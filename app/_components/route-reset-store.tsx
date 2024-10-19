"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import useFormVersionStore from "@/store/formVersions"

const RouteResetStore = () => {
  const pathname = usePathname()
  const resetFormVersionStore = useFormVersionStore((state) => state.resetStore)

  useEffect(() => {
    return () => {
      if (
        !pathname.startsWith("/form/") &&
        !pathname.startsWith("/dashboard")
      ) {
        resetFormVersionStore()
      }
    }
  }, [pathname, resetFormVersionStore])

  return null
}

export default RouteResetStore
