"use client"

import { csvToXml } from "@/app/transformations/csv-to-xml"
import { Search, Upload } from "lucide-react"
import { ChangeEvent, useEffect, useState } from "react"

const ResponsePicker = () => {
  const [csvData, setCsvData] = useState<string | null>(null)

  const handleCsvImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCsvData(content)
        const xml = csvToXml(content)
        console.log("XML:", xml)
      }
      reader.readAsText(file)
    }
  }
  return (
    <div className="min-w-[30rem] mx-auto border-dashed border rounded-md flex items-center p-6 gap-4">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border cursor-pointer rounded-lg">
        <div>
          <Search />
        </div>
        Select from Published Form Responses
      </div>
      <span>OR</span>
      <label className="flex items-center gap-2 px-3 py-2 border cursor-pointer rounded-lg">
        <div>
          <Upload />
        </div>
        Import from CSV
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvImport}
          className="hidden"
        />
      </label>
    </div>
  )
}

export default ResponsePicker
