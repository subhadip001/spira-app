export type TFormValues = {
  formFieldId: number;
  formFieldName: string;
  formFieldLabel: string;
  formFieldValue: string;
}[];
export type TFormErrors = {
  formFieldId: number;
  error: string;
}[];
export type TFormDetails = {
  title: string;
  description: string;
};

export type TFormData = {
  details: TFormDetails;
  values: TFormValues;
};
