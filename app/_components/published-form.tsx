"use client"
import React from "react"
import PublishedFormBuilder from "./form-components/published-formbuilder"

interface PublishedFormProps {
  publishedForm: {
    id: string
    form_versions: {
      id: string
      created_at: string
      form_id: string
      form_schema_string: string
      query: string
      status: "DRAFT" | "PUBLISHED" | "DELETED" | "UNPUBLISHED"
      version_number: number
    } | null
  }
}

const PublishedForm: React.FC<PublishedFormProps> = ({ publishedForm }) => {
  const formSchema = JSON.parse(
    publishedForm?.form_versions?.form_schema_string || "{}"
  )
  if (!formSchema) {
    return null
  }

  return (
    <PublishedFormBuilder
      initialSchema={formSchema}
      publishedFormId={publishedForm.id}
      className=""
    />
  )
}

export default PublishedForm
