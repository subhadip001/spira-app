export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  constantId: number;
  serialId: number;
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  maxSize?: string;
}

export interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
}
