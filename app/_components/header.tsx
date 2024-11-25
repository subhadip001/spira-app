"use client"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import React from "react"
import { Icons } from "./icons"
import UserDropdown from "./user-dropdown"
import CustomButton from "./custom-button"
import { ArrowRight } from "lucide-react"

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
      <div className="flex gap-4 items-center">
        <CustomButton
          handleClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 py-[0.3rem]"
        >
          Go to Dashboard
          <div>
            <ArrowRight className="w-4 h-4" />
          </div>
        </CustomButton>
        <UserDropdown />
      </div>
    </div>
  )
}

export default Header
