import Header from "@/app/_components/header"
import PublishedForm from "@/app/_components/published-form"
import { createClient } from "@/utils/supabase/server"
type TSearchParams = {
  q: string
}

export default async function PublishedFormHome({
  params,
}: {
  params: { publishId: string }
}) {
  const supabase = createClient()
  const { data: publishedForm, error: formError } = await supabase
    .from("published_forms")
    .select(
      `
    id,
    form_versions (
      id,
      created_at,
      form_id,
      form_schema_string,
      query,
      status,
      version_number
    )
  `
    )
    .eq("id", params.publishId)
    .single()

  if (formError) {
    return (
      <div className="bg-white w-[100vw] min-h-[100svh]">
        <Header />
        <main className="flex px-2">
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-2xl font-bold">Form not found</h1>
          </div>
        </main>
      </div>
    )
  }

  if (publishedForm?.form_versions?.status !== "PUBLISHED") {
    return (
      <div className="bg-white w-[100vw] min-h-[100svh]">
        <Header />
        <main className="flex px-2">
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-2xl font-bold">Form not published yet</h1>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-white w-[100vw] min-h-[100svh]">
      <Header />
      <main className="flex px-2">
        <PublishedForm publishedForm={publishedForm} />
      </main>
    </div>
  )
}
