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
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteFormVersionById, QueryKeys } from "@/lib/queries"
import { Trash2 } from "lucide-react"
import { Fragment } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import toast from "react-hot-toast"

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

  const queryClient = useQueryClient()

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

  const deleteFormVersionMutation = useMutation({
    mutationFn: (formVersionId: string) => deleteFormVersionById(formVersionId),
    onSuccess: (data) => {
      if (data.error) {
        console.error(data.error)
      } else {
        console.log("Form version deleted successfully")
        toast.success("Form version deleted successfully")
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.GetFormVersions, formId],
        })
      }
    },
  })

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
          <div className="flex" key={version.version_number}>
            <SelectItem
              key={version.version_number}
              value={version.version_number?.toString() || ""}
              className="flex gap-2 w-full"
            >
              <span>v{version.version_number}</span>
            </SelectItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-xs text-red-500 px-1 rounded-md hover:bg-red-100">
                  <div>
                    <Trash2 className="w-4 h-4" />
                  </div>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete{" "}
                    <b>Version {version.version_number}</b> of this form. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteFormVersionMutation.mutate(version.id)}
                    className="bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}

        {formVersionsData.length === 0 && (
          <SelectItem value="no-version-available">No Version</SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}

export default VersionDropdown
