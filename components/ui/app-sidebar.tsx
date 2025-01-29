import {
  Calendar,
  ChevronUp,
  CreditCard,
  Home,
  icons,
  Inbox,
  Search,
  Settings,
  Sparkle,
  Sparkles,
  User2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { title } from "process"
import { url } from "inspector"
import { usePathname, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Icons } from "@/app/_components/icons"
import { cn } from "@/lib/utils"
import useAppStore from "@/store/appStore"

const items = [
  {
    title: "Home",
    url: "/dashboard/forms",
    icon: Home,
  },
  {
    title: "Response Analytics",
    url: "/dashboard/response-analytics",
    icon: Sparkles,
  },
  {
    title: "Global Search",
    url: "/dashboard/global-search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAppStore((state) => state.user)
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div
              onClick={() => router.push("/")}
              className="flex items-center gap-1 cursor-pointer"
            >
              <Icons.logo size={20} />
              Spira AI
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div
                      data-active={pathname === item.url}
                      className={cn(
                        "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left h-8 text-sm cursor-pointer transition-colors",
                        "data-[active=true]:bg-blue-100 data-[active=true]:text-blue-600 data-[active=true]:hover:bg-blue-100 data-[active=true]:hover:text-blue-600",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
                      )}
                      onClick={() => {
                        router.push(`${item.url}`)
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  <span>{user?.name}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
