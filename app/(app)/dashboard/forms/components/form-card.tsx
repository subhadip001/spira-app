"use client"

import { formatRelativeTime } from "@/lib/form-lib/utils"
import useAppStore from "@/store/appStore"
import { useRouter } from "next/navigation"

type FormCardProps = {
  form: {
    created_at: string
    id: string
    query: string
    user_id: string | null
  }
}

export default function FormCard({ form }: FormCardProps) {
  const user = useAppStore((state) => state.user)
  const router = useRouter()

  return (
    <div
      onClick={() => {
        router.push(`/form/${form.id}/editor`)
      }}
      className="bg-white rounded-md border cursor-pointer p-4 w-full"
    >
      <span className="text-lg line-clamp-1 max-w-48">{form.query}</span>
      <p className="text-xs text-gray-400 capitalize">
        {formatRelativeTime(new Date(form.created_at))}
      </p>
    </div>
  )
}
