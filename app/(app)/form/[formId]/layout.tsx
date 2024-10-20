import EditFormHeader from "@/app/_components/edit-form-header"
import SelectVersion from "@/app/_components/select-version"
import { TooltipProvider } from "@/components/ui/tooltip"
import React from "react"

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { formId: string }
}) {
  return (
    <TooltipProvider>
      <div className="bg-white w-[100vw] min-h-[100svh]">
        <SelectVersion formId={params.formId} />
        <EditFormHeader formId={params.formId} />
        <main className="flex px-3">{children}</main>
      </div>
    </TooltipProvider>
  )
}
