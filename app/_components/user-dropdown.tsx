"use client";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full h-10 w-10 flex items-center justify-center border">
          <div>
            <UserRound size={16} />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="-translate-x-5">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Explore</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Help</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
