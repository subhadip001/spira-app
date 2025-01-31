"use client"
import React, { useState } from "react"
import { EUiLayout } from "@/lib/types"
import TypeformLayout from "./typeform-layout"
import { FormSchema } from "@/types/FormSchema"
import { useForm } from "react-hook-form"
import { TFormData, TFormErrors, TFormValues } from "@/types/form"
import { validateForm } from "@/lib/form-lib/validation"
import { useMutation } from "@tanstack/react-query"
import { createNewResponseForPublishedForm } from "@/lib/queries"
import toast from "react-hot-toast"
import { Form } from "@/components/ui/form"
import ThankYouPage from "./thank-you-component"
import { convertFormResponseArrayToObject } from "@/lib/form-lib/utils"

interface TypeformPageProps {
  initialSchema: FormSchema
  publishedFormId?: string
  className?: string
}

const TypeformPage: React.FC<TypeformPageProps> = ({
  initialSchema,
  publishedFormId,
  className,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formErrors, setFormErrors] = useState<TFormErrors>([])
  const [formResponse, setFormResponse] = useState<TFormData>({
    details: {
      title: "",
      description: "",
      headerBackground: "#ffffff",
    },
    values: [],
  })

  const form = useForm<Record<string, string>>({
    defaultValues: initialSchema.fields.reduce(
      (acc, field) => {
        acc[field.name] = ""
        return acc
      },
      {} as Record<string, string>
    ),
  })

  const createNewResponseForPublishedFormMutation = useMutation({
    mutationFn: (responseDataArray: TFormValues) =>
      createNewResponseForPublishedForm(
        responseDataArray,
        publishedFormId || ""
      ),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data?.error.message)
      } else {
        toast.success("Form submitted successfully")
        setIsSubmitted(true)
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (data: Record<string, string>) => {
    const newformResponse: TFormValues = initialSchema.fields.map((field) => ({
      formFieldId: field.serialId,
      formFieldName: field.name,
      formFieldLabel: field.label,
      formFieldValue: data[field.name] || "",
    }))
    const errors = validateForm(initialSchema, newformResponse)
    errors.forEach((error, index) => {
      setTimeout(() => {
        toast.error(error.error)
      }, index * 300)
    })
    setFormErrors(errors)
    if (errors.length === 0) {
      console.log(
        "Form submitted:",
        convertFormResponseArrayToObject(newformResponse)
      )
      createNewResponseForPublishedFormMutation.mutate(newformResponse)
    }
  }

  const handleFieldChange = (field: any, value: string) => {
    const newFormResponse = [...formResponse.values]
    const fieldIndex = newFormResponse.findIndex(
      (f) => f.formFieldId === field.serialId
    )
    if (fieldIndex !== -1) {
      newFormResponse[fieldIndex].formFieldValue = value
    } else {
      newFormResponse.push({
        formFieldId: field.serialId,
        formFieldName: field.name,
        formFieldLabel: field.label,
        formFieldValue: value,
      })
    }
    setFormResponse({
      ...formResponse,
      values: newFormResponse,
    })

    setFormErrors((prevErrors) =>
      prevErrors.filter((e) => e.formFieldId !== field.serialId)
    )
  }

  const handleReset = () => {
    setIsSubmitted(false)
    form.reset()
    setFormErrors([])
    setFormResponse({
      details: {
        title: "",
        description: "",
        headerBackground: "#ffffff",
      },
      values: [],
    })
  }

  if (isSubmitted) {
    return <ThankYouPage onReset={handleReset} />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <TypeformLayout
          initialSchema={initialSchema}
          form={form}
          formErrors={formErrors}
          handleFieldChange={handleFieldChange}
          backgroundColor="#ffffff"
          className={className}
        />
      </form>
    </Form>
  )
}

export default TypeformPage
