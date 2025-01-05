import { createClient } from "@/utils/supabase/server"
import { Metadata } from "next"
import { redirect } from "next/navigation"

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
      title: "Settings - Spira AI",
    }
  }

  return {
    title: `Settings - ${baseForm.query.length > 50 ? baseForm.query.slice(0, 40) + "..." : baseForm.query}`,
  }
}

export default function SettingsPage(props: {
  // params: Promise<{ formId: string }>
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // const searchParams = await props.searchParams
  // const params = await props.params
  // const supabase = await createClient()
  // const { data: user } = await supabase.auth.getUser()
  // const pathname = `/form/${params.formId}/${Object.keys(searchParams)[0] || ""}`

  // if (!user?.user && !pathname?.endsWith("/editor")) {
  //   redirect(`/login?${params.formId ? `formId=${params.formId}` : ""}`)
  // }
  return <div>Soon to be implemented</div>
}
