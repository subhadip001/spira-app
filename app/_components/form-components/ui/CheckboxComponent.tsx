import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FormField, FormFieldOption } from "@/types/FormSchema"
import { SquareCheck } from "lucide-react"
import React, { useState, useEffect } from "react"
import { LabelComponent } from "./LabelComponent"
import { Input } from "@/components/ui/input"

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
  // Extract the "Other" value from the current value if it exists
  const extractOtherValue = () => {
    const otherEntry = currentValues.find((v) => v.startsWith("Other: "))
    return otherEntry ? otherEntry.substring(7) : ""
  }

  const currentValues = value ? value?.split(",").filter(Boolean) : []

  // Check if "Other" is selected
  const isOtherSelected =
    currentValues.includes("Other") ||
    currentValues.includes("other") ||
    currentValues.some((v) => v.startsWith("Other: "))

  // Initialize otherValue from the current value if it exists
  const [otherValue, setOtherValue] = useState<string>(extractOtherValue())

  // Update the parent value only when the input loses focus or on Enter key
  const handleOtherInputBlur = () => {
    if (isOtherSelected && otherValue) {
      const valuesWithoutOther = currentValues.filter(
        (v) => v !== "Other" && v !== "other" && !v.startsWith("Other: ")
      )
      // Store the custom value as "Other: {custom value}"
      onChange([...valuesWithoutOther, `Other: ${otherValue}`].join(","))
    }
  }

  // Handle key press events for the Other input
  const handleOtherKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleOtherInputBlur()
    }
  }

  const handleChange = (optionValue: string, checked: boolean) => {
    let newValues: string[]

    if (checked) {
      newValues = [...currentValues, optionValue]
    } else {
      newValues = currentValues.filter((v) => v !== optionValue)
      // If unchecking "Other", clear the other input value
      if (optionValue === "Other" || optionValue === "other") {
        setOtherValue("")
      }
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
              checked={value?.split(",").includes(option.label)}
              onCheckedChange={(checked) =>
                handleChange(option.label, checked as boolean)
              }
              className="peer sr-only"
            />
            <Label
              htmlFor={`${field.name}-${option.value}`}
              className="flex items-center justify-between p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <span className="text-sm">{option.label}</span>

              {value?.split(",").includes(option.label) && (
                <SquareCheck className="w-4 h-4" />
              )}
            </Label>

            {/* Show input field when "Other" option is selected */}
            {option.label?.toLowerCase() === "other" &&
              option.value === "other" &&
              (value?.split(",").includes("Other") ||
                value.split(",").includes("other")) && (
                <Input
                  className="mt-2"
                  placeholder="Please specify"
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                  onBlur={handleOtherInputBlur}
                  onKeyDown={handleOtherKeyDown}
                />
              )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CheckboxField
