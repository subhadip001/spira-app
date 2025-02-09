import React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Json } from "@/utils/supabase/database.types"

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

const SummaryTab = ({ responses }: SummaryTabProps) => {
  // Function to calculate response statistics for each question
  const calculateQuestionStats = () => {
    if (!responses.length) return []

    // Get all questions from the first response
    const firstResponse = responses[0]
    if (
      !firstResponse.response_data ||
      typeof firstResponse.response_data !== "object"
    )
      return []

    const responseData = firstResponse.response_data as Record<
      string,
      QuestionData
    >
    const questions = Object.entries(responseData).map(([id, data]) => ({
      id,
      label: data.label,
      name: data.name,
      responses: new Map<string, number>(),
    }))

    // Calculate response frequencies
    responses.forEach((response) => {
      if (!response.response_data || typeof response.response_data !== "object")
        return
      const responseData = response.response_data as Record<
        string,
        QuestionData
      >

      Object.entries(responseData).forEach(([id, data]) => {
        const question = questions.find((q) => q.id === id)
        if (!question) return

        // Handle multiple values (comma-separated)
        const values = data.value.split(",").filter(Boolean)
        if (values.length === 0) values.push("No response")

        values.forEach((value) => {
          question.responses.set(
            value,
            (question.responses.get(value) || 0) + 1
          )
        })
      })
    })

    return questions.map((question) => {
      const responseEntries = Array.from(question.responses.entries())
      const totalResponses = responseEntries.reduce(
        (sum, [_, count]) => sum + count,
        0
      )

      return {
        id: question.id,
        title: question.label,
        name: question.name,
        totalResponses,
        choices: responseEntries.map(([value, count]) => ({
          text: value,
          responses: count,
          percentage: Math.round((count / totalResponses) * 100),
        })),
      }
    })
  }

  const questionStats = calculateQuestionStats()

  return (
    <div className="space-y-6 p-6 w-full overflow-y-auto">
      <span className="text-3xl font-[200]">Response Summary</span>
      <div className="flex flex-col gap-4 pb-8 lg:w-2/3">
        {questionStats.map((question) => (
          <section
            key={question.id}
            className="p-6 pb-8 bg-white rounded-md shadow-sm"
          >
            <div className="space-y-4">
              {/* Question Header */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  {question.id}
                </div>
                <h3 className="text-lg font-medium">{question.title}</h3>
              </div>

              {/* Response Stats */}
              <p className="text-sm text-gray-500">
                {question.totalResponses}{" "}
                {question.totalResponses === 1 ? "person" : "people"} answered
                this question
              </p>

              {/* Response Distribution */}
              <div className="space-y-3">
                {question.choices.map((choice, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{choice.text}</span>
                      <div className="flex gap-4">
                        <span>{choice.responses} resp.</span>
                        <span className="w-12 text-right">
                          {choice.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="h-5 rounded-sm bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-[#009AC9]"
                        style={{ width: `${choice.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default SummaryTab
