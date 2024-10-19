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
import { ArrowRight } from "lucide-react"
import React, { Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { FormFieldComponent } from "./FormFields"

interface FormBuilderProps {
  initialSchema: FormSchema
  className?: string
  formStatus?: "live" | "draft" | "closed"
}

const PublishedFormBuilder: React.FC<FormBuilderProps> = ({
  initialSchema,
  className,
}) => {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")

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
    defaultValues: formResponse?.values.reduce(
      (acc, field) => {
        acc[field.formFieldName] = field.formFieldValue
        return acc
      },
      {} as Record<string, string>
    ),
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
      console.log("Form submitted:", JSON.stringify(newformResponse, null, 2))
      toast.success("Form submitted successfully")
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn("flex flex-col", className)}>
          <div className={cn("flex flex-col gap-8")}>
            <section
              className="form-cover-background flex flex-col "
              style={{ backgroundColor }}
            >
              <span className="mb-4 text-3xl">{initialSchema?.title}</span>
              <FormDescription>{initialSchema?.description}</FormDescription>
            </section>

            <section className={`flex flex-col gap-5 pb-3`}>
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
                                  field.type === "file"
                                    ? field.accept
                                    : undefined
                                }
                                maxSize={
                                  field.type === "file"
                                    ? field.maxSize
                                    : undefined
                                }
                              />
                            </FormControl>
                            {/* <FormMessage>
                              {
                                formErrors.find(
                                  (e) => e.formFieldId === field.serialId
                                )?.error
                              }
                            </FormMessage> */}
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </Fragment>
              ))}
            </section>
          </div>
          <div className="flex justify-end">
            <Button
              className="gap-2 flex items-center group bg-spirablue hover:bg-spirablue text-white hover:text-white"
              variant="outline"
              type="submit"
            >
              <span>Submit</span>
              <div className="transition-all duration-800 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default PublishedFormBuilder
