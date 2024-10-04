"use client";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Monitor,
  Pencil,
  Smartphone,
  Sparkle,
  Sparkles,
  SquareArrowUpRight,
  Tablet,
} from "lucide-react";
import React, { useState } from "react";
import GenerateForm from "./generate-form";
import useFormStore from "@/store/formStore";
import { createClient } from "@/utils/supabase/client";
import useAppStore from "@/store/appStore";
import { usePathname, useRouter } from "next/navigation";
import UserProfileAvatar from "./profile-avatar";

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
      <div className="flex px-3 justify-between items-center w-full rounded-md h-[7vh] gap-5">
        <div className="flex items-center w-full gap-1">
          <div className="flex-grow">
            <span className=" mx-auto line-clamp-1 flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-md text-gray-500 outline-none">
              <div>
                <Sparkle className="h-4 w-4" />
              </div>
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
                  fieldConstantId: 0,
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
          needToGenerateFormSchema={needToGenerateFormSchema}
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
