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
    title: `Edit - ${baseForm.query.length > 50 ? baseForm.query.slice(0, 40) + "..." : baseForm.query}`,
  }
}

export default function EditFormPage() {
  return <FormPage />
}
