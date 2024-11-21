import React from "react"

async function page({
  params,
}: {
  params: {
    chatId: string
  }
}) {
  const { chatId } = await params
  return <div>page {chatId}</div>
}

export default page
