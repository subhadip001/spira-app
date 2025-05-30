import { TFormValues } from "@/types/form"
import { createClient } from "@/utils/supabase/client"
import { convertFormResponseArrayToObject } from "./form-lib/utils"
import {
  AddNewFormVersionVariables,
  EFormVersionStatus,
  EProfession,
  EReferrer,
  EUseCase,
  TAiChatMessage,
  TIpDetails,
  TQueryData,
} from "./types"

export enum QueryKeys {
  GetUserProfile = "getUserProfile",
  GetSpiraResponse = "getSpiraResponse",
  GetFormVersions = "getFormVersions",
  GetFormVersionByVersionNumber = "getFormVersionByVersionNumber",
  GetLatestFormVersion = "getLatestFormVersion",
  GetPublishedFormByFormVersionId = "getPublishedFormByFormVersionId",
  GetRecentFormsByUserId = "getRecentFormsByUserId",
  GetFormsByUserId = "getFormsByUserId",
  GetPublishedFormResponseByPublishedFormId = "getPublishedFormResponseByPublishedFormId",
  GetAiChatMessagesByPublishedFormId = "getAiChatMessagesByPublishedFormId",
  GetBaseForm = "getBaseForm",
  GetResponseAnalytics = "getResponseAnalytics",
  GetDataForUploadedCsvByResponseAnalyticsId = "getDataForUploadedCsvByResponseAnalyticsId",
  GetAllResponseAnalyticsByUserId = "getAllResponseAnalyticsByUserId",
}

export enum ApiQueryKeys {
  GenerateFormSchema = "generateFormSchema",
  GenerateTypeSuggestion = "generateTypeSuggestion",
  GenerateStarterQuestions = "generateStarterQuestions",
}

/* ********* API Queries ******** */

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

export const generateStarterQuestions = async (csvXml: string) => {
  const response = await fetch("/api/generate-starter-questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ csvXml }),
  })
  return response.json()
}

/* ********* Supabase Queries ******** */

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

export const fetchFormVersions = async (formId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("form_versions")
    .select()
    .neq("status", EFormVersionStatus.DELETED)
    .eq("form_id", formId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export const fetchFormVersionByVersionNumber = async (
  formId: string,
  versionNumber: number
) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("form_versions")
    .select()
    .eq("form_id", formId)
    .neq("status", EFormVersionStatus.DELETED)
    .eq("version_number", versionNumber)
    .single()

  if (error) throw error
  return data
}

export const fetchLatestFormVersion = async (formId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("form_versions")
    .select()
    .eq("form_id", formId)
    .neq("status", EFormVersionStatus.DELETED)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

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

export const addNewFormVersion = async ({
  formSchemaString,
  baseFormId,
  query,
  version,
  status,
  uiLayout,
  uiTheme,
  uiBrandKit,
  availableUiThemes,
}: AddNewFormVersionVariables) => {
  const supabase = createClient()

  console.log("version", version)

  const { data: existingVersion } = await supabase
    .from("form_versions")
    .select()
    .eq("form_id", baseFormId)
    .eq("version_number", version)
    .neq("status", EFormVersionStatus.DELETED)
    .limit(1)
    .single()

  let response

  if (existingVersion) {
    response = await supabase
      .from("form_versions")
      .update({
        form_schema_string: formSchemaString,
        query: query,
        status: status,
        ui_layout: uiLayout,
        ui_theme: uiTheme,
        ui_brand_kit: uiBrandKit,
        available_ui_themes: availableUiThemes,
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
        status: status,
        ui_layout: uiLayout,
        ui_theme: uiTheme,
        ui_brand_kit: uiBrandKit,
        available_ui_themes: availableUiThemes,
      })
      .select()
  }

  return response
}

export const deleteFormVersionById = async (formVersionId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("form_versions")
    .update({
      status: EFormVersionStatus.DELETED,
    })
    .eq("id", formVersionId)
  return { data, error }
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
    .order("created_at", { ascending: false })
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
    const { data, error } = await supabase.from("ai_chat").insert({
      ai_chat_messages: [message],
      published_form_id: publishedFormId,
      is_chat_active: true,
      ai_starter_questions: [],
    })

    return { data, error }
  } else {
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
  transformedXml: string
  uploadedCsvUrl: string
  userId: string
}) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("response_analytics")
    .insert({
      title: param.title,
      transformed_xml: param.transformedXml,
      uploaded_csv_url: param.uploadedCsvUrl,
      version: "1",
      user_id: param.userId,
    })
    .select()
    .limit(1)
    .single()

  return { data, error }
}

