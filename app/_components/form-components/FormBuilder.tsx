import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import useFormStore from "@/store/formStore";
import { TFormValues } from "@/types/form";
import {
  FieldType,
  FormField as FormSchemaField,
  FormSchema,
} from "@/types/FormSchema";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormFieldComponent } from "./FormFields";
import { HexColorPicker } from "react-colorful";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { ChooseCreatePosition } from "./ui/choose-create-position";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface FormBuilderProps {
  initialSchema: FormSchema;
  published: boolean;
  editable: boolean;
  className?: string;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  initialSchema,
  published,
  editable,
  className,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(editable);
  const [hoveredField, setHoveredField] = useState<number | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [schema, setSchema] = useState<FormSchema>(initialSchema);

  const formData = useFormStore((state) => state.formData.values);
  const formDetails = useFormStore((state) => state.formData.details);
  const setFormData = useFormStore((state) => state.setFormData);
  const formErrors = useFormStore((state) => state.formErrors);
  const currentFormSchema = useFormStore((state) => state.currentFormSchema);
  const setCurrentFormSchema = useFormStore(
    (state) => state.setCurrentFormSchema
  );

  // console.table(formData);
  // console.table(formDetails);

  useEffect(() => {
    setFormData(
      {
        title: initialSchema.title,
        description: initialSchema.description,
        headerBackground: initialSchema.headerBackground,
      },
      formData,
      initialSchema
    );
  }, []);

  useEffect(() => {
    setCurrentFormSchema(schema);
  }, [schema]);

  const form = useForm<Record<string, string>>({
    defaultValues: formData.reduce((acc, field) => {
      acc[field.formFieldName] = field.formFieldValue;
      return acc;
    }, {} as Record<string, string>),
  });

  const onSubmit = (data: Record<string, string>) => {
    const newFormData: TFormValues = schema.fields.map((field) => ({
      formFieldId: field.constantId,
      formFieldName: field.name,
      formFieldLabel: field.label,
      formFieldValue: data[field.name] || "",
    }));
    setFormData(formDetails, newFormData, schema);
    console.log("Form submitted:", JSON.stringify(newFormData, null, 2));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newFields = [...schema.fields];
    if (direction === "up" && index > 0) {
      [newFields[index - 1], newFields[index]] = [
        newFields[index],
        newFields[index - 1],
      ];
    } else if (direction === "down" && index < newFields.length - 1) {
      [newFields[index], newFields[index + 1]] = [
        newFields[index + 1],
        newFields[index],
      ];
    }
    setSchema({ ...schema, fields: newFields });
  };

  const deleteField = (constantId: number) => {
    const newFields = schema.fields.filter(
      (field) => field.constantId !== constantId
    );
    setSchema({ ...schema, fields: newFields });
    const newFormData = formData.filter(
      (field) => field.formFieldId !== constantId
    );
    setFormData(formDetails, newFormData, schema);
  };

  const addNewField = (
    constantId: number,
    serialId: number,
    type: FieldType
  ) => {
    let newField: FormSchemaField;
    switch (type) {
      case FieldType.TEXT || FieldType.TEL:
        newField = {
          constantId,
          serialId,
          type,
          label: "",
          name: "",
          placeholder: "",
          required: false,
        };
        break;
      case FieldType.EMAIL:
        newField = {
          constantId,
          serialId,
          type,
          label: "",
          name: "",
          placeholder: "",
          required: false,
        };
        break;
      case FieldType.TEXTAREA:
        newField = {
          constantId,
          serialId,
          type,
          label: "",
          name: "",
          placeholder: "",
          required: false,
        };
        break;
      case FieldType.SELECT:
        newField = {
          constantId,
          serialId,
          type,
          label: "",
          name: "",
          placeholder: "",
          required: false,
          options: [],
        };
        break;
      case FieldType.CHECKBOX:
        newField = {
          constantId,
          serialId,
          type,
          label: "",
          name: "",
          placeholder: "",
          required: false,
          options: [],
        };
        break;
      case FieldType.RADIO:
        newField = {
          constantId,
          serialId,
          type,
          label: "",
          name: "",
          placeholder: "",
          required: false,
          options: [],
        };
        break;
      case FieldType.RANGE:
        newField = {
          constantId,
          serialId,
          type,
          label: "",
          name: "",
          placeholder: "",
          required: false,
          min: 0,
          max: 100,
          step: 1,
        };
        break;
      case FieldType.FILE:
        newField = {
          constantId,
          serialId,
          type,
          label: "",
          name: "",
          placeholder: "",
          required: false,
          accept: "",
          maxSize: "",
        };
        break;
      default:
        newField = {
          constantId,
          serialId,
          type,
          label: "",
          name: "",
          placeholder: "",
          required: false,
        };
        break;
    }
    setSchema({ ...schema, fields: [...schema.fields, newField] });
  };

  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
    setCurrentFormSchema({
      ...currentFormSchema,
      headerBackground: color,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "")}
      >
        <div className="flex flex-col gap-8">
          {editable ? (
            <section
              className="form-cover-background relative flex flex-col "
              style={{ backgroundColor }}
            >
              <>
                <input
                  type="text"
                  name="title"
                  defaultValue={schema?.title}
                  placeholder="Add Form Title"
                  className="mb-4 text-4xl w-full outline-none bg-transparent"
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSchema({ ...schema, title: e.target.value });
                    setFormData(
                      {
                        ...formDetails,
                        title: e.target.value,
                      },
                      formData,
                      schema
                    );
                  }}
                />
                <FormDescription>
                  <textarea
                    name="description"
                    defaultValue={schema?.description}
                    placeholder="Add Form Description"
                    className="mb-4 w-full outline-none bg-transparent"
                    onChange={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSchema({ ...schema, description: e.target.value });
                      setFormData(
                        {
                          ...formDetails,
                          description: e.target.value,
                        },
                        formData,
                        schema
                      );
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
              <span className="mb-4 text-4xl">{schema?.title}</span>
              <FormDescription>
                <p>{schema?.description}</p>
              </FormDescription>
            </section>
          )}
          <section className="flex flex-col gap-6 pb-3">
            {schema?.fields?.map((field, index) => (
              <div
                key={index}
                className=" relative border rounded-md"
                onMouseEnter={() => setHoveredField(index)}
                onMouseLeave={() => setHoveredField(null)}
              >
                {editable && hoveredField === index && (
                  <div className="absolute z-50 right-5 -top-5 bg-white border p-2 rounded-md flex gap-4">
                    <button
                      onClick={() => moveField(index, "up")}
                      disabled={index === 0}
                      className={`p-1 rounded-full border outline-none ${
                        index === 0 ? "text-gray-400 cursor-not-allowed" : ""
                      }`}
                    >
                      <div>
                        <ArrowUp className="h-3 w-3" />
                      </div>
                    </button>
                    <button
                      onClick={() => moveField(index, "down")}
                      disabled={index === schema.fields.length - 1}
                      className={`p-1 rounded-full border outline-none ${
                        index === schema.fields.length - 1
                          ? "text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div>
                        <ArrowDown className="h-3 w-3" />
                      </div>
                    </button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1 rounded-full border outline-none"
                        >
                          <div>
                            <Plus className="h-3 w-3" />
                          </div>
                        </button>
                      </DialogTrigger>
                      <ChooseCreatePosition />
                    </Dialog>

                    <button
                      onClick={() => deleteField(field.constantId)}
                      className="p-1 rounded-full border outline-none"
                    >
                      <div>
                        <Trash2 className="h-3 w-3" color="red" />
                      </div>
                    </button>
                  </div>
                )}
                <div className="p-3">
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
                              controllerField.onChange(value);
                              const newFormData = [...formData];
                              const fieldIndex = newFormData.findIndex(
                                (f) => f.formFieldId === field.constantId
                              );
                              if (fieldIndex !== -1) {
                                newFormData[fieldIndex].formFieldValue = value;
                              } else {
                                newFormData.push({
                                  formFieldId: field.constantId,
                                  formFieldName: field.name,
                                  formFieldLabel: field.label,
                                  formFieldValue: value,
                                });
                              }
                              setFormData(formDetails, newFormData, schema);
                            }}
                            accept={
                              field.type === "file" ? field.accept : undefined
                            }
                            maxSize={
                              field.type === "file" ? field.maxSize : undefined
                            }
                          />
                        </FormControl>
                        {published && (
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
            ))}
          </section>
        </div>
        {published && (
          <Button variant="outline" type="submit">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
};

export default FormBuilder;
