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
      className="bg-white rounded-md border cursor-pointer p-4 flex justify-between w-full hover:border-gray-300 transition-colors"
    >
      <div className="flex flex-col min-w-0">
        <span className="text-lg font-medium line-clamp-1">{form.query}</span>
        <span className="text-xs text-gray-400 capitalize">
          {formatRelativeTime(new Date(form.created_at))}
        </span>
      </div>
      <div className="flex items-start ml-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            console.log("delete")
          }}
          className="p-1 hover:bg-gray-100 rounded-md"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  )
}
