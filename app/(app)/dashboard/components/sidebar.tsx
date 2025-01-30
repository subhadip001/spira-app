"use client"

import { Icons } from "@/app/_components/icons"
import useAppStore from "@/store/appStore"
import {
  ChevronsUpDown,
  CreditCard,
  FileText,
  LucideIcon,
  Settings,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()
  const user = useAppStore((state) => state.user)

  const NavItem = ({
    icon: Icon,
    label,
    isActive,
    onClick,
  }: {
    icon: LucideIcon
    label: string
    isActive: boolean
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 w-full px-3 py-[0.3rem] rounded-sm transition-colors ${
        isActive
          ? "bg-blue-200 text-spirablue hover:bg-blue-300"
          : "text-muted-foreground hover:bg-gray-200"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm">{label}</span>
    </button>
  )

  const router = useRouter()

  return (
    <aside className="min-w-48 bg-card border-r border-border flex flex-col justify-between">
      <div className="flex flex-col gap-4 w-[92%] mx-auto my-4 ">
        <div className="inline-flex items-center gap-2">
          <div
            className="inline-flex cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Icons.logo className="h-8 w-8" />
          </div>
          <span className="text-lg font-semibold">Dashboard</span>
        </div>
        <nav className="flex flex-col gap-2 w-full">
          <NavItem
            icon={FileText}
            label="Forms"
            isActive={pathname === "/dashboard/forms"}
            onClick={() => router.push("/dashboard/forms")}
          />
          <NavItem
            icon={Settings}
            label="Settings"
            isActive={pathname === "/dashboard/settings"}
            onClick={() => router.push("/dashboard/settings")}
          />

          <NavItem
            icon={CreditCard}
            label="Plans"
            isActive={pathname === "/dashboard/plans"}
            onClick={() => router.push("/dashboard/plans")}
          />
        </nav>
      </div>
      <div className="w-[92%] mx-auto my-4 cursor-pointer">
        <div className="py-2 border px-3 rounded-md">
          <div className="flex items-center space-x-3 justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-semibold max-w-24 line-clamp-1">
                {user?.name}
              </span>
              {/* <Badge className="text-xs bg-blue-200 text-spirablue hover:bg-blue-300">
                Pro
              </Badge> */}
            </div>
            <div className="rounded-full p-1">
              <ChevronsUpDown className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
