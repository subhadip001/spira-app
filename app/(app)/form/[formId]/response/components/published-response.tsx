"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  getPublishedFormByFormVersionId,
  getPublishedFormResponseByPublishedFormId,
  QueryKeys,
} from "@/lib/queries"
import { EFormVersionStatus } from "@/lib/types"
import useFormVersionStore from "@/store/formVersions"
import { useQuery } from "@tanstack/react-query"
import { BotMessageSquare, CircleDashed, Sheet } from "lucide-react"
import { cn } from "@/lib/utils"
import { useParams, usePathname, useRouter } from "next/navigation"
import { jsonArrayToXml } from "@/app/transformations/json-to-xml"
import { useFormResponseChatGenerator } from "@/hooks/form-response-chat-streamer"
import { Button } from "@/components/ui/button"
import { Parser } from "htmlparser2"
import parse from "html-react-parser"

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

  const renderSubmittedTab = () => {
    return (
      <div className="max-w-full overflow-x-auto">
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
    )
  }

  const renderInProgressTab = () => {
    return <div>In progress</div>
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
                  "How many rows and columns are there? List all column point wise",
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

  const renderTab = (tab: TabType) => {
    switch (tab) {
      case "submitted":
        return renderSubmittedTab()
      case "in-progress":
        return renderInProgressTab()
      case "advanced-insights":
        return renderAdvancedInsightsTab()
      default:
        return null
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="inline-flex w-fit items-center text-lg rounded-md bg-gray-100 border">
        <div
          className={cn(
            "flex items-center gap-2 cursor-pointer px-3 py-1 rounded-l-md",
            activeTab === "submitted"
              ? "bg-spirablue text-white"
              : "text-gray-500"
          )}
          onClick={() => handleTabClick("submitted")}
        >
          <div className="">
            <Sheet className="w-4 h-4" />
          </div>
          <span className="">Submitted</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 cursor-pointer px-3 py-1",
            activeTab === "in-progress"
              ? "bg-spirablue text-white"
              : "text-gray-500"
          )}
          onClick={() => handleTabClick("in-progress")}
        >
          <div className="">
            <CircleDashed className="w-4 h-4" />
          </div>
          <span className="">In progress</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 cursor-pointer px-3 py-1 rounded-r-md",
            activeTab === "advanced-insights"
              ? "bg-spirablue text-white"
              : "text-gray-500"
          )}
          onClick={() => handleTabClick("advanced-insights")}
        >
          <div>
            <BotMessageSquare className="w-4 h-4" />
          </div>
          <span className="">Advanced Insights</span>
        </div>
      </div>
      <section>{renderTab(activeTab)}</section>
    </section>
  )
}
