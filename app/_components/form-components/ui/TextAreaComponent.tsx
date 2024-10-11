import React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Required } from "./Required"
import { FormField } from "@/types/FormSchema"
import { LabelComponent } from "./LabelComponent"

type TextAreaComponentProps = {
  field: FormField
  value: string
  onChange: (value: string) => void
  classname?: string
}

const TextAreaComponent: React.FC<TextAreaComponentProps> = ({
  field,
  value,
  onChange,
  classname,
}) => {
  return (
    <div className={cn(classname, "flex flex-col gap-4")}>
      <LabelComponent field={field} />
      {field.description && (
        <p className="text-sm text-gray-500">{field.description}</p>
      )}
      <Textarea
        name={field.name}
        id={field.name}
        placeholder={field.placeholder}
        value={value}
        cols={30}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default TextAreaComponent
