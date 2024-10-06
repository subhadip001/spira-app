export type TQueryData = {
  prompt: string;
};

export type TFormVersionData = {
  created_at: string;
  form_id: string;
  form_schema_string: string;
  id: string;
  query: string;
  version_number: number;
};

export type AddNewFormVersionVariables = {
  formSchemaString: string;
  baseFormId: string;
  query: string;
  version: number;
};
