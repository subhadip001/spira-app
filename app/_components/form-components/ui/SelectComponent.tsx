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
import { FormField } from "@/types/FormSchema";
import { LabelComponent } from "./LabelComponent";

type SelectComponentProps = {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  classname?: string;
  triggerClassName?: string;
};

const SelectComponent: React.FC<SelectComponentProps> = ({
  field,
  value,
  onChange,
  classname,
  triggerClassName,
}) => {
  return (
    <div className={cn(classname, "flex flex-col gap-4")}>
      <LabelComponent field={field} />
      <Select name={field.name} value={value} onValueChange={onChange}>
        <SelectTrigger id={field.name} className={cn(triggerClassName, "")}>
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option, index) => (
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
