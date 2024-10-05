import React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type TextAreaComponentProps = {
  label: string;
  type: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  classname?: string;
};

const TextAreaComponent: React.FC<TextAreaComponentProps> = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  classname,
  required,
}) => {
  return (
    <div className={cn(classname, "flex flex-col gap-4")}>
      <Label htmlFor={name} className="">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        cols={30}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TextAreaComponent;
