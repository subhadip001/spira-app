"use client"

import { Button } from "@/components/ui/button"
import { CreditCard, LucideIcon, Settings } from "lucide-react"
import { FileText } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

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
      className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-colors ${
        isActive
          ? "bg-gray-200 text-black"
          : "text-muted-foreground hover:bg-gray-200"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  )

  const router = useRouter()

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col justify-between">
      <nav className="flex-1 p-2 space-y-2">
        <NavItem
          icon={FileText}
          label="Forms"
          isActive={pathname === "/dashboard"}
          onClick={() => router.push("/dashboard")}
        />
        <NavItem
          icon={FileText}
          label="Responses"
          isActive={pathname === "/responses"}
          onClick={() => router.push("/responses")}
        />
        <NavItem
          icon={Settings}
          label="Settings"
          isActive={pathname === "/settings"}
          onClick={() => router.push("/settings")}
        />

        <NavItem
          icon={CreditCard}
          label="Plans"
          isActive={pathname === "/plans"}
          onClick={() => router.push("/plans")}
        />
      </nav>
      <div className="px-4 py-2 border-t border-border bg-[#f5f5f5]">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <p className="font-medium">Sam User</p>
            <p className="text-sm text-muted-foreground">Pro Plan</p>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
