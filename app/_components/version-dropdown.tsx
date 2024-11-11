"use client"

import useFormVersionStore from "@/store/formVersions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useEditFormPageStore from "@/store/editFormPageStore"

const VersionDropdown = ({ formId }: { formId: string }) => {
  const formVersionsData = useFormVersionStore(
    (state) => state.formVersionsData
  )
  const { selectedFormVersion, setSelectedFormVersion } = useFormVersionStore(
    (state) => ({
      selectedFormVersion: state.selectedFormVersion,
      setSelectedFormVersion: state.setSelectedFormVersion,
    })
  )

  const setSelectedFieldConstantId = useEditFormPageStore(
    (state) => state.setSelectedFieldConstantId
  )

  // useEffect(() => {
  //   if (formVersionsData?.length === 1) {
  //     setSelectedFormVersion(formVersionsData[0])
  //   } else if (
  //     formVersionsData &&
  //     formVersionsData.length > 0 &&
  //     !selectedFormVersion?.version_number
  //   ) {
  //     setSelectedFormVersion(formVersionsData[0])
  //   }
  // }, [formVersionsData, setSelectedFormVersion])

  const getConstantIdForFirstField = (formSchemaString: string) => {
    const jsonFormSchema = JSON.parse(formSchemaString as string)
    const constantId = jsonFormSchema.fields[0].constantId
    return constantId
  }

  const handleVersionChange = (value: string) => {
    const selectedVersion = formVersionsData.find(
      (version) => version.version_number === Number(value)
    )
    if (selectedVersion) {
      setSelectedFormVersion(selectedVersion)
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "selected-form-version",
          JSON.stringify(selectedVersion)
        )
      }
      setSelectedFieldConstantId(
        getConstantIdForFirstField(selectedVersion.form_schema_string)
      )
    }
  }

  return (
    <Select
      value={selectedFormVersion?.version_number?.toString() || ""}
      onValueChange={(value) => {
        handleVersionChange(value)
      }}
    >
      <SelectTrigger className="flex gap-2">
        <SelectValue placeholder="Select version" />
      </SelectTrigger>
      <SelectContent>
        {formVersionsData.map((version) => (
          <SelectItem
            key={version.version_number}
            value={version.version_number?.toString() || ""}
          >
            v{version.version_number}
          </SelectItem>
        ))}
        {formVersionsData.length === 0 && (
          <SelectItem value="no-version-available">No Version</SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}

export default VersionDropdown
