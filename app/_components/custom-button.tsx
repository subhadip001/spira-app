"use client"

import React from "react"
import useAppStore from "@/store/appStore"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const CustomButton = ({
  children,
  handleClick,
  className,
}: {
  children: React.ReactNode | string
  handleClick?: () => void
  className?: string
}) => {
  const user = useAppStore((state) => state.user)
  const router = useRouter()

  if (!user) {
    return null
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "bg-blue-100 text-spirablue border border-blue-200 hover:bg-blue-200 px-3  py-[0.35rem] rounded-lg flex items-center",
        className
      )}
    >
      {children}
    </button>
  )
}

export default CustomButton
