"use client";

import useAppStore from "@/store/appStore";
import Avvvatars from "avvvatars-react";
import { UserRound } from "lucide-react";
import { useMemo } from "react";

const generateRandomGradient = () => {
  const randomColor = () => Math.floor(Math.random() * 256);
  const color1 = `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`;
  const color2 = `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`;
  return `linear-gradient(135deg, ${color1}, ${color2})`;
};

const UserProfileAvatar = () => {
  const user = useAppStore((state) => state.user);

  const gradientBackground = useMemo(() => generateRandomGradient(), [user]);

  return (
    <div className="flex items-center gap-2">
      {user?.name ? (
        <Avvvatars size={40} value={user.name} />
      ) : (
        <div
          className="w-8 h-8 rounded-full"
          style={{ background: gradientBackground }}
        />
      )}
    </div>
  );
};

export default UserProfileAvatar;
