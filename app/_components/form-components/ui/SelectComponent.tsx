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

type SelectComponentProps = {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
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
}) => {
  return (
    <div className={cn(classname, "flex flex-col gap-2")}>
      <Label htmlFor={name}>{label}</Label>
      <Select name={name} value={value} onValueChange={onChange}>
        <SelectTrigger id={name} className={cn(triggerClassName, "")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectComponent;
