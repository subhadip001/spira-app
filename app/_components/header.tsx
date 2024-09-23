import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import React from "react";
import { Icons } from "./icons";

type HeaderProps = {
  className?: string;
};

const UserDropdown = dynamic(() => import("./user-dropdown"), {
  ssr: false,
});

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <div className={cn(className, "flex justify-between py-3 px-5")}>
      <Icons.logo />
      <UserDropdown />
    </div>
  );
};

export default Header;
