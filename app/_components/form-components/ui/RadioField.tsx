import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Required } from "./Required";

interface RadioFieldProps {
  field: {
    name: string;
    value: string;
    onChange: (value: string) => void;
  };
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

const selectedThemePrimaryColor = "#007bff";

const RadioField: React.FC<RadioFieldProps> = ({
  field,
  label,
  required,
  options,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Label className="flex items-center gap-1">
        {label}
        {required && <Required />}
      </Label>
      <RadioGroup
        value={field.value}
        onValueChange={field.onChange}
        className=""
      >
        {options.map((option, index) => (
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
  );
};

export default RadioField;
