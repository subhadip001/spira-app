import React from "react"
import OnboardingForm from "./components/OnboardingForm"
import { createClient } from "@/utils/supabase/server"

export function generateMetadata({
  params,
  searchParams,
}: {
  params: { onboardingId: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  return {
    title: "Onboarding",
  }
}

const OnboardingPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const formId = (await searchParams)?.formId

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main>
      <OnboardingForm userId={user?.id as string} formId={formId} />
    </main>
  )
}

export default OnboardingPage
