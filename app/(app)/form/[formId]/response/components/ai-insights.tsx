import { TPublishedFormResponse } from "@/lib/types"
import React, { useState } from "react"

type AiInsightsProps = {
  publishedFormResponse: TPublishedFormResponse
}
const AiInsights: React.FC<AiInsightsProps> = () => {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle message submission here
    setMessage("")
  }

  return (
    <div className="flex flex-col gap-4 p-6 w-full overflow-y-auto">
      <span className="text-3xl font-[200]">Smart Insights</span>
      <div className="flex flex-col gap-4 h-full">
        {/* Chat Messages Area */}
        <div className="flex-grow bg-white rounded-md p-6 overflow-y-auto min-h-[400px]">
          <div className="flex flex-col gap-4">
            {/* System Message */}
            <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
              <p className="text-sm text-gray-700">
                Hello! I can help you analyze your form responses and provide
                insights. What would you like to know?
              </p>
            </div>
            {/* Messages will be dynamically rendered here */}
          </div>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            disabled
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your form responses..."
            className="flex-grow p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Coming Soon
          </button>
        </form>

        {/* Visualization Section - Empty for now, will be populated dynamically */}
      </div>
    </div>
  )
}

export default AiInsights
