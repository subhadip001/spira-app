import { TooltipProvider } from "@/components/ui/tooltip"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import React from "react"
import ClientLayout from "./components/client-layout"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

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

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={true}>
      <TooltipProvider>
        <ClientLayout>{children}</ClientLayout>
      </TooltipProvider>
    </SidebarProvider>
  )
}
