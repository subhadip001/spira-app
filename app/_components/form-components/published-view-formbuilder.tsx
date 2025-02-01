import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { convertFormResponseArrayToObject } from "@/lib/form-lib/utils"
import { validateForm } from "@/lib/form-lib/validation"
import { createNewResponseForPublishedForm } from "@/lib/queries"
import { cn } from "@/lib/utils"
import { TFormData, TFormErrors, TFormValues } from "@/types/form"
import { FormSchema } from "@/types/FormSchema"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import React, { Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Icons } from "../icons"
import { FormFieldComponent } from "./FormFields"
import ThankYouPage from "./thank-you-component"

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
  const containerWidthClassName =
    "max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[55%]"
  return (
    <div className={cn("flex flex-col h-[100dvh] overflow-y-auto", className)}>
      <div className="bg-[radial-gradient(circle_at_1px_1px,_black_1px,_transparent_0)] bg-[size:40px_40px] w-full h-[100dvh] fixed z-[-1]"></div>
      <div className={cn("flex flex-col gap-8")}>
        <section className="relative">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br bg-white from-blue-500/80 via-purple-500/80 to-pink-500/80 rounded-b-[60px]" />
          <div
            className={cn(
              "relative  mx-auto flex flex-col justify-center transform translate-y-[6rem]",
              containerWidthClassName
            )}
          >
            <div className="w-32 h-32 relative mb-6 bg-white rounded-2xl p-4 shadow-lg">
              <Icons.logo className="w-full h-full" />
            </div>
            <div className="w-full flex flex-col bg-blue-50 border text-spirablue rounded-md p-4 mb-[12vh]">
              <h1 className="mb-4 text-3xl font-semibold">
                {initialSchema?.title}
              </h1>
              <FormDescription className="">
                {initialSchema?.description}
              </FormDescription>
            </div>
          </div>
        </section>

        <section
          className={cn(
            "flex flex-col gap-5 pb-3 mx-auto w-full z-10",
            containerWidthClassName
          )}
        >
          {initialSchema?.fields?.map((field, index) => (
            <Fragment key={index}>
              <div
                key={field.constantId + index}
                className={cn(
                  "relative border bg-white rounded-md transition-all duration-800",
                  !!formErrors.find((e) => e.formFieldId === field.serialId)
                    ?.error
                    ? "border-red-500 bg-red-50"
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
      <div
        className={cn("flex mt-4 mb-8 mx-auto w-full", containerWidthClassName)}
      >
        <Button
          type="submit"
          className="px-8 w-full md:w-auto"
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

const DefaultViewFormBuilder: React.FC<PublishedViewFormBuilderProps> = ({
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

export default DefaultViewFormBuilder
