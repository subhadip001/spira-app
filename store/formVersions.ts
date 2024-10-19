import { TFormVersionData } from "@/lib/types"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type FormVersionStore = {
  formVersionsData: TFormVersionData[]
  setFormVersionsData: (formsData: TFormVersionData[]) => void
  selectedFormVersion: TFormVersionData | null
  setSelectedFormVersion: (form: TFormVersionData | null) => void
  resetStore: () => void
}

const initialState = {
  formVersionsData: [],
  selectedFormVersion: null,
}

const useFormVersionStore = create<FormVersionStore>()(
  persist(
    (set) => ({
      ...initialState,
      setFormVersionsData: (formData) => set({ formVersionsData: formData }),
      setSelectedFormVersion: (form) => set({ selectedFormVersion: form }),
      resetStore: () => set(initialState),
    }),
    {
      name: "form-version-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useFormVersionStore
