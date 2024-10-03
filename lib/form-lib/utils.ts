import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse, Allow } from "partial-json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fileSizeConverter = (bytes: number): string => {
  const megabytes = bytes / (1024 * 1024);
  if (megabytes >= 1000) {
    const gigabytes = megabytes / 1024;
    return `${gigabytes.toFixed(2)} GB`;
  } else {
    return `${megabytes.toFixed(2)} MB`;
  }
};

export const jsonExtractor = (jsonString: string) => {
  try {
    const jsonRegex = /```json\n([\s\S]*?\n)```/;
    const match = jsonString.match(jsonRegex);

    if (match && match[1]) {
      const requiredJson = JSON.parse(match[1]);
      return requiredJson;
    }
  } catch (error) {
    return {
      error: "Error parsing JSON",
    };
  }
};

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

export const partialJsonExtractor = (jsonString: string) => {
  try {
    // Use partial-json to parse the content, allowing all types of partial values
    const partialResult = parse(jsonString, Allow.ALL);
    console.log("Parsed partial JSON:", partialResult);
    return partialResult;
  } catch (error) {
    if (error instanceof Error && error.name === "MalformedJSON") {
      console.error("Malformed JSON:", error.message);
      return { error: "Malformed JSON" };
    } else {
      console.error("Error processing JSON:", error);
      return { error: "Error processing JSON" };
    }
  }
};

// Helper function to extract specific parts of the schema
export const extractSchemaSection = (jsonString: string, section: string) => {
  try {
    const allowOptions = Allow.OBJ | Allow.ARR | Allow.STR | Allow.NUM;
    const partialSchema = parse(jsonString, allowOptions);
    return partialSchema[section] || null;
  } catch (error) {
    console.error(`Error extracting ${section} from schema:`, error);
    return null;
  }
};
