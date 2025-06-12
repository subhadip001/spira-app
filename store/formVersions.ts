import { TFormVersionData } from "@/lib/types"
import { create } from "zustand"

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

const useFormVersionStore = create<FormVersionStore>()((set) => ({
  ...initialState,
  setFormVersionsData: (formData) => set({ formVersionsData: formData }),
  setSelectedFormVersion: (form) => {
    set({ selectedFormVersion: form })
  },
  resetStore: () => set(initialState),
}))

export default useFormVersionStore
