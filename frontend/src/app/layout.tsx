"use client";

import { useEffect, useState, ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner.tsx";
import AmplifyProvider from "@/components/auth/AmplifyProvider.tsx";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import { Footer } from "@/components/layout/Footer.tsx";
import { Header } from "@/components/layout/Header.tsx";

import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
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
          <AuthProvider>
            <Header
              // isLoading={isLoading}
              // isAuth={isAuth}
              // setIsAuth={setIsAuth}
              // user={user}
              // setUser={setUser}
              finance={finance}
              setFinance={setFinance}
            />
            {children}
            <Toaster position="top-center" richColors />
            <Footer />
          </AuthProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}
