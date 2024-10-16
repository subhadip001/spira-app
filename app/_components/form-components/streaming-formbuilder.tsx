import { Button } from "@/components/ui/button"
import { Form, FormDescription } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import useEditFormPageStore from "@/store/editFormPageStore"
import useFormStore from "@/store/formStore"
import { TFormData, TFormDetails, TFormErrors } from "@/types/form"
import { FormSchema } from "@/types/FormSchema"
import { ArrowDown, ArrowUp, CircleCheckBig, Edit, Trash2 } from "lucide-react"
import React, { Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import { FormFieldComponent } from "./FormFields"
import AddFieldSelector from "./ui/add-new-field"

interface FormBuilderProps {
  initialSchema: Partial<FormSchema>
  published?: boolean
  className?: string
}

const StreamingFormBuilder: React.FC<FormBuilderProps> = ({
  initialSchema,
  published,
  className,
}) => {
  const [hoveredField, setHoveredField] = useState<number | null>(null)
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

  const setCurrentFormSchema = useFormStore(
    (state) => state.setCurrentFormSchema
  )
  const selectedFieldConstantId = useEditFormPageStore(
    (state) => state.selectedFieldConstantId
  )
  const setSelectedFieldConstantId = useEditFormPageStore(
    (state) => state.setSelectedFieldConstantId
  )

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

  return (
    <Form {...form}>
      <form>
        <div className={cn("flex flex-col", className)}>
          <div className={cn("flex flex-col gap-8")}>
            <section
              className="form-cover-background relative flex flex-col "
              style={{ backgroundColor }}
            >
              <>
                <input
                  type="text"
                  name="title"
                  value={initialSchema?.title ?? ""}
                  placeholder="Add Form Title"
                  className="mb-4 text-3xl w-full outline-none bg-transparent"
                  onChange={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    //   setCurrentFormSchema({
                    //     ...initialSchema,
                    //     title: e.target.value,
                    //   })
                    setFormData({
                      details: {
                        ...formDetails,
                        title: e.target.value,
                      },
                      values: formData.values,
                    })
                  }}
                />
                <FormDescription>
                  <textarea
                    name="description"
                    value={initialSchema?.description ?? ""}
                    placeholder="Add Form Description"
                    className="mb-4 w-full outline-none bg-transparent"
                    onChange={(e) => {
                      e.preventDefault()
                      e.stopPropagation()

                      setFormData({
                        details: {
                          ...formDetails,
                          description: e.target.value,
                        },
                        values: formData.values,
                      })
                    }}
                  />
                </FormDescription>
              </>
            </section>

            <section className={`flex flex-col pb-3`}>
              {initialSchema?.fields?.map((field, index) => (
                <Fragment key={index}>
                  {index === 0 && (
                    <AddFieldSelector onAddField={(type) => {}} />
                  )}
                  <div
                    key={field.constantId + index}
                    className={`relative border rounded-md hover:bg-gray-50 ${
                      selectedFieldConstantId === field.constantId
                        ? "ring-2 ring-blue-300 bg-gray-50"
                        : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredField(index)}
                    onMouseLeave={() => setHoveredField(null)}
                  >
                    {hoveredField === index && (
                      <div className="absolute z-50 right-5 -top-5 bg-white border p-2 rounded-md flex gap-4">
                        <button
                          onClick={() => {}}
                          disabled={true}
                          className={`p-1 rounded-full border outline-none ${
                            index === 0
                              ? "text-gray-400 cursor-not-allowed"
                              : ""
                          }`}
                          type="button"
                        >
                          <div>
                            <ArrowUp className="h-3 w-3" />
                          </div>
                        </button>
                        <button
                          onClick={() => {}}
                          disabled={true}
                          className={`p-1 rounded-full border outline-none ${
                            index === (initialSchema.fields || []).length - 1
                              ? "text-gray-400 cursor-not-allowed"
                              : ""
                          }`}
                          type="button"
                        >
                          <div>
                            <ArrowDown className="h-3 w-3" />
                          </div>
                        </button>

                        <button
                          onClick={() => {}}
                          type="button"
                          className="p-1 rounded-full border outline-none"
                          disabled={true}
                        >
                          <div>
                            <Edit className="h-3 w-3" />
                          </div>
                        </button>
                        <button
                          onClick={() => {}}
                          type="button"
                          className="p-1 rounded-full border outline-none"
                          disabled={true}
                        >
                          <div>
                            <Trash2 className="h-3 w-3" color="red" />
                          </div>
                        </button>
                      </div>
                    )}
                    <div className="p-6">
                      <FormFieldComponent
                        field={field}
                        value={""}
                        onChange={(value: string) => {}}
                        accept={
                          field.type === "file" ? field.accept : undefined
                        }
                        maxSize={
                          field.type === "file" ? field.maxSize : undefined
                        }
                      />
                    </div>
                  </div>
                  <AddFieldSelector onAddField={(type) => {}} />
                </Fragment>
              ))}
            </section>
          </div>
          <div className="flex justify-end">
            {published && (
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
            )}
          </div>
        </div>
      </form>
    </Form>
  )
}

export default StreamingFormBuilder
