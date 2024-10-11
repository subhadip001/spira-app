import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import React from "react"
import FileInput from "./file-input"
import { Required } from "./Required"
import { FormField } from "@/types/FormSchema"
import { LabelComponent } from "./LabelComponent"

type InputComponentProps = {
  field: FormField
  value?: string
  onChange: (value: string) => void
  className?: string
  accept?: string
  maxSize?: string
}

const InputComponent: React.FC<InputComponentProps> = ({
  field,
  value,
  onChange,
  className,
  accept,
  maxSize,
}) => {
  return (
    <div className={cn(className, "flex flex-col gap-4")}>
      <LabelComponent field={field} />
      {field.description && (
        <p className="text-sm text-gray-500">{field.description}</p>
      )}
      {field.type === "file" ? (
        <FileInput
          name={field.name}
          id={field.name}
          placeholder={field.placeholder}
          required={field.required}
          onChange={(e) => onChange(e)}
          className="hidden"
          accept={accept}
          maxSize={(maxSize as string) ?? "5242880"}
        />
      ) : (
        <Input
          type={field.type}
          name={field.name}
          className={cn("")}
          id={field.name}
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

export default InputComponent
