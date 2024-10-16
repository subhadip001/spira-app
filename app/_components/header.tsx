"use client"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import React from "react"
import { Icons } from "./icons"
import { useRouter } from "next/navigation"

type HeaderProps = {
  className?: string
}

const UserDropdown = dynamic(() => import("./user-dropdown"), {
  ssr: false,
})

const Header: React.FC<HeaderProps> = ({ className }) => {
  const router = useRouter()
  return (
    <div className={cn(className, "flex justify-between py-3 px-5")}>
      <div className="cursor-pointer" onClick={() => router.push("/")}>
        <Icons.logo />
      </div>
      <UserDropdown />
    </div>
  )
}

export default Header
