"use client";

import SigninForm from "@/components/auth/SigninForm";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
