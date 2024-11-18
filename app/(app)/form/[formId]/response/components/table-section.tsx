"use client"

import { TAiChat, TPublishedFormResponse, TResponseData } from "@/lib/types"
import { cn } from "@/lib/utils"

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
  return (
    <div
      className={cn(
        "flex-1",
        aiChat?.isChatActive ? "h-[calc(100vh-12rem)] overflow-y-auto" : "mb-8"
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
                {Object.values(response.response_data as TResponseData).map(
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
  )
}
