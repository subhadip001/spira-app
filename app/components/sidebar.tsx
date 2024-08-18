import { cn } from "@/lib/utils";
import React from "react";
import spiraLogo from "../assets/spira-transparent.png";
import Image from "next/image";
import {
  CircleUser,
  LayoutDashboard,
  LayoutTemplate,
  Settings,
} from "lucide-react";

type SidebarProps = {
  className?: string;
};

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div
      className={cn(className, "bg-transparent flex flex-col gap-8 py-3 px-5")}
    >
      <div className="flex items-center justify-center">
        <Image
          src={spiraLogo}
          className="p-2"
          height={40}
          width={40}
          alt="Spira Logo"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="p-2 cursor-pointer bg-[#E8E8E2] rounded-lg hover:bg-[#E8E8E2]">
          <LayoutDashboard />
        </div>
        <div className="p-2 cursor-pointer rounded-lg hover:bg-[#E8E8E2]">
          <LayoutTemplate />
        </div>
        <div className="p-2 cursor-pointer rounded-lg hover:bg-[#E8E8E2]">
          <Settings />
        </div>
      </div>
      <div className="flex flex-col mt-auto items-center gap-2">
        <div className="p-2 cursor-pointer rounded-lg hover:bg-[#E8E8E2]">
          <CircleUser />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
