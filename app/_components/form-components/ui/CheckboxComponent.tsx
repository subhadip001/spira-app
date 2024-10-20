import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FormField, FormFieldOption } from "@/types/FormSchema"
import { SquareCheck } from "lucide-react"
import React from "react"
import { LabelComponent } from "./LabelComponent"

interface CheckboxFieldProps {
  field: FormField
  value: string
  onChange: (value: string) => void
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  value,
  onChange,
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    const currentValues = value ? value?.split(",").filter(Boolean) : []
    let newValues: string[]

    if (checked) {
      newValues = [...currentValues, optionValue]
    } else {
      newValues = currentValues.filter((v) => v !== optionValue)
    }

    onChange(newValues?.join(","))
  }

  return (
    <div className="flex flex-col gap-4">
      <LabelComponent field={field} />
      {field.description && (
        <p className="text-sm text-gray-500">{field.description}</p>
      )}
      <div className="space-y-1">
        {field.options?.map((option: FormFieldOption, index: number) => (
          <div key={index} className="relative">
            <Checkbox
              id={`${field.name}-${option.value}`}
              checked={value?.split(",").includes(option.value)}
              onCheckedChange={(checked) =>
                handleChange(option.value, checked as boolean)
              }
              className="peer sr-only"
            />
            <Label
              htmlFor={`${field.name}-${option.value}`}
              className="flex items-center justify-between p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <span className="text-sm">{option.label}</span>

              {value?.split(",").includes(option.value) && (
                <SquareCheck className="w-4 h-4" />
              )}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CheckboxField
