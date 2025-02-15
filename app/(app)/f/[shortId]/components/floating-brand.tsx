"use client"
import { Icons } from "@/app/_components/icons"
import { cn } from "@/lib/utils"
import React from "react"

type FloatingBrandProps = {
  text?: string
  className?: string
}
const FloatingBrand = ({ text, className }: FloatingBrandProps) => {
  return (
    <div
      className={cn(
        "fixed bottom-4 cursor-pointer right-4 z-50 bg-blue-100 px-3 py-2 rounded-md",
        className
      )}
      onClick={() => {
        window.open(process.env.NEXT_PUBLIC_SITE_URL, "_blank")
      }}
    >
      <div className="text-sm inline-flex items-center gap-1 text-gray-500">
        {text || "Powered by "}
        <div className="flex items-center cursor-pointer gap-[0.1rem]">
          <Icons.logo className="w-4 h-4" />
          <span className="text-spirablue">Spira</span>
        </div>
      </div>
    </div>
  )
}

export default FloatingBrand
