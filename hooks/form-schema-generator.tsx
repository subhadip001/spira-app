// hooks/useFormSchemaGenerator.ts
import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateFormSchema } from "@/lib/queries";
import { jsonExtractor } from "@/lib/form-lib/utils";
import { TQueryData } from "@/lib/types";

const useFormSchemaGenerator = () => {
  const [formSchema, setFormSchema] = useState<any>(null);
  const [streamedMessage, setStreamedMessage] = useState("");

  const extractAndUpdateSchema = useCallback((message: string) => {
    console.log("Attempting to extract schema from:", message);
    const extractedSchema = jsonExtractor(message);
    if (extractedSchema && !extractedSchema.error) {
      console.log("Valid schema extracted:", extractedSchema);
      setFormSchema(extractedSchema);
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
          setStreamedMessage((prev) => {
            const updatedMessage = prev + chunk;
            extractAndUpdateSchema(updatedMessage);
            return updatedMessage;
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

  console.log("Current formSchema:", formSchema);
  console.log("Current streamedMessage:", streamedMessage);

  return { formSchema, formSchemaGenerateMutation, streamedMessage };
};

export default useFormSchemaGenerator;