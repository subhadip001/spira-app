"use client"

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
        } else {
          setSelectedFormVersion(formVersion)
        }
      } catch (error) {
        setSelectedFormVersion(formVersionsData[0])
        localStorage.setItem(
          "selected-form-version",
          JSON.stringify(formVersionsData[0])
        )
      }
    }
  }, [formVersionsData, formId])
  return null
}

export default SelectVersion
