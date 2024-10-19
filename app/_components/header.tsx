"use client"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import React from "react"
import { Icons } from "./icons"
import UserDropdown from "./user-dropdown"

type HeaderProps = {
  className?: string
}

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
