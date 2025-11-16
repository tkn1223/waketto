"use client";

import Link from "next/link";
import { LogOutIcon, SettingsIcon, UserRoundPen } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";

export function NaviMenu() {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    void signOut();
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className="cursor-pointer"
            onPointerMove={preventPointerEvent}
            onPointerLeave={preventPointerEvent}
          >
            メニュー
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/setting" className="flex-row items-center gap-2">
                    <SettingsIcon />
                    予算設定
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/account" className="flex-row items-center gap-2">
                    <UserRoundPen />
                    アカウント設定
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex-row items-center gap-2"
                  >
                    <LogOutIcon />
                    ログアウト
                  </button>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// ポインターイベントを無効化
function preventPointerEvent(e: React.PointerEvent<HTMLElement>) {
  e.preventDefault();
}
