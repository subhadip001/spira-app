import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormFieldComponent } from "./FormFields";
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
import { TFormValues } from "@/types/form";
import useFormStore from "@/store/formStore";
import { FormSchema } from "@/types/FormSchema";

interface FormBuilderProps {
  initialSchema: FormSchema;
  published: boolean;
  editable: boolean;
  className?: string;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  initialSchema,
  published,
  editable,
  className,
}) => {
  const [schema, setSchema] = useState<FormSchema>(initialSchema);
  const formData = useFormStore((state) => state.formData);
  const setFormData = useFormStore((state) => state.setFormData);
  const formErrors = useFormStore((state) => state.formErrors);

  useEffect(() => {
    setSchema(initialSchema);
  }, [initialSchema]);

  const form = useForm<TFormValues>({
    defaultValues: { ...formData },
  });

  const onSubmit = (data: TFormValues) => {
    setFormData(data);
    console.log("Form submitted:", JSON.stringify(data, null, 2));
    if (Object.keys(formErrors).length === 0) {
      console.log("Form submitted:", JSON.stringify(data, null, 2));
    }
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

  const deleteField = (index: number) => {
    const newFields = schema.fields.filter((_, i) => i !== index);
    setSchema({ ...schema, fields: newFields });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "")}
      >
        <h1>{schema?.title}</h1>
        <FormDescription>{schema?.description}</FormDescription>
        {schema?.fields.map((field, index) => (
          <div key={index} className="mb-4">
            <FormField
              key={index}
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
                        setFormData({ ...formData, [field.name]: value });
                      }}
                      accept={field.type === "file" ? field.accept : undefined}
                      maxSize={
                        field.type === "file" ? field.maxSize : undefined
                      }
                    />
                  </FormControl>
                  <FormMessage> {formErrors[field.name]}</FormMessage>
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
                <Button type="button" onClick={() => deleteField(index)}>
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
