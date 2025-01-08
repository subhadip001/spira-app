import EditFormHeader from "@/app/_components/edit-form-header"
import NotFoundPage from "@/app/_components/not-found-page"
import SelectVersion from "@/app/_components/select-version"
import { TooltipProvider } from "@/components/ui/tooltip"
import { fetchBaseForm } from "@/lib/queries"
import { createClient } from "@/utils/supabase/server"
import React from "react"

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ formId: string }>
}) {
  const params = await props.params

  const { children } = props

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  const response = await fetchBaseForm(params.formId)

  if (response.user_id && response.user_id !== data?.user?.id) {
    return (
      <div className="bg-white w-[100vw] h-[100svh]">
        <NotFoundPage />
      </div>
    )
  }

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
