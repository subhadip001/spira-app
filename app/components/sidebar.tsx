import { cn } from "@/lib/utils";
import React from "react";
import spiraLogo from "../assets/spira-logo.png";
import Image from "next/image";

type SidebarProps = {
  className?: string;
};

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={cn(className, "")}>
      <div>
        <Image src={spiraLogo} height={40} width={40} alt="Spira Logo" />
      </div>
      <span>Sidebar</span>
    </div>
  );
};

export default Sidebar;
