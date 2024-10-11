import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { FieldType } from "@/types/FormSchema"
import {
  Mail,
  Phone,
  Plus,
  Radio,
  Type,
  Text,
  File,
  ListChecks,
  SquareChevronDown,
  SlidersHorizontal,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"

interface AddFieldSelectorProps {
  onAddField: (type: FieldType) => void
}

const FieldTypeIcon = ({ type }: { type: FieldType }) => {
  switch (type) {
    case FieldType.TEXT:
      return <Type className="h-4 w-4" />
    case FieldType.TEXTAREA:
      return <Text className="h-4 w-4" />
    case FieldType.TEL:
      return <Phone className="h-4 w-4" />
    case FieldType.EMAIL:
      return <Mail className="h-4 w-4" />
    case FieldType.CHECKBOX:
      return <ListChecks className="h-4 w-4" />
    case FieldType.RADIO:
      return <Radio className="h-4 w-4" />
    case FieldType.SELECT:
      return <SquareChevronDown className="h-4 w-4" />
    case FieldType.FILE:
      return <File className="h-4 w-4" />
    case FieldType.RANGE:
      return <SlidersHorizontal className="h-4 w-4" />
    default:
      return null
  }
}

const FieldTypeLabel = ({ type }: { type: FieldType }) => {
  switch (type) {
    case FieldType.TEXT:
      return "Short Text"
    case FieldType.TEXTAREA:
      return "Long Text"
    case FieldType.TEL:
      return "Phone Number"
    case FieldType.EMAIL:
      return "Email"
    case FieldType.CHECKBOX:
      return "Multiple Choice"
    case FieldType.RADIO:
      return "Single Choice"
    case FieldType.SELECT:
      return "Dropdown"
    case FieldType.FILE:
      return "File Upload"
    case FieldType.RANGE:
      return "Slider"
    default:
      return ""
  }
}

const AddFieldSelector: React.FC<AddFieldSelectorProps> = ({ onAddField }) => {
  const fieldTypes = Object.values(FieldType)
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType | null>(
    null
  )

  return (
    <Dialog>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="h-[4vh] border-l border-dashed"></div>
        <DialogTrigger asChild>
          <div className="border cursor-pointer border-dashed rounded-md p-2 flex items-center gap-2 hover:bg-gray-100">
            <div className="">
              <Plus className="h-4 w-4" />
            </div>
            <span className="text-sm">Add New Field</span>
          </div>
        </DialogTrigger>
        <div className="h-[4vh] border-l border-dashed"></div>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Field Type</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {fieldTypes.map((type, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedFieldType(type)
              }}
              className={`flex items-center gap-2 cursor-pointer
                 ${selectedFieldType === type ? "border-spirablue bg-blue-200 text-spirablue" : "border-gray-200"} 
                 px-6 py-4 rounded-md border`}
            >
              <FieldTypeIcon type={type} />
              <FieldTypeLabel type={type} />
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                if (selectedFieldType) {
                  onAddField(selectedFieldType)
                }
              }}
              variant="default"
              className="w-full"
            >
              Add Field
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddFieldSelector
