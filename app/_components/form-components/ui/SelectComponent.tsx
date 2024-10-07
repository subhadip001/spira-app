import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Required } from "./Required";

type SelectComponentProps = {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  classname?: string;
  triggerClassName?: string;
};

const SelectComponent: React.FC<SelectComponentProps> = ({
  label,
  name,
  options,
  value,
  placeholder,
  onChange,
  classname,
  triggerClassName,
  required,
}) => {
  return (
    <div className={cn(classname, "flex flex-col gap-4")}>
      <Label htmlFor={name} className="flex items-center gap-1">
        {label} {required && <Required />}
      </Label>
      <Select name={name} value={value} onValueChange={onChange}>
        <SelectTrigger id={name} className={cn(triggerClassName, "")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem
              key={index}
              value={option.value.length > 0 ? option.value : `-${index}-`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectComponent;
