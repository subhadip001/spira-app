"use client"

import { csvToXml } from "@/app/transformations/csv-to-xml"
import { Command, Search, Upload, Loader2 } from "lucide-react"
import { ChangeEvent } from "react"
import { useFileUpload } from "@/hooks/useFileUpload"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { createNewResponseAnalyticsForUploadedCsv } from "@/lib/queries"
import toast from "react-hot-toast"

const ResponsePicker = () => {
  const { uploadFile, uploadProgress, uploadError, isUploading } =
    useFileUpload()

  const router = useRouter()

  const createNewResponseAnalyticsForUploadedCsvMutation = useMutation({
    mutationFn: async (csvData: { csv: string; url: string }) => {
      return createNewResponseAnalyticsForUploadedCsv({
        title: "New Response Analytics",
        transformedJson: csvToJson(csvData.csv),
        transformedXml: csvToXml(csvData.csv),
        uploadedCsvUrl: csvData.url,
      })
    },
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data?.error.message)
      } else {
        console.log("New Response Analytics created:", data.data?.id)
        if (!data.data?.id) {
          toast.error("Failed to create new Response Analytics")
          return
        }
        router.push(`/dashboard/response-analytics/${data.data?.id}`)
      }
    },
  })

  const handleCsvImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const content = e.target?.result as string
          const downloadURL = await uploadFile(file)
          createNewResponseAnalyticsForUploadedCsvMutation.mutate({
            csv: content,
            url: downloadURL,
          })
        }
        reader.readAsText(file)
      } catch (error) {
        console.error("Error handling file:", error)
      }
    }
  }

  const csvToJson = (csv: string): Record<string, string>[] => {
    const lines = csv.split("\n")
    const headers = lines[0].split(",")
    return lines.slice(1).map((line) => {
      const values = line.split(",")
      return headers.reduce(
        (obj, header, index) => {
          obj[header.trim()] = values[index].trim()
          return obj
        },
        {} as Record<string, string>
      )
    })
  }

  return (
    <div className="min-w-[30rem] mx-auto border-dashed border rounded-md flex flex-col items-center p-6 gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border cursor-pointer rounded-lg">
          <Search />
          Select from Published Form Responses
          <div className="flex items-center ">
            <Command className="w-4 h-4" /> +K
          </div>
        </div>
        <span>OR</span>
        <label className="flex items-center gap-2 px-3 py-2 border cursor-pointer rounded-lg">
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload />
          )}
          Import from CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvImport}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {uploadError && (
        <div className="text-red-500 text-sm mt-2">{uploadError}</div>
      )}

      {isUploading && (
        <div className="w-full max-w-xs mt-2">
          <div className="bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="text-sm text-gray-500 mt-1 text-center">
            {uploadProgress.toFixed(0)}% uploaded
          </div>
        </div>
      )}
    </div>
  )
}

export default ResponsePicker
