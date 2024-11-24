"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TResponseAnalytics } from "@/lib/types"
import React, { useState } from "react"
import CSVViewer from "./csv-viewer"

type DataViewSectionProps = {
  responseAnalytics: TResponseAnalytics
}

const DataViewSection: React.FC<DataViewSectionProps> = ({
  responseAnalytics,
}) => {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <div className="">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="w-full flex justify-start" variant="outline">
            View Full Data
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] w-full h-[90vh]">
          <DialogTitle>Table Data View</DialogTitle>
          <CSVViewer url={responseAnalytics.uploaded_csv_url} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DataViewSection
