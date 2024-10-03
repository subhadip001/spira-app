import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateFormSchema } from "@/lib/queries";
import {
  partialJsonExtractor,
  extractSchemaSection,
} from "@/lib/form-lib/utils";
import { TQueryData } from "@/lib/types";

const useFormSchemaGenerator = () => {
  const [state, setState] = useState<{
    formSchema: any;
    streamedMessage: string;
    fields: any[];
  }>({
    formSchema: null,
    streamedMessage: "",
    fields: [],
  });

  const extractAndUpdateSchema = useCallback((message: string) => {
    console.log("Attempting to extract schema from:", message);
    const extractedSchema = partialJsonExtractor(message);
    if (extractedSchema && !extractedSchema.error) {
      console.log("Valid schema extracted:", extractedSchema);

      // Extract specific sections of the schema
      const fields = extractSchemaSection(message, "fields") || [];

      setState((prevState) => ({
        ...prevState,
        formSchema: extractedSchema,
        fields: [...prevState.fields, ...fields],
      }));
    } else {
      console.log("Failed to extract valid schema:", extractedSchema);
    }
  }, []);

  const formSchemaGenerateMutation = useMutation({
    mutationFn: (data: TQueryData) => generateFormSchema(data),
    onSuccess: async (stream: ReadableStream<Uint8Array>) => {
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          console.log("Received chunk:", chunk);
          setState((prevState) => {
            const updatedMessage = prevState.streamedMessage + chunk;
            // extractAndUpdateSchema(updatedMessage);
            return {
              ...prevState,
              streamedMessage: updatedMessage,
            };
          });
        }
      } finally {
        reader.releaseLock();
      }
    },
    onError: (error: Error) => {
      console.error("Error generating form schema", error);
    },
  });

  console.log("Current state:", state);

  return { ...state, formSchemaGenerateMutation };
};

export default useFormSchemaGenerator;
