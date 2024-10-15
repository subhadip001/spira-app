import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { TFormData, TFormDetails, TFormErrors, TFormValues } from "@/types/form"
import { FormSchema } from "@/types/FormSchema"
import { CircleCheckBig } from "lucide-react"
import React, { Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import { FormFieldComponent } from "./FormFields"

interface FormBuilderProps {
  initialSchema: FormSchema
  published?: boolean
  editable: boolean
  className?: string
  formStatus?: "live" | "draft" | "closed"
}

const PublishedFormBuilder: React.FC<FormBuilderProps> = ({
  initialSchema,
  published,
  editable,
  className,
}) => {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")

  const [formDetails, setFormDetails] = useState<TFormDetails>({
    title: "",
    description: "",
    headerBackground: "#ffffff",
  })
  const [formErrors, setFormErrors] = useState<TFormErrors>([])
  const [formData, setFormData] = useState<TFormData>({
    details: {
      title: "",
      description: "",
      headerBackground: "#ffffff",
    },
    values: [],
  })

  // console.table(formData);
  // console.table(formDetails);

  // useEffect(() => {
  //   setFormData(
  //     {
  //       title: initialSchema.title,
  //       description: initialSchema.description,
  //       headerBackground: initialSchema.headerBackground,
  //     },
  //     formData,
  //     initialSchema
  //   );
  // }, []);

  const form = useForm<Record<string, string>>({
    defaultValues: formData?.values.reduce(
      (acc, field) => {
        acc[field.formFieldName] = field.formFieldValue
        return acc
      },
      {} as Record<string, string>
    ),
  })

  const onSubmit = (data: Record<string, string>) => {
    const newFormData: TFormValues = initialSchema.fields.map((field) => ({
      formFieldId: field.constantId,
      formFieldName: field.name,
      formFieldLabel: field.label,
      formFieldValue: data[field.name] || "",
    }))
    setFormData({ details: formDetails, values: newFormData })
    console.log("Form submitted:", JSON.stringify(newFormData, null, 2))
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
                    className={`relative border rounded-md `}
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
                                  const newFormData = [...formData.values]
                                  const fieldIndex = newFormData.findIndex(
                                    (f) => f.formFieldId === field.constantId
                                  )
                                  if (fieldIndex !== -1) {
                                    newFormData[fieldIndex].formFieldValue =
                                      value
                                  } else {
                                    newFormData.push({
                                      formFieldId: field.constantId,
                                      formFieldName: field.name,
                                      formFieldLabel: field.label,
                                      formFieldValue: value,
                                    })
                                  }
                                  setFormData({
                                    details: formDetails,
                                    values: newFormData,
                                  })
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
                            <FormMessage>
                              {
                                formErrors.find(
                                  (e) => e.formFieldId === field.constantId
                                )?.error
                              }
                            </FormMessage>
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
              className="gap-2 flex items-center"
              variant="outline"
              type="submit"
            >
              <span>Submit</span>
              <div>
                <CircleCheckBig className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default PublishedFormBuilder
