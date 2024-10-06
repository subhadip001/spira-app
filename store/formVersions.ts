import { TFormVersionData } from "@/lib/types";
import { create } from "zustand";

type FormVersionStore = {
  formVersionsData: TFormVersionData[];
  setFormVersionsData: (formsData: TFormVersionData[]) => void;
  selectedFormVersion: TFormVersionData;
  setSelectedFormVersion: (form: TFormVersionData) => void;
};

const useFormVersionStore = create<FormVersionStore>((set) => ({
  formVersionsData: [],
  setFormVersionsData: (formData) => {
    set(() => ({
      formVersionsData: formData,
    }));
  },
  selectedFormVersion: {} as TFormVersionData,
  setSelectedFormVersion: (form) =>
    set(() => ({
      selectedFormVersion: form,
    })),
}));

export default useFormVersionStore;
