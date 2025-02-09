import { TResponseData } from "@/lib/types"
import React from "react"

interface FormResponse {
  id: string
  created_at: string
  updated_at: string
  published_form_id: string
  response_data: any
}

interface InsightsTabProps {
  responses: FormResponse[]
}

const InsightsTab = ({ responses }: InsightsTabProps) => {
  // Calculate metrics
  const views = responses.length
  const starts = responses.filter((r) => r.response_data).length
  const submissions = responses.filter(
    (r) => Object.keys((r.response_data as TResponseData) || {}).length > 0
  ).length
  const completionRate =
    starts > 0 ? Math.round((submissions / starts) * 100) : 0

  // Calculate average time to complete in minutes
  const avgTimeToComplete =
    responses.reduce((acc, response) => {
      const startTime = new Date(response.created_at).getTime()
      const endTime = new Date(response.updated_at).getTime()
      return acc + (endTime - startTime) / (1000 * 60) // Convert to minutes
    }, 0) / (responses.length || 1)

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes % 60)
    const hours = Math.floor(minutes / 60)
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6 p-6 w-full overflow-y-auto">
      <span className="text-3xl font-[200]">Insights</span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-md p-4">
          <div className="text-5xl font-[300]">{views}</div>
          <div className="text-gray-500 text-sm mt-1">Views</div>
        </div>
        <div className="bg-white rounded-md p-4">
          <div className="text-5xl font-[300]">{starts}</div>
          <div className="text-gray-500 text-sm mt-1">Starts</div>
        </div>
        <div className="bg-white rounded-md p-4">
          <div className="text-5xl font-[300]">{submissions}</div>
          <div className="text-gray-500 text-sm mt-1">Submissions</div>
        </div>
        <div className="bg-white rounded-md p-4">
          <div className="text-5xl font-[300]">{completionRate}%</div>
          <div className="text-gray-500 text-sm mt-1">Completion rate</div>
        </div>
        <div className="bg-white rounded-md p-4">
          <div className="text-5xl font-[300]">
            {formatTime(avgTimeToComplete)}
          </div>
          <div className="text-gray-500 text-sm mt-1">Time to complete</div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Question drop-off rate</h3>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
            Coming Soon!
          </button>
        </div>
        <p className="text-gray-500 text-sm">
          See where people abandon your form—the first step to improving your
          questions so you get more responses
        </p>
        {/* <div className="text-sm text-orange-600 mt-4">
          Available on these plans: Business, Enterprise, Growth Pro, Growth
          Custom
        </div> */}
      </div>
    </div>
  )
}

export default InsightsTab
