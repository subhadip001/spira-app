import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Required } from "./Required";
import { FormField, FormFieldOption } from "@/types/FormSchema";
import { LabelComponent } from "./LabelComponent";

interface CheckboxFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  value,
  onChange,
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    const currentValues = value ? value?.split(",").filter(Boolean) : [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter((v) => v !== optionValue);
    }

    onChange(newValues?.join(","));
  };

  return (
    <div className="flex flex-col gap-4">
      <LabelComponent field={field} />
      <div className="space-y-1">
        {field.options?.map((option: FormFieldOption) => (
          <div key={option.value} className="relative">
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
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxField;
