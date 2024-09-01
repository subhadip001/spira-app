import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Icons } from "./icons";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

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
