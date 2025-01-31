"use client"
import React from "react"
import PublishedFormBuilder from "./form-components/published-formbuilder"
import PublishedViewFormBuilder from "./form-components/published-view-formbuilder"
import TypeformPage from "./form-components/typeform-page"
import {
  EFormVersionStatus,
  EUiLayout,
  TFormVersionData,
  TUiBrandKit,
  TUiTheme,
} from "@/lib/types"
import { FormSchema } from "@/types/FormSchema"

interface PublishedFormProps {
  id: string
  form_versions: TFormVersionData
}

const PublishedForm: React.FC<PublishedFormProps> = ({ id, form_versions }) => {
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

  if (layout === EUiLayout.ONE_BY_ONE) {
    return <TypeformPage initialSchema={formSchema} publishedFormId={id} />
  }

  return (
    <PublishedViewFormBuilder
      initialSchema={formSchema}
      publishedFormId={id}
      className=""
    />
  )
}

export default PublishedForm
