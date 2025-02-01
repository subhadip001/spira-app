import { EUiLayout, THEME_PRESETS, TUiConfig } from "@/lib/types"
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
  currentFormUI: {
    layout: EUiLayout.DEFAULT,
    theme: THEME_PRESETS.DEFAULT,
    availableThemes: [
      THEME_PRESETS.DEFAULT,
      THEME_PRESETS.LIGHT,
      THEME_PRESETS.DARK,
    ],
    brandKit: {},
  } as TUiConfig,
  setCurrentFormUI: (formUI) => set(() => ({ currentFormUI: formUI })),
  resetStore: () =>
    set(() => ({
      currentFormSchema: {} as FormSchema,
      currentFormUI: {} as TUiConfig,
    })),
}))

export default useFormStore
