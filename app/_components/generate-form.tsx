"use client"
import { useFormSchemaGenerator } from "@/hooks/form-schema-streamer"
import { TQueryData } from "@/lib/types"
import useEditFormPageStore from "@/store/editFormPageStore"
import useFormStore from "@/store/formStore"
import useFormVersionStore from "@/store/formVersions"
import { FormSchema } from "@/types/FormSchema"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react"
import dynamic from "next/dynamic"
import React, { useEffect, useRef } from "react"
import FormBuilder from "./form-components/FormBuilder"
import StreamingFormBuilder from "./form-components/streaming-formbuilder"

const HorizontalResizableComponent = dynamic(
  () => import("./resizable-component"),
  { ssr: false }
)

type TGenerateFormProps = {
  formData: TQueryData
  selectedViewport: "phone" | "tablet" | "desktop"
  baseFormId: string
  needToGenerateFormSchema: boolean
  isEditFormStreaming: boolean
  isEditFormStreamStarting: boolean
  currentStreamedEditFormSchema: Partial<FormSchema> | null
}

const GenerateForm: React.FC<TGenerateFormProps> = ({
  formData,
  selectedViewport,
  baseFormId,
  needToGenerateFormSchema,
  isEditFormStreaming,
  isEditFormStreamStarting,
  currentStreamedEditFormSchema,
}) => {
  const currentFormSchema = useFormStore((state) => state.currentFormSchema)
  const streamingFormRef = useRef<HTMLDivElement>(null)

  const setCurrentFormSchema = useFormStore(
    (state) => state.setCurrentFormSchema
  )

  const isViewAsPublished = useEditFormPageStore(
    (state) => state.isViewAsPublished
  )

  const queryClient = useQueryClient()
  const {
    formSchemaStreamMutation,
    currentStreamedFormSchema,
    addNewFormversionMutation,
    isStreamStarting,
  } = useFormSchemaGenerator(baseFormId)

  const seletedFormVersion = useFormVersionStore(
    (state) => state.selectedFormVersion
  )

  // const formSchemaGenerateMutation = useMutation({
  //   mutationFn: generateFormSchema,
  //   onSuccess: async (data) => {
  //     const extractedFormSchema = jsonExtractor(data.message)
  //     setCurrentFormSchema(extractedFormSchema)
  //     addNewFormversionMutation.mutate({
  //       formSchemaString: JSON.stringify(extractedFormSchema),
  //       baseFormId: baseFormId,
  //       query: formData.prompt,
  //       version: 1,
  //     })
  //   },
  //   onError: (error: Error) => {
  //     console.error("Error generating form schema", error)
  //   },
  // })
  useEffect(() => {
    if (needToGenerateFormSchema) {
      // formSchemaGenerateMutation.mutate(formData)
      formSchemaStreamMutation.mutate(formData.prompt)
    } else if (
      formData.prompt === "CREATED_FROM_SCRATCH" ||
      formData.prompt === "CREATED_FROM_TEMPLATE"
    ) {
      setCurrentFormSchema({
        title: "",
        description: "",
        headerBackground: "#ffffff",
        fields: [],
      })
    }
  }, [needToGenerateFormSchema])

  useEffect(() => {
    if (!needToGenerateFormSchema && seletedFormVersion?.form_schema_string) {
      const jsonFormSchema = JSON.parse(
        seletedFormVersion?.form_schema_string as string
      )
      setCurrentFormSchema(jsonFormSchema)
    }
  }, [seletedFormVersion, needToGenerateFormSchema])

  // const addNewFormversionMutation = useMutation({
  //   mutationFn: (variables: AddNewFormVersionVariables) =>
  //     addNewFormVersion(variables),
  //   onSuccess: (data) => {
  //     queryClient.invalidateQueries({
  //       queryKey: [QueryKeys.GetFormVersions, baseFormId],
  //     })
  //     toast.success("Form version added successfully")
  //   },
  //   onError: (error: Error) => {
  //     console.error("Error adding new form version", error)
  //   },
  // })

  const isFormStreaming =
    formSchemaStreamMutation.isPending || isEditFormStreaming
  const isFormStreamStarting = isStreamStarting || isEditFormStreamStarting

  useEffect(() => {
    if (isFormStreaming && streamingFormRef.current) {
      streamingFormRef.current.scrollTop = streamingFormRef.current.scrollHeight
    }
  }, [
    currentStreamedFormSchema,
    currentStreamedEditFormSchema,
    isFormStreaming,
  ])

  return (
    <HorizontalResizableComponent
      initialWidth={
        selectedViewport === "desktop"
          ? 1300
          : selectedViewport === "tablet"
            ? 800
            : 400
      }
    >
      <div
        className="mx-3 w-full  mmd:w-auto  bg-[#ffff] border shadow-sm rounded-lg h-[calc(90svh-128px)] overflow-y-auto"
        ref={streamingFormRef}
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {isFormStreamStarting ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : isFormStreaming ? (
          <StreamingFormBuilder
            initialSchema={
              currentStreamedFormSchema ??
              (currentStreamedEditFormSchema as Partial<FormSchema>)
            }
            className="px-4 py-3 mmd:px-10 mmd:py-8"
            published={false}
          />
        ) : addNewFormversionMutation.isPending ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : currentFormSchema ? (
          <FormBuilder
            initialSchema={currentFormSchema}
            className="px-4 py-3 mmd:px-10 mmd:py-8"
            published={false}
            editable={!isViewAsPublished}
          />
        ) : (
          <>
            <div className="flex flex-col w-full items-center justify-center gap-2 h-[calc(100svh-64px)] py-2 px-3 bg-[#f6f6f6df] rounded-md min-w-0">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Form not found</h1>
                <p className="text-gray-500">
                  The form you are looking for does not exist.
                </p>
              </div>
            </div>
          </>
        )}
        <div className="w-[90%] mx-auto flex justify-end">
          <div className="border inline-flex items-center justify-center gap-2 p-1 rounded-md mb-3">
            <div className="cursor-pointer hover:bg-gray-100 rounded-md p-2 border">
              <ThumbsUp className="h-4 w-4" />
            </div>
            <div className="cursor-pointer hover:bg-gray-100 rounded-md p-2 border">
              <ThumbsDown className="h-4 w-4" />
            </div>
            <div
              onClick={() => {
                formSchemaStreamMutation.mutate(formData.prompt)
              }}
              className="cursor-pointer hover:bg-gray-100 rounded-md p-2 border"
            >
              <RefreshCw className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </HorizontalResizableComponent>
  )
}

export default GenerateForm
