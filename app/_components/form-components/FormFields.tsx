import React from "react";
import InputComponent from "./ui/InputComponent";
import TextAreaComponent from "./ui/TextAreaComponent";
import SelectComponent from "./ui/SelectComponent";
import CheckboxField from "./ui/CheckboxComponent";
import RadioField from "./ui/RadioField";
import SliderField from "./ui/SliderField";
import { FormField } from "@/types/FormSchema";

interface FormFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  maxSize?: string;
}

export const FormFieldComponent: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  accept,
  maxSize,
}) => {
  const safeValue = value ?? "";

  const handleChange = (newValue: string | number) => {
    onChange(newValue?.toString() ?? "");
  };

  switch (field.type) {
    case "text":
    case "email":
    case "tel":
      return (
        <div>
          <InputComponent
            field={field}
            value={safeValue}
            onChange={handleChange}
          />
        </div>
      );
    case "textarea":
      return (
        <div>
          <TextAreaComponent
            field={field}
            value={safeValue}
            onChange={handleChange}
          />
        </div>
      );
    case "select":
      return (
        <div>
          <SelectComponent
            field={field}
            value={safeValue}
            onChange={handleChange}
          />
        </div>
      );
    case "checkbox":
      return (
        <div>
          <CheckboxField
            field={field}
            value={safeValue}
            onChange={handleChange}
          />
        </div>
      );
    case "radio":
      return (
        <div>
          <RadioField
            field={field}
            value={safeValue}
            onChange={handleChange}
          />
        </div>
      );
    case "file":
      return (
        <div>
          <InputComponent
            field={field}
            accept={accept}
            onChange={handleChange}
            maxSize={maxSize}
          />
        </div>
      );
    case "range":
      return (
        <div>
          <SliderField
            field={field}
            value={parseFloat(safeValue) || 0}
            onChange={(newValue: number) => handleChange(newValue)}
          />
        </div>
      );
    default:
      return null;
  }
};
