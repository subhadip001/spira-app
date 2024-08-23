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
}

export const FormFieldComponent: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
}) => {
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
            value={value}
            onChange={onChange}
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
            value={value}
            onChange={onChange}
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
            value={value}
            placeholder={field.placeholder}
            onChange={onChange}
          />
        </div>
      );
    case "checkbox":
      return (
        <div>
          <CheckboxField
            field={{
              name: field.name,
              value: value,
              onChange: (value) => onChange(value),
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
              value: value,
              onChange: (value) => onChange(value),
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
            label={field.label}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  onChange(e.target?.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
      );
    case "range":
      return (
        <div>
          <SliderField
            field={{
              name: field.name,
              value: parseFloat(value) || 0,
              onChange: (newValue) => onChange(newValue.toString()),
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