export const getAllResponseAnalyticsByUserId = async (userId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("response_analytics")
    .select("id, title, created_at, version, updated_at")
    .eq("user_id", userId)
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

export const fetchChatDataForUploadedCsvByResponseAnalyticsId = async (
  responseAnalyticsId: string
) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("uploaded_csv_chat")
    .select()
    .eq("response_analytics_id", responseAnalyticsId)
    .limit(1)

  // If no rows found, return null data instead of throwing error
  if (data && data.length === 0) {
    return { data: null, error: null }
  }

  return { data: data?.[0] || null, error }
}

export const createStarterQuestionsForUploadedCsv = async (
  responseAnalyticsId: string,
  aiStarterQuestions: string
) => {
  const supabase = createClient()
  const { data, error } = await supabase.from("uploaded_csv_chat").insert({
    ai_starter_questions: aiStarterQuestions,
    response_analytics_id: responseAnalyticsId,
  })
  return { data, error }
}

export const addAiChatMessageToDbForUploadedCsv = async (
  message: TAiChatMessage,
  responseAnalyticsId: string
) => {
  const supabase = createClient()

  const { data: existingData, error: existingError } = await supabase
    .from("uploaded_csv_chat")
    .select()
    .eq("response_analytics_id", responseAnalyticsId)

  if (existingError) return { data: null, error: existingError }

  if (existingData.length === 0) {
    const { data, error } = await supabase.from("uploaded_csv_chat").insert({
      ai_chat_messages: [message],
      response_analytics_id: responseAnalyticsId,
      ai_starter_questions: "",
      is_chat_active: true,
    })

    if (!error) {
      // Update response_analytics updated_at timestamp
      await supabase
        .from("response_analytics")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", responseAnalyticsId)
    }

    return { data, error }
  } else {
    const { data: updatedData, error: updatedError } = await supabase
      .from("uploaded_csv_chat")
      .update({
        ai_chat_messages: [
          ...(existingData[0].ai_chat_messages as TAiChatMessage[]),
          message,
        ],
        is_chat_active: true,
      })
      .eq("response_analytics_id", responseAnalyticsId)

    if (!updatedError) {
      // Update response_analytics updated_at timestamp
      await supabase
        .from("response_analytics")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", responseAnalyticsId)
    }

    return { data: updatedData, error: updatedError }
  }
}

export const addNewUserToOnboarding = async (
  userId: string,
  profession: EProfession,
  usecase: EUseCase,
  referrer: EReferrer
) => {
  const supabase = createClient()
  const { data, error } = await supabase.from("user_onboardings").insert({
    user_id: userId,
    profession: profession,
    usecase: usecase,
    referred_from: referrer,
  })

  if (!error) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        is_onboarded: true,
      })
      .eq("id", userId)

    if (profileError) {
      console.log("Error updating profile", profileError)
      return { data: null, error: profileError }
    }
  }
  return { data, error }
}

export const getOnboardingByUserId = async (userId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("user_onboardings")
    .select()
    .eq("user_id", userId)
  return { data, error }
}

////////

export const fetchIpDetails = async (): Promise<TIpDetails> => {
  const response = await fetch("http://ip-api.com/json/")
  const data = await response.json()
  return data as TIpDetails
}
