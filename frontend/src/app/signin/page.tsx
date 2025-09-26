"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SigninForm from "@/components/auth/SigninForm.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";

export default function SigninPage() {
  const router = useRouter();
  const { isAuth } = useAuth();

  useEffect(() => {
    // 認証済みの場合はダッシュボードにリダイレクト
    if (isAuth) {
      router.push("/dashboard");
    }
  }, [isAuth, router]);

  return <SigninForm />;
}
