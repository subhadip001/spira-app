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
import useEditFormPageStore from "@/store/editFormPageStore"
import useFormStore from "@/store/formStore"
import { TFormValues } from "@/types/form"
import {
  FieldType,
  FormSchema,
  FormField as FormSchemaField,
} from "@/types/FormSchema"
import { ArrowDown, ArrowUp, Edit, Plus, Trash2 } from "lucide-react"
import React, { Fragment, useState } from "react"
import { HexColorPicker } from "react-colorful"
import { useForm } from "react-hook-form"
import { FormFieldComponent } from "./FormFields"
import AddFieldSelector from "./ui/add-new-field"

interface FormBuilderProps {
  initialSchema: FormSchema
  published?: boolean
  editable: boolean
  className?: string
  formStatus?: "live" | "draft" | "closed"
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  initialSchema,
  published,
  editable,
  className,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(editable)
  const [hoveredField, setHoveredField] = useState<number | null>(null)
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  // const [schema, setCurrentFormSchema] = useState<FormSchema>(initialSchema);

  const formData = useFormStore((state) => state.formData.values)
  const formDetails = useFormStore((state) => state.formData.details)
  const setFormData = useFormStore((state) => state.setFormData)
  const formErrors = useFormStore((state) => state.formErrors)
  // const currentFormSchema = useFormStore((state) => state.currentFormSchema);
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
    defaultValues: formData.reduce(
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
    setFormData(formDetails, newFormData, initialSchema)
    console.log("Form submitted:", JSON.stringify(newFormData, null, 2))
  }

  const moveField = (index: number, direction: "up" | "down") => {
    if (!editable) return
    const newFields = [...initialSchema.fields]
    if (direction === "up" && index > 0) {
      const temp = newFields[index - 1].serialId
      newFields[index - 1].serialId = newFields[index].serialId
      newFields[index].serialId = temp
      ;[newFields[index - 1], newFields[index]] = [
        newFields[index],
        newFields[index - 1],
      ]
    } else if (direction === "down" && index < newFields.length - 1) {
      const temp = newFields[index + 1].serialId
      newFields[index + 1].serialId = newFields[index].serialId
      newFields[index].serialId = temp
      ;[newFields[index], newFields[index + 1]] = [
        newFields[index + 1],
        newFields[index],
      ]
    }
    setCurrentFormSchema({ ...initialSchema, fields: newFields })
  }

  const deleteField = (constantId: number) => {
    if (!editable) return
    const fieldToDelete = initialSchema.fields.find(
      (field) => field.constantId === constantId
    )
    if (!fieldToDelete) return

    const newFields = initialSchema.fields.filter(
      (field) => field.constantId !== constantId
    )

    newFields.forEach((field, index) => {
      if (field.serialId > fieldToDelete.serialId) {
        field.serialId -= 1
      }
    })

    setCurrentFormSchema({ ...initialSchema, fields: newFields })
    const newFormData = formData.filter(
      (field) => field.formFieldId !== constantId
    )
    const nearestField =
      newFields.length > 0
        ? newFields.reduce((nearest, field) => {
            if (!nearest) return field
            return Math.abs(field.serialId - fieldToDelete.serialId) <
              Math.abs(nearest.serialId - fieldToDelete.serialId)
              ? field
              : nearest
          })
        : null

    setTimeout(() => {
      setSelectedFieldConstantId(nearestField?.constantId ?? 0)
    }, 0)

    setFormData(formDetails, newFormData, initialSchema)
  }

  const addNewField = (
    type: FieldType,
    position: "top" | "bottom" = "bottom",
    serialId?: number
  ) => {
    if (!editable) return
    const newConstantId =
      Math.max(...initialSchema.fields.map((f) => f.constantId), 0) + 1
    const newSerialId =
      position === "top"
        ? 1
        : serialId
          ? serialId + 1
          : initialSchema.fields.length + 1
    let newField: FormSchemaField = {
      constantId: newConstantId,
      serialId: newSerialId,
      type,
      label: `New ${type} Field`,
      description: `Edit description of this field`,
      name: `new_${type.toLowerCase()}_field_${newConstantId}`,
      placeholder: `Edit placeholder of this field`,
      required: false,
    }
    console.log(newField)

    switch (type) {
      case FieldType.SELECT:
      case FieldType.CHECKBOX:
      case FieldType.RADIO:
        newField = {
          ...newField,
          options: [{ label: "Option 1", value: "value-1" }],
        }
        break
      case FieldType.RANGE:
        newField = { ...newField, min: 0, max: 100, step: 1 }
        break
      case FieldType.FILE:
        newField = { ...newField, accept: ".pdf,.doc,.docx", maxSize: "" }
        break
    }

    const updatedFields = initialSchema.fields.map((field) => {
      if (position === "top" || (serialId && field.serialId > serialId)) {
        return { ...field, serialId: field.serialId + 1 }
      }
      return field
    })

    setCurrentFormSchema({
      ...initialSchema,
      fields: [...updatedFields, newField].sort(
        (a, b) => a.serialId - b.serialId
      ),
    })
    setSelectedFieldConstantId(newConstantId)
  }

