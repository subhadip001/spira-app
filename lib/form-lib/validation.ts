import { TFormValues } from "@/types/form";
import { FormSchema } from "@/types/FormSchema";

interface ValidationErrors {
  [key: string]: string;
}

export const validateForm = (
  schema: FormSchema,
  values: TFormValues
): ValidationErrors => {
  const errors: ValidationErrors = {};

  schema.fields.forEach((field) => {
    if (field.required && !values[field.name]) {
      errors[field.name] = `${field.label} is required`;
    }
  });

  return errors;
};