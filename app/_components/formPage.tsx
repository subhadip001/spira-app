"use client"
import { fetchFormVersions, QueryKeys } from "@/lib/queries"
import useFormVersionStore from "@/store/formVersions"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import EditForm from "./edit-form"
import EditFormField from "./edit-form-field"
import { TFormVersionData } from "@/lib/types"

type FormPageProps = {
  baseQuery: string
  baseFormId: string
  formVersions: {
    created_at: string
    form_id: string
    form_schema_string: string
    id: string
    query: string
    version_number: number
  }[]
}

const FormPage: React.FC<FormPageProps> = ({
  baseQuery,
  formVersions,
  baseFormId,
}) => {
  const setFormVersionsData = useFormVersionStore(
    (state) => state.setFormVersionsData
  )

  const { data } = useQuery({
    queryKey: [QueryKeys.GetFormVersions, baseFormId],
    queryFn: () => fetchFormVersions(baseFormId),
    initialData: formVersions,
    enabled: !!baseFormId,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (data && data?.length > 0) {
      const sortedData = data.sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      )
      setFormVersionsData(sortedData as TFormVersionData[])
    }
  }, [data])

  return (
    <>
      {data && data?.length > 0 ? (
        <>
          <EditForm
            baseQuery={baseQuery}
            baseFormId={baseFormId}
            needToGenerateFormSchema={false}
          />
          <EditFormField />
        </>
      ) : baseQuery ? (
        <>
          <EditForm
            baseQuery={baseQuery}
            baseFormId={baseFormId}
            needToGenerateFormSchema={
              baseQuery !== "CREATED_FROM_SCRATCH" &&
              baseQuery !== "CREATED_FROM_TEMPLATE"
            }
          />
          <EditFormField />
        </>
      ) : (
        <div className="flex flex-col w-full items-center justify-center gap-2 h-[calc(100svh-64px)] py-2 px-3 bg-[#f6f6f6df] rounded-md min-w-0">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Form not found</h1>
            <p className="text-gray-500">
              The form you are looking for does not exist.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default FormPage
