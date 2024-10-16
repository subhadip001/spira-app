import { useMutation, useQueryClient } from "@tanstack/react-query"
import { parse, Allow } from "partial-json"
import { useState, useCallback } from "react"

interface FormSchema {
  title?: string
  description?: string
  headerBackground?: string
  fields?: any[] // Define a more specific type if possible
}

const generateFormSchema = async (
  prompt: string,
  onPartialUpdate: (partialSchema: Partial<FormSchema>) => void
): Promise<FormSchema> => {
  const response = await fetch("/api/generate-form-schema", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let finalSchema: FormSchema = {}

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

export const useFormSchemaMutation = (baseFormId: string) => {
  const queryClient = useQueryClient()
  const [currentStreamedFormSchema, setCurrentStreamedFormSchema] =
    useState<Partial<FormSchema> | null>(null)

  const addNewFormVersionMutation = useMutation({
    mutationFn: (variables: {
      formSchemaString: string
      baseFormId: string
      query: string
      version: number
    }) =>
      fetch("/api/add-new-form-version", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(variables),
      }).then((res) => res.json()),
  })

  const formSchemaGenerateMutation = useMutation({
    mutationFn: (prompt: string) =>
      generateFormSchema(prompt, (partialSchema) => {
        setCurrentStreamedFormSchema(partialSchema)
      }),
    onSuccess: async (data, variables) => {
      // The full schema is now in 'data'
      setCurrentStreamedFormSchema(data)

      addNewFormVersionMutation.mutate({
        formSchemaString: JSON.stringify(data),
        baseFormId: baseFormId,
        query: variables, // This is the prompt
        version: 1,
      })

      // Optionally invalidate or update any relevant queries
      //   queryClient.invalidateQueries("formSchemas")
    },
    onError: (error: Error) => {
      console.error("Error generating form schema", error)
    },
  })

  return {
    formSchemaGenerateMutation,
    currentStreamedFormSchema,
    addNewFormVersionMutation,
  }
}
