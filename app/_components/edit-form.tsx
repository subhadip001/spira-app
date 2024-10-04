"use client";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Monitor,
  Smartphone,
  Sparkles,
  SquareArrowUpRight,
  Tablet,
} from "lucide-react";
import React, { useState } from "react";
import GenerateForm from "./generate-form";
import useFormStore from "@/store/formStore";

type EditFormProps = {
  baseQuery: string;
  baseFormId: string;
  generatedFormSchema: boolean;
};

const EditForm: React.FC<EditFormProps> = ({
  baseQuery,
  baseFormId,
  generatedFormSchema,
}) => {
  const [selectedViewport, setSelectedViewport] = useState<
    "phone" | "tablet" | "desktop"
  >("desktop");

  const currentFormSchema = useFormStore((state) => state.currentFormSchema);

  const handlePublish = () => {
    console.log("Publishing form...");
    console.log(currentFormSchema);
  };
  return (
    <section className="relative flex-grow flex flex-col items-center gap-2 h-[calc(100svh-64px)] py-2 px-3 bg-[#f6f6f6df] rounded-md min-w-0">
      <div className="flex px-3 justify-between items-center w-full rounded-md h-[7vh] gap-5">
        <div className="flex items-center w-full gap-1">
          <div className="min-w-8 min-h-8 bg-blue-400 flex text-white justify-center items-center rounded-full"></div>
          <div className="flex-grow">
            <span className=" mx-auto line-clamp-1 bg-gray-200 px-3 py-1 rounded-full text-gray-500 outline-none">
              {baseQuery}
            </span>
          </div>
        </div>
        <div className="flex gap-5 items-center">
          <div className="bg-white h-full border rounded-md flex gap-2 p-1">
            <div
              className="p-2 cursor-pointer rounded bg-gray-100"
              onClick={() => {}}
            >
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="bg-white h-full border rounded-md flex gap-2 p-1">
            <div
              className={`p-2 cursor-pointer ${
                selectedViewport === "desktop" ? "bg-gray-200" : ""
              } rounded`}
              onClick={() => setSelectedViewport("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </div>
            <div
              className={`p-2 cursor-pointer ${
                selectedViewport === "tablet" ? "bg-gray-200" : ""
              } rounded`}
              onClick={() => setSelectedViewport("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </div>
            <div
              className={`p-2 cursor-pointer ${
                selectedViewport === "phone" ? "bg-gray-200" : ""
              } rounded`}
              onClick={() => setSelectedViewport("phone")}
            >
              <Smartphone className="h-4 w-4" />
            </div>
          </div>
          <Button
            type="button"
            variant="default"
            className="flex items-center gap-1"
            onClick={handlePublish}
          >
            Publish
            <div>
              <SquareArrowUpRight className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </div>
      <div className="flex w-full justify-center items-center h-[calc(90svh-128px)]">
        <GenerateForm
          formData={{
            prompt: baseQuery,
          }}
          selectedViewport={selectedViewport}
          baseFormId={baseFormId}
          generatedFormSchema={generatedFormSchema}
        />
      </div>
      <div className="flex w-full px-3">
        <div className="w-full flex gap-2 items-center border px-3 py-2 rounded-md bg-white">
          <div>
            <Sparkles className="h-4 w-4" />
          </div>
          <input
            placeholder="Ask spira to modify the form"
            name="name"
            type="text"
            disabled
            className="outline-none flex-grow text-sm bg-transparent"
            onChange={() => {}}
          />
        </div>
      </div>
    </section>
  );
};

export default EditForm;
