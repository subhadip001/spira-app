import { TUiConfig } from "@/lib/types"
import { FormSchema } from "@/types/FormSchema"
import { create } from "zustand"

interface FormStore {
  currentFormSchema: FormSchema
  setCurrentFormSchema: (formSchema: FormSchema) => void
  currentFormUI: TUiConfig
  setCurrentFormUI: (formUI: TUiConfig) => void
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
  currentFormUI: {} as TUiConfig,
  setCurrentFormUI: (formUI) => set(() => ({ currentFormUI: formUI })),
  resetStore: () =>
    set(() => ({
      currentFormSchema: {} as FormSchema,
      currentFormUI: {} as TUiConfig,
    })),
}))

export default useFormStore
