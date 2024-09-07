"use client";
import { Button } from "@/components/ui/button";
import { generateFormSchema } from "@/lib/queries";
import { TFormData } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FormBuilder } from "./form-components/FormBuilder";
import { devopsForm } from "@/schema/testSchema";
import { sampleFormSchema } from "@/schema/formSchema";
import HorizontalResizableComponent from "./resizable-component";

type TGenerateFormProps = {
  formData: TFormData;
  selectedViewport: "phone" | "tablet" | "desktop";
};

const GenerateForm: React.FC<TGenerateFormProps> = ({
  formData,
  selectedViewport,
}) => {
  const [formSchema, setFormSchema] = useState(devopsForm);

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
    <HorizontalResizableComponent
      initialWidth={
        selectedViewport === "desktop"
          ? 1300
          : selectedViewport === "tablet"
          ? 800
          : 400
      }
    >
      <div className="mx-3 px-4 py-3 bg-white border shadow-sm rounded-lg h-[calc(90svh-128px)] overflow-y-auto">
        {formSchemaGenerateMutation.isPending && <div>Loading...</div>}
        {devopsForm && (
          <FormBuilder
            initialSchema={devopsForm}
            className=""
            published={false}
            editable={true}
          />
        )}
      </div>
    </HorizontalResizableComponent>
  );
};

export default GenerateForm;
