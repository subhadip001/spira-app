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
  // Ensure value is never undefined
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
            label={field.label}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            value={safeValue}
            onChange={handleChange}
          />
        </div>
      );
    case "textarea":
      return (
        <div>
          <TextAreaComponent
            label={field.label}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            value={safeValue}
            onChange={handleChange}
          />
        </div>
      );
    case "select":
      return (
        <div>
          <SelectComponent
            label={field.label}
            name={field.name}
            options={field.options || []}
            value={safeValue}
            placeholder={field.placeholder}
            onChange={handleChange}
          />
        </div>
      );
    case "checkbox":
      return (
        <div>
          <CheckboxField
            field={{
              name: field.name,
              value: safeValue,
              onChange: handleChange,
            }}
            label={field.label}
            options={field.options || []}
          />
        </div>
      );
    case "radio":
      return (
        <div>
          <RadioField
            field={{
              name: field.name,
              value: safeValue,
              onChange: handleChange,
            }}
            label={field.label}
            options={field.options || []}
          />
        </div>
      );
    case "file":
      return (
        <div>
          <InputComponent
            type="file"
            accept={accept}
            label={field.label}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            onChange={handleChange}
            maxSize={maxSize}
            // File inputs can't be controlled, so we don't pass a value prop
          />
        </div>
      );
    case "range":
      return (
        <div>
          <SliderField
            field={{
              name: field.name,
              value: parseFloat(safeValue) || 0,
              onChange: (newValue) => handleChange(newValue.toString()),
            }}
            label={field.label}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        </div>
      );
    default:
      return null;
  }
};
