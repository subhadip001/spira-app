"use client"
import { RainbowButton } from "@/components/magicui/rainbow-button"
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
import { addNewFormVersion, QueryKeys } from "@/lib/queries"
import useAppStore from "@/store/appStore"
import useEditFormPageStore from "@/store/editFormPageStore"
import useFormStore from "@/store/formStore"
import useFormVersionStore from "@/store/formVersions"
import {
  Eye,
  Monitor,
  Pencil,
  Save,
  Smartphone,
  Sparkles,
  SquareArrowUpRight,
  Tablet,
  WandSparkles,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import React, { useState } from "react"
import GenerateForm from "./generate-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AddNewFormVersionVariables } from "@/lib/types"
import toast from "react-hot-toast"
import VersionDropdown from "./version-dropdown"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import FormBuilder from "./form-components/FormBuilder"

type EditFormProps = {
  baseQuery: string
  baseFormId: string
  needToGenerateFormSchema: boolean
}

const EditForm: React.FC<EditFormProps> = ({
  baseQuery,
  baseFormId,
  needToGenerateFormSchema,
}) => {
  const [selectedViewport, setSelectedViewport] = useState<
    "phone" | "tablet" | "desktop"
  >("desktop")

  const currentFormSchema = useFormStore((state) => state.currentFormSchema)
  const user = useAppStore((state) => state.user)
  const router = useRouter()
  const pathName = usePathname()
  const formId = pathName.split("/")[2]

  const queryClient = useQueryClient()

  const selectedFieldConstantId = useEditFormPageStore(
    (state) => state.selectedFieldConstantId
  )
  const setSelectedFieldConstantId = useEditFormPageStore(
    (state) => state.setSelectedFieldConstantId
  )
  const isViewAsPublished = useEditFormPageStore(
    (state) => state.isViewAsPublished
  )
  const setIsViewAsPublished = useEditFormPageStore(
    (state) => state.setIsViewAsPublished
  )
  const selectedFormVersion = useFormVersionStore(
    (state) => state.selectedFormVersion
  )
  const setSelectedFormVersion = useFormVersionStore(
    (state) => state.setSelectedFormVersion
  )
  const formVersionsData = useFormVersionStore(
    (state) => state.formVersionsData
  )

  const handlePublish = () => {
    if (!user) {
      router.push(`/login?${formId ? `formId=${formId}` : ""}`)
      return
    }
    console.log("Publishing form...")
    console.log(currentFormSchema)
  }

  const addNewFormversionMutation = useMutation({
    mutationFn: (variables: AddNewFormVersionVariables) =>
      addNewFormVersion(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GetFormVersions, baseFormId],
      })
      toast.success("Form version added successfully")
    },
    onError: (error: Error) => {
      console.error("Error adding new form version", error)
    },
  })
  return (
    <section className="relative flex-grow flex flex-col items-center gap-2 h-[calc(100svh-64px)] py-2 px-3 bg-[#f6f6f6df] rounded-md min-w-0">
      <div className="flex flex-col mmd:flex-row px-3 justify-between mmd:items-center w-full rounded-md mmd:h-[7vh] gap-2 mmd:gap-5">
        <div className="flex items-center w-full gap-2 bg-[#ffff] border px-3 py-2 rounded-md">
          <div>
            <Sparkles className="h-4 w-4 text-[#6b6b6b]" />
          </div>
          <div className="flex-grow">
            <span className="mx-auto line-clamp-1 text-[1.1rem] text-[#6b6b6b] capitalize">
              {baseQuery}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <VersionDropdown />
          <div className="bg-white h-full border rounded-md flex gap-2 p-1">
            <Dialog>
              <DialogTrigger>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`p-2 cursor-pointer rounded border border-gray-200 ${
                          isViewAsPublished ? "bg-gray-200" : ""
                        }`}
                      >
                        <div>
                          <Eye className="h-4 w-4" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>View as Published</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTrigger>
              <DialogContent className="max-w-[80vw]">
                <div className="w-full h-[80svh] overflow-y-auto">
                  <FormBuilder
                    initialSchema={currentFormSchema}
                    published={true}
                    editable={false}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="bg-white h-full border rounded-md flex gap-2 p-1">
            <div
              className={`p-2 cursor-pointer ${
                selectedViewport === "desktop" ? "bg-gray-200" : ""
              } rounded`}
              onClick={() => setSelectedViewport("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </div>
            <div
              className={`p-2 cursor-pointer ${
                selectedViewport === "tablet" ? "bg-gray-200" : ""
              } rounded`}
              onClick={() => setSelectedViewport("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </div>
            <div
              className={`p-2 cursor-pointer ${
                selectedViewport === "phone" ? "bg-gray-200" : ""
              } rounded`}
              onClick={() => setSelectedViewport("phone")}
            >
              <Smartphone className="h-4 w-4" />
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger>
              <div className="flex items-center gap-2 border rounded-md py-2 px-3 bg-white">
                <div>
                  <Save className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Save</span>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save changes to the form?</AlertDialogTitle>
                <AlertDialogDescription>
                  You can save the changes to the form as a new version or
                  overwrite the current version.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    addNewFormversionMutation.mutate({
                      formSchemaString: JSON.stringify(currentFormSchema),
                      baseFormId: baseFormId,
                      query: selectedFormVersion?.query || "N/A",
                      version: (formVersionsData?.length || 1) + 1,
                    })
                  }}
                >
                  Save as New Version
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={() => {
                    addNewFormversionMutation.mutate({
                      formSchemaString: JSON.stringify(currentFormSchema),
                      baseFormId: baseFormId,
                      query: selectedFormVersion?.query || "N/A",
                      version: selectedFormVersion?.version_number || 1,
                    })
                  }}
                >
                  Save as current version
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <RainbowButton
            type="button"
            className="flex items-center gap-2"
            onClick={handlePublish}
          >
            Publish
            <div>
              <SquareArrowUpRight className="h-4 w-4" />
            </div>
          </RainbowButton>
        </div>
      </div>
      <div className="flex w-full justify-center items-center h-[calc(90svh-128px)]">
        <GenerateForm
          formData={{
            prompt: baseQuery,
          }}
          selectedViewport={selectedViewport}
          baseFormId={baseFormId}
          needToGenerateFormSchema={needToGenerateFormSchema}
        />
      </div>
      <div className="flex w-full px-3">
        <div className="w-full flex gap-2 items-center border px-3 py-2 rounded-md bg-white">
          <div>
            <WandSparkles className="h-4 w-4" />
          </div>
          <input
            placeholder="Ask spira to modify the form"
            name="name"
            type="text"
            disabled
            className="outline-none flex-grow text-sm bg-transparent"
            onChange={() => {}}
          />
        </div>
      </div>
    </section>
  )
}

export default EditForm
