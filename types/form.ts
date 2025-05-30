export type TFormValues = {
  formFieldId: number
  formFieldName: string
  formFieldLabel: string
  formFieldType: string
  formFieldValue: string
}[]
export type TFormErrors = {
  formFieldId: number
  error: string
}[]
export type TFormDetails = {
  title: string
  description: string
  headerBackground: string
}

export type TFormData = {
  details: TFormDetails
  values: TFormValues
}
