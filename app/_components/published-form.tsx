"use client";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, SquareArrowUpRight, Tablet } from "lucide-react";
import React, { useState } from "react";
import GenerateForm from "./generate-form";
import useFormStore from "@/store/formStore";
// import FormBuilder from "./form-components/FormBuilder";
import { devopsForm } from "@/schema/testSchema";
import dynamic from "next/dynamic";
const FormBuilder = dynamic(() => import("./form-components/FormBuilder"), {
  ssr: false,
});

type PublishedFormProps = {};

const PublishedForm: React.FC<PublishedFormProps> = () => {
  const [selectedViewport, setSelectedViewport] = useState<
    "phone" | "tablet" | "desktop"
  >("desktop");

  const currentFormSchema = useFormStore((state) => state.currentFormSchema);

  const handlePublish = () => {
    console.log("Publishing form...");
    console.log(currentFormSchema);
  };
  return (
    <section className="relative flex-grow flex overflow-y-auto flex-col items-center gap-2 h-[calc(100svh-64px)] py-2 px-3 bg-[#f6f6f6df] rounded-md min-w-0">
      <FormBuilder
        initialSchema={devopsForm}
        className=""
        published={true}
        editable={false}
      />
    </section>
  );
};

export default PublishedForm;
