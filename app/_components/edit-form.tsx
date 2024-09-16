"use client";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, SquareArrowUpRight, Tablet } from "lucide-react";
import React, { useState } from "react";
import GenerateForm from "./generate-form";
import useFormStore from "@/store/formStore";

type EditFormProps = {
  query: string;
};

const EditForm: React.FC<EditFormProps> = ({ query }) => {
  const [selectedViewport, setSelectedViewport] = useState<
    "phone" | "tablet" | "desktop"
  >("desktop");

  const formData = useFormStore((state) => state.formData);

  const handlePublish = () => {
    console.log("Publishing form...");
    console.log(formData);
  };
  return (
    <section className="relative flex-grow flex flex-col items-center gap-2 h-[calc(100svh-64px)] py-2 px-3 bg-[#f6f6f6df] rounded-md min-w-0">
      <div className="flex px-3 justify-between items-center w-full rounded-md h-[7vh]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-400 flex text-white justify-center items-center rounded-full">
            O
          </div>
          <span className="bg-gray-200 px-3 py-1 rounded-full">Edit Form</span>
        </div>
        <div className="flex gap-5 items-center">
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
            prompt: query,
          }}
          selectedViewport={selectedViewport}
        />
      </div>
    </section>
  );
};

export default EditForm;
