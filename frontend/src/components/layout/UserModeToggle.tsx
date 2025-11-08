"use client";

import { User, Users } from "lucide-react";
import { Toggle } from "@/components/ui/toggle.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import type { UserModeToggleProps } from "@/types/viewmode";

export function UserModeToggle({ user, setUser }: UserModeToggleProps) {
  const { userInfo } = useAuth();

  if (userInfo.couple_id !== "null") {
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
  } else {
    return (
      <Toggle
        aria-label="Toggle user mode"
        disabled
        className="cursor-not-allowed"
      >
        <User className="h-4 w-4" />
        個人
      </Toggle>
    );
  }
}
