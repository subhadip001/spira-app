import React from "react"

interface FormResponse {
  id: string
  created_at: string
  updated_at: string
  published_form_id: string
  response_data: any
}

interface QuestionData {
  name: string
  label: string
  value: string
}

interface SummaryTabProps {
  responses: FormResponse[]
}

const InsightsTab = ({ responses }: SummaryTabProps) => {
  return (
    <div className="space-y-6 p-6 w-full overflow-y-auto">
      <span className="text-3xl font-[200]">Insights</span>
      <div className="flex flex-col gap-4 pb-8 lg:w-2/3"></div>
    </div>
  )
}

export default InsightsTab
