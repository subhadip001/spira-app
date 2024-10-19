import { TFormValues } from "@/types/form"

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
          name: field.formFieldName,
        }
        return acc
      },
      {} as FormResponseForStorage["fields"]
    ),
  }
}
