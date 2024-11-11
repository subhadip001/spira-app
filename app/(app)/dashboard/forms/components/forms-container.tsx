"use client"
import { getFormsByUserId, QueryKeys } from "@/lib/queries"
import useAppStore from "@/store/appStore"
import { useQuery } from "@tanstack/react-query"
import FormCard from "./form-card"
import { Fragment } from "react"

export default function FormsContainer() {
  const user = useAppStore((state) => state.user)

  const { data, error } = useQuery({
    queryKey: [QueryKeys.GetFormsByUserId, user?.id],
    queryFn: () => getFormsByUserId(user?.id || ""),
    enabled: !!user?.id,
  })

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <section className="flex flex-1 w-full h-[70svh] gap-3 overflow-y-auto">
      {data?.data?.map((form, index) => {
        return <FormCard key={index} form={form} />
      })}
    </section>
  )
}
