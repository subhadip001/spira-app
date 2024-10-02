import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxFieldProps {
  field: {
    name: string;
    value: string;
    onChange: (value: string) => void;
  };
  label: string;
  options: { value: string; label: string }[];
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  label,
  options,
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    const currentValues = field.value
      ? field.value?.split(",").filter(Boolean)
      : [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter((value) => value !== optionValue);
    }

    field.onChange(newValues?.join(","));
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="space-y-1">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${field.name}-${option.value}`}
              checked={field.value?.split(",").includes(option.value)}
              onCheckedChange={(checked) =>
                handleChange(option.value, checked as boolean)
              }
            />
            <Label htmlFor={`${field.name}-${option.value}`}>
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxField;
