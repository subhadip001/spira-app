import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import SharePublished from "./components/share-published"

export default async function SharePage(props: {
  params: Promise<{ formId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const params = await props.params
  // const supabase = await createClient()
  // const { data: user } = await supabase.auth.getUser()
  // const pathname = `/form/${params.formId}/${Object.keys(searchParams)[0] || ""}`

  // if (!user?.user && !pathname?.endsWith("/editor")) {
  //   redirect(`/login?${params.formId ? `formId=${params.formId}` : ""}`)
  // }
  return (
    <main className="flex flex-col gap-4 p-4 w-full">
      <span className="text-2xl text-muted-foreground">
        Share this form with others
      </span>
      <SharePublished formId={params.formId} />
    </main>
  )
}
