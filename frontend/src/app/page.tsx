"use client";

import { useAuth } from "@/contexts/AuthContext.tsx";

export default function Home() {
  const { isLoading } = useAuth();

  // リダイレクト処理はAuthContextで実施
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">支出わけっと</h1>
      </div>
    </div>
  );
}
