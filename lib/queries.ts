import { createClient } from "@/utils/supabase/client"
import { TQueryData, AddNewFormVersionVariables, TAiChatMessage } from "./types"
import { TFormValues } from "@/types/form"
import { convertFormResponseArrayToObject } from "./form-lib/utils"

export enum QueryKeys {
  GetUserProfile = "getUserProfile",
  GetSpiraResponse = "getSpiraResponse",
  GetFormVersions = "getFormVersions",
  GetPublishedFormByFormVersionId = "getPublishedFormByFormVersionId",
  GetRecentFormsByUserId = "getRecentFormsByUserId",
  GetFormsByUserId = "getFormsByUserId",
  GetPublishedFormResponseByPublishedFormId = "getPublishedFormResponseByPublishedFormId",
  GetAiChatMessagesByPublishedFormId = "getAiChatMessagesByPublishedFormId",
  GetBaseForm = "getBaseForm",
}

export const generateFormSchema = async (data: TQueryData) => {
  const response = await fetch("/api/generate-form-schema", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to generate form schema")
  }

  return response.json()
}

export const generateTypeSuggestion = async (data: TQueryData) => {
  const response = await fetch("/api/ai-type-recommender", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to generate type suggestion")
  }

  return response.json()
}

export const getUserProfile = async () => {
  const supabase = createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user?.user?.id) return { data: null, error: "User ID is required" }
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.user.id)
    .single()
  return { data, error }
}

export const addNewFormVersion = async ({
  formSchemaString,
  baseFormId,
  query,
  version,
}: AddNewFormVersionVariables) => {
  const supabase = createClient()

  const { data: existingVersion } = await supabase
    .from("form_versions")
    .select()
    .eq("form_id", baseFormId)
    .eq("version_number", version)
    .single()

  let response

  if (existingVersion) {
    response = await supabase
      .from("form_versions")
      .update({
        form_schema_string: formSchemaString,
        query: query,
      })
      .eq("form_id", baseFormId)
      .eq("version_number", version)
      .select()
  } else {
    response = await supabase
      .from("form_versions")
      .insert({
        form_schema_string: formSchemaString,
        form_id: baseFormId,
        query: query,
        version_number: version,
      })
      .select()
  }

  return response
}

export const getPublishedFormByFormVersionId = async (
  formVersionId: string
) => {
  if (!formVersionId)
    return { data: null, error: "Form version ID is required" }
  const supabase = createClient()
  const { data, error } = await supabase
    .from("published_forms")
    .select()
    .eq("form_version_id", formVersionId)
    .limit(1)
    .single()
  return { data, error }
}

export const getFormsByUserId = async (userId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("forms")
    .select()
    .order("created_at", { ascending: false })
    .eq("user_id", userId)
  return { data, error }
}

export const getRecentFormsByUserId = async (userId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("forms")
    .select()
    .limit(3)
    .order("created_at", { ascending: false })
    .eq("user_id", userId)
  return { data, error }
}

export const createNewResponseForPublishedForm = async (
  responseDataArray: TFormValues,
  publishedFormId: string
) => {
  const supabase = createClient()

  const responseDataObject = convertFormResponseArrayToObject(responseDataArray)

  const { data, error } = await supabase
    .from("form_responses")
    .insert({
      response_data: responseDataObject.fields,
      published_form_id: publishedFormId,
    })
    .select()

  return { data, error }
}

export const getPublishedFormResponseByPublishedFormId = async (
  publishedFormId: string
) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("form_responses")
    .select()
    .eq("published_form_id", publishedFormId)
    .order("created_at", { ascending: true })
  return { data, error }
}

export const addAiChatMessageToDb = async (
  message: TAiChatMessage,
  publishedFormId: string
) => {
  const supabase = createClient()

  const { data: existingData, error: existingError } = await supabase
    .from("ai_chat")
    .select()
    .eq("published_form_id", publishedFormId)

  if (existingError) return { data: null, error: existingError }

  if (existingData.length === 0) {
    // insert message into ai_chat table
    const { data, error } = await supabase.from("ai_chat").insert({
      ai_chat_messages: [message],
      published_form_id: publishedFormId,
      is_chat_active: true,
      ai_starter_questions: [],
    })

    return { data, error }
  } else {
    // update existing ai_chat table with appended message
    const { data: updatedData, error: updatedError } = await supabase
      .from("ai_chat")
      .update({
        ai_chat_messages: [
          ...(existingData[0].ai_chat_messages as TAiChatMessage[]),
          message,
        ],
      })
      .eq("published_form_id", publishedFormId)

    return { data: updatedData, error: updatedError }
  }
}

export const getAiChatMessagesByPublishedFormId = async (
  publishedFormId: string
) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("ai_chat")
    .select()
    .eq("published_form_id", publishedFormId)

  const aiChatMessages = data?.[0]?.ai_chat_messages as TAiChatMessage[]
  const aiStarterQuestions = data?.[0]?.ai_starter_questions as string[]
  const isChatActive = data?.[0]?.is_chat_active as boolean
  return { aiChatMessages, aiStarterQuestions, isChatActive, error }
}

export const createNewResponseAnalyticsForUploadedCsv = async (param: {
  title: string
  transformedJson: Record<string, string>[]
  transformedXml: string
  uploadedCsvUrl: string
}) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("response_analytics")
    .insert({
      title: param.title,
      response_json: param.transformedJson,
      transformed_xml: param.transformedXml,
      uploaded_csv_url: param.uploadedCsvUrl,
      version: "1",
    })
    .select()
    .limit(1)
    .single()

  return { data, error }
}

export const getResponseAnalyticsById = async (responseAnalyticsId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("response_analytics")
    .select()
    .eq("id", responseAnalyticsId)
  return { data, error }
}
// Make sure to create a client-side Supabase client
import { TFormVersionData } from "@/lib/types"

export const fetchFormVersions = async (formId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("form_versions")
    .select()
    .eq("form_id", formId)

  if (error) throw error
  return data
}

export const fetchBaseForm = async (formId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", formId)
    .single()

  if (error) throw error
  return data
}
