"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldType } from "@/types/FormSchema";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

type NewFieldDetailsType = {
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: FieldType;
};

export function CreateNewField() {
  const [newFieldDetails, setNewFieldDetails] = useState<
    NewFieldDetailsType | undefined
  >();

  return (
    <section className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Choose new field Details:</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="px-3 py-2 rounded-md border items-center border-gray-300 flex gap-2 cursor-pointer">
          <div>
            <ArrowUp className="h-4 w-4" />
          </div>
          <span>Above</span>
        </div>
        <div className="px-3 py-2 rounded-md border items-center border-gray-300 flex gap-2 cursor-pointer">
          <div>
            <ArrowDown className="h-4 w-4" />
          </div>
          <span>Below</span>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" className="w-full flex items-center gap-2">
          <div>
            <span>Create</span>
          </div>
        </Button>
      </DialogFooter>
    </section>
  );
}
