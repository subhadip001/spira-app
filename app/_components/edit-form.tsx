"use client"
import Confetti from "@/components/magicui/confetti"
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
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFormSchemaEditor } from "@/hooks/form-schema-editor"
import {
  addNewFormVersion,
  fetchFormVersionByVersionNumber,
  fetchLatestFormVersion,
  getPublishedFormByFormVersionId,
  QueryKeys,
} from "@/lib/queries"
import {
  AddNewFormVersionVariables,
  EFormVersionStatus,
  EUiLayout,
  THEME_PRESETS,
  TUiBrandKit,
  TUiConfig,
  TUiTheme,
} from "@/lib/types"
import useAppStore from "@/store/appStore"
import useEditFormPageStore from "@/store/editFormPageStore"
import useFormStore from "@/store/formStore"
import useFormVersionStore from "@/store/formVersions"
import { createClient } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Edit,
  Eye,
  Loader,
  Monitor,
  MousePointerClick,
  Save,
  Send,
  Smartphone,
  Sparkles,
  Tablet,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import React, { useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"
import ShortUniqueId from "short-unique-id"
import GenerateForm from "./generate-form"
import { Icons } from "./icons"
import VersionDropdown from "./version-dropdown"
import { getMaxFormVersion } from "@/lib/form-lib/utils"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import EditFormField from "./edit-form-field"
import EditFormFieldMobile from "./edit-form-field-mobile"

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
  const [publishedShortId, setPublishedShortId] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [editInstruction, setEditInstruction] = useState<string>("")
  const [saveAsNewVersion, setSaveAsNewVersion] = useState(false)
  const [isPublishAlertDialogOpen, setIsPublishAlertDialogOpen] =
    useState(false)

  const currentFormSchema = useFormStore((state) => state.currentFormSchema)
  const currentFormUI = useFormStore((state) => state.currentFormUI)
  const user = useAppStore((state) => state.user)
  const router = useRouter()
  const pathName = usePathname()
  const formId = pathName.split("/")[2]
  const queryClient = useQueryClient()

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)

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

  const { data: publishedForm } = useQuery({
    queryKey: [
      QueryKeys.GetPublishedFormByFormVersionId,
      selectedFormVersion?.id,
    ],
    queryFn: () => {
      if (selectedFormVersion?.status !== EFormVersionStatus.PUBLISHED) {
        return null
      }
      return getPublishedFormByFormVersionId(selectedFormVersion?.id || "")
    },
    enabled: !!selectedFormVersion?.id,
    refetchOnWindowFocus: false,
  })

  const publishForm = async (currentFormUI?: TUiConfig) => {
    if (!user) {
      router.push(`/login?${formId ? `formId=${formId}` : ""}`)
      return
    }

    // if (selectedFormVersion?.status !== EFormVersionStatus.PUBLISHED) {
    //   return
    // }
    setIsPublishing(true)
    setIsPublishAlertDialogOpen(false)

    const { randomUUID } = new ShortUniqueId({ length: 10 })
    const shortId = randomUUID()

    const supabase = createClient()
    if (!selectedFormVersion) return
    if (selectedFormVersion?.status === EFormVersionStatus.PUBLISHED) {
      if (publishedForm?.error) {
        console.error("Error getting published form", publishedForm?.error)
        toast.error("Error getting published form")
      }

      setIsPublishing(false)
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.GetPublishedFormByFormVersionId,
          selectedFormVersion?.id,
        ],
      })
      window.open(
        `${process.env.NEXT_PUBLIC_SITE_URL}/f/${publishedForm?.data?.short_id}`,
        "_blank"
      )
      return
    }

    try {
      const { data: updatedFormVersion, error } = await supabase
        .from("form_versions")
        .update({
          status: EFormVersionStatus.PUBLISHED,
          ui_layout: currentFormUI?.layout,
        })
        .eq("id", selectedFormVersion?.id)
        .select()
        .single()

      if (error) {
        throw new Error("Error updating form version")
      }

      const { data: published, error: publishError } = await supabase
        .from("published_forms")
        .insert({
          user_id: user.id,
          form_version_id: selectedFormVersion.id,
          form_base_id: baseFormId,
          short_id: shortId,
          form_title:
            JSON.parse(selectedFormVersion?.form_schema_string || "{}").title ??
            selectedFormVersion?.query,
        })
        .select()
        .single()

      if (error || publishError || !published?.id) {
        throw new Error("Error publishing form")
      }

      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GetFormVersions, baseFormId],
      })
      setPublishedShortId(shortId)
      toast.success("Form published successfully")

      setShowConfetti(true)

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "selected-form-version",
          JSON.stringify(updatedFormVersion)
        )
      }
    } catch (error) {
      console.error("Error publishing form", error)
      toast.error("Error publishing form")
    } finally {
      setIsPublishing(false)
      setIsPublishAlertDialogOpen(false)
    }
  }

  const addNewFormversionMutation = useMutation({
    mutationFn: (variables: AddNewFormVersionVariables) => {
      return addNewFormVersion(variables)
    },
    onSuccess: async (data, variables) => {
      const response = await fetchLatestFormVersion(baseFormId)
      const updatedResponse = {
        ...response,
        status: response.status as EFormVersionStatus,
        ui_layout: response.ui_layout as EUiLayout,
        ui_theme: response.ui_theme as TUiTheme,
        available_ui_themes: response.available_ui_themes as TUiTheme[],
        ui_brand_kit: response.ui_brand_kit as TUiBrandKit,
      }
      setSelectedFormVersion(updatedResponse)
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GetFormVersions, baseFormId],
      })
      toast.success("Form version added successfully")
    },
    onError: (error: Error) => {
      console.error("Error adding new form version", error)
      toast.error("Error adding new form version")
    },
  })

  const updateFormVersionMutation = useMutation({
    mutationFn: (variables: AddNewFormVersionVariables) =>
      addNewFormVersion(variables),
    onSuccess: async (data, variables) => {
      const response = await fetchFormVersionByVersionNumber(
        baseFormId,
        variables.version
      )
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GetFormVersions, baseFormId],
      })
      const updatedResponse = {
        ...response,
        status: response.status as EFormVersionStatus,
        ui_layout: response.ui_layout as EUiLayout,
        ui_theme: response.ui_theme as TUiTheme,
        available_ui_themes: response.available_ui_themes as TUiTheme[],
        ui_brand_kit: response.ui_brand_kit as TUiBrandKit,
      }
      setSelectedFormVersion(updatedResponse)
      toast.success("Form version updated successfully")
    },
    onError: (error: Error) => {
      console.error("Error adding new form version", error)
      toast.error("Error adding new form version")
    },
  })

  const {
    formSchemaEditMutation,
    currentStreamedFormSchema,
    isStreamStarting,
  } = useFormSchemaEditor(baseFormId)

  const handleEditFormUsingSpira = async () => {
    formSchemaEditMutation.mutate(
      {
        prompt: editInstruction,
        formSchema: selectedFormVersion?.form_schema_string as string,
      },
      {
        onSuccess: () => {
          setEditInstruction("")
        },
      }
    )
  }

  const handleFormUIChange = (key: string, value: any) => {
    const currentUI = useFormStore.getState().currentFormUI
    useFormStore.getState().setCurrentFormUI({
      ...currentUI,
      [key]: value,
    })
  }

  const MobileToolbar = useCallback(
    ({ className }: { className?: string }) => {
      return (
        <Drawer open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              className="bg-blue-200 text-spirablue hover:bg-blue-300 hover:text-spirablue"
              variant="outline"
            >
              Edit Manually
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <div>
                  <Edit className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold">
                  Edit Selected Field
                </span>
              </DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <div>
              <EditFormFieldMobile />
            </div>
          </DrawerContent>
        </Drawer>
      )
    },
    [isEditDrawerOpen]
  )

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
        <div className="flex items-center gap-2 justify-between">
          <div className="flex flex-col sm:flex-row gap-5 items-center">
            <div className="flex items-center gap-2 justify-between">
              <VersionDropdown formId={formId} />

              <div className="bg-white h-full border rounded-md flex gap-2 p-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`p-2 cursor-pointer rounded border border-gray-200 ${
                          isViewAsPublished ? "bg-gray-200" : ""
                        }`}
                        onClick={() => setIsViewAsPublished(!isViewAsPublished)}
                      >
                        <div>
                          <Eye className="h-4 w-4" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Published Preview</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="bg-white h-full border rounded-md hidden lg:flex gap-2 p-1">
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
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger
                onClick={() => {
                  setSaveAsNewVersion(false)
                }}
              >
                <div className="flex items-center gap-2 border rounded-md py-2 px-3 bg-white">
                  <div>
                    <Save className="h-5 w-5" />
                  </div>
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
                <div className="flex items-center space-x-2 py-4">
                  <Switch
                    id="save-as-new"
                    checked={saveAsNewVersion}
                    onCheckedChange={setSaveAsNewVersion}
                  />
                  <label
                    htmlFor="save-as-new"
                    className="text-sm text-muted-foreground"
                  >
                    Save as new version
                  </label>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (saveAsNewVersion) {
                        addNewFormversionMutation.mutate({
                          formSchemaString: JSON.stringify(currentFormSchema),
                          baseFormId: baseFormId,
                          query: selectedFormVersion?.query || "N/A",
                          version: getMaxFormVersion(formVersionsData) + 1,
                          status: EFormVersionStatus.DRAFT,
                          uiLayout: currentFormUI?.layout,
                          uiTheme: currentFormUI?.theme,
                          uiBrandKit: currentFormUI?.brandKit,
                          availableUiThemes: currentFormUI?.availableThemes,
                        })
                      } else {
                        updateFormVersionMutation.mutate({
                          formSchemaString: JSON.stringify(currentFormSchema),
                          baseFormId: baseFormId,
                          query: selectedFormVersion?.query || "N/A",
                          version: selectedFormVersion?.version_number ?? 1,
                          status: selectedFormVersion?.status,
                          uiLayout: currentFormUI?.layout,
                          uiTheme: currentFormUI?.theme,
                          uiBrandKit: currentFormUI?.brandKit,
                          availableUiThemes: currentFormUI?.availableThemes,
                        })
                      }
                    }}
                    disabled={
                      saveAsNewVersion && formVersionsData?.length === 0
                    }
                  >
                    {saveAsNewVersion ? "Save as New Version" : "Save"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={isPublishAlertDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="default"
                  className={`flex items-center gap-2 ${
                    selectedFormVersion?.status === EFormVersionStatus.PUBLISHED
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }`}
                  onClick={() => {
                    if (
                      selectedFormVersion?.status ===
                      EFormVersionStatus.PUBLISHED
                    ) {
                      publishForm()
                    } else {
                      setIsPublishAlertDialogOpen(true)
                    }
                  }}
                >
                  {selectedFormVersion?.status === EFormVersionStatus.PUBLISHED
                    ? "Published"
                    : "Publish"}
                  {isPublishing ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : selectedFormVersion?.status ===
                    EFormVersionStatus.PUBLISHED ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Form UI Settings</AlertDialogTitle>
                  <AlertDialogDescription>
                    Customize your form layout and theme before publishing
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
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
                  {/* <section className="mt-4">
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
                        {theme.name.charAt(0) +
                          theme.name.slice(1).toLowerCase()}
                      </Button>
                    ))}
                  </div>
                </section> */}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setIsPublishAlertDialogOpen(false)}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      publishForm(currentFormUI)
                    }}
                  >
                    Publish
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
          isEditFormStreaming={formSchemaEditMutation.isPending}
          isEditFormStreamStarting={isStreamStarting}
          currentStreamedEditFormSchema={currentStreamedFormSchema}
        />
      </div>
      <div className="hidden lg:flex w-full px-3">
        <div className="w-full flex gap-2 items-center border px-3 py-2 rounded-md bg-white">
          <div>
            <Icons.logo className="w-6 h-6" />
          </div>
          <input
            placeholder="Ask spira to modify the form"
            name="edit-form-using-spira"
            type="text"
            className="outline-none flex-grow text-sm bg-transparent"
            onChange={(e) => setEditInstruction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEditFormUsingSpira()
              }
            }}
            value={editInstruction}
          />
          <div
            className="flex items-center cursor-pointer"
            onClick={handleEditFormUsingSpira}
          >
            <Send className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 w-full ">
        <div
          className={cn(
            "w-fit mx-auto bg-white border-blue-200 shadow-2xl lg:hidden flex flex-wrap justify-center items-center py-2 px-3 rounded-md gap-2 border"
          )}
        >
          <MobileToolbar />
          <div>
            <div className="flex-grow">
              <div className="w-full flex gap-2 items-center border px-3 py-2 rounded-md bg-white">
                <div>
                  <Icons.logo className="w-6 h-6" />
                </div>
                <input
                  placeholder="Ask spira to modify the form"
                  name="edit-form-using-spira"
                  type="text"
                  className="outline-none flex-grow text-sm bg-transparent"
                  onChange={(e) => setEditInstruction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEditFormUsingSpira()
                    }
                  }}
                  value={editInstruction}
                />
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleEditFormUsingSpira}
                >
                  <Send className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog
        open={!!publishedShortId}
        onOpenChange={() => setPublishedShortId(null)}
      >
        <AlertDialogContent className="max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[50%]">
          <div className="sr-only">
            <AlertDialogTitle>Form Published Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Your form has been published successfully. You can now share the
              form with others.
            </AlertDialogDescription>
          </div>

          <div>
            {showConfetti && (
              <Confetti
                className="absolute w-full h-full pointer-events-none top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
                options={{
                  spread: 70,
                  particleCount: 400,
                }}
              />
            )}
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-green-200 rounded-full p-5">
                  <Check className="text-green-500" size={40} />
                </div>
                <div>
                  <span className="text-lg font-medium">
                    Form Published Successfully
                  </span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="bg-gray-100 border w-[90%] relative px-2 py-1 rounded-md text-center font-mono flex items-center gap-2">
                  <span className="line-clamp-1">
                    {`${process.env.NEXT_PUBLIC_SITE_URL}/f/${publishedShortId}`}
                  </span>
                  <div
                    onClick={() => {
                      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/f/${publishedShortId}`
                      navigator.clipboard.writeText(url)
                      toast.success("URL copied to clipboard")
                    }}
                    className="cursor-pointer hover:bg-gray-200 p-1 rounded border"
                  >
                    <Copy className="h-4 w-4" />
                  </div>
                </div>
                <div
                  onClick={() => {
                    window.open(`/f/${publishedShortId}`, "_blank")
                  }}
                  className="flex items-center gap-1 border hover:border-spirablue hover:text-spirablue hover:bg-blue-200 transition-all duration-300 rounded-md px-2 py-1 cursor-pointer"
                >
                  <span>Open</span>
                  <div>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-center mt-6">
                <Button
                  onClick={() => {
                    router.push("/dashboard")
                  }}
                  className="flex items-center gap-2"
                >
                  <span>Go to Dashboard</span>
                  <div>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Button>
                <Button
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: [
                        QueryKeys.GetPublishedFormByFormVersionId,
                        selectedFormVersion?.id,
                      ],
                    })
                    setPublishedShortId(null)
                    setShowConfetti(false)
                  }}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

export default EditForm
