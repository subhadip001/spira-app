"use client"

import React, { useState } from "react"
import { TResponseAnalytics } from "@/lib/types"
import TableViewComponent from "./table-view-component"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type DataViewSectionProps = {
  responseAnalytics: TResponseAnalytics
}

const DataViewSection: React.FC<DataViewSectionProps> = ({
  responseAnalytics,
}) => {
  const [openDialog, setOpenDialog] = useState(false)

  const TableContentView = () => (
    <div className="flex-1 overflow-x-auto max-w-[95vw] h-[60vh]">
      <TableViewComponent tableData={responseAnalytics.response_json} />
    </div>
  )

  return (
    <div className="space-y-4">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button variant="outline">View Table Data</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh]">
          <DialogTitle>Table Data View</DialogTitle>
          <TableContentView />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DataViewSection
