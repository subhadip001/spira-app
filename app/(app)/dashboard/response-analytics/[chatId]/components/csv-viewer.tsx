interface CSVRow {
  [key: string]: string | number | boolean | null
}

import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Papa from "papaparse"
import React, { useEffect, useState } from "react"

interface CSVViewerProps {
  url: string
  title?: string
}

const CSVViewer: React.FC<CSVViewerProps> = ({
  url,
  title = "CSV Data Viewer",
}) => {
  const [headers, setHeaders] = useState<string[]>([])
  const [data, setData] = useState<CSVRow[]>([])

  const {
    isLoading,
    error,
    data: csvData,
  } = useQuery({
    queryKey: ["csv", url],
    queryFn: async () => {
      const response = await fetch(`/api/fetch-csv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch CSV")
      }

      const { data: csvText } = await response.json()
      return csvText
    },
    enabled: !!url,
  })

  useEffect(() => {
    if (csvData) {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn("CSV parsing warnings:", results.errors)
          }
          setHeaders(results.meta.fields || [])
          setData(results.data as CSVRow[])
        },
        error: (error) => {
          console.error("Error parsing CSV:", error.message)
        },
      })
    }
  }, [csvData])

  const renderCell = (value: CSVRow[keyof CSVRow]) => {
    if (value === null || value === undefined) return "-"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    return String(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded">
        {error instanceof Error ? error.message : "An error occurred"}
      </div>
    )
  }

  if (!url) {
    return (
      <div className="text-yellow-500 p-4 border border-yellow-200 rounded">
        Please provide a CSV URL
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-auto">
      <div className="">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="p-2 text-left bg-gray-100 border border-gray-200 font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="p-2 border border-gray-200">
                    {renderCell(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Total rows: {data.length}
      </div>
    </div>
  )
}

export default CSVViewer
