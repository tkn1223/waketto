"use client";

import Image from "next/image";
import Link from "next/link";
import AmplifyProvider from "@/components/auth/AmplifyProvider";
import {
  getCurrentUserInfo,
  isAuthenticated,
  signOutUser,
  type User,
} from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import "./globals.css";
import { useEffect, useState } from "react";
import { LogOut, LogOutIcon, SettingsIcon } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);
      setIsLoading(false);
    };

    void checkAuth();
    // 初回ログイン後にメニューが表示されるため
    window.addEventListener("signedIn", checkAuth);

    return () => {
      window.removeEventListener("signedIn", checkAuth);
    };
  }, []);

  // ログアウト時に、loadingを引き継ぐ？
  const handleSignOut = async () => {
    await signOutUser();
    setIsAuth(false);
  };

  return (
    <html lang="ja">
      <body className="antialiased">
        <AmplifyProvider>
          <header className="max-w-screen-x1 bg-emerald-100">
            <div className="flex items-center justify-between h-14 px-5">
              <Link aria-label="Home" href={"/dashboard"}>
                <Image
                  className="dark:invert"
                  src="/waketto.svg"
                  alt="支出わけっと ロゴ"
                  width={120}
                  height={20}
                  priority
                />
              </Link>

              {!isLoading &&
                (isAuth ? (
                  <>
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger>
                            メニュー
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-4">
                              <li>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href="#"
                                    className="flex-row items-center gap-2"
                                  >
                                    <SettingsIcon />
                                    設定
                                  </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href="#"
                                    onClick={handleSignOut}
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
                  </>
                ) : null)}
            </div>
          </header>
          {children}
          <footer className="py-2 flex flex-wrap items-center justify-center bg-emerald-100">
            <p>© 2025 支出わけっと</p>
          </footer>
        </AmplifyProvider>
      </body>
    </html>
  );
}
