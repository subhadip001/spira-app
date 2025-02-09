import React, { useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"
import { TResponseData } from "@/lib/types"

interface FormResponse {
  id: string
  created_at: string
  updated_at: string
  published_form_id: string
  response_data: any
}

interface SubmissionsTabProps {
  responses: FormResponse[]
}

const SubmissionsTab = ({ responses }: SubmissionsTabProps) => {
  const columnHelper = createColumnHelper<any>()

  const columns = useMemo(() => {
    if (responses.length === 0) return []

    // Get the last response's data to extract headers
    const lastResponse = responses[0]
    const responseData = lastResponse.response_data as TResponseData

    // Create date column first
    const cols = [
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) =>
          new Date(info.row.original.created_at).toLocaleDateString(),
      }),
    ]

    // Add columns based on response data
    Object.values(responseData).forEach((field, index) => {
      cols.push(
        columnHelper.accessor(`response_data.${index + 1}.value`, {
          header: () => <span className="line-clamp-2">{field.label}</span>,
          cell: (info) => info.getValue() || "-",
        })
      )
    })

    return cols
  }, [responses])

  const table = useReactTable({
    data: responses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (responses.length === 0) {
    return (
      <div className="space-y-6 p-6 w-full overflow-y-auto">
        <span className="text-3xl font-[200]">Submissions</span>
        <div>No submissions yet</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 w-full overflow-y-auto">
      <span className="text-3xl font-[200]">Submissions</span>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-white">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-6 py-3 text-sm font-medium text-gray-500 border-b"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors border-b"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SubmissionsTab
