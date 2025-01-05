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
import { TFormVersionData } from "@/lib/types"
import { switchToNearestFormVersion } from "@/lib/form-lib/utils"

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

  const handleVersionChange = (value: string) => {
    const selectedVersion = formVersionsData.find(
      (version) => version.version_number === Number(value)
    )
    if (selectedVersion) {
      setSelectedFormVersion(selectedVersion)
    }
  }

  const deleteFormVersionMutation = useMutation({
    mutationFn: (version: TFormVersionData) =>
      deleteFormVersionById(version.id),
    onSuccess: (data, variables) => {
      if (data.error) {
        console.error(data.error)
      } else {
        toast.success("Form version deleted successfully")
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.GetFormVersions, formId],
        })

        if (selectedFormVersion?.version_number !== variables.version_number) {
          return
        }

        const nearestVersionNumber = switchToNearestFormVersion(
          formVersionsData,
          variables.version_number
        )
        const nearestVersion = formVersionsData.find(
          (version) => version.version_number === nearestVersionNumber
        )

        setSelectedFormVersion(nearestVersion as TFormVersionData)
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
        {formVersionsData.map((version, index, data) => (
          <div className="flex" key={index}>
            <SelectItem
              key={version.version_number}
              value={version.version_number?.toString() || ""}
              className="flex gap-2 w-full"
            >
              <span>v{version.version_number}</span>
            </SelectItem>
            {data.length > 1 && (
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
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete{" "}
                      <b>Version {version.version_number}</b> of this form. This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteFormVersionMutation.mutate(version)}
                      className="bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
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
