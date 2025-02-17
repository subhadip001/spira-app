export interface FormFieldOption {
  label: string
  value: string
}

export type FormField = {
  constantId: number
  serialId: number
  type: string
  label: string
  description: string
  name: string
  placeholder?: string
  required?: boolean
  options?: FormFieldOption[]
  min?: number
  max?: number
  step?: number
  accept?: string
  maxSize?: string
}

export type FormSchema = {
  title: string
  description: string
  headerBackground: string
  fields: FormField[]
}

export enum FieldType {
  TEXT = "text",
  TEL = "tel",
  EMAIL = "email",
  TEXTAREA = "textarea",
  SELECT = "select",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  RANGE = "range",
  FILE = "file",
  DATE = "date",
}
