import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type EditFormPageStore = {
  selectedFieldConstantId: number
  setSelectedFieldConstantId: (selectedFieldConstantId: number) => void
  isViewAsPublished: boolean
  setIsViewAsPublished: (isViewAsPublished: boolean) => void
  resetStore: () => void
}

const useEditFormPageStore = create<EditFormPageStore>()((set) => ({
  selectedFieldConstantId: 1,
  setSelectedFieldConstantId: (selectedFieldConstantId: number) => {
    set((state) => ({
      ...state,
      selectedFieldConstantId,
    }))
  },
  isViewAsPublished: false,
  setIsViewAsPublished: (isViewAsPublished: boolean) =>
    set((state) => {
      return {
        ...state,
        isViewAsPublished,
      }
    }),
  resetStore: () =>
    set(() => ({
      selectedFieldConstantId: 1,
      isViewAsPublished: false,
    })),
}))

export default useEditFormPageStore
