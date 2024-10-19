"use client"
import { getFormsByUserId, QueryKeys } from "@/lib/queries"
import useAppStore from "@/store/appStore"
import { useQuery } from "@tanstack/react-query"
import FormCard from "./form-card"

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
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[65svh] gap-2 overflow-y-auto">
      {data?.data?.map((form) => <FormCard key={form.id} form={form} />)}
    </section>
  )
}
