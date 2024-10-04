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
    <div className="flex flex-col gap-4">
      <Label>{label}</Label>
      <div className="space-y-1">
        {options.map((option) => (
          <div key={option.value} className="relative">
            <Checkbox
              id={`${field.name}-${option.value}`}
              checked={field.value?.split(",").includes(option.value)}
              onCheckedChange={(checked) =>
                handleChange(option.value, checked as boolean)
              }
              className="peer sr-only"
            />
            <Label
              htmlFor={`${field.name}-${option.value}`}
              className="flex items-center justify-between p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxField;
