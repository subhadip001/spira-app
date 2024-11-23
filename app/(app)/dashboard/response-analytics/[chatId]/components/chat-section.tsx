"use client"

import React, { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createStarterQuestionsForUploadedCsv,
  fetchChatDataForUploadedCsv,
  generateStarterQuestions,
  QueryKeys,
} from "@/lib/queries"
import toast from "react-hot-toast"
import { TResponseAnalytics } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"

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

  const { data: chatData } = useQuery({
    queryKey: [QueryKeys.GetDataForUploadedCsv, responseAnalytics.id],
    queryFn: () => fetchChatDataForUploadedCsv(responseAnalytics.id),
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
          queryKey: [QueryKeys.GetDataForUploadedCsv, responseAnalytics.id],
        })
        toast.success("Starter questions saved successfully")
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

    // Add user message to chat
    setMessages([...messages, { role: "user", content: message.trim() }])
    setMessage("")

    // TODO: Implement API call to get AI response
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] mx-auto">
      {/* Chat Messages */}
      <Card className="flex-1 p-4 mb-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
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
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Starter Questions */}
      {chatData?.data?.ai_starter_questions && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {chatData.data.ai_starter_questions
              .split("|")
              .map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left h-auto py-2 px-3"
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
