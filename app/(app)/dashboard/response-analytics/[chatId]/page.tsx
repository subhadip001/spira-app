import { createClient } from "@/utils/supabase/server"
import React from "react"
import DashboardChatSection from "./components/chat-section"
import { TResponseAnalytics } from "@/lib/types"

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
    <div>
      <DashboardChatSection
        responseAnalytics={responseAnalytics?.[0] as TResponseAnalytics}
      />
    </div>
  )
}
