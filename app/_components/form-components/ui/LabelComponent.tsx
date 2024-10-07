import { Label } from "@/components/ui/label";
import { FormField } from "@/types/FormSchema";
import { Required } from "./Required";

export const LabelComponent = ({ field }: { field: FormField }) => {
  return (
    <Label
      htmlFor={field.name}
      className="flex items-center gap-1 text-gray-500"
    >
      <span className="text-sm font-medium w-5 h-5 rounded-md inline-flex bg-gray-200 border border-gray-300 items-center justify-center">
        {field.serialId}
      </span>
      <span className="text-lg font-medium ml-1">{field.label}</span>
      {field.required && <Required />}
    </Label>
  );
};
