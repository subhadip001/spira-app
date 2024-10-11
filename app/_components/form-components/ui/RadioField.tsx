import React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Required } from "./Required"
import { FormField, FormFieldOption } from "@/types/FormSchema"
import { LabelComponent } from "./LabelComponent"

interface RadioFieldProps {
  field: FormField
  value: string
  onChange: (value: string) => void
}

const RadioField: React.FC<RadioFieldProps> = ({ field, value, onChange }) => {
  return (
    <div className="flex flex-col gap-4">
      <LabelComponent field={field} />
      {field.description && (
        <p className="text-sm text-gray-500">{field.description}</p>
      )}
      <RadioGroup value={value} onValueChange={onChange} className="">
        {field.options?.map((option: FormFieldOption, index: number) => (
          <div key={option.value + index} className="relative">
            <RadioGroupItem
              id={`${field.name}-${option.value}`}
              value={option.value}
              className="peer sr-only "
            />
            <Label
              htmlFor={`${field.name}-${option.value}`}
              className={`flex items-center justify-between p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all`}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default RadioField
