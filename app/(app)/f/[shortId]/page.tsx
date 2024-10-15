import PublishedForm from "@/app/_components/published-form"
import { EFormVersionStatus } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { Metadata } from "next"

export const generateMetadata = async ({
  params,
}: {
  params: { shortId: string }
}): Promise<Metadata> => {
  const supabase = createClient()
  const { data: publishedForm, error: formError } = await supabase
    .from("published_forms")
    .select(
      `
    id,
    form_versions (
      id,
      created_at,
      query
    )
  `
    )
    .eq("short_id", params.shortId)
    .single()

  if (formError || !publishedForm) {
    return {
      title: "Form not found",
    }
  }

  return {
    title: `Form - ${publishedForm.form_versions?.query}`,
  }
}

export default async function PublishedFormHome({
  params,
}: {
  params: { shortId: string }
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
    .eq("short_id", params.shortId)
    .single()

  if (formError) {
    return (
      <div className="bg-white w-[100vw] min-h-[100svh]">
        <main className="flex px-2">
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-2xl font-bold">Form not found</h1>
          </div>
        </main>
      </div>
    )
  }

  if (publishedForm?.form_versions?.status !== EFormVersionStatus.PUBLISHED) {
    return (
      <div className="bg-white w-[100vw] min-h-[100svh]">
        <main className="flex px-2">
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-2xl font-bold">Form not published yet</h1>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-white w-[100vw] overflow-y-auto h-[100svh]">
      <main className="flex px-2">
        <PublishedForm publishedForm={publishedForm} />
      </main>
    </div>
  )
}
