"use client"
import { Form } from "@/components/ui/form"
import { convertFormResponseArrayToObject } from "@/lib/form-lib/utils"
import { validateForm } from "@/lib/form-lib/validation"
import { createNewResponseForPublishedForm } from "@/lib/queries"
import { TFormData, TFormErrors, TFormValues } from "@/types/form"
import { FormSchema } from "@/types/FormSchema"
import { useMutation } from "@tanstack/react-query"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import ThankYouPage from "./thank-you-component"
import TypeformLayout from "./typeform-layout"

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
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [formResponse, setFormResponse] = useState<TFormData>({
    details: {
      title: "",
      description: "",
      headerBackground: "#ffffff",
    },
    values: [],
  })

  const form = useForm<Record<string, string>>()

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
      formFieldValue: formValues[field.name] || "",
    }))

    const errors = validateForm(initialSchema, newformResponse)
    if (errors.length > 0) {
      errors.forEach((error, index) => {
        setTimeout(() => {
          toast.error(error.error)
        }, index * 300)
      })
      setFormErrors(errors)
      return
    }

    setFormErrors([])
    console.log(
      "Form submitted:",
      convertFormResponseArrayToObject(newformResponse)
    )
    // for testing
    createNewResponseForPublishedFormMutation.mutate(newformResponse)
  }

  const handleFieldChange = (field: any, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field.name]: value,
    }))

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

    // Clear any errors for this field when it changes
    setFormErrors((prevErrors) =>
      prevErrors.filter((e) => e.formFieldId !== field.serialId)
    )
  }

  const handleReset = () => {
    setIsSubmitted(false)
    form.reset()
    setFormErrors([])
    setFormValues({})
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
          formValues={formValues}
          isFormSubmitting={createNewResponseForPublishedFormMutation.isPending}
        />
      </form>
    </Form>
  )
}

export default TypeformPage
