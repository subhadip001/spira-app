import { createClient } from "@/utils/supabase/client";
import { TQueryData, AddNewFormVersionVariables } from "./types";

export enum QueryKeys {
  GetSpiraResponse = "getSpiraResponse",
  GetFormVersions = "getFormVersions",
}

export const generateFormSchema = async (data: TQueryData) => {
  const response = await fetch("/api/generate-form-schema", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to generate form schema");
  }

  return response.json();
};

// export const generateFormSchema = async (data: TQueryData): Promise<ReadableStream<Uint8Array>> => {
//   const response = await fetch("/api/generate-form-schema", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to generate form schema");
//   }

//   if (!response.body) {
//     throw new Error("Response body is null");
//   }

//   return response.body;
// };

export const addNewFormVersion = async ({
  formSchemaString,
  baseFormId,
  query,
  version,
}: AddNewFormVersionVariables) => {
  const supabase = createClient();

  const { data: existingVersion } = await supabase
    .from("form_versions")
    .select()
    .eq("form_id", baseFormId)
    .eq("version_number", version)
    .single();

  let response;

  if (existingVersion) {
    response = await supabase
      .from("form_versions")
      .update({
        form_schema_string: formSchemaString,
        query: query,
      })
      .eq("form_id", baseFormId)
      .eq("version_number", version)
      .select();
  } else {
    response = await supabase
      .from("form_versions")
      .insert({
        form_schema_string: formSchemaString,
        form_id: baseFormId,
        query: query,
        version_number: version,
      })
      .select();
  }
  
  return response;
};

export const fetchFormVersions = async (baseFormId: string) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("form_versions")
    .select()
    .eq("form_id", baseFormId);
  return data;
};
