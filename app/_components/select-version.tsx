"use client"

import useFormStore from "@/store/formStore"
import useFormVersionStore from "@/store/formVersions"
import { useEffect } from "react"

const SelectVersion = ({ formId }: { formId: string }) => {
  const formVersionsData = useFormVersionStore(
    (state) => state.formVersionsData
  )
  const setSelectedFormVersion = useFormVersionStore(
    (state) => state.setSelectedFormVersion
  )
  const selectedFormVersion = useFormVersionStore(
    (state) => state.selectedFormVersion
  )
  const setCurrentFormUI = useFormStore((state) => state.setCurrentFormUI)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const formVersion = JSON.parse(
          localStorage.getItem("selected-form-version") || "{}"
        )
        if (formVersion?.form_id !== formId) {
          setSelectedFormVersion(formVersionsData[0])
          localStorage.setItem(
            "selected-form-version",
            JSON.stringify(formVersionsData[0])
          )
          setCurrentFormUI({
            layout: formVersionsData[0].ui_layout,
            theme: formVersionsData[0].ui_theme,
            brandKit: formVersionsData[0].ui_brand_kit,
            availableThemes: formVersionsData[0].available_ui_themes,
          })
        } else {
          setSelectedFormVersion(formVersion)
          setCurrentFormUI({
            layout: formVersion.ui_layout,
            theme: formVersion.ui_theme,
            brandKit: formVersion.ui_brand_kit,
            availableThemes: formVersion.available_ui_themes,
          })
        }
      } catch (error) {
        setSelectedFormVersion(formVersionsData[0])
        localStorage.setItem(
          "selected-form-version",
          JSON.stringify(formVersionsData[0])
        )
        setCurrentFormUI({
          layout: formVersionsData[0].ui_layout,
          theme: formVersionsData[0].ui_theme,
          brandKit: formVersionsData[0].ui_brand_kit,
          availableThemes: formVersionsData[0].available_ui_themes,
        })
      }
    }
  }, [formVersionsData, formId])
  return null
}

export default SelectVersion