  const handleColorChange = (color: string) => {
    setBackgroundColor(color)
    setCurrentFormSchema({
      ...initialSchema,
      headerBackground: color,
    })
  }

  const handleAddFieldForEditing = (fieldConstantId: number): void => {
    if (!editable) return
    setSelectedFieldConstantId(fieldConstantId)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn("flex flex-col", className)}>
          <div className={cn("flex flex-col gap-8")}>
            {editable ? (
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
                      setCurrentFormSchema({
                        ...initialSchema,
                        title: e.target.value,
                      })
                      setFormData(
                        {
                          ...formDetails,
                          title: e.target.value,
                        },
                        formData,
                        initialSchema
                      )
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
                        setCurrentFormSchema({
                          ...initialSchema,
                          description: e.target.value,
                        })
                        setFormData(
                          {
                            ...formDetails,
                            description: e.target.value,
                          },
                          formData,
                          initialSchema
                        )
                      }}
                    />
                  </FormDescription>

                  {false && (
                    <div className=" absolute top-0 right-0">
                      <HexColorPicker
                        color={backgroundColor}
                        onChange={handleColorChange}
                      />
                    </div>
                  )}
                </>
              </section>
            ) : (
              <section
                className="form-cover-background flex flex-col "
                style={{ backgroundColor }}
              >
                <span className="mb-4 text-3xl">{initialSchema?.title}</span>
                <FormDescription>{initialSchema?.description}</FormDescription>
              </section>
            )}
            <section className="flex flex-col gap-0 pb-3">
              {initialSchema?.fields?.map((field, index) => (
                <Fragment key={index}>
                  {editable && index === 0 && (
                    <AddFieldSelector
                      onAddField={(type) => addNewField(type, "top")}
                    />
                  )}
                  <div
                    key={index}
                    className={`relative border rounded-md ${
                      editable ? "hover:bg-gray-50" : "cursor-default"
                    } ${
                      selectedFieldConstantId === field.constantId && editable
                        ? "ring-2 ring-blue-300 bg-gray-50"
                        : ""
                    }`}
                    style={{ cursor: editable ? "pointer" : "default" }}
                    onMouseEnter={() => setHoveredField(index)}
                    onMouseLeave={() => setHoveredField(null)}
                    onClick={() => handleAddFieldForEditing(field.constantId)}
                  >
                    {editable && hoveredField === index && (
                      <div className="absolute z-50 right-5 -top-5 bg-white border p-2 rounded-md flex gap-4">
                        <button
                          onClick={() => moveField(index, "up")}
                          disabled={index === 0}
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
                          onClick={() => moveField(index, "down")}
                          disabled={index === initialSchema.fields.length - 1}
                          className={`p-1 rounded-full border outline-none ${
                            index === initialSchema.fields.length - 1
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
                          onClick={() => {
                            handleAddFieldForEditing(field.constantId)
                          }}
                          type="button"
                          className="p-1 rounded-full border outline-none"
                        >
                          <div>
                            <Edit className="h-3 w-3" />
                          </div>
                        </button>
                        <button
                          onClick={() => deleteField(field.constantId)}
                          type="button"
                          className="p-1 rounded-full border outline-none"
                        >
                          <div>
                            <Trash2 className="h-3 w-3" color="red" />
                          </div>
                        </button>
                      </div>
                    )}
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
                                  const newFormData = [...formData]
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
                                  setFormData(
                                    formDetails,
                                    newFormData,
                                    initialSchema
                                  )
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
                            {!editable && (
                              <FormMessage>
                                {
                                  formErrors.find(
                                    (e) => e.formFieldId === field.constantId
                                  )?.error
                                }
                              </FormMessage>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {editable && (
                    <AddFieldSelector
                      onAddField={(type) =>
                        addNewField(type, "bottom", field.serialId)
                      }
                    />
                  )}
                </Fragment>
              ))}
            </section>
          </div>
          <div>
            {published && (
              <Button variant="outline" type="submit">
                Submit
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  )
}

export default FormBuilder
