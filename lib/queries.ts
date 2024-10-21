import { createClient } from "@/utils/supabase/client"
import { TQueryData, AddNewFormVersionVariables } from "./types"
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

export const fetchFormVersions = async (baseFormId: string) => {
  const supabase = createClient()
  const { data } = await supabase
    .from("form_versions")
    .select()
    .eq("form_id", baseFormId)
  return data
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
