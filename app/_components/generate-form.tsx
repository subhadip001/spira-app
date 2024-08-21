"use client";
import { generateFormSchema } from "@/lib/queries";
import { TFormData } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

type TGenerateFormProps = {
  formData: TFormData;
};

const GenerateForm: React.FC<TGenerateFormProps> = ({ formData }) => {
  const [formSchema, setFormSchema] = useState(null);
  
  console.log("formData", formData);
  useEffect(() => {
    formSchemaGenerateMutation.mutate(formData);
  }, [formData]);

  const formSchemaGenerateMutation = useMutation({
    mutationFn: generateFormSchema,
    onSuccess: (data) => {
      const message = data.message;
      console.log(message);
      const jsonString = message.match(/```\n([\s\S]*?)\n```/)[1];
      const formSchema = JSON.parse(jsonString);
      console.log(formSchema);
      setFormSchema(formSchema);
      console.log("Form schema generated successfully");
    },
    onError: (error: Error) => {
      console.error("Error generating form schema", error);
    },
  });
  return (
    <div>{formSchema && <pre>{JSON.stringify(formSchema, null, 2)}</pre>}</div>
  );
};

export default GenerateForm;
