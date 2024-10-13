"use client"
import { Button } from "@/components/ui/button"
import { Monitor, Smartphone, SquareArrowUpRight, Tablet } from "lucide-react"
import React, { useState } from "react"
import GenerateForm from "./generate-form"
import useFormStore from "@/store/formStore"
// import FormBuilder from "./form-components/FormBuilder";
import { devopsForm } from "@/schema/testSchema"
import dynamic from "next/dynamic"

const FormBuilder = dynamic(() => import("./form-components/FormBuilder"), {
  ssr: false,
})

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
  const [selectedViewport, setSelectedViewport] = useState<
    "phone" | "tablet" | "desktop"
  >("desktop")
  const formSchema = JSON.parse(
    publishedForm?.form_versions?.form_schema_string || "{}"
  )
  if (!formSchema) {
    return null
  }

  return (
    <section className="relative flex-grow flex overflow-y-auto flex-col items-center gap-2 h-[calc(100svh-64px)] py-2 px-3 rounded-md min-w-0">
      <FormBuilder
        initialSchema={formSchema}
        className=""
        published={true}
        editable={false}
      />
    </section>
  )
}

export default PublishedForm
