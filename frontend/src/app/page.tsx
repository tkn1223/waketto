"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 認証チェックとリダイレクト
    const checkAuthAndRedirect = async () => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        // 認証済みの場合はダッシュボードにリダイレクト
        router.push("/dashboard");
      } else {
        // 未認証の場合はサインインページにリダイレクト
        router.push("/signin");
      }
    };

    void checkAuthAndRedirect();
  }, [router]);

  // リダイレクト中は何も表示しない
  return null;
}
