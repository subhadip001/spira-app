import { cn } from "@/lib/utils";
import React from "react";

type HeaderProps = {
  className?: string;
};

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <div className={cn(className, "")}>
      <span>Header</span>
    </div>
  );
};

export default Header;
