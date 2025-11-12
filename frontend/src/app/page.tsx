"use client";

import { useAuth } from "@/contexts/AuthContext.tsx";

export default function Home() {
  const { isLoading } = useAuth();

  // リダイレクト処理はAuthContextで実施
  if (isLoading) {
    return null;
  }

  return null;
}
