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
      className={`flex items-center space-x-3 w-full px-3 py-[0.3rem] rounded-sm transition-colors ${
        isActive
          ? "bg-blue-200 text-spirablue"
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
      <nav className="flex flex-col gap-2 w-[92%] mx-auto my-4">
        <NavItem
          icon={FileText}
          label="Forms"
          isActive={pathname === "/dashboard/forms"}
          onClick={() => router.push("/dashboard/forms")}
        />
        <NavItem
          icon={FileText}
          label="Responses"
          isActive={pathname === "/dashboard/responses"}
          onClick={() => router.push("/dashboard/responses")}
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
