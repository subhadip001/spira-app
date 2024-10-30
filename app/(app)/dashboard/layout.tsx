import { TooltipProvider } from "@/components/ui/tooltip"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import React from "react"
import ClientLayout from "./components/client-layout"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  return (
    <TooltipProvider>
      <ClientLayout>{children}</ClientLayout>
    </TooltipProvider>
  )
}
