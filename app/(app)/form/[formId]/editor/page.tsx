import FormPage from "@/app/_components/formPage"
import { createClient } from "@/utils/supabase/server"
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
      title: "Edit your form",
    }
  }

  return {
    title: `Edit form - ${baseForm.query}`,
  }
}

type TSearchParams = {
  q: string
}

export default async function EditFormPage(props: {
  searchParams: Promise<TSearchParams>
  params: Promise<{ formId: string }>
}) {
  const params = await props.params
  const baseformId = params?.formId
  if (!baseformId) return null

  const supabase = await createClient()
  const { data: formVersions, error } = await supabase
    .from("form_versions")
    .select()
    .eq("form_id", baseformId)
  if (error) {
    return null
  }

  const { data: baseForm, error: baseFormError } = await supabase
    .from("forms")
    .select("*")
    .eq("id", baseformId)
  if (baseFormError) {
    return null
  }

  return (
    <FormPage
      baseQuery={baseForm[0]?.query}
      formVersions={formVersions}
      baseFormId={baseformId}
    />
  )
}
