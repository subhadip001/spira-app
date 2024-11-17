import { useState, useCallback } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

const generateFormResponseChat = async (
  xml: string,
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<string> => {
  const response = await fetch("/api/response-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ xml, prompt, streaming: true }),
  })

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let fullResponse = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    fullResponse += chunk
    onChunk(chunk)
  }

  return fullResponse
}

export const useFormResponseChatGenerator = () => {
  const [currentStreamedResponse, setCurrentStreamedResponse] =
    useState<string>("")
  const [isStreamStarting, setIsStreamStarting] = useState(false)
  const [isStreamFinished, setIsStreamFinished] = useState(false)

  const formResponseChatMutation = useMutation({
    mutationFn: ({ xml, prompt }: { xml: string; prompt: string }) => {
      setIsStreamStarting(true)
      setCurrentStreamedResponse("")
      return generateFormResponseChat(xml, prompt, (chunk) => {
        setCurrentStreamedResponse((prev) => prev + chunk)
      })
    },
    onSuccess: async () => {
      setIsStreamStarting(false)
      setIsStreamFinished(true)
    },
    onError: (error: Error) => {
      setIsStreamStarting(false)
      console.error("Error generating form response", error)
      toast.error("Failed to generate form response")
    },
  })

  return {
    formResponseChatMutation,
    currentStreamedResponse,
    isStreamStarting,
    isStreamFinished,
  }
}
