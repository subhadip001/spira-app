"use client";
import { Button } from "@/components/ui/button";
import { generateFormSchema } from "@/lib/queries";
import { TFormData } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { FormBuilder } from "./form-components/FormBuilder";

type TGenerateFormProps = {
  formData: TFormData;
};

const GenerateForm: React.FC<TGenerateFormProps> = ({ formData }) => {
  const [formSchema, setFormSchema] = useState(null);

  console.log("formData", formData);
  // useEffect(() => {
  //   formSchemaGenerateMutation.mutate(formData);
  // }, [formData]);

  const formSchemaGenerateMutation = useMutation({
    mutationFn: generateFormSchema,
    onSuccess: (data) => {
      const message = data.message;
      console.log(message);
      const jsonRegex = /```json\n([\s\S]*?\n)```/;
      const match = message.match(jsonRegex);
      console.log("match", match);

      if (match && match[1]) {
        try {
          const formSchema = JSON.parse(match[1]);
          console.log("formSchema", formSchema);
          setFormSchema(formSchema);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    },
    onError: (error: Error) => {
      console.error("Error generating form schema", error);
    },
  });
  return (
    <div className="w-[80%] mx-auto">
      <Button onClick={() => formSchemaGenerateMutation.mutate(formData)}>
        Generate Form
      </Button>
      {formSchemaGenerateMutation.isPending && <div>Loading...</div>}
      {formSchema && <FormBuilder schema={formSchema} />}
    </div>
  );
};

export default GenerateForm;
