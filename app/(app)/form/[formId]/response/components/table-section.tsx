"use client"

import { TAiChat, TPublishedFormResponse, TResponseData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

type TableSectionProps = {
  aiChat: TAiChat
  publishedFormResponse: TPublishedFormResponse
  headers: string[]
}

export default function TableSection({
  aiChat,
  publishedFormResponse,
  headers,
}: TableSectionProps) {
  const exportToCsv = () => {
    if (!publishedFormResponse?.data) return

    const csvContent = [
      headers.join(","),
      ...publishedFormResponse.data.map((response) =>
        Object.values(response.response_data as TResponseData)
          .map((field) => `"${field.value}"`)
          .join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "form_responses.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div
      className={cn(
        "flex-1 border rounded-lg relative",
        aiChat?.isChatActive ? "h-[calc(100vh-12rem)] overflow-y-auto" : "mb-8"
      )}
    >
      <div className="p-4 absolute right-0 bottom-0 flex justify-end border-b">
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCsv}
          className="flex items-center gap-2"
          title="Export to CSV"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="divide-x divide-gray-200">
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
              <tr key={rowIndex} className="divide-x divide-gray-200">
                {Object.values(response.response_data as TResponseData).map(
                  (field, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-sm text-gray-500"
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
  )
}
