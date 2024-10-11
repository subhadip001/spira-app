import { FormSchema } from "@/types/FormSchema"
import { create } from "zustand"

interface FormStore {
  currentFormSchema: FormSchema
  setCurrentFormSchema: (formSchema: FormSchema) => void
  resetStore: () => void
}

const useFormStore = create<FormStore>((set) => ({
  currentFormSchema: {} as FormSchema,
  setCurrentFormSchema: (formSchema) =>
    set((state) => {
      return {
        ...state,
        currentFormSchema: {
          ...formSchema,
          headerBackground: "#ffffff",
        },
      }
    }),

  resetStore: () =>
    set(() => ({
      currentFormSchema: {} as FormSchema,
    })),
}))

export default useFormStore
