import { TooltipProvider } from "@/components/ui/tooltip"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import React from "react"
import EditFormHeader from "@/app/_components/edit-form-header"

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { formId: string }
}) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  return (
    <TooltipProvider>
      <div className="bg-white w-[100vw] min-h-[100svh]">
        <EditFormHeader formId={params.formId} />
        <main className="flex px-3">{children}</main>
      </div>
    </TooltipProvider>
  )
}
