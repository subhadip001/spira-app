"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserRound } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const UserDropdown = () => {
  const supabase = createClient();
  const pathName = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user);
      setUser(user);
    };
    fetchUser();
  }, []);

  const logOut = async () => {
    try {
      await supabase.auth.signOut({ scope: "local" });
      setUser(null);
      toast.success("Logged out successfully");
      if (pathName !== "/" || !pathName.startsWith("/form")) {
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full h-10 w-10 flex items-center justify-center border">
          {/* <UserRound size={16} /> */}
          {user?.user_metadata.full_name ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="avatar"
              width={35}
              height={35}
              className="rounded-full"
            />
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
                  <span>{user.user_metadata.full_name}</span>
                </div>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Explore</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/login")}>
              Login
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
