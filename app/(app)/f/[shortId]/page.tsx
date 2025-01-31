import { Icons } from "@/app/_components/icons"
import PublishedForm from "@/app/_components/published-form"
import { EFormVersionStatus, TFormVersionData } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { Metadata } from "next"
import FloatingBrand from "./components/floating-brand"

export const generateMetadata = async (props: {
  params: Promise<{ shortId: string }>
}): Promise<Metadata> => {
  const params = await props.params
  const supabase = await createClient()
  const { data: publishedForm, error: formError } = await supabase
    .from("published_forms")
    .select(
      `
    id,
    form_title,
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
    title: `Form - ${publishedForm?.form_title !== "N/A" ? publishedForm.form_title : publishedForm?.form_versions?.query}`,
    description:
      publishedForm?.form_title !== "N/A"
        ? publishedForm.form_title
        : publishedForm?.form_versions?.query,
  }
}

export default async function PublishedFormHome({
  params,
}: {
  params: Promise<{ shortId: string }>
}) {
  const shortId = (await params).shortId
  const supabase = await createClient()
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
      version_number,
      ui_layout,
      ui_theme,
      ui_brand_kit
    )
  `
    )
    .eq("short_id", shortId)
    .single()

  if (formError || !publishedForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Form not found</h1>
        <p className="text-gray-600">
          The form you are looking for does not exist or has been deleted.
        </p>
      </div>
    )
  }

  if (publishedForm?.form_versions?.status !== EFormVersionStatus.PUBLISHED) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Form not published yet</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PublishedForm
        id={publishedForm.id}
        form_versions={publishedForm.form_versions as TFormVersionData}
      />
    </div>
  )
}
