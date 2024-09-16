"use client";
import { jsonExtractor } from "@/lib/form-lib/utils";
import { generateFormSchema } from "@/lib/queries";
import { TQueryData } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FormBuilder } from "./form-components/FormBuilder";
import HorizontalResizableComponent from "./resizable-component";

type TGenerateFormProps = {
  formData: TQueryData;
  selectedViewport: "phone" | "tablet" | "desktop";
};

const GenerateForm: React.FC<TGenerateFormProps> = ({
  formData,
  selectedViewport,
}) => {
  const [formSchema, setFormSchema] = useState();

  // useEffect(() => {
  //   formSchemaGenerateMutation.mutate(formData);
  // }, [formData]);

  const formSchemaGenerateMutation = useMutation({
    mutationFn: generateFormSchema,
    onSuccess: (data) => {
      const message = data.message;
      const formSchema = jsonExtractor(message);
      console.log("formSchema", formSchema);
      setFormSchema(formSchema);
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
        {formSchemaGenerateMutation.isPending ? (
          <div>Loading...</div>
        ) : (
          <FormBuilder
            initialSchema={formSchema && formSchema}
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
