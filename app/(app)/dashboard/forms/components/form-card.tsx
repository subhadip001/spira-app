"use client"

import { formatRelativeTime } from "@/lib/form-lib/utils"
import useAppStore from "@/store/appStore"
import { MoreVertical, Pin, Trash2 } from "lucide-react"
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
      className="bg-white flex gap-8 rounded-md border cursor-pointer h-fit p-4"
    >
      <div>
        <span className="text-lg line-clamp-1 max-w-48">{form.query}</span>
        <span className="text-xs text-gray-400 capitalize">
          {formatRelativeTime(new Date(form.created_at))}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div
          onClick={(e) => {
            e.stopPropagation()
            console.log("delete")
          }}
          className=" rounded-md flex"
        >
          <MoreVertical size={16} />
        </div>
      </div>
    </div>
  )
}
