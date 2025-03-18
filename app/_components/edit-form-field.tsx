"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EUiLayout, THEME_PRESETS } from "@/lib/types"
import useEditFormPageStore from "@/store/editFormPageStore"
import useFormStore from "@/store/formStore"
import { FormField } from "@/types/FormSchema"
import {
  Edit,
  Paintbrush,
  Palette,
  Plus,
  TableOfContents,
  Text,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"

const EditFormField = () => {
  const selectedFieldConstantId = useEditFormPageStore(
    (state) => state.selectedFieldConstantId
  )
  const setSelectedFieldConstantId = useEditFormPageStore(
    (state) => state.setSelectedFieldConstantId
  )
  const {
    currentFormSchema,
    setCurrentFormSchema,
    currentFormUI,
    setCurrentFormUI,
  } = useFormStore((state) => ({
    currentFormSchema: state.currentFormSchema,
    setCurrentFormSchema: state.setCurrentFormSchema,
    currentFormUI: state.currentFormUI,
    setCurrentFormUI: state.setCurrentFormUI,
  }))
  const [editedField, setEditedField] = useState<FormField | null>(null)

  useEffect(() => {
    const filteredFormFieldSchema = currentFormSchema?.fields?.find(
      (field) => field.constantId === selectedFieldConstantId
    )
    if (filteredFormFieldSchema) {
      setEditedField({
        ...filteredFormFieldSchema,
        required: filteredFormFieldSchema.required ?? false,
      })
    } else {
      setEditedField(null)
    }
  }, [currentFormSchema, selectedFieldConstantId])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (editedField) {
      const updatedField = { ...editedField, [e.target.name]: e.target.value }
      setEditedField(updatedField)
      saveChanges(updatedField)
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    if (editedField) {
      const updatedField = { ...editedField, required: checked }
      setEditedField(updatedField)
      saveChanges(updatedField)
    }
  }

  const handleOptionsChange = (
    index: number,
    key: "label" | "value",
    value: string
  ) => {
    if (editedField && editedField.options) {
      const newOptions = [...editedField.options]
      newOptions[index] = { ...newOptions[index], [key]: value }
      const updatedField = { ...editedField, options: newOptions }
      setEditedField(updatedField)
      saveChanges(updatedField)
    }
  }

  const addOption = () => {
    if (editedField) {
      const newLabelName = `Option ${
        editedField.options?.length ? `${editedField.options?.length + 1}` : "1"
      }`
      const newValueName = `value-${
        editedField.options?.length ? `${editedField.options?.length + 1}` : "1"
      }`
      const newOptions = [
        ...(editedField.options || []),
        { label: newLabelName, value: newValueName },
      ]
      const updatedField = { ...editedField, options: newOptions }
      setEditedField(updatedField)
      saveChanges(updatedField)
    }
  }

  const removeOption = (index: number) => {
    if (editedField && editedField.options) {
      const newOptions = editedField.options.filter((_, i) => i !== index)
      const updatedField = { ...editedField, options: newOptions }
      setEditedField(updatedField)
      saveChanges(updatedField)
    }
  }

  const saveChanges = (updatedField: FormField) => {
    const updatedFields = currentFormSchema.fields.map((field) =>
      field.constantId === updatedField.constantId ? updatedField : field
    )

    setCurrentFormSchema({
      ...currentFormSchema,
      fields: updatedFields,
    })
  }

  const handleFormUIChange = (
    type: "layout" | "theme",
    value: EUiLayout | keyof typeof THEME_PRESETS
  ) => {
    if (type === "layout") {
      setCurrentFormUI({
        ...currentFormUI,
        layout: value as EUiLayout,
      })
    } else {
      setCurrentFormUI({
        ...currentFormUI,
        theme: THEME_PRESETS[value as keyof typeof THEME_PRESETS],
      })
    }
  }

  if (!editedField) {
    return (
      <section
        className={`min-w-[30%] hidden max-w-[30%] bg-[#ffff] border ml-3 rounded-md lg:flex flex-col transition-all duration-300 overflow-hidden`}
      >
        <div className="flex justify-between items-center py-2 px-3">
          <div className="flex items-center gap-2">
            <div>
              <Edit className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Edit Selected Field</span>
          </div>
        </div>
        <section className="py-4 mx-4">
          <div className="w-full min-h-[70svh] flex flex-col items-center justify-center gap-2">
            <h3 className="text-gray-500 font-semibold text-xl">
              No Field Selected
            </h3>
            <p className="text-gray-500">Create or Select a field to edit</p>
          </div>
        </section>
      </section>
    )
  }

  return (
    <section
      className={`min-w-[30%] hidden max-w-[30%] bg-[#ffff] border ml-3 rounded-md
       lg:flex flex-col transition-all duration-300 overflow-hidden`}
    >
      <Tabs defaultValue="field" className="w-full p-2">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="field" className="flex gap-2 items-center">
            <div>
              <TableOfContents className="h-5 w-5" />
            </div>
            <span>Field Content</span>
          </TabsTrigger>
          <TabsTrigger value="ui" className="flex gap-2 items-center">
            <div>
              <Palette className="h-5 w-5" />
            </div>
            <span>Form UI</span>
            <Badge>New</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="field">
          <div className="p-4 space-y-4 flex-grow overflow-y-auto max-h-[calc(100vh-190px)]">
            <section className="flex max-w-full overflow-x-auto gap-3 hide-scrollbar">
              {currentFormSchema?.fields.map((field, index) => (
                <div
                  key={field.serialId}
                  className={`flex gap-2 text-sm px-3 py-1 ${
                    selectedFieldConstantId === field.constantId
                      ? "bg-blue-200 text-spirablue border-spirablue"
                      : ""
                  } cursor-pointer border rounded-md`}
                  onClick={() => setSelectedFieldConstantId(field.constantId)}
                >
                  <span>Field</span>
                  <span> {field.serialId}</span>
                </div>
              ))}
            </section>
            <div>
              <Label className="text-gray-500" htmlFor="label">
                Label
              </Label>
              <Input
                id="label"
                name="label"
                value={editedField.label}
                onChange={handleInputChange}
              />
            </div>
            {Object.keys(editedField).includes("name") && (
              <div>
                <Label className="text-gray-500" htmlFor="name">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter a name without spaces"
                  value={editedField.name}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {Object.keys(editedField).includes("placeholder") && (
              <div>
                <Label className="text-gray-500" htmlFor="description">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={editedField.description}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {Object.keys(editedField).includes("placeholder") && (
              <div>
                <Label className="text-gray-500" htmlFor="placeholder">
                  Placeholder
                </Label>
                <Input
                  id="placeholder"
                  name="placeholder"
                  value={editedField.placeholder}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={editedField.required}
                onCheckedChange={handleCheckboxChange}
              />
              <Label className="text-gray-500" htmlFor="required">
                Required
              </Label>
            </div>
            {editedField.type === "select" ||
            editedField.type === "checkbox" ||
            editedField.type === "radio" ? (
              <div>
                <Label className="text-gray-500">Options</Label>
                {editedField.options?.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 mt-2 w-full"
                  >
                    <Input
                      placeholder="Enter a label"
                      value={option.label}
                      onChange={(e) =>
                        handleOptionsChange(index, "label", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Enter a value without spaces"
                      value={option.value}
                      onChange={(e) =>
                        handleOptionsChange(index, "value", e.target.value)
                      }
                    />
                    <div
                      onClick={() => removeOption(index)}
                      className="h-4 w-4 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </div>
                  </div>
                ))}
                <div className="flex">
                  <Button
                    variant="outline"
                    className="my-2 flex items-center gap-2"
                    onClick={addOption}
                  >
                    <div>
                      <Plus className="h-4 w-4" />
                    </div>
                    Add Option
                  </Button>
                  {(editedField.type === "checkbox" ||
                    editedField.type === "radio") &&
                    !editedField.options?.some(
                      (option) => option.label === "Other"
                    ) && (
                      <Button
                        variant="outline"
                        className="my-2 ml-2 flex items-center gap-2"
                        onClick={() => {
                          if (editedField && editedField.options) {
                            const newOptions = [
                              ...(editedField.options || []),
                              { label: "Other", value: "other" },
                            ]
                            const updatedField = {
                              ...editedField,
                              options: newOptions,
                            }
                            setEditedField(updatedField)
                            saveChanges(updatedField)
                          }
                        }}
                      >
                        <div>
                          <Text className="h-4 w-4" />
                        </div>
                        Add `Other`
                      </Button>
                    )}
                </div>
              </div>
            ) : null}

            {editedField.type === "range" && (
              <>
                <div>
                  <Label className="text-gray-500" htmlFor="min">
                    Min
                  </Label>
                  <Input
                    id="min"
                    name="min"
                    type="number"
                    value={editedField.min}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label className="text-gray-500" htmlFor="max">
                    Max
                  </Label>
                  <Input
                    id="max"
                    name="max"
                    type="number"
                    value={editedField.max}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label className="text-gray-500" htmlFor="step">
                    Step
                  </Label>
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
                  <Label className="text-gray-500" htmlFor="accept">
                    Accepted File Types
                  </Label>
                  <Input
                    id="accept"
                    name="accept"
                    value={editedField.accept}
                    onChange={handleInputChange}
                    placeholder=".pdf,.doc,.docx"
                  />
                </div>
                <div>
                  <Label className="text-gray-500" htmlFor="maxSize">
                    Max File Size (in bytes)
                  </Label>
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
          </div>
        </TabsContent>
        <TabsContent value="ui">
          <div className="p-4 space-y-4 flex-grow overflow-y-auto max-h-[calc(100vh-190px)]">
            <section>
              <Label className="text-gray-500" htmlFor="label">
                Choose Layout
              </Label>
              <div className="flex gap-4 mt-2">
                <Button
                  variant={
                    currentFormUI?.layout === EUiLayout.DEFAULT
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    handleFormUIChange("layout", EUiLayout.DEFAULT)
                  }
                >
                  All In One
                </Button>
                <Button
                  variant={
                    currentFormUI?.layout === EUiLayout.ONE_BY_ONE
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    handleFormUIChange("layout", EUiLayout.ONE_BY_ONE)
                  }
                >
                  One By One
                </Button>
              </div>
            </section>
            {/* <section>
              <Label className="text-gray-500" htmlFor="label">
                Choose Theme
              </Label>
              <div className="flex gap-4 mt-2">
                {currentFormUI?.availableThemes?.map((theme) => (
                  <Button
                    key={theme.name}
                    variant={
                      currentFormUI?.theme?.name === theme.name
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleFormUIChange(
                        "theme",
                        theme.name as keyof typeof THEME_PRESETS
                      )
                    }
                  >
                    {theme.name.charAt(0) + theme.name.slice(1).toLowerCase()}
                  </Button>
                ))}
              </div>
            </section> */}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default EditFormField
