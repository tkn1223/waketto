"use client";

import { Toggle } from "@/components/ui/toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Users } from "lucide-react";

interface UserModeToggleProps {
  user: string;
  setUser: (user: string) => void;
}

export function UserModeToggle({ user, setUser }: UserModeToggleProps) {
  return (
    <Toggle
      aria-label="Toggle user mode"
      onClick={() => setUser(user === "alone" ? "common" : "alone")}
    >
      <div className="flex items-center justify-center w-full h-full cursor-pointer">
        {user === "alone" ? (
          <>
            <User className="h-4 w-4 mr-1" />
            個人
          </>
        ) : (
          <>
            <Users className="h-4 w-4 mr-1" />
            共通
          </>
        )}
      </div>
    </Toggle>
  );
}
