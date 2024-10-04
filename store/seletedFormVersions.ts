import { create } from "zustand";

type FormData = {
  created_at: string;
  form_id: string;
  form_schema_string: string;
  id: string;
  query: string;
  version_number: number;
};

type SelectedFormVersionStore = {
  selectedFormVersion: FormData | null;
  setSelectedFormVersion: (form: FormData | null) => void;
};

const useSelectedFormVersionStore = create<SelectedFormVersionStore>((set) => ({
  selectedFormVersion: null,
  setSelectedFormVersion: (form) =>
    set(() => ({
      selectedFormVersion: form,
    })),
}));

export default useSelectedFormVersionStore;
