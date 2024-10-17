import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

// export const jsonExtractor = (jsonString: string) => {
//   try {
//     const jsonRegex = /```json\n([\s\S]*?\n)```/;
//     const match = jsonString.match(jsonRegex);

//     if (match && match[1]) {
//       const jsonContent = match[1].trim();
//       console.log("Extracted JSON content:", jsonContent);
//       const requiredJson = JSON.parse(jsonContent);
//       return requiredJson;
//     } else {
//       console.log("No JSON content found in the string");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error parsing JSON:", error);
//     return {
//       error: "Error parsing JSON",
//     };
//   }
// };
