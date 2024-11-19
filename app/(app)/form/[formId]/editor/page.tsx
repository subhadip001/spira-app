import FormPage from "@/app/_components/formPage"

// import { Metadata } from "next"
// export const generateMetadata = async (props: {
//   params: Promise<{ formId: string }>
// }): Promise<Metadata> => {
//   const params = await props.params
//   const supabase = await createClient()
//   const { data: baseForm, error: baseFormError } = await supabase
//     .from("forms")
//     .select("query")
//     .eq("id", params.formId)
//     .single()

//   if (baseFormError || !baseForm) {
//     return {
//       title: "Edit your form",
//     }
//   }

//   return {
//     title: `Edit form - ${baseForm.query}`,
//   }
// }

// type TSearchParams = {
//   q: string
// }

export default function EditFormPage() {
  return <FormPage />
}
