import React from "react";
import { Label } from "@/components/ui/label";
import { Required } from "./Required";
import { FormField } from "@/types/FormSchema";
import { LabelComponent } from "./LabelComponent";

interface SliderFieldProps {
  field: FormField;
  value: number;
  onChange: (value: number) => void;
}

const SliderField: React.FC<SliderFieldProps> = ({
  field,
  value,
  onChange,
}) => {
  const percentage =
    ((value - (field.min ?? 0)) / ((field.max ?? 100) - (field.min ?? 0))) *
    100;

  return (
    <div className="flex flex-col gap-4">
      <LabelComponent field={field} />
      <div className="relative w-full h-10">
        <div className="absolute top-0 left-0 w-full h-10 rounded-md bg-gray-300"></div>
        <div
          className="absolute top-0 left-0 h-10 rounded-md bg-gray-700"
          style={{ width: `${percentage}%` }}
        ></div>

        <input
          type="range"
          id={field.name}
          name={field.name}
          min={field.min ?? 0}
          max={field.max ?? 100}
          step={field.step ?? 1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute top-0 left-0 w-full h-10 opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{field.min}</span>
        <span>{value}</span>
        <span>{field.max}</span>
      </div>
    </div>
  );
};

export default SliderField;
