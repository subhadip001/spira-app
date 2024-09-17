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
import { devopsForm } from "@/schema/testSchema";
import useFormStore from "@/store/formStore";
import { TFormValues } from "@/types/form";
import { FormSchema } from "@/types/FormSchema";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormFieldComponent } from "./FormFields";

interface FormBuilderProps {
  initialSchema?: FormSchema;
  published: boolean;
  editable: boolean;
  className?: string;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  initialSchema = devopsForm,
  published,
  editable,
  className,
}) => {
  const [schema, setSchema] = useState<FormSchema>(initialSchema);
  const formData = useFormStore((state) => state.formData.values);
  const formDetails = useFormStore((state) => state.formData.details);
  const setFormData = useFormStore((state) => state.setFormData);
  const formErrors = useFormStore((state) => state.formErrors);
  const setCurrentFormSchema = useFormStore(
    (state) => state.setCurrentFormSchema
  );

  console.table(formData);
  console.table(formDetails);

  useEffect(() => {
    setSchema(initialSchema);
    setFormData(
      {
        title: devopsForm.title,
        description: devopsForm.description,
      },
      formData,
      devopsForm
    );
  }, [devopsForm]);

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "")}
      >
        {editable ? (
          <input
            type="text"
            name="title"
            defaultValue={schema?.title}
            placeholder="Add Form Title"
            className="mb-4 w-full outline-none"
            onChange={(e) => {
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
        ) : (
          <h2 className="mb-4">{schema?.title}</h2>
        )}
        <FormDescription>
          {editable ? (
            <textarea
              name="description"
              defaultValue={schema?.description}
              placeholder="Add Form Description"
              className="mb-4 w-full outline-none"
              onChange={(e) => {
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
          ) : (
            <p>{schema?.description}</p>
          )}
        </FormDescription>
        {schema?.fields?.map((field, index) => (
          <div key={field.constantId} className="mb-4">
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
                      accept={field.type === "file" ? field.accept : undefined}
                      maxSize={
                        field.type === "file" ? field.maxSize : undefined
                      }
                    />
                  </FormControl>
                  <FormMessage>
                    {
                      formErrors.find((e) => e.formFieldId === field.constantId)
                        ?.error
                    }
                  </FormMessage>
                </FormItem>
              )}
            />
            {editable && (
              <div className="mt-2">
                <Button
                  type="button"
                  onClick={() => moveField(index, "up")}
                  disabled={index === 0}
                >
                  Move Up
                </Button>
                <Button
                  type="button"
                  onClick={() => moveField(index, "down")}
                  disabled={index === schema.fields.length - 1}
                >
                  Move Down
                </Button>
                <Button
                  type="button"
                  onClick={() => deleteField(field.constantId)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))}
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