import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioFieldProps {
  field: {
    name: string;
    value: string;
    onChange: (value: string) => void;
  };
  label: string;
  options: { value: string; label: string }[];
}

const RadioField: React.FC<RadioFieldProps> = ({ field, label, options }) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <RadioGroup
        value={field.value}
        onValueChange={field.onChange}
        className=""
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              id={`${field.name}-${option.value}`}
              value={option.value}
            />
            <Label htmlFor={`${field.name}-${option.value}`}>
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RadioField;
