"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TAiChat } from "@/lib/types"
import { cn } from "@/lib/utils"
import parse from "html-react-parser"
import { Send } from "lucide-react"
import { useEffect, useRef } from "react"
import { extractSingleDivFromHtml } from "./streaming-ai-content"

import { Input } from "@/components/ui/input"

type ChatSectionProps = {
  aiChat: TAiChat
  handleSendMessageAction: (e: React.FormEvent<HTMLFormElement>) => void
  inputValue: string
  setInputValueAction: (value: string) => void
}

export default function ChatSection({
  aiChat,
  handleSendMessageAction,
  inputValue,
  setInputValueAction,
}: ChatSectionProps) {
  const scrollToBottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollToBottomRef.current) {
      const scrollContainer = scrollToBottomRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    if (aiChat?.aiChatMessages?.length) {
      scrollToBottom()
    }
  }, [aiChat?.aiChatMessages])

  return (
    <div>
      {aiChat?.isChatActive && (
        <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Chat with your data</h3>
          </div>

          <ScrollArea className="flex-1 p-4" data-scroll-container>
            {aiChat?.aiChatMessages?.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "mb-4 p-3 rounded-lg max-w-[80%]",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                )}
              >
                {parse(
                  message.role === "assistant"
                    ? extractSingleDivFromHtml(message.content, "analysis")
                    : message.content
                )}
              </div>
            ))}
            <div className="" ref={scrollToBottomRef}></div>
            {/* {isStreamStarting && <div>Loading...</div>}
        <StreamingAiContent
          className="mb-4 p-3 rounded-lg max-w-[80%]"
          currentStreamedResponse={currentStreamedResponse}
        /> */}
          </ScrollArea>

          <form
            onSubmit={handleSendMessageAction}
            className="p-4 border-t flex gap-2"
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
      )}
    </div>
  )
}
