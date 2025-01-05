import { getMaxFormVersion } from "@/lib/form-lib/utils"
import {
  addNewFormVersion,
  fetchLatestFormVersion,
  QueryKeys,
} from "@/lib/queries"
import { AddNewFormVersionVariables, EFormVersionStatus } from "@/lib/types"
import useFormVersionStore from "@/store/formVersions"
import { FormSchema } from "@/types/FormSchema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Allow, parse } from "partial-json"
import { useState } from "react"
import { toast } from "react-hot-toast"

const editFormSchemaStreaming = async (
  prompt: string,
  formSchema: string,
  onPartialUpdate: (partialSchema: Partial<FormSchema>) => void
) => {
  const response = await fetch("/api/ai-form-editor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, formSchema, streaming: true }),
  })

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let finalSchema: FormSchema = {
    title: "",
    description: "",
    headerBackground: "#ffffff",
    fields: [],
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    try {
      const partialSchema = parse(buffer, Allow.ALL) as Partial<FormSchema>
      finalSchema = { ...finalSchema, ...partialSchema }
      onPartialUpdate(finalSchema)
    } catch (error) {
      // If parsing fails, it means the JSON is incomplete
      // We'll continue to accumulate more data
    }
  }

  if (Object.keys(finalSchema).length === 0) {
    throw new Error("Failed to generate complete form schema")
  }

  return finalSchema
}

export const useFormSchemaEditor = (baseFormId: string) => {
  const queryClient = useQueryClient()
  const [currentStreamedFormSchema, setCurrentStreamedFormSchema] =
    useState<Partial<FormSchema> | null>(null)
  const [isStreamStarting, setIsStreamStarting] = useState(false)

  const formVersionsData = useFormVersionStore(
    (state) => state.formVersionsData
  )
  const setSelectedFormVersion = useFormVersionStore(
    (state) => state.setSelectedFormVersion
  )

  const addNewFormversionMutation = useMutation({
    mutationFn: (variables: AddNewFormVersionVariables) =>
      addNewFormVersion(variables),
    onSuccess: async (data, variables) => {
      const response = await fetchLatestFormVersion(baseFormId)
      const updatedResponse = {
        ...response,
        status: response.status as EFormVersionStatus,
      }
      setSelectedFormVersion(updatedResponse)
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GetFormVersions, baseFormId],
      })
      toast.success("Form version added successfully")
    },
    onError: (error: Error) => {
      console.error("Error adding new form version", error)
      toast.error("Error adding new form version")
    },
  })

  const formSchemaEditMutation = useMutation({
    mutationFn: ({
      prompt,
      formSchema,
    }: {
      prompt: string
      formSchema: string
    }) => {
      setIsStreamStarting(true)
      return editFormSchemaStreaming(prompt, formSchema, (partialSchema) => {
        setIsStreamStarting(false)
        setCurrentStreamedFormSchema(partialSchema)
      })
    },
    onSuccess: async (data, variables) => {
      setCurrentStreamedFormSchema(data)

      addNewFormversionMutation.mutate({
        formSchemaString: JSON.stringify(data),
        baseFormId: baseFormId,
        query: variables.prompt,
        version: getMaxFormVersion(formVersionsData) + 1,
        status: EFormVersionStatus.DRAFT,
      })
    },
    onError: (error: Error) => {
      console.error("Error editing form schema", error)
      toast.error("Failed to edit form schema")
    },
  })

  return {
    formSchemaEditMutation,
    currentStreamedFormSchema,
    addNewFormversionMutation,
    isStreamStarting,
  }
}
