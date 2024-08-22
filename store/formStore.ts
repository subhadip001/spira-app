import { validateForm } from "@/lib/form-lib/validation";
import { formSchema } from "@/schema/formSchema";
import { TFormDetails, TFormErrors, TFormValues } from "@/types/form";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FormStore {
  formDetails: TFormDetails;
  formData: TFormValues;
  setFormData: (data: TFormValues) => void;
  formErrors: TFormErrors;
  initializeForm: (details: TFormDetails, data: TFormValues) => void;
}

const useFormStore = create<FormStore>((set) => ({
  formDetails: {
    title: "",
    description: "",
  },
  formData: {},
  formErrors: {},
  setFormData: (data) =>
    set((state) => {
      return {
        ...state,
        formData: data,
        formErrors: validateForm(formSchema, data),
      };
    }),

  initializeForm: (details, data) =>
    set((state) => {
      return {
        ...state,
        formDetails: details,
        formData: data,
        formErrors: validateForm(formSchema, data),
      };
    }),
}));

export default useFormStore;
