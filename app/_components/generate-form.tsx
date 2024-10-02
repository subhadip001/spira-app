"use client";
import { jsonExtractor } from "@/lib/form-lib/utils";
import { generateFormSchema } from "@/lib/queries";
import { TQueryData } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import FormBuilder from "./form-components/FormBuilder";
import dynamic from "next/dynamic";
const HorizontalResizableComponent = dynamic(
  () => import("./resizable-component"),
  { ssr: false }
);

type TGenerateFormProps = {
  formData: TQueryData;
  selectedViewport: "phone" | "tablet" | "desktop";
};

const GenerateForm: React.FC<TGenerateFormProps> = ({
  formData,
  selectedViewport,
}) => {
  const [formSchema, setFormSchema] = useState();

  useEffect(() => {
    formSchemaGenerateMutation.mutate(formData);
  }, []);

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
        ) : formSchema ? (
          <FormBuilder
            initialSchema={formSchema}
            className=""
            published={false}
            editable={true}
          />
        ) : (
          <>
            <div className="flex flex-col w-full items-center justify-center gap-2 h-[calc(100svh-64px)] py-2 px-3 bg-[#f6f6f6df] rounded-md min-w-0">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Form not found</h1>
                <p className="text-gray-500">
                  The form you are looking for does not exist.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </HorizontalResizableComponent>
  );
};

export default GenerateForm;
