import { Label } from "@/components/ui/label"
import { FormField } from "@/types/FormSchema"
import { Required } from "./Required"

export const LabelComponent = ({ field }: { field: FormField }) => {
  return (
    <Label
      htmlFor={field.name}
      className="flex items-center gap-1 text-gray-500"
    >
      <div className="text-sm font-medium">
        <span className="text-sm mr-2 font-medium w-5 h-5 rounded-md inline-flex bg-gray-200 border border-gray-300 items-center justify-center">
          {field.serialId}
        </span>
        {field.label} {field.required && <Required />}
      </div>
    </Label>
  )
}
