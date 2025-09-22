"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SigninForm from "@/components/auth/SigninForm.tsx";
import { isAuthenticated } from "@/lib/auth.ts";

export default function SigninPage() {
  const router = useRouter();

  useEffect(() => {
    // 認証済みの場合はダッシュボードにリダイレクト
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();

      if (authenticated) {
        router.push("/dashboard");
      }
    };

    void checkAuth();
  }, [router]);

  return <SigninForm />;
}
