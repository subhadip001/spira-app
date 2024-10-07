import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type EditFormPageStore = {
  editFormSideBarOpen: {
    isEditFormSideBarOpen: boolean;
    fieldConstantId: number;
  };
  setIsEditFormSideBarOpen: (editFormSideBarOpen: {
    isEditFormSideBarOpen: boolean;
    fieldConstantId: number;
  }) => void;
  isViewAsPublished: boolean;
  setIsViewAsPublished: (isViewAsPublished: boolean) => void;
  resetStore: () => void;
};

const useEditFormPageStore = create<EditFormPageStore>()(
  persist(
    (set) => ({
      editFormSideBarOpen: { isEditFormSideBarOpen: false, fieldConstantId: 0 },
      setIsEditFormSideBarOpen: (editFormSideBarOpen) =>
        set((state) => {
          if (state.isViewAsPublished) return state;
          return {
            ...state,
            editFormSideBarOpen,
          };
        }),
      isViewAsPublished: false,
      setIsViewAsPublished: (isViewAsPublished) =>
        set((state) => {
          if (state.editFormSideBarOpen.isEditFormSideBarOpen) return state;
          return {
            ...state,
            isViewAsPublished,
          };
        }),
      resetStore: () =>
        set(() => ({
          editFormSideBarOpen: {
            isEditFormSideBarOpen: false,
            fieldConstantId: 0,
          },
          isViewAsPublished: false,
        })),
    }),
    {
      name: "edit-form-page-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEditFormPageStore;
