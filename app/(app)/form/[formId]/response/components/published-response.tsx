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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFormResponseChatGenerator } from "@/hooks/form-response-chat-streamer"
import {
  addAiChatMessageToDb,
  getAiChatMessagesByPublishedFormId,
  getPublishedFormByFormVersionId,
  getPublishedFormResponseByPublishedFormId,
  QueryKeys,
} from "@/lib/queries"
import {
  EFormVersionStatus,
  TAiChat,
  TAiChatMessage,
  TPublishedForm,
  TPublishedFormResponse,
  TResponseData,
} from "@/lib/types"
import { cn } from "@/lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowRight,
  CircleDashed,
  ClipboardX,
  Clock,
  Construction,
  Loader2,
  MessageSquarePlus,
  Send,
  Sheet,
} from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import ShortUniqueId from "short-unique-id"
import ChatSection from "./chat-section"
import TableSection from "./table-section"
import SubmittedTab from "./submitted-tab"
import InProgressTab from "./in-progress-tab"
const { randomUUID } = new ShortUniqueId({ length: 10 })

type TabType = "submitted" | "in-progress" | "advanced-insights"

export default function PublishedResponse() {
  const { formId } = useParams()
  // const selectedFormVersion = useFormVersionStore(
  //   (state) => state.selectedFormVersion
  // )

  const selectedFormVersion =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("selected-form-version") || "{}")
      : null

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
      .response_data as TResponseData
    return Object.values(firstResponse).map((field) => field.label)
  }, [publishedFormResponse?.data])

  const [activeTab, setActiveTab] = useState<TabType>("submitted")
  const router = useRouter()
  const pathname = usePathname()

  const [inputValue, setInputValue] = useState("")
  const queryClient = useQueryClient()

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const {
    formResponseChatMutation,
    currentStreamedResponse,
    isStreamStarting,
    isStreamFinished,
  } = useFormResponseChatGenerator()

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
      }
    },
  })

  const { data: aiChat, error: aiChatError } = useQuery({
    queryKey: [
      QueryKeys.GetAiChatMessagesByPublishedFormId,
      publishedForm?.data?.id,
    ],
    queryFn: () =>
      getAiChatMessagesByPublishedFormId(publishedForm?.data?.id || ""),
    enabled: !!publishedForm?.data?.id,
  })

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

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
        streaming: false,
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
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        })
      }
    }
  }

  useEffect(() => {
    if (aiChat?.aiChatMessages?.length) {
      scrollToBottom()
    }
  }, [aiChat?.aiChatMessages])

  return (
    <section className="flex flex-col gap-4">
      <Tabs
        defaultValue="submitted"
        value={activeTab}
        onValueChange={(value: string) => handleTabClick(value as TabType)}
        className="w-full flex flex-col gap-8"
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

        <TabsContent value="submitted">
          <SubmittedTab
            publishedForm={publishedForm as TPublishedForm}
            publishedFormResponse={
              publishedFormResponse as TPublishedFormResponse
            }
            isPublishedFormResponseLoading={isPublishedFormResponseLoading}
            aiChat={aiChat as TAiChat}
            headers={headers}
            inputValue={inputValue}
            setInputValueAction={setInputValue}
            handleSendMessageAction={handleSendMessage}
            handleSampleQuestionClickAction={handleSampleQuestionClick}
            createAiChatMessageMutationPending={
              createAiChatMessageMutation.isPending
            }
            currentStreamedResponse={currentStreamedResponse}
            isStreamStarting={isStreamStarting}
            isStreamFinished={isStreamFinished}
          />
        </TabsContent>
        <TabsContent value="in-progress">
          <InProgressTab />
        </TabsContent>
      </Tabs>
    </section>
  )
}
