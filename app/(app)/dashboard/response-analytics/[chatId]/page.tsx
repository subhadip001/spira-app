import { createClient } from "@/utils/supabase/server"
import React from "react"
import DashboardChatSection from "./components/chat-section"
import { TResponseAnalytics } from "@/lib/types"
import DataViewSection from "./components/data-view-section"

type ChatPageProps = {
  params: Promise<{
    chatId: string
  }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params

  const supabase = await createClient()

  const { data: responseAnalytics } = await supabase
    .from("response_analytics")
    .select("*")
    .eq("id", chatId)
    .limit(1)

  if (!responseAnalytics) {
    return <div>Response Analytics not found</div>
  }

  return (
    <div className="space-y-6">
      <DataViewSection
        responseAnalytics={responseAnalytics?.[0] as TResponseAnalytics}
      />
      <div className="">
        <DashboardChatSection
          responseAnalytics={responseAnalytics?.[0] as TResponseAnalytics}
        />
      </div>
    </div>
  )
}
