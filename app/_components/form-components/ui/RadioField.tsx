import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FormField, FormFieldOption } from "@/types/FormSchema"
import { CircleCheck } from "lucide-react"
import React, { useState, useEffect } from "react"
import { LabelComponent } from "./LabelComponent"
import { Input } from "@/components/ui/input"

interface RadioFieldProps {
  field: FormField
  value: string
  onChange: (value: string) => void
}

const RadioField: React.FC<RadioFieldProps> = ({ field, value, onChange }) => {
  // Extract the "Other" value from the current value if it exists
  const extractOtherValue = () => {
    return value.startsWith("Other: ") ? value.substring(7) : ""
  }

  // Check if "Other" is selected
  const isOtherSelected =
    value === "Other" || value === "other" || value.startsWith("Other: ")

  // Initialize otherValue from the current value if it exists
  const [otherValue, setOtherValue] = useState<string>(extractOtherValue())

  // Update the parent value only when the input loses focus
  const handleOtherInputBlur = () => {
    if (isOtherSelected && otherValue) {
      // Store the custom value as "Other: {custom value}"
      onChange(`Other: ${otherValue}`)
    }
  }

  // Handle key press events for the Other input
  const handleOtherKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleOtherInputBlur()
    }
  }

  const handleChange = (newValue: string) => {
    // If changing from "Other" to something else, clear the other input
    if (value === "Other" && newValue !== "Other") {
      setOtherValue("")
    }
    onChange(newValue)
  }

  return (
    <div className="flex flex-col gap-4">
      <LabelComponent field={field} />
      {field.description && (
        <p className="text-sm text-gray-500">{field.description}</p>
      )}
      <RadioGroup value={value} onValueChange={handleChange} className="">
        {field.options?.map((option: FormFieldOption, index: number) => (
          <div key={option.value + index} className="relative">
            <RadioGroupItem
              id={`${field.name}-${option.value}`}
              value={option.label}
              className="peer sr-only "
            />
            <Label
              htmlFor={`${field.name}-${option.value}`}
              className={`flex items-center justify-between p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all`}
            >
              <span className="text-sm">{option.label}</span>
              {value === option.label && <CircleCheck className="w-4 h-4" />}
            </Label>

            {/* Show input field when "Other" option is selected */}
            {option.label.toLowerCase() === "other" &&
              value.toLowerCase() === "other" && (
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
      </RadioGroup>
    </div>
  )
}

export default RadioField
