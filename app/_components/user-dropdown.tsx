"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { UserRound } from "lucide-react";

const UserDropdown = () => {
  const supabase = createClient();

  const logOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      console.error(error);
    }
    window.location.reload();
  };

  supabase.auth.getUser().then(({ data }) => {
    console.log(data);
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full h-10 w-10 flex items-center justify-center border">
          <div>
            <UserRound size={16} />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Explore</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Help</DropdownMenuItem>
        <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
