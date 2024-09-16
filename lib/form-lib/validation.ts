import { TFormValues, TFormErrors } from "@/types/form";
import { FormSchema } from "@/types/FormSchema";

export const validateForm = (
  schema: FormSchema,
  values: TFormValues
): TFormErrors => {
  const errors: TFormErrors = [];

  schema.fields.forEach((field) => {
    const fieldValue = values.find(v => v.formFieldId === field.constantId);
    
    if (field.required) {
      if (!fieldValue || fieldValue.formFieldValue.trim() === "") {
        errors.push({
          formFieldId: field.constantId,
          error: `${field.label} is required`
        });
      }
    }
    
    // Add more validation rules here if needed
    // For example, email validation, number range validation, etc.
  });

  return errors;
};