"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import useAppStore from "@/store/appStore";
import useFormStore from "@/store/formStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type FieldOption = {
  label: string;
  value: string;
};

type FormField = {
  constantId: number;
  serialId: number;
  type: string;
  label: string;
  name: string;
  required: boolean;
  options?: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  maxSize?: string;
};

const EditFormField = () => {
  const editFormSideBarOpen = useAppStore((state) => state.editFormSideBarOpen);
  const setIsEditFormSideBarOpen = useAppStore(
    (state) => state.setIsEditFormSideBarOpen
  );
  const currentFormSchema = useFormStore((state) => state.currentFormSchema);
  const setCurrentFormSchema = useFormStore(
    (state) => state.setCurrentFormSchema
  );

  const [editedField, setEditedField] = useState<FormField | null>(null);

  useEffect(() => {
    const filteredFormFieldSchema = currentFormSchema.fields.find(
      (field) => field.constantId === editFormSideBarOpen.fieldConstantId
    );
    if (filteredFormFieldSchema) {
      setEditedField({
        ...filteredFormFieldSchema,
        required: filteredFormFieldSchema.required ?? false,
      });
    } else {
      setEditedField(null);
    }
  }, [currentFormSchema, editFormSideBarOpen.fieldConstantId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (editedField) {
      setEditedField({ ...editedField, [e.target.name]: e.target.value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedField) {
      setEditedField({ ...editedField, [e.target.name]: e.target.checked });
    }
  };

  const handleOptionsChange = (
    index: number,
    key: "label" | "value",
    value: string
  ) => {
    if (editedField && editedField.options) {
      const newOptions = [...editedField.options];
      newOptions[index] = { ...newOptions[index], [key]: value };
      setEditedField({ ...editedField, options: newOptions });
    }
  };

  const addOption = () => {
    if (editedField) {
      const newOptions = [
        ...(editedField.options || []),
        { label: "", value: "" },
      ];
      setEditedField({ ...editedField, options: newOptions });
    }
  };

  const removeOption = (index: number) => {
    if (editedField && editedField.options) {
      const newOptions = editedField.options.filter((_, i) => i !== index);
      setEditedField({ ...editedField, options: newOptions });
    }
  };

  const handleSave = () => {
    if (editedField) {
      const updatedFields = currentFormSchema.fields.map((field) =>
        field.constantId === editedField.constantId ? editedField : field
      );
      setCurrentFormSchema({ ...currentFormSchema, fields: updatedFields });
      setIsEditFormSideBarOpen({
        isEditFormSideBarOpen: false,
        fieldConstantId: 0,
      });
    }
  };

  if (!editedField) {
    return null;
  }

  return (
    <section
      className={`${
        editFormSideBarOpen.isEditFormSideBarOpen
          ? "min-w-[25%] max-w-[25%] bg-primary/5 ml-3 rounded-md"
          : "min-w-0 max-w-0"
      } flex flex-col transition-all duration-300 overflow-hidden`}
    >
      <div className="flex justify-between items-center py-3 px-3 border-b">
        <span className="text-lg font-semibold">Edit Selected Field</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setIsEditFormSideBarOpen({
              isEditFormSideBarOpen: false,
              fieldConstantId: 0,
            })
          }
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            name="label"
            value={editedField.label}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={editedField.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            name="required"
            checked={editedField.required}
            onCheckedChange={(checked) =>
              setEditedField({ ...editedField, required: checked })
            }
          />
          <Label htmlFor="required">Required</Label>
        </div>
        {editedField.type === "select" ||
        editedField.type === "checkbox" ||
        editedField.type === "radio" ? (
          <div>
            <Label>Options</Label>
            {editedField.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Input
                  placeholder="Label"
                  value={option.label}
                  onChange={(e) =>
                    handleOptionsChange(index, "label", e.target.value)
                  }
                />
                <Input
                  placeholder="Value"
                  value={option.value}
                  onChange={(e) =>
                    handleOptionsChange(index, "value", e.target.value)
                  }
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeOption(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="mt-2" onClick={addOption}>
              Add Option
            </Button>
          </div>
        ) : null}
        {editedField.type === "range" && (
          <>
            <div>
              <Label htmlFor="min">Min</Label>
              <Input
                id="min"
                name="min"
                type="number"
                value={editedField.min}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="max">Max</Label>
              <Input
                id="max"
                name="max"
                type="number"
                value={editedField.max}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="step">Step</Label>
              <Input
                id="step"
                name="step"
                type="number"
                value={editedField.step}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        {editedField.type === "file" && (
          <>
            <div>
              <Label htmlFor="accept">Accepted File Types</Label>
              <Input
                id="accept"
                name="accept"
                value={editedField.accept}
                onChange={handleInputChange}
                placeholder=".pdf,.doc,.docx"
              />
            </div>
            <div>
              <Label htmlFor="maxSize">Max File Size (in bytes)</Label>
              <Input
                id="maxSize"
                name="maxSize"
                type="number"
                value={editedField.maxSize}
                onChange={handleInputChange}
                placeholder="5242880"
              />
            </div>
          </>
        )}
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </section>
  );
};

export default EditFormField;
