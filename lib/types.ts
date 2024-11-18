import { PostgrestError } from "@supabase/supabase-js"
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
  status: EFormVersionStatus
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
  DELETED = "DELETED",
}

export enum EPublishedFormStatus {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  UNPUBLISHED = "UNPUBLISHED",
}

export type TAiChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export type TAiChat = {
  aiChatMessages: TAiChatMessage[]
  aiStarterQuestions: string[]
  isChatActive: boolean
  error: PostgrestError | null
}
export type TPublishedFormResponse = {
  data:
    | {
        created_at: string
        id: string
        published_form_id: string
        response_data: TResponseData
        updated_at: string
      }[]
    | null
  error: PostgrestError | null
}

export type TResponseData = {
  [key: string]: {
    name: string
    label: string
    value: string
  }
}
