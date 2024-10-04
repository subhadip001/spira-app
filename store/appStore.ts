import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  id: string;
  email: string;
  name: string;
};

type AppStore = {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
};

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isDarkMode: false,
      setIsDarkMode: (isDarkMode) =>
        set((state) => ({
          ...state,
          isDarkMode,
        })),
      user: null,
      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAppStore;
