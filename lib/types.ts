import exp from "constants"

export type TQueryData = {
  prompt: string
}

export type TFormVersionData = {
  created_at: string
  form_id: string
  form_schema_string: string
  id: string
  query: string
  version_number: number
}

export type AddNewFormVersionVariables = {
  formSchemaString: string
  baseFormId: string
  query: string
  version: number
}

export enum EFormVersionStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  UNPUBLISHED = "UNPUBLISHED",
}

export enum EPublishedFormStatus {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  UNPUBLISHED = "UNPUBLISHED",
}
