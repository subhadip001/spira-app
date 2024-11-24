import { useState, useCallback } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import {
  addAiChatMessageToDb,
  addAiChatMessageToDbForUploadedCsv,
  QueryKeys,
} from "@/lib/queries"
import { TAiChatMessage } from "@/lib/types"
import ShortUniqueId from "short-unique-id"

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

  const [isResponseLoading, setIsResponseLoading] = useState(false)

  const queryClient = useQueryClient()
  const { randomUUID } = new ShortUniqueId({ length: 10 })

  const createAiChatMessageMutation = useMutation({
    mutationFn: async ({
      message,
      publishedFormId,
    }: {
      message: TAiChatMessage
      publishedFormId: string
    }) => addAiChatMessageToDb(message, publishedFormId),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data?.error.message)
      } else {
      }
    },
  })

  const createAiChatMessageMutationForUploadedCsv = useMutation({
    mutationFn: async ({
      message,
      responseAnalyticsId,
    }: {
      message: TAiChatMessage
      responseAnalyticsId: string
    }) => addAiChatMessageToDbForUploadedCsv(message, responseAnalyticsId),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data?.error.message)
      } else {
      }
    },
  })
  const formResponseChatMutation = useMutation({
    mutationFn: ({
      xml,
      prompt,
      streaming,
      publishedFormId,
      responseAnalyticsId,
    }: {
      xml: string
      prompt: string
      streaming: boolean
      publishedFormId?: string
      responseAnalyticsId?: string
    }) => {
      setIsStreamStarting(true)
      setIsResponseLoading(true)
      setCurrentStreamedResponse("")

      if (streaming) {
        return generateFormResponseChat(xml, prompt, (chunk) => {
          setCurrentStreamedResponse((prev) => prev + chunk)
        })
      } else {
        return fetch("/api/response-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ xml, prompt, streaming: false }),
        }).then((res) => res.json())
      }
    },
    onSuccess: async (data, variables) => {
      setIsStreamStarting(false)
      setIsStreamFinished(true)
      setIsResponseLoading(false)
      console.log("data", data)

      const message = {
        id: randomUUID(),
        role: "assistant" as const,
        content: variables.streaming ? data : data?.message,
      }

      console.log("variables", variables)

      if (variables.publishedFormId) {
        createAiChatMessageMutation.mutate(
          { message, publishedFormId: variables.publishedFormId },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: [QueryKeys.GetAiChatMessagesByPublishedFormId],
              })
            },
          }
        )
      } else if (variables.responseAnalyticsId) {
        createAiChatMessageMutationForUploadedCsv.mutate(
          { message, responseAnalyticsId: variables.responseAnalyticsId },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: [
                  QueryKeys.GetDataForUploadedCsvByResponseAnalyticsId,
                  variables.responseAnalyticsId,
                ],
              })
            },
          }
        )
      }
    },
    onError: (error: Error) => {
      setIsStreamStarting(false)
      setIsResponseLoading(false)
      console.error("Error generating form response", error)
      toast.error("Failed to generate form response")
    },
  })

  return {
    formResponseChatMutation,
    currentStreamedResponse,
    isStreamStarting,
    isStreamFinished,
    isResponseLoading,
  }
}
