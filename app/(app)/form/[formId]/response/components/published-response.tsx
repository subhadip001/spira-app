"use client"

import { jsonArrayToXml } from "@/app/transformations/json-to-xml"
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CircleDashed, Sheet } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import ShortUniqueId from "short-unique-id"
import InProgressTab from "./in-progress-tab"
import SubmittedTab from "./submitted-tab"
import { cn } from "@/lib/utils"
import SummaryTab from "./summary"
import InsightsTab from "./insights"
import SubmissionsTab from "./submissions"
const { randomUUID } = new ShortUniqueId({ length: 10 })

type TabType = "insights" | "summary" | "submissions" | "advanced-insights"

export default function PublishedResponse() {
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

  console.log(publishedFormResponse?.data)

  const [activeTab, setActiveTab] = useState<TabType>("summary")
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
      hash === "summary" ||
      hash === "submissions" ||
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
          setInputValue("")
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
        onSuccess: () => {},
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

  const tabs: { label: string; key: TabType }[] = [
    {
      label: "Insights",
      key: "insights",
    },
    {
      label: "Summary",
      key: "summary",
    },
    {
      label: `Submissions [${publishedFormResponse?.data?.length || 0}]`,
      key: "submissions",
    },
  ]

  return (
    <div className="flex flex-col gap-4 h-full">
      <section>
        <nav className="flex gap-2 text-sm">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={cn(
                "px-3 py-1 rounded-md cursor-pointer",
                activeTab === tab.key
                  ? "bg-blue-200 text-spirablue"
                  : "hover:bg-gray-100"
              )}
              onClick={() => handleTabClick(tab.key)}
            >
              <span>{tab.label}</span>
            </div>
          ))}
        </nav>
      </section>
      <section className="flex-grow flex w-full h-0 bg-slate-100 rounded-md">
        {activeTab === "insights" && (
          <InsightsTab responses={publishedFormResponse?.data || []} />
        )}
        {activeTab === "summary" && (
          <>
            <SummaryTab responses={publishedFormResponse?.data || []} />
          </>
        )}
        {activeTab === "submissions" && (
          <SubmissionsTab responses={publishedFormResponse?.data || []} />
        )}
      </section>
    </div>
  )
}
