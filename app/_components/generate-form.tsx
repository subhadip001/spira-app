"use client";
import { jsonExtractor } from "@/lib/form-lib/utils";
import {
  generateFormSchema,
  addNewFormVersion,
  QueryKeys,
} from "@/lib/queries";
import { AddNewFormVersionVariables, TQueryData } from "@/lib/types";
import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { use, useEffect, useState } from "react";
import FormBuilder from "./form-components/FormBuilder";
import dynamic from "next/dynamic";
import useFormSchemaGenerator from "@/hooks/form-schema-generator";
import { set } from "react-hook-form";
import useFormVersionStore from "@/store/formVersions";
import useSelectedFormVersionStore from "@/store/seletedFormVersions";
import useAppStore from "@/store/appStore";
import useFormStore from "@/store/formStore";

const HorizontalResizableComponent = dynamic(
  () => import("./resizable-component"),
  { ssr: false }
);

type TGenerateFormProps = {
  formData: TQueryData;
  selectedViewport: "phone" | "tablet" | "desktop";
  baseFormId: string;
  needToGenerateFormSchema: boolean;
};

const GenerateForm: React.FC<TGenerateFormProps> = ({
  formData,
  selectedViewport,
  baseFormId,
  needToGenerateFormSchema,
}) => {
  const [formSchema, setFormSchema] = useState();
  const currentFormSchema = useFormStore((state) => state.currentFormSchema);
  const setCurrentFormSchema = useFormStore(
    (state) => state.setCurrentFormSchema
  );
  const formVersionsData = useFormVersionStore(
    (state) => state.formVersionsData
  );

  const isViewAsPublished = useAppStore((state) => state.isViewAsPublished);
  const setIsViewAsPublished = useAppStore(
    (state) => state.setIsViewAsPublished
  );

  const queryClient = useQueryClient();
  // const { formSchema, formSchemaGenerateMutation, streamedMessage } =
  //   useFormSchemaGenerator();

  const seletedFormVersion = useSelectedFormVersionStore(
    (state) => state.selectedFormVersion
  );
  const formSchemaGenerateMutation = useMutation({
    mutationFn: generateFormSchema,
    onSuccess: async (data) => {
      setFormSchema(jsonExtractor(data.message));
      setCurrentFormSchema(jsonExtractor(data.message));
      addNewFormversionMutation.mutate({
        formSchemaString: data.message,
        baseFormId: baseFormId,
        query: formData.prompt,
        version: 1,
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GetFormVersions, baseFormId],
      });
    },
    onError: (error: Error) => {
      console.error("Error generating form schema", error);
    },
  });
  useEffect(() => {
    if (needToGenerateFormSchema) {
      formSchemaGenerateMutation.mutate(formData);
    }
  }, [needToGenerateFormSchema]);

  useEffect(() => {
    if (seletedFormVersion?.form_schema_string) {
      const jsonFormSchema = jsonExtractor(
        seletedFormVersion.form_schema_string
      );
      setFormSchema(jsonFormSchema);
      setCurrentFormSchema(jsonFormSchema);
    }
  }, [seletedFormVersion]);

  const addNewFormversionMutation = useMutation({
    mutationFn: (variables: AddNewFormVersionVariables) =>
      addNewFormVersion(variables),
    onSuccess: (data) => {
      // console.log("data", data);
    },
    onError: (error: Error) => {
      console.error("Error adding new form version", error);
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
      <div className="mx-3 w-full  mmd:w-auto  bg-white border shadow-sm rounded-lg h-[calc(90svh-128px)] overflow-y-auto">
        {formSchemaGenerateMutation.isPending ? (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Generating Form Schema...
            </h3>
          </div>
        ) : formSchema ? (
          <FormBuilder
            initialSchema={currentFormSchema}
            className="px-4 py-3 mmd:px-10 mmd:py-8"
            published={false}
            editable={!isViewAsPublished}
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
