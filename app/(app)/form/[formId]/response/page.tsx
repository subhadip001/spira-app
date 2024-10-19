import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import PublishedResponse from "./components/published-response"

export default async function ResponsePage({
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
  return (
    <main className="flex flex-col gap-4 p-4 w-full">
      <PublishedResponse />
    </main>
  )
}
