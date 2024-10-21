import React, { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormField } from "@/types/FormSchema"
import { LabelComponent } from "./LabelComponent"

type DatePickerComponentProps = {
  field: FormField
  value: string
  onChange: (value: string) => void
}

function DatePickerComponent({
  field,
  value,
  onChange,
}: DatePickerComponentProps) {
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  )

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      onChange(newDate.toISOString().split("T")[0])
    } else {
      onChange("")
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default function DateFieldComponent({
  field,
  value,
  onChange,
}: DatePickerComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <LabelComponent field={field} />
      {field.description && (
        <p className="text-sm text-gray-500">{field.description}</p>
      )}
      <DatePickerComponent field={field} value={value} onChange={onChange} />
    </div>
  )
}
