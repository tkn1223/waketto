"use client";

import AmplifyProvider from "@/components/auth/AmplifyProvider";
import { getCurrentUserInfo, isAuthenticated, type User } from "@/lib/auth";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import "./globals.css";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userMode") || "alone";
    }
    return "alone"; // alone or common （個人 or 共有）
  });
  const [finance, setFinance] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("financeMode") || "expense";
    }
    return "expense";
  });

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

  // localStorageに保存（ユーザーモード）
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userMode", user);
    }
  }, [user]);

  // localStorageに保存（ファイナンスモード）
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("financeMode", finance);
    }
  }, [finance]);

  return (
    <html lang="ja">
      <body className="antialiased">
        <AmplifyProvider>
          <Header
            isLoading={isLoading}
            isAuth={isAuth}
            setIsAuth={setIsAuth}
            user={user}
            setUser={setUser}
            finance={finance}
            setFinance={setFinance}
          />
          {children}
          <Footer />
        </AmplifyProvider>
      </body>
    </html>
  );
}
