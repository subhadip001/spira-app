"use client"
import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { UserRound } from "lucide-react"
import { toast } from "react-hot-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useAppStore from "@/store/appStore"
import Avvvatars from "avvvatars-react"
import { getUserProfile, QueryKeys } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
type UserProfile = {
  created_at: string
  email: string
  id: string
  name: string
}

const UserDropdown = ({ size = 40 }: { size: number }) => {
  const supabase = createClient()
  const pathName = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const setAppStoreUser = useAppStore((state) => state.setUser)
  const formId = pathName.split("/")[2]

  const { data: userProfileData, isSuccess } = useQuery({
    queryKey: [QueryKeys.GetUserProfile],
    queryFn: getUserProfile,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (isSuccess && userProfileData?.data) {
      setUser(userProfileData.data)
      setAppStoreUser({
        id: userProfileData.data.id,
        email: userProfileData.data.email,
        name: userProfileData.data.name,
      })
    }
  }, [isSuccess, userProfileData, setAppStoreUser])

  const logOut = async () => {
    try {
      await supabase.auth.signOut({ scope: "local" })
      setUser(null)
      setAppStoreUser(null)
      toast.success("Logged out successfully")
      if (pathName !== "/" || !pathName.startsWith("/form")) {
        router.push("/")
      }
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to log out. Please try again.")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full h-fit w-fit flex items-center justify-center">
          {user?.name ? (
            <Avvvatars size={size} value={user.name} />
          ) : (
            <div
              style={{ width: `${size}px`, height: `${size}px` }}
              className="rounded-full bg-gray-200"
            ></div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user ? (
          <>
            <DropdownMenuItem>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span>{user.name}</span>
                </div>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/login?${formId ? `formId=${formId}` : ""}`)
              }
            >
              Login
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
