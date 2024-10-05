"use client";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import useAppStore from "@/store/appStore";
import useFormStore from "@/store/formStore";
import {
  Eye,
  Monitor,
  Pencil,
  Smartphone,
  Sparkles,
  SquareArrowUpRight,
  Tablet,
  WandSparkles,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import GenerateForm from "./generate-form";

type EditFormProps = {
  baseQuery: string;
  baseFormId: string;
  needToGenerateFormSchema: boolean;
};

const EditForm: React.FC<EditFormProps> = ({
  baseQuery,
  baseFormId,
  needToGenerateFormSchema,
}) => {
  const [selectedViewport, setSelectedViewport] = useState<
    "phone" | "tablet" | "desktop"
  >("desktop");

  const currentFormSchema = useFormStore((state) => state.currentFormSchema);
  const user = useAppStore((state) => state.user);
  const router = useRouter();
  const pathName = usePathname();
  const formId = pathName.split("/")[2];

  const editFormSideBarOpen = useAppStore((state) => state.editFormSideBarOpen);
  const setIsEditFormSideBarOpen = useAppStore(
    (state) => state.setIsEditFormSideBarOpen
  );
  const isViewAsPublished = useAppStore((state) => state.isViewAsPublished);
  const setIsViewAsPublished = useAppStore(
    (state) => state.setIsViewAsPublished
  );

  const handlePublish = () => {
    if (!user) {
      router.push(`/login?${formId ? `formId=${formId}` : ""}`);
      return;
    }
    console.log("Publishing form...");
    console.log(currentFormSchema);
  };
  return (
    <section className="relative flex-grow flex flex-col items-center gap-2 h-[calc(100svh-64px)] py-2 px-3 bg-[#f6f6f6df] rounded-md min-w-0">
      <div className="flex flex-col mmd:flex-row px-3 justify-between mmd:items-center w-full rounded-md mmd:h-[7vh] gap-2 mmd:gap-5">
        <div className="flex items-center w-full gap-2 bg-[#ffff] border px-3 py-2 rounded-md">
          <div>
            <Sparkles className="h-4 w-4 text-[#6b6b6b]" />
          </div>
          <div className="flex-grow">
            <span className="mx-auto line-clamp-1 text-[1.1rem] text-[#6b6b6b]">
              {baseQuery}
            </span>
          </div>
        </div>
        <div className="flex gap-5 items-center">
          <div className="bg-white h-full border rounded-md flex gap-2 p-1">
            <div
              className={`p-2 cursor-pointer ${
                isViewAsPublished ? "bg-gray-200" : ""
              } rounded border border-gray-200`}
              onClick={() => {
                setIsViewAsPublished(!isViewAsPublished);
              }}
            >
              <Eye className="h-4 w-4" />
            </div>
            <div
              className={`p-2 cursor-pointer rounded border border-gray-200 ${
                editFormSideBarOpen.isEditFormSideBarOpen ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                setIsEditFormSideBarOpen({
                  isEditFormSideBarOpen:
                    !editFormSideBarOpen.isEditFormSideBarOpen,
                  fieldConstantId: editFormSideBarOpen.isEditFormSideBarOpen
                    ? 0
                    : 1,
                });
              }}
            >
              <Pencil className="h-4 w-4" />
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
          <RainbowButton
            type="button"
            className="flex items-center gap-2"
            onClick={handlePublish}
          >
            Publish
            <div>
              <SquareArrowUpRight className="h-4 w-4" />
            </div>
          </RainbowButton>
        </div>
      </div>
      <div className="flex w-full justify-center items-center h-[calc(90svh-128px)]">
        <GenerateForm
          formData={{
            prompt: baseQuery,
          }}
          selectedViewport={selectedViewport}
          baseFormId={baseFormId}
          needToGenerateFormSchema={needToGenerateFormSchema}
        />
      </div>
      <div className="flex w-full px-3">
        <div className="w-full flex gap-2 items-center border px-3 py-2 rounded-md bg-white">
          <div>
            <WandSparkles className="h-4 w-4" />
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
