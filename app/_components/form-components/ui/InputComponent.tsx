import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";
import FileInput from "./file-input";

type InputComponentProps = {
  label: string;
  type: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange: (value: any) => void;
  className?: string;
  accept?: string;
  maxSize?: string;
};

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  type,
  name,
  placeholder,
  required,
  value,
  onChange,
  className,
  accept,
  maxSize,
}) => {
  return (
    <div className={cn(className, "")}>
      <Label htmlFor={name} className="text-gray-500">
        {label}
      </Label>
      {type === "file" ? (
        <FileInput
          name={name}
          id={name}
          placeholder={placeholder}
          required={required}
          onChange={(e) => onChange(e)}
          className="hidden"
          accept={accept}
          maxSize={(maxSize as string) ?? "5242880"}
        />
      ) : (
        <Input
          type={type}
          name={name}
          className={cn("")}
          id={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default InputComponent;
