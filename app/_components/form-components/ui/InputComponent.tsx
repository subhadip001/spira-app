import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";

type InputComponentProps = {
  label: string;
  type: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange: (value : any) => void;
  classname?: string;
};

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  type,
  name,
  placeholder,
  required,
  value,
  onChange,
  classname,
}) => {
  return (
    <div className={cn(classname, "")}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default InputComponent;
