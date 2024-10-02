import React from "react";
import { Slider } from "@/components/ui/slider";
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
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Slider
        id={field.name}
        min={min}
        max={max}
        step={step}
        value={[field.value]}
        onValueChange={(values) => field.onChange(values[0])}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-gray-500">
        <span>{min}</span>
        <span>{field.value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default SliderField;
