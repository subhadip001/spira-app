import React from "react";
import { Label } from "@/components/ui/label";

interface SliderFieldProps {
  field: {
    name: string;
    value: number;
    onChange: (value: number) => void;
  };
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

const SliderField: React.FC<SliderFieldProps> = ({
  field,
  label,
  min = 0,
  max = 100,
  step = 1,
}) => {
  const percentage = ((field.value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor={field.name}>{label}</Label>
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
          min={min}
          max={max}
          step={step}
          value={field.value}
          onChange={(e) => field.onChange(Number(e.target.value))}
          className="absolute top-0 left-0 w-full h-10 opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{min}</span>
        <span>{field.value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default SliderField;
