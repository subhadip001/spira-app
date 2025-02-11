"use client"

import { TAiChat, TPublishedFormResponse, TResponseData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import {
  DataEditor,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
  TextCell,
} from "@glideapps/glide-data-grid"
import "@glideapps/glide-data-grid/dist/index.css"
import { useCallback, useMemo } from "react"
import { exportToCsv } from "@/lib/form-lib/utils"

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
  // Transform data for the grid
  const rows = publishedFormResponse?.data?.length || 0
  const columns = useMemo<GridColumn[]>(
    () =>
      headers.map((header) => ({
        id: header,
        title: header,
        width: 200,
      })),
    [headers]
  )

  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const response = publishedFormResponse?.data?.[row]
      if (!response?.response_data)
        return {
          kind: GridCellKind.Text,
          displayData: "",
          data: "",
          allowOverlay: true,
          readonly: true,
        }

      const values = Object.values(response.response_data as TResponseData)
      const cellValue = values[col]?.value || ""

      return {
        kind: GridCellKind.Text,
        displayData: cellValue,
        data: cellValue,
        allowOverlay: true,
        readonly: true,
      } as TextCell
    },
    [publishedFormResponse?.data]
  )

  return (
    <div
      className={cn(
        "flex flex-col border rounded-lg relative",
        aiChat?.isChatActive ? "h-[calc(100vh-12rem)]" : "h-[600px] mb-8"
      )}
    >
      <div className="flex-1 relative overflow-auto">
        <DataEditor
          getCellContent={getCellContent}
          columns={columns}
          rows={rows}
          height={aiChat?.isChatActive ? "calc(100vh - 12rem)" : "100%"}
          width="100%"
          rowHeight={45}
          smoothScrollX
          smoothScrollY
          isDraggable={false}
          onPaste={false}
        />
      </div>
      <div className="flex justify-end border-t bg-white h-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCsv(publishedFormResponse, headers)}
          className="flex items-center gap-2 m-1"
          title="Export to CSV"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
