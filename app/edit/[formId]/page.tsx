import ReactQueryProvider from "@/app/components/react-query-provider";
import { TFormData } from "@/lib/types";
import dynamic from "next/dynamic";
import React from "react";
const GenerateForm = dynamic(() => import("../../components/generate-form"), {
  ssr: false,
});

type TSearchParams = {
  q: string;
};

export default function EditForm({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  console.log(searchParams);
  return (
    <ReactQueryProvider>
      <GenerateForm
        formData={{
          prompt: searchParams.q,
        }}
      />
    </ReactQueryProvider>
  );
}
