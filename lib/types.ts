import { PostgrestError } from "@supabase/supabase-js"

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
  status?: EFormVersionStatus
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

export type TPublishedForm = {
  data: {
    created_at: string
    form_base_id: string
    form_version_id: string
    id: string
    short_id: string
    status: EPublishedFormStatus
    user_id: string
  } | null
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

export type TResponseAnalytics = {
  created_at: string
  id: string
  published_formId: string
  title: string
  transformed_xml: string
  updated_at: string
  uploaded_csv_url: string
  user_id: string
  version: string
}

export type TUploadedCsvChatData = {
  ai_chat_messages: Object
  ai_starter_questions: string
  created_at: string
  id: string
  is_chat_active: boolean
  response_analytics_id: string
}

export enum EProfession {
  DATA_SCIENCE = "Data Science",
  DEVELOPMENT = "Development",
  DESIGN = "Design",
  MARKETING = "Marketing",
  BUSINESS = "Business",
  STUDENT = "Student",
  OTHER = "Other",
}

export enum EUseCase {
  SURVEY = "Survey",
  RESEARCH = "Research",
  JOB_APPLICATION = "Job Application",
  CUSTOMER_SATISFACTION = "Customer Satisfaction",
  EMPLOYEE_ONBOARDING = "Employee Onboarding",
  PRODUCT_FEATURE = "Product Feature",
  FEEDBACK_FORM = "Feedback Form",
  ALL = "All",
  OTHER = "Other",
}

export enum EReferrer {
  LINKEDIN = "LinkedIn",
  GOOGLE = "Google",
  FACEBOOK = "Facebook",
  TWITTER = "Twitter",
  INSTAGRAM = "Instagram",
  YOUTUBE = "YouTube",
  WHATSAPP = "WhatsApp",
  OTHER = "Other",
}

export type TUserOnboarding = {
  created_at: string
  id: string
  profession: EProfession | undefined
  referrer: EReferrer | undefined
  updated_at: string
  usecase: EUseCase | undefined
  user_id: string
}
