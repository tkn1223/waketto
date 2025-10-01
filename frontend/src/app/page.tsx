"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkTokenValidity,isAuthenticated } from "@/lib/auth.ts";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 認証チェックとリダイレクト
    const checkAuthAndRedirect = async () => {
      const authenticated = await isAuthenticated();

      // 認証済み→ダッシュボード、未認証→サインインページ
      if (authenticated) {
        const isTokenValid = await checkTokenValidity();

        if (isTokenValid) {
          router.push("/dashboard");
        } else {
          router.push("/signin");
        }
      } else {
        router.push("/signin");
      }
    };

    void checkAuthAndRedirect();
  }, [router]);

  // リダイレクト中は何も表示しない
  return null;
}
