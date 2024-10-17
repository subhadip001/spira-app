"use client"
import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { UserRound } from "lucide-react"
import { toast } from "react-hot-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import useAppStore from "@/store/appStore"
import Avvvatars from "avvvatars-react"
type UserProfile = {
  created_at: string
  email: string
  id: string
  name: string
}

const UserDropdown = () => {
  const supabase = createClient()
  const pathName = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const setAppStoreUser = useAppStore((state) => state.setUser)
  const formId = pathName.split("/")[2]

  // console.log("searchParams", formId);
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return
      const { data: userProfile, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single()
      if (error) {
        console.error("Error fetching user profile", error)
        return
      }
      setUser(userProfile)
      setAppStoreUser({
        id: userProfile?.id,
        email: userProfile?.email,
        name: userProfile?.name,
      })
    }
    fetchUser()
  }, [])

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
        <div className="rounded-full h-10 w-10 flex items-center justify-center border">
          {user?.name ? (
            <Avvvatars size={40} value={user.name} />
          ) : (
            <UserRound size={16} />
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
