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
  setSelectedFieldConstantId: (selectedFieldConstantId) =>
    set((state) => ({
      ...state,
      selectedFieldConstantId,
    })),
  isViewAsPublished: false,
  setIsViewAsPublished: (isViewAsPublished) =>
    set((state) => {
      return {
        ...state,
        isViewAsPublished,
      }
    }),
  resetStore: () =>
    set(() => ({
      editFormSideBarOpen: {
        isEditFormSideBarOpen: true,
        fieldConstantId: 1,
      },
      isViewAsPublished: false,
    })),
}))

export default useEditFormPageStore
