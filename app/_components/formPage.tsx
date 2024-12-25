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
  const setSelectedFormVersion = useFormVersionStore(
    (state) => state.setSelectedFormVersion
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
      // setSelectedFormVersion(sortedData[0] as TFormVersionData)
    }
  }, [formVersions, setFormVersionsData])

  if (isLoadingBaseForm || isLoadingVersions) {
    return (
      <div className="flex flex-col w-full h-[calc(100svh-64px)] bg-[#f6f6f6df] rounded-md min-w-0">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-20 bg-gray-200 animate-pulse rounded" />
            <div className="h-9 w-24 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex flex-1 overflow-hidden">
          {/* Form Preview Skeleton */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="h-10 w-72 bg-gray-200 animate-pulse rounded mb-4" />
              <div className="h-6 w-96 bg-gray-200 animate-pulse rounded mb-8" />

              {/* Form Fields Skeleton */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-6 bg-white mb-4">
                  <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-4" />
                  <div className="h-10 w-full bg-gray-100 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="w-[500px] border-l bg-white p-4">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                  <div className="h-9 w-full bg-gray-100 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
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
