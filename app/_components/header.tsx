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
    <div className={cn(className, "flex justify-between py-2 px-5 z-10")}>
      <div className="cursor-pointer" onClick={() => router.push("/")}>
        <Icons.logo size={30} />
      </div>
      <div className="flex gap-4 items-center">
        <CustomButton
          handleClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 py-1 text-sm"
        >
          Go to Dashboard
          <div>
            <ArrowRight className="w-4 h-4" />
          </div>
        </CustomButton>
        <UserDropdown size={30} />
      </div>
    </div>
  )
}

export default Header
