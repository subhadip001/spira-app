import React from "react";
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
  schema: FormSchema;
  classname?: string;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  schema,
  classname,
}) => {
  const formData = useFormStore((state) => state.formData);
  const setFormData = useFormStore((state) => state.setFormData);
  const formErrors = useFormStore((state) => state.formErrors);

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(classname, "")}
      >
        <h1>{schema.title}</h1>
        <FormDescription>{schema.description}</FormDescription>
        {schema.fields.map((field, index) => (
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
                  />
                </FormControl>
                <FormMessage> {formErrors[field.name]}</FormMessage>
              </FormItem>
            )}
          />
        ))}
        <Button variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
