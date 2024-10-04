import EditForm from "@/app/_components/edit-form";
import FormPage from "@/app/_components/formPage";
import Header from "@/app/_components/header";
import HistorySidebar from "@/app/_components/history-sidebar";
import { createClient } from "@/utils/supabase/server";
import React from "react";

type TSearchParams = {
  q: string;
};

export default async function EditFormHome({
  searchParams,
  params,
}: {
  searchParams: TSearchParams;
  params: { formId: string };
}) {
  const baseformId = params?.formId;
  if (!baseformId) return null;

  const supabase = createClient();
  const { data: formVersions, error } = await supabase
    .from("form_versions")
    .select()
    .eq("form_id", baseformId);
  if (error) {
    return null;
  }
  let baseQuery = "";

  const { data: baseForm, error: baseFormError } = await supabase
    .from("forms")
    .select("*")
    .eq("id", baseformId);
  if (baseFormError) {
    return null;
  }

  return (
    <div className="bg-white w-[100vw] min-h-[100svh]">
      <Header />
      <main className="flex px-2">
        <FormPage
          baseQuery={baseForm[0]?.query}
          formVersions={formVersions}
          baseFormId={baseformId}
        />
      </main>
    </div>
  );
}
