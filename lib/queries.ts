import { TQueryData } from "./types";

export enum QueryKeys {
  GetSpiraResponse = "getSpiraResponse",
}

export const generateFormSchema = async (data: TQueryData) => {
  const response = await fetch("/api/generate-form-schema", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to generate form schema");
  }

  return response.json();
};
