import { Plus } from "lucide-react"
import { BookDashed } from "lucide-react"
import React from "react"

type TemplateAndScratchProps = {
  onTemplateClick: () => void
  onCreateClick: () => void
  isScratchPending: boolean
  isTemplatePending: boolean
}

const TemplateAndScratch = ({
  onTemplateClick,
  onCreateClick,
  isScratchPending,
  isTemplatePending,
}: TemplateAndScratchProps) => {
  return (
    <>
      <div className="flex justify-center relative my-2">
        <hr className="w-full border-t border-gray-300" />
        <div className="absolute text-sm top-[50%] -translate-y-[50%] p-1 h-7 w-10 flex items-center justify-center">
          <span className="bg-white text-gray-400 text-sm p-1 rounded-full h-7 w-7 flex items-center justify-center">
            OR
          </span>
        </div>
      </div>
      <div className="flex justify-center gap-5 text-gray-600">
        <button
          className="flex gap-2 items-center rounded-md p-2 border border-gray-200"
          onClick={onTemplateClick}
          disabled={isTemplatePending}
        >
          <div className="">
            <BookDashed className="w-4 h-4" />
          </div>
          <span>Start from template</span>
        </button>
        <button
          className="flex gap-2 items-center rounded-md p-2 border border-gray-200"
          onClick={onCreateClick}
          disabled={isScratchPending}
        >
          <div className="">
            <Plus className="w-4 h-4" />
          </div>
          <span>Create from scratch</span>
        </button>
      </div>
    </>
  )
}

export default TemplateAndScratch
