import { redirect } from "next/navigation"

export default function FormPage({ params }: { params: { formId: string } }) {
  redirect(`/form/${params.formId}/editor`)
}
