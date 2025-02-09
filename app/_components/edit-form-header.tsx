"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React from "react"
import { Icons } from "./icons"
import UserDropdown from "./user-dropdown"

type HeaderProps = {
  formId: string
  className?: string
}

const Header: React.FC<HeaderProps> = ({ formId, className }) => {
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    {
      label: "Editor",
      href: `/form/${formId}/editor`,
    },
    {
      label: "Share",
      href: `/form/${formId}/share`,
    },
    {
      label: "Response",
      href: `/form/${formId}/response`,
    },
    // {
    //   label: "Settings",
    //   href: `/form/${formId}/settings`,
    // },
  ]
  return (
    <div className={cn(className, "flex justify-between py-2 px-5 border-b")}>
      <div className="cursor-pointer" onClick={() => router.push("/")}>
        <Icons.logo size={30} />
      </div>
      <div>
        <div className="flex gap-3 text-sm items-center rounded-md">
          {navigationItems.map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(item.href)}
              className={cn(
                "px-3 py-1 rounded-md cursor-pointer",
                pathname === item.href
                  ? "bg-blue-200 text-spirablue"
                  : "hover:bg-gray-100"
              )}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <UserDropdown size={30} />
    </div>
  )
}

export default Header
