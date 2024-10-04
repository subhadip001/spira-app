"use client";
import React, { useEffect, useState } from "react";
import EditForm from "./edit-form";
import HistorySidebar from "./history-sidebar";
import { useQuery } from "@tanstack/react-query";
import { fetchFormVersions, QueryKeys } from "@/lib/queries";
import useFormVersionStore from "@/store/formVersions";
import useSelectedFormVersionStore from "@/store/seletedFormVersions";
import { set } from "react-hook-form";
import useAppStore from "@/store/appStore";
import EditFormField from "./edit-form-field";

type FormPageProps = {
  baseQuery: string;
  baseFormId: string;
  formVersions: {
    created_at: string;
    form_id: string;
    form_schema_string: string;
    id: string;
    query: string;
    version_number: number;
  }[];
};

const FormPage: React.FC<FormPageProps> = ({
  baseQuery,
  formVersions,
  baseFormId,
}) => {
  const [isFormVersionsAvalible, setIsFormVersionsAvalible] =
    useState<boolean>(true);
  const setFormVersionsData = useFormVersionStore(
    (state) => state.setFormVersionsData
  );
  const seletedFormVersion = useSelectedFormVersionStore(
    (state) => state.selectedFormVersion
  );
  const setSelectedFormVersion = useSelectedFormVersionStore(
    (state) => state.setSelectedFormVersion
  );

  const { data } = useQuery({
    queryKey: [QueryKeys.GetFormVersions, baseFormId],
    queryFn: () => fetchFormVersions(baseFormId),
    initialData: formVersions,
    enabled: !!baseFormId,
  });

  useEffect(() => {
    if (data && data?.length > 0) {
      setIsFormVersionsAvalible(true);
      setFormVersionsData(data);
      setSelectedFormVersion(seletedFormVersion ? seletedFormVersion : data[0]);
    } else {
      setIsFormVersionsAvalible(false);
    }
  }, [data]);

  return (
    <>
      <HistorySidebar />
      {(data && data?.length > 0) || baseQuery ? (
        <EditForm
          baseQuery={baseQuery}
          baseFormId={baseFormId}
          needToGenerateFormSchema={!isFormVersionsAvalible}
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

      <EditFormField />
    </>
  );
};

export default FormPage;
