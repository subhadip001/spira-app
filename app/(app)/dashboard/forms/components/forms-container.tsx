"use client"
import { getFormsByUserId, QueryKeys } from "@/lib/queries"
import useAppStore from "@/store/appStore"
import { useQuery } from "@tanstack/react-query"
import FormCard from "./form-card"
import { Plus } from "lucide-react"
import Link from "next/link"
import CustomButton from "@/app/_components/custom-button"

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

  if (data?.data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-lg text-muted-foreground">No forms found</p>
        <Link href="/">
          <CustomButton className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Form
          </CustomButton>
        </Link>
      </div>
    )
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full p-2">
      {data?.data?.map((form, index) => {
        return <FormCard key={form.id} form={form} />
      })}
    </section>
  )
}
