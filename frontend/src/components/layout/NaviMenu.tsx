"use client";

import Link from "next/link";
import { LogOutIcon, SettingsIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu.tsx";
import { signOutUser } from "@/lib/auth.ts";

interface NaviMenuProps {
  setIsAuth: (isAuth: boolean) => void;
}

export function NaviMenu({ setIsAuth }: NaviMenuProps) {
  // ログアウト時に、loadingを引き継ぐ？
  const handleSignOut = async () => {
    await signOutUser();
    setIsAuth(false);
    // localStorageをクリア
    localStorage.clear();
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="cursor-pointer">
            メニュー
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <SettingsIcon />
                    設定
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="#"
                    onClick={() => void handleSignOut()}
                    className="flex-row items-center gap-2"
                  >
                    <LogOutIcon />
                    ログアウト
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
