"use client"
import { fetchFormVersions, fetchBaseForm, QueryKeys } from "@/lib/queries"
import useFormVersionStore from "@/store/formVersions"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect } from "react"
import EditForm from "./edit-form"
import EditFormField from "./edit-form-field"
import { TFormVersionData } from "@/lib/types"
import { useParams } from "next/navigation"

const FormPage: React.FC = () => {
  const params = useParams()
  const baseFormId = params.formId as string
  const setFormVersionsData = useFormVersionStore(
    (state) => state.setFormVersionsData
  )

  const { data: baseFormData, isLoading: isLoadingBaseForm } = useQuery({
    queryKey: [QueryKeys.GetBaseForm, baseFormId],
    queryFn: () => fetchBaseForm(baseFormId),
    enabled: !!baseFormId,
    refetchOnWindowFocus: false,
  })

  const { data: formVersions, isLoading: isLoadingVersions } = useQuery({
    queryKey: [QueryKeys.GetFormVersions, baseFormId],
    queryFn: () => fetchFormVersions(baseFormId),
    enabled: !!baseFormId,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (formVersions && formVersions?.length > 0) {
      const sortedData = formVersions.sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      )
      setFormVersionsData(sortedData as TFormVersionData[])
    }
  }, [formVersions, setFormVersionsData])

  if (isLoadingBaseForm || isLoadingVersions) {
    return <div>Loading...</div>
  }

  if (!baseFormId || !baseFormData) {
    return (
      <div className="flex flex-col w-full items-center justify-center gap-2 h-[calc(100svh-64px)] py-2 px-3 bg-[#f6f6f6df] rounded-md min-w-0">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Form not found</h1>
          <p className="text-gray-500">
            The form you are looking for does not exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {formVersions && formVersions?.length > 0 ? (
        <>
          <EditForm
            baseQuery={baseFormData.query}
            baseFormId={baseFormId}
            needToGenerateFormSchema={false}
          />
          <EditFormField />
        </>
      ) : baseFormData.query ? (
        <>
          <EditForm
            baseQuery={baseFormData.query}
            baseFormId={baseFormId}
            needToGenerateFormSchema={
              baseFormData.query !== "CREATED_FROM_SCRATCH" &&
              baseFormData.query !== "CREATED_FROM_TEMPLATE"
            }
          />
          <EditFormField />
        </>
      ) : null}
    </>
  )
}

export default FormPage
