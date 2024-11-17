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
import { useMutation, useQuery } from "@tanstack/react-query"
import parse from "html-react-parser"
import { Parser } from "htmlparser2"
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
import React, { useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast"
import ShortUniqueId from "short-unique-id"
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

  console.log("messages", messages)

  const [inputValue, setInputValue] = useState("")
  const [isChatActive, setIsChatActive] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const newMessage = {
      id: randomUUID(),
      role: "user" as const,
      content: inputValue,
    }
    setInputValue("")
    setIsChatActive(true)

    createAiChatMessageMutation.mutate({
      message: newMessage,
      publishedFormId: publishedForm?.data?.id || "",
    })

    // TODO: Implement your chat API call here
    // For now, just adding a mock response
    // setTimeout(() => {
    //   setMessages((prev) => [
    //     ...prev,
    //     {
    //       id: randomUUID(),
    //       role: "assistant",
    //       content:
    //         "This is a mock response. Implement your actual chat logic here.",
    //     },
    //   ])
    // }, 1000)
  }

  const sampleQuestions = [
    "What is the total number of responses?",
    "Show me the most common answers",
    "Summarize the key findings",
  ]

  const handleSampleQuestionClick = (question: string) => {
    setInputValue(question)
    handleSendMessage(new Event("submit") as any)
  }

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

            <ScrollArea className="flex-1 p-4">
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
                  {message.content}
                </div>
              ))}
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
                {sampleQuestions.map((question, index) => (
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

  const [extractedContent, setExtractedContent] = useState("")

  useEffect(() => {
    const extractSingleDivFromStreamingHtml = (
      html: string,
      className: string
    ) => {
      return new Promise((resolve) => {
        let depth = 0
        let capturing = false
        let capturedContent = ""

        const parser = new Parser({
          onopentag(name, attributes) {
            if (name === "div" && attributes.class?.includes(className)) {
              capturing = true
            }
            if (capturing) {
              depth++
              capturedContent += `<${name}`
              for (const [key, value] of Object.entries(attributes)) {
                capturedContent += ` ${key}="${value}"`
              }
              capturedContent += ">"
            }
          },
          ontext(text) {
            if (capturing) {
              capturedContent += text
            }
          },
          onclosetag(tagname) {
            if (capturing) {
              depth--
              capturedContent += `</${tagname}>`
              if (depth === 0) {
                capturing = false
                resolve(capturedContent)
              }
            }
          },
        })

        parser.write(html)
        parser.end()
      })
    }

    extractSingleDivFromStreamingHtml(currentStreamedResponse, "analysis")
      .then((content) => setExtractedContent(content as string))
      .catch(console.error)
  }, [currentStreamedResponse])

  const renderAdvancedInsightsTab = () => {
    const xml = jsonArrayToXml(publishedFormResponse?.data || [])
    if (
      !publishedFormResponse?.data ||
      publishedFormResponse?.data.length === 0
    ) {
      return <div>No responses found</div>
    }

    return (
      <div>
        <span className="text-xl font-medium">Advanced Insights</span>
        <div className="mt-4 p-4 bg-gray-100 rounded-md min-h-[100px]">
          {extractedContent.length > 0 ? (
            <div>{parse(extractedContent)}</div>
          ) : (
            <div>Response will appear here...</div>
          )}
        </div>
        {isStreamStarting && (
          <div className="mt-2 text-blue-500">Generating response...</div>
        )}
        <section className="mt-4">
          <Button
            type="button"
            onClick={() =>
              formResponseChatMutation.mutate({
                xml,
                prompt:
                  "Give a short human readable summary highlighting important points of the data in the table.",
              })
            }
            disabled={isStreamStarting}
          >
            Get Started
          </Button>
        </section>
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
