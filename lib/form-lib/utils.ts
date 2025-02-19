import { TFormValues } from "@/types/form"
import {
  TFormVersionData,
  TPublishedFormResponse,
  TResponseData,
} from "../types"

export const fileSizeConverter = (bytes: number): string => {
  const megabytes = bytes / (1024 * 1024)
  if (megabytes >= 1000) {
    const gigabytes = megabytes / 1024
    return `${gigabytes.toFixed(2)} GB`
  } else {
    return `${megabytes.toFixed(2)} MB`
  }
}
export const jsonExtractor = (jsonString: string) => {
  try {
    const jsonRegex = /```json\n?([\s\S]+?)```/
    const match = jsonString.match(jsonRegex)

    if (match && match[1]) {
      const requiredJson = JSON.parse(match[1].trim())
      return requiredJson
    }
  } catch (error) {
    return {
      error: "Error parsing JSON",
    }
  }
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 172800) return "yesterday"
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`

  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

type FormResponseForStorage = {
  fields: {
    [key: string]: {
      label: string
      value: string
      type: string
      name: string
    }
  }
}

export function convertFormResponseArrayToObject(
  formResponse: TFormValues
): FormResponseForStorage {
  return {
    fields: formResponse.reduce(
      (acc, field) => {
        acc[field.formFieldId] = {
          label: field.formFieldLabel,
          value: field.formFieldValue,
          type: field.formFieldType,
          name: field.formFieldName,
        }
        return acc
      },
      {} as FormResponseForStorage["fields"]
    ),
  }
}

export const getMaxFormVersion = (
  formVersionsData: TFormVersionData[]
): number => {
  if (!formVersionsData || formVersionsData.length === 0) {
    return 0
  }

  const maxVersion = formVersionsData.reduce((acc, version) => {
    if (acc.version_number < version.version_number) {
      return version
    }
    return acc
  })

  return maxVersion.version_number
}

export const switchToNearestFormVersion = (
  formVersionsData: TFormVersionData[],
  currentVersionNumber: number
): number => {
  if (!formVersionsData || formVersionsData.length === 0) {
    return 1
  }

  // check if successor version exists
  const successorVersion = formVersionsData.find(
    (version) => version.version_number === currentVersionNumber + 1
  )
  if (successorVersion) {
    // if successor version exists, set it as selected version
    return successorVersion.version_number
  }

  // check if predecessor version exists
  const predecessorVersion = formVersionsData.find(
    (version) => version.version_number === currentVersionNumber - 1
  )
  if (predecessorVersion) {
    // if predecessor version exists, set it as selected version
    return predecessorVersion.version_number
  }

  return 1
}

export const exportToCsv = (
  publishedFormResponse: TPublishedFormResponse,
  headers: string[]
) => {
  if (!publishedFormResponse?.data) return

  const csvContent = [
    headers.join(","),
    ...publishedFormResponse.data.map((response) =>
      Object.values(response.response_data as TResponseData)
        .map((field) => `"${field.value}"`)
        .join(",")
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", "form_responses.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
