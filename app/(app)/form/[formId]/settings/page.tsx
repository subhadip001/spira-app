import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: { formId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()
  const { data: user } = await supabase.auth.getUser()
  const pathname = `/form/${params.formId}/${Object.keys(searchParams)[0] || ""}`

  if (!user?.user && !pathname?.endsWith("/editor")) {
    redirect(`/login?${params.formId ? `formId=${params.formId}` : ""}`)
  }
  return <div>SettingsPage</div>
}
