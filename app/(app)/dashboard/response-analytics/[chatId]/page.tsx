import React from "react"

type ChatPageProps = {
  params: Promise<{
    chatId: string
  }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params
  return <div>page {chatId}</div>
}
