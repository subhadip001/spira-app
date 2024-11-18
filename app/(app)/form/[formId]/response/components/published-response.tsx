"use client"

import { jsonArrayToXml } from "@/app/transformations/json-to-xml"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFormResponseChatGenerator } from "@/hooks/form-response-chat-streamer"
import {
  addAiChatMessageToDb,
  getAiChatMessagesByPublishedFormId,
  getPublishedFormByFormVersionId,
  getPublishedFormResponseByPublishedFormId,
  QueryKeys,
} from "@/lib/queries"
import { EFormVersionStatus, TAiChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"
import useFormVersionStore from "@/store/formVersions"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import parse from "html-react-parser"
import {
  ArrowRight,
  CircleDashed,
  Clock,
  Construction,
  MessageSquarePlus,
  Send,
  Sheet,
} from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import ShortUniqueId from "short-unique-id"
import { extractSingleDivFromHtml } from "./streaming-ai-content"
const { randomUUID } = new ShortUniqueId({ length: 10 })

type ResponseData = {
  [key: string]: {
    name: string
    label: string
    value: string
  }
}

type TabType = "submitted" | "in-progress" | "advanced-insights"

export default function PublishedResponse() {
  const { formId } = useParams()
  const selectedFormVersion = useFormVersionStore(
    (state) => state.selectedFormVersion
  )
  const { data: publishedForm, isLoading } = useQuery({
    queryKey: [
      QueryKeys.GetPublishedFormByFormVersionId,
      selectedFormVersion?.id,
    ],
    queryFn: () => {
      if (selectedFormVersion?.status !== EFormVersionStatus.PUBLISHED) {
        return null
      }
      return getPublishedFormByFormVersionId(selectedFormVersion?.id || "")
    },
    enabled: !!selectedFormVersion?.id,
    refetchOnWindowFocus: false,
  })

  const {
    data: publishedFormResponse,
    isLoading: isPublishedFormResponseLoading,
  } = useQuery({
    queryKey: [
      QueryKeys.GetPublishedFormResponseByPublishedFormId,
      publishedForm?.data?.id,
    ],
    queryFn: () =>
      getPublishedFormResponseByPublishedFormId(publishedForm?.data?.id || ""),
    enabled: !!publishedForm?.data?.id,
    refetchOnWindowFocus: false,
  })

  const headers = useMemo(() => {
    if (
      !publishedFormResponse?.data ||
      publishedFormResponse.data.length === 0
    ) {
      return []
    }
    const firstResponse = publishedFormResponse.data[0]
      .response_data as ResponseData
    return Object.values(firstResponse).map((field) => field.label)
  }, [publishedFormResponse?.data])

  const [activeTab, setActiveTab] = useState<TabType>("submitted")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as TabType
    if (
      hash === "submitted" ||
      hash === "in-progress" ||
      hash === "advanced-insights"
    ) {
      setActiveTab(hash)
    }
  }, [pathname])

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab)
    router.push(`${pathname}#${tab}`)
  }

  const {
    formResponseChatMutation,
    currentStreamedResponse,
    isStreamStarting,
    isStreamFinished,
  } = useFormResponseChatGenerator()

  const createAiChatMessageMutation = useMutation({
    mutationFn: async ({
      message,
      publishedFormId,
    }: {
      message: TAiChatMessage
      publishedFormId: string
    }) => addAiChatMessageToDb(message, publishedFormId),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data?.error.message)
      } else {
        toast.success("Message added to chat")
      }
    },
  })

  const { data: messages, error: messagesError } = useQuery({
    queryKey: [
      QueryKeys.GetAiChatMessagesByPublishedFormId,
      publishedForm?.data?.id,
    ],
    queryFn: () =>
      getAiChatMessagesByPublishedFormId(publishedForm?.data?.id || ""),
    enabled: !!publishedForm?.data?.id,
  })

  const [inputValue, setInputValue] = useState("")
  const [isChatActive, setIsChatActive] = useState(true)
  const queryClient = useQueryClient()

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const newMessage = {
      id: randomUUID(),
      role: "user" as const,
      content: inputValue,
    }

    createAiChatMessageMutation.mutate(
      {
        message: newMessage,
        publishedFormId: publishedForm?.data?.id || "",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.GetAiChatMessagesByPublishedFormId],
          })
        },
      }
    )

    formResponseChatMutation.mutate(
      {
        xml: jsonArrayToXml(publishedFormResponse?.data || []),
        prompt: inputValue,
        publishedFormId: publishedForm?.data?.id || "",
      },
      {
        onSuccess: () => {
          setInputValue("")
        },
      }
    )
  }

  const handleSampleQuestionClick = (question: string) => {
    setInputValue(question)
    handleSendMessage(new Event("submit") as any)
  }

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  // Handle scroll on messages update
  useEffect(() => {
    if (messages?.aiChatMessages?.length) {
      // Add a small delay to ensure content is rendered
      const timeoutId = setTimeout(scrollToBottom, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [messages?.aiChatMessages])

  // Handle initial scroll when component mounts
  useEffect(() => {
    if (messages?.aiChatMessages?.length) {
      scrollToBottom()
    }
  }, [])

  const renderSubmittedTab = () => {
    if (
      !publishedFormResponse?.data ||
      publishedFormResponse?.data.length === 0
    ) {
      return <div>No responses found</div>
    }

    return (
      <div
        className={cn(
          "flex flex-col min-h-[calc(100vh-12rem)]",
          isChatActive && "grid grid-cols-2 gap-6"
        )}
      >
        {/* Table Section - Full width initially, moves to right when chat is active */}
        <div
          className={cn(
            "flex-1",
            isChatActive ? "h-[calc(100vh-12rem)] overflow-y-auto" : "mb-8"
          )}
        >
          <div className="border rounded-lg overflow-x-auto">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 text-left whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {publishedFormResponse?.data?.map((response, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(response.response_data as ResponseData).map(
                      (field, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-2 text-sm text-gray-500"
                        >
                          {field.value}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Chat Section - Shows on left when active */}
        {isChatActive && (
          <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Chat with your data</h3>
            </div>

            <ScrollArea
              ref={scrollAreaRef}
              className="flex-1 p-4"
              data-scroll-container
            >
              {messages?.aiChatMessages?.map((message, index) => (
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
              {/* {isStreamStarting && <div>Loading...</div>}
              <StreamingAiContent
                className="mb-4 p-3 rounded-lg max-w-[80%]"
                currentStreamedResponse={currentStreamedResponse}
              /> */}
            </ScrollArea>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t flex gap-2"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your data..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}

        {/* Initial Chat Input with Sample Questions - Only shows when chat is not active */}
        {!isChatActive && (
          <div className="sticky bottom-0 bg-background pt-4">
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
                    onClick={() => handleSampleQuestionClick(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSendMessage}
              className="flex gap-2 max-w-2xl mx-auto"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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

  const renderInProgressTab = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Construction className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">
              Coming Soon: Partial Submissions Tracking
            </CardTitle>
            <CardDescription className="text-base">
              We're building a powerful feature to help you track and manage
              partially completed form submissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start space-x-3 bg-muted/50 rounded-lg p-4">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Save Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Users will be able to save their progress and return later
                    to complete the form
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-muted/50 rounded-lg p-4">
                <ArrowRight className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Resume Anytime</h4>
                  <p className="text-sm text-muted-foreground">
                    Track incomplete submissions and send reminders to boost
                    completion rates
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" className="gap-2">
                <Clock className="w-4 h-4" />
                Get notified when it's ready
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <section className="flex flex-col gap-4">
      <Tabs
        defaultValue="submitted"
        value={activeTab}
        onValueChange={(value: string) => handleTabClick(value as TabType)}
        className="w-full"
      >
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="submitted" className="flex items-center gap-2">
              <Sheet className="w-4 h-4" />
              <span>Submitted</span>
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="flex items-center gap-2"
            >
              <CircleDashed className="w-4 h-4" />
              <span>In progress</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="submitted">{renderSubmittedTab()}</TabsContent>
        <TabsContent value="in-progress">{renderInProgressTab()}</TabsContent>
      </Tabs>
    </section>
  )
}
