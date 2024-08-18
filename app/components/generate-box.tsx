"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";

const GenerateBox = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formData = Object.fromEntries(data.entries());
    console.log(formData);
  };
  return (
    <form
      className="flex flex-col gap-3 border rounded-lg p-3"
      onSubmit={handleSubmit}
    >
      <input
        className="w-full border-none outline-none px-3 py-1"
        placeholder="Ask Spira what to build..."
        name="question"
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
  );
};

export default GenerateBox;
