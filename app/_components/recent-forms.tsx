"use client"

import { getRecentFormsByUserId, QueryKeys } from "@/lib/queries"
import { User } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
export const RecentForms = ({
  user,
  userError,
}: {
  user: User
  userError: Error
}) => {
  const router = useRouter()

  if (userError || !user) {
    console.error(userError)
    return null
  }

  const { data: recentForms, error: recentFormsError } = useQuery({
    queryKey: [QueryKeys.GetRecentFormsByUserId, user.id],
    queryFn: () => getRecentFormsByUserId(user.id),
    enabled: !!user,
    refetchOnWindowFocus: false,
  })

  if (recentFormsError || !recentForms) {
    console.error(recentFormsError)
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg text-gray-500">Your Recent Forms</span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {recentForms?.data?.map((form) => (
          <div
            onClick={() => {
              router.push(`/form/${form.id}`)
            }}
            key={form.id}
            className="p-2 rounded-md flex justify-between items-center gap-2 cursor-pointer border hover:border-gray-300 hover:bg-[#ffffff1a]"
          >
            <span className="text-sm line-clamp-1">{form.query}</span>
            <div className="inline-flex items-center">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
