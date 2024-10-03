import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AppStore = {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
};

const useAppStore = create<AppStore>((set) => ({
  isDarkMode: false,
  setIsDarkMode: (isDarkMode) =>
    set((state) => {
      return {
        ...state,
        isDarkMode: isDarkMode,
      };
    }),
}));

export default useAppStore;
