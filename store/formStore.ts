import { validateForm } from "@/lib/form-lib/validation";
import { sampleFormSchema } from "@/schema/formSchema";
import {
  TFormData,
  TFormDetails,
  TFormErrors,
  TFormValues,
} from "@/types/form";
import { FormSchema } from "@/types/FormSchema";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FormStore {
  currentFormSchema: FormSchema;
  setCurrentFormSchema: (formSchema: FormSchema) => void;
  formData: TFormData;
  setFormData: (
    details: TFormDetails,
    values: TFormValues,
    formSchema: FormSchema
  ) => void;
  formErrors: TFormErrors;
}

const useFormStore = create<FormStore>((set) => ({
  currentFormSchema: {} as FormSchema,
  setCurrentFormSchema: (formSchema) =>
    set((state) => {
      return {
        ...state,
        currentFormSchema: formSchema,
      };
    }),
  formData: {
    details: {
      title: "",
      description: "",
    },
    values: [],
  },
  formErrors: [],
  setFormData: (details, values, formSchema) =>
    set((state) => {
      return {
        ...state,
        formData: {
          details: details,
          values: values,
        },
        formErrors: validateForm(formSchema, values),
      };
    }),
}));

export default useFormStore;
