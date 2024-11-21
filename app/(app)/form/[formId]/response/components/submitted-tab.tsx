"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, MessageSquarePlus, Send, ClipboardX } from "lucide-react"
import {
  TAiChat,
  TPublishedForm,
  TPublishedFormResponse,
  TResponseData,
} from "@/lib/types"
import { cn } from "@/lib/utils"
import TableSection from "./table-section"
import ChatSection from "./chat-section"

interface SubmittedTabProps {
  publishedForm: TPublishedForm | undefined
  publishedFormResponse: TPublishedFormResponse | undefined
  isPublishedFormResponseLoading: boolean
  aiChat: TAiChat | undefined
  headers: string[]
  inputValue: string
  setInputValueAction: (value: string) => void
  handleSendMessageAction: (e: React.FormEvent) => void
  handleSampleQuestionClickAction: (question: string) => void
  createAiChatMessageMutationPending: boolean
  currentStreamedResponse: string
  isStreamStarting: boolean
  isStreamFinished: boolean
}

export default function SubmittedTab({
  publishedForm,
  publishedFormResponse,
  isPublishedFormResponseLoading,
  aiChat,
  headers,
  inputValue,
  setInputValueAction,
  handleSendMessageAction,
  handleSampleQuestionClickAction,
  createAiChatMessageMutationPending,
  currentStreamedResponse,
  isStreamStarting,
  isStreamFinished,
}: SubmittedTabProps) {
  if (
    publishedFormResponse?.data?.length === 0 &&
    !isPublishedFormResponseLoading
  ) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-gray-400">
          <ClipboardX className="w-12 h-12 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No responses yet
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          When users submit responses to your form, they will appear here.
        </p>
      </div>
    )
  }

  if (!publishedForm?.data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        Form not published yet
      </div>
    )
  }

  return (
    <div>
      {isPublishedFormResponseLoading && (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading responses...
          </span>
        </div>
      )}

      {!isPublishedFormResponseLoading && aiChat?.isChatActive && (
        <div
          className={cn(
            "flex flex-col min-h-[calc(100vh-12rem)]",
            "grid grid-cols-2 gap-6"
          )}
        >
          <TableSection
            aiChat={aiChat as TAiChat}
            publishedFormResponse={{
              data:
                publishedFormResponse?.data?.map((response: any) => ({
                  ...response,
                  response_data: response.response_data as TResponseData,
                })) || null,
              error: publishedFormResponse?.error || null,
            }}
            headers={headers}
          />
          <ChatSection
            aiChat={aiChat as TAiChat}
            handleSendMessageAction={handleSendMessageAction}
            inputValue={inputValue}
            setInputValueAction={setInputValueAction}
            createAiChatMessageMutationPending={
              createAiChatMessageMutationPending
            }
            currentStreamedResponse={currentStreamedResponse}
            isStreamStarting={isStreamStarting}
            isStreamFinished={isStreamFinished}
          />
        </div>
      )}

      {!isPublishedFormResponseLoading && !aiChat?.isChatActive && (
        <div className={cn("flex flex-col min-h-[calc(100vh-12rem)]")}>
          <TableSection
            aiChat={aiChat as TAiChat}
            publishedFormResponse={{
              data:
                publishedFormResponse?.data?.map((response: any) => ({
                  ...response,
                  response_data: response.response_data as TResponseData,
                })) || null,
              error: publishedFormResponse?.error || null,
            }}
            headers={headers}
          />
          <div className="sticky bottom-10 bg-background pt-4">
            <div className="mb-4 flex flex-col gap-2 items-center">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquarePlus className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Try asking these questions
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "What is the total number of responses?",
                  "Show me the most common answers",
                  "Summarize the key findings",
                ].map((question, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    className="text-sm"
                    onClick={() => handleSampleQuestionClickAction(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSendMessageAction}
              className="flex gap-2 max-w-2xl mx-auto"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValueAction(e.target.value)}
                placeholder="Ask about your data..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
