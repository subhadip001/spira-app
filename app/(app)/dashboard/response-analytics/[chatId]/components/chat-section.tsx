"use client"

import React, { useEffect, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addAiChatMessageToDbForUploadedCsv,
  createStarterQuestionsForUploadedCsv,
  fetchChatDataForUploadedCsvByResponseAnalyticsId,
  generateStarterQuestions,
  QueryKeys,
} from "@/lib/queries"
import toast from "react-hot-toast"
import { TAiChatMessage, TResponseAnalytics } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"
import { useFormResponseChatGenerator } from "@/hooks/form-response-chat-streamer"
import ShortUniqueId from "short-unique-id"
import parse from "html-react-parser"
import { extractSingleDivFromHtml } from "@/app/(app)/form/[formId]/response/components/streaming-ai-content"
import { ScrollArea } from "@/components/ui/scroll-area"

type DashboardChatSectionProps = {
  responseAnalytics: TResponseAnalytics
}

const DashboardChatSection: React.FC<DashboardChatSectionProps> = ({
  responseAnalytics,
}) => {
  const queryClient = useQueryClient()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([])

  const { randomUUID } = new ShortUniqueId({ length: 10 })
  const scrollToBottomRef = useRef<HTMLDivElement>(null)

  const {
    formResponseChatMutation,
    currentStreamedResponse,
    isStreamStarting,
    isStreamFinished,
  } = useFormResponseChatGenerator()

  const { data: chatData } = useQuery({
    queryKey: [
      QueryKeys.GetDataForUploadedCsvByResponseAnalyticsId,
      responseAnalytics.id,
    ],
    queryFn: () =>
      fetchChatDataForUploadedCsvByResponseAnalyticsId(responseAnalytics.id),
  })

  const generateStarterQuestionsMutation = useMutation({
    mutationFn: async (xml: string) => generateStarterQuestions(xml),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error)
      } else {
        toast.success("Starter questions generated successfully")
        saveStarterQuestionsResponseMutation.mutate({
          starterQuestions: data.message,
        })
      }
    },
  })

  const saveStarterQuestionsResponseMutation = useMutation({
    mutationFn: async ({ starterQuestions }: { starterQuestions: string }) =>
      createStarterQuestionsForUploadedCsv(
        responseAnalytics.id,
        starterQuestions
      ),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message)
      } else {
        queryClient.invalidateQueries({
          queryKey: [
            QueryKeys.GetDataForUploadedCsvByResponseAnalyticsId,
            responseAnalytics.id,
          ],
        })
        toast.success("Starter questions saved successfully")
      }
    },
  })

  const createAiChatMessageMutationForUploadedCsv = useMutation({
    mutationFn: async ({
      message,
      responseAnalyticsId,
    }: {
      message: TAiChatMessage
      responseAnalyticsId: string
    }) => addAiChatMessageToDbForUploadedCsv(message, responseAnalyticsId),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data?.error.message)
      } else {
      }
    },
  })

  useEffect(() => {
    if (chatData && !chatData.data?.ai_starter_questions) {
      generateStarterQuestionsMutation.mutate(
        responseAnalytics.transformed_xml as string
      )
    }
  }, [chatData, responseAnalytics.transformed_xml])

  const handleSendMessage = () => {
    if (!message.trim()) return

    createAiChatMessageMutationForUploadedCsv.mutate(
      {
        message: {
          id: randomUUID(),
          role: "user" as const,
          content: message,
        },
        responseAnalyticsId: responseAnalytics.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              QueryKeys.GetDataForUploadedCsvByResponseAnalyticsId,
              responseAnalytics.id,
            ],
          })
        },
      }
    )

    formResponseChatMutation.mutate(
      {
        xml: responseAnalytics.transformed_xml as string,
        prompt: message,
        responseAnalyticsId: responseAnalytics.id,
      },
      {
        onSuccess: () => {
          setMessage("")
        },
      }
    )
  }

  const scrollToBottom = () => {
    if (scrollToBottomRef.current) {
      const scrollContainer = scrollToBottomRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      )
      if (scrollContainer) {
        console.log(chatData?.data?.ai_chat_messages)

        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatData?.data?.ai_chat_messages])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] mx-auto">
      {/* Chat Messages */}
      <ScrollArea
        ref={scrollToBottomRef}
        className="flex-1 p-4 mb-4 overflow-y-auto"
      >
        <div className="space-y-4">
          {(chatData?.data?.ai_chat_messages as TAiChatMessage[])?.map(
            (msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {parse(
                    msg.role === "assistant"
                      ? extractSingleDivFromHtml(msg.content, "analysis")
                      : msg.content
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </ScrollArea>

      {/* Starter Questions */}
      {chatData?.data?.ai_starter_questions &&
        !chatData.data.is_chat_active && (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {chatData.data.ai_starter_questions
                .split("|")
                .map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left h-auto py-2 px-3 whitespace-normal break-words"
                    onClick={() => setMessage(question.trim())}
                  >
                    {question.trim()}
                  </Button>
                ))}
            </div>
          </div>
        )}

      {/* Chat Input */}
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="px-4"
        >
          {generateStarterQuestionsMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default DashboardChatSection
