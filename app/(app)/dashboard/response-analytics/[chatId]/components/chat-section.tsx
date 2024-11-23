"use client"
import React, { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createStarterQuestionsForUploadedCsv,
  fetchChatDataForUploadedCsv,
  generateStarterQuestions,
  QueryKeys,
} from "@/lib/queries"
import toast from "react-hot-toast"
import { TResponseAnalytics } from "@/lib/types"

type DashboardChatSectionProps = {
  responseAnalytics: TResponseAnalytics
}

const DashboardChatSection: React.FC<DashboardChatSectionProps> = ({
  responseAnalytics,
}) => {
  const queryClient = useQueryClient()

  const { data: chatData } = useQuery({
    queryKey: [QueryKeys.GetDataForUploadedCsv, responseAnalytics.id],
    queryFn: () => fetchChatDataForUploadedCsv(responseAnalytics.id),
  })

  const generateStarterQuestionsMutation = useMutation({
    mutationFn: async (xml: string) => generateStarterQuestions(xml),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error)
      } else {
        toast.success("Starter questions generated successfully")
        saveStarterQuestionsResponseMutation.mutate({
          starterQuestions: data.message,
        })
      }
    },
  })

  const saveStarterQuestionsResponseMutation = useMutation({
    mutationFn: async ({ starterQuestions }: { starterQuestions: string }) =>
      createStarterQuestionsForUploadedCsv(
        responseAnalytics.id,
        starterQuestions
      ),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message)
      } else {
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.GetDataForUploadedCsv, responseAnalytics.id],
        })
        toast.success("Starter questions saved successfully")
      }
    },
  })

  useEffect(() => {
    if (chatData && !chatData.data?.ai_starter_questions) {
      generateStarterQuestionsMutation.mutate(
        responseAnalytics.transformed_xml as string
      )
    }
  }, [chatData, responseAnalytics.transformed_xml])

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {chatData?.data?.ai_starter_questions
          ?.split("|")
          .map((question, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border hover:border-gray-300 transition-colors cursor-pointer"
              onClick={() => {
                /* TODO: Handle question click */
              }}
            >
              <p className="text-sm font-medium text-gray-800">
                {question.trim()}
              </p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default DashboardChatSection
