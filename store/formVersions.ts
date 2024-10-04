import { create } from "zustand";

type FormData =
  | {
      created_at: string;
      form_id: string;
      form_schema_string: string;
      id: string;
      query: string;
      version_number: number;
    }[]
  | null;

type FormVersionStore = {
  formVersionsData: FormData;
  setFormVersionsData: (formData: FormData) => void;
};

const useFormVersionStore = create<FormVersionStore>((set) => ({
  formVersionsData: [],
  setFormVersionsData: (formData) => {
    set(() => ({
      formVersionsData: formData,
    }));
  },
}));

export default useFormVersionStore;
