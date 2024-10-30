import { redirect } from "next/navigation"

export default async function FormPage(props: {
  params: Promise<{ formId: string }>
}) {
  const params = await props.params
  redirect(`/form/${params.formId}/editor`)
}
