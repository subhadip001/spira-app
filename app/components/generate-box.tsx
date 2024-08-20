"use client";
import { Button } from "@/components/ui/button";
import { generateFormSchema } from "@/lib/queries";
import { TFormData } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import React from "react";
import { BorderBeam } from "@/components/magicui/border-beam";
import ShineBorder from "@/components/magicui/shine-border";
const GenerateBox = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formData = Object.fromEntries(data.entries()) as TFormData;
    console.log(formData);
    formSchemaGenerateMutation.mutate(formData);
  };

  const formSchemaGenerateMutation = useMutation({
    mutationFn: generateFormSchema,
    onSuccess: (data) => {
      const message = data.message;
      const jsonString = message.match(/```\n([\s\S]*?)\n```/)[1];
      const formSchema = JSON.parse(jsonString);

      console.log(formSchema);
      console.log("Form schema generated successfully");
    },
    onError: (error: Error) => {
      console.error("Error generating form schema", error);
    },
  });

  return (
    // <div className="relative rounded-lg">
    //   <form
    //     className="flex flex-col gap-3 border rounded-lg p-3 relative bg-white"
    //     onSubmit={handleSubmit}
    //   >
    //     <input
    //       className="w-full border-none outline-none px-3 py-1 rounded"
    //       placeholder="Ask Spira what to build..."
    //       name="question"
    //       autoComplete="off"
    //     />

    //     <div className="w-full flex">
    //       <Button
    //         type="submit"
    //         className="rounded-full w-[50px] h-[50px] ml-auto"
    //         variant="outline"
    //       >
    //         <div>
    //           <ArrowRight size={20} />
    //         </div>
    //       </Button>
    //     </div>
    //   </form>
    //   <BorderBeam />
    // </div>

    <ShineBorder
      className="rounded-lg relative bg-white "
      color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
    >
      <form
        className=" flex flex-col gap-3 rounded-lg p-3 z-50  "
        onSubmit={handleSubmit}
      >
        <input
          className="w-full border-none outline-none px-3 py-1 rounded"
          placeholder="Ask Spira what to build..."
          name="question"
          autoComplete="off"
        />

        <div className="w-full flex">
          <Button
            type="submit"
            className="rounded-full w-[50px] h-[50px] ml-auto"
            variant="outline"
          >
            <div>
              <ArrowRight size={20} />
            </div>
          </Button>
        </div>
      </form>
    </ShineBorder>
  );
};

export default GenerateBox;
