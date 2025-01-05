import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import PublishedResponse from "./components/published-response"
import { Metadata } from "next"

export const generateMetadata = async (props: {
  params: Promise<{ formId: string }>
}): Promise<Metadata> => {
  const params = await props.params
  const supabase = await createClient()
  const { data: baseForm, error: baseFormError } = await supabase
    .from("forms")
    .select("query")
    .eq("id", params.formId)
    .single()

  if (baseFormError || !baseForm) {
    return {
      title: "Responses",
    }
  }

  return {
    title: `Responses - ${baseForm.query.length > 50 ? baseForm.query.slice(0, 40) + "..." : baseForm.query}`,
  }
}

export default async function ResponsePage(props: {
  params: Promise<{ formId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const params = await props.params
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  const pathname = `/form/${params.formId}/${Object.keys(searchParams)[0] || ""}`

  if (!user?.user && !pathname?.endsWith("/editor")) {
    redirect(`/login?${params.formId ? `formId=${params.formId}` : ""}`)
  }
  return (
    <main className="flex flex-col gap-4 p-4 w-full">
      <PublishedResponse />
    </main>
  )
}
