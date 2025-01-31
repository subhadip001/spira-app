import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { validateForm } from "@/lib/form-lib/validation"
import { cn } from "@/lib/utils"
import { TFormData, TFormErrors, TFormValues } from "@/types/form"
import { FormSchema } from "@/types/FormSchema"
import { ArrowRight, Loader2 } from "lucide-react"
import React, { Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { FormFieldComponent } from "./FormFields"
import { convertFormResponseArrayToObject } from "@/lib/form-lib/utils"
import { useMutation } from "@tanstack/react-query"
import { createNewResponseForPublishedForm } from "@/lib/queries"
import ThankYouPage from "./thank-you-component"
import { EUiLayout } from "@/lib/types"
import Image from "next/image"
import { Icons } from "../icons"

interface PublishedViewFormBuilderProps {
  initialSchema: FormSchema
  className?: string
  publishedFormId: string
}

interface DefaultFormLayoutProps {
  initialSchema: FormSchema
  form: any
  formErrors: TFormErrors
  handleFieldChange: (field: any, value: string) => void
  backgroundColor: string
  className?: string
}

const DefaultFormLayout: React.FC<DefaultFormLayoutProps> = ({
  initialSchema,
  form,
  formErrors,
  handleFieldChange,
  backgroundColor,
  className,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className={cn("flex flex-col gap-8")}>
        <section className="flex flex-col items-center justify-center py-8 border-b">
          <div className="w-24 h-24 relative mb-4">
            <Icons.logo className="w-full h-full" />
          </div>
          <span className="mb-4 text-3xl text-center">
            {initialSchema?.title}
          </span>
          <FormDescription className="text-center">
            {initialSchema?.description}
          </FormDescription>
        </section>

        <section
          className={`flex flex-col gap-5 pb-3 max-w-3xl mx-auto w-full`}
        >
          {initialSchema?.fields?.map((field, index) => (
            <Fragment key={index}>
              <div
                key={field.constantId + index}
                className={cn(
                  "relative border rounded-md transition-all duration-800",
                  !!formErrors.find((e) => e.formFieldId === field.serialId)
                    ?.error
                    ? "border-red-500 bg-[#ffe7e75c]"
                    : ""
                )}
              >
                <div className="p-6">
                  <FormField
                    control={form.control}
                    name={field.name}
                    render={({ field: controllerField }) => (
                      <FormItem>
                        <FormControl>
                          <FormFieldComponent
                            field={field}
                            value={controllerField.value}
                            onChange={(value: string) => {
                              controllerField.onChange(value)
                              handleFieldChange(field, value)
                            }}
                            accept={
                              field.type === "file" ? field.accept : undefined
                            }
                            maxSize={
                              field.type === "file" ? field.maxSize : undefined
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </Fragment>
          ))}
        </section>
      </div>
      <div className="flex justify-center mt-8 mb-8">
        <Button
          type="submit"
          className="px-8"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Submit
        </Button>
      </div>
    </div>
  )
}

const PublishedViewFormBuilder: React.FC<PublishedViewFormBuilderProps> = ({
  initialSchema,
  publishedFormId,
  className,
}) => {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
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
      createNewResponseForPublishedForm(responseDataArray, publishedFormId),
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
      console.log(error)
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
        <DefaultFormLayout
          initialSchema={initialSchema}
          form={form}
          formErrors={formErrors}
          handleFieldChange={handleFieldChange}
          backgroundColor={backgroundColor}
          className={className}
        />
      </form>
    </Form>
  )
}

export default PublishedViewFormBuilder
