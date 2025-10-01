"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import AmplifyProvider from "@/components/auth/AmplifyProvider.tsx";
import { Footer } from "@/components/layout/Footer.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import { CategoryProvider } from "@/contexts/CategoryContext.tsx";

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
            <CategoryProvider>
              <Header finance={finance} setFinance={setFinance} />
              {children}
              <Toaster position="top-center" richColors />
              <Footer />
            </CategoryProvider>
          </AuthProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}
