"use client"
import { useFormSchemaGenerator } from "@/hooks/form-schema-streamer"
import { jsonExtractor } from "@/lib/form-lib/utils"
import { generateFormSchema } from "@/lib/queries"
import { TQueryData } from "@/lib/types"
import useEditFormPageStore from "@/store/editFormPageStore"
import useFormStore from "@/store/formStore"
import useFormVersionStore from "@/store/formVersions"
import { FormSchema } from "@/types/FormSchema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import React, { useEffect } from "react"
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
}

const GenerateForm: React.FC<TGenerateFormProps> = ({
  formData,
  selectedViewport,
  baseFormId,
  needToGenerateFormSchema,
}) => {
  const currentFormSchema = useFormStore((state) => state.currentFormSchema)
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
  } = useFormSchemaGenerator(baseFormId)

  const seletedFormVersion = useFormVersionStore(
    (state) => state.selectedFormVersion
  )

  const formSchemaGenerateMutation = useMutation({
    mutationFn: generateFormSchema,
    onSuccess: async (data) => {
      const extractedFormSchema = jsonExtractor(data.message)
      setCurrentFormSchema(extractedFormSchema)
      addNewFormversionMutation.mutate({
        formSchemaString: JSON.stringify(extractedFormSchema),
        baseFormId: baseFormId,
        query: formData.prompt,
        version: 1,
      })
    },
    onError: (error: Error) => {
      console.error("Error generating form schema", error)
    },
  })
  useEffect(() => {
    if (needToGenerateFormSchema) {
      // formSchemaGenerateMutation.mutate(formData)
      formSchemaStreamMutation.mutate(formData.prompt)
    }
  }, [needToGenerateFormSchema])

  console.log(currentStreamedFormSchema)

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
      <div className="mx-3 w-full  mmd:w-auto  bg-white border shadow-sm rounded-lg h-[calc(90svh-128px)] overflow-y-auto">
        {formSchemaStreamMutation.isPending ? (
          <StreamingFormBuilder
            initialSchema={currentStreamedFormSchema as Partial<FormSchema>}
            className="px-4 py-3 mmd:px-10 mmd:py-8"
            published={false}
          />
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
      </div>
    </HorizontalResizableComponent>
  )
}

export default GenerateForm
