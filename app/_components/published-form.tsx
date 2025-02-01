"use client"
import { EUiLayout, TFormVersionData } from "@/lib/types"
import { FormSchema } from "@/types/FormSchema"
import React from "react"
import DefaultViewFormBuilder from "./form-components/published-view-formbuilder"
import TypeformPage from "./form-components/typeform-page"

interface PublishedFormProps {
  id: string
  form_versions: TFormVersionData
}

const PublishedFormWrapper: React.FC<PublishedFormProps> = ({
  id,
  form_versions,
}) => {
  const formSchema = JSON.parse(
    form_versions?.form_schema_string || "{}"
  ) as FormSchema

  if (!formSchema) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Form schema not found</h1>
      </div>
    )
  }

  const layout = form_versions?.ui_layout // You can make this dynamic based on form settings

  if (layout === EUiLayout.DEFAULT) {
    return <TypeformPage initialSchema={formSchema} publishedFormId={id} />
  }

  return (
    <DefaultViewFormBuilder
      initialSchema={formSchema}
      publishedFormId={id}
      className=""
    />
  )
}

export default PublishedFormWrapper
