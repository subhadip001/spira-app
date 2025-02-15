import { TPublishedFormResponse } from "@/lib/types"
import React from "react"

type AiInsightsProps = {
  publishedFormResponse: TPublishedFormResponse
}
const AiInsights: React.FC<AiInsightsProps> = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="mt-8 bg-white rounded-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">
            AI Insights on your Form Response
          </h3>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
            Coming Soon!
          </button>
        </div>
        <p className="text-gray-500 text-sm">
          Get AI-powered insights about your form responses - understand
          patterns, sentiment analysis, and key takeaways to make better
          decisions
        </p>
      </div>
    </div>
  )
}

export default AiInsights
