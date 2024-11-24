"use client"
import React from "react"
import useAppStore from "@/store/appStore"
import { useQuery } from "@tanstack/react-query"
import { getAllResponseAnalyticsByUserId, QueryKeys } from "@/lib/queries"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { formatRelativeTime } from "@/lib/form-lib/utils"

const RecentAnalytics = () => {
  const user = useAppStore((state) => state.user)
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.GetAllResponseAnalyticsByUserId, user?.id],
    queryFn: () => getAllResponseAnalyticsByUserId(user?.id || ""),
    enabled: !!user?.id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!data?.data?.length) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
        No analytics data found
      </div>
    )
  }

  // Sort analytics by updated_at in descending order (latest first)
  const sortedAnalytics = [...data.data].sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedAnalytics.map((item) => (
        <Card
          key={item.id}
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() =>
            router.push(`/dashboard/response-analytics/${item.id}`)
          }
        >
          <CardContent className="p-4 flex flex-col h-full">
            <div className="font-medium">{item.title}</div>
            <div className="flex flex-col flex-grow gap-1 justify-end text-sm text-muted-foreground">
              <div className="">
                Last updated {formatRelativeTime(new Date(item.updated_at))}
              </div>
              <div className="text-xs">
                Created {formatRelativeTime(new Date(item.created_at))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default RecentAnalytics
