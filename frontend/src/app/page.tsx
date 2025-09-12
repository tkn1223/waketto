"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";

export default function Home() {
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

  return (
    <div className="font-sans grid-rows-[20px_1fr_20px] items-center justify-items-center pb-20 gap-16 sm:p-10">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold text-center">家計簿アプリ</h1>

        <p className="text-xl font-medium">Cognito JWT認証が実装されました！</p>
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">✅ Cognito認証の実装</li>
          <li className="mb-2 tracking-[-.01em]">
            ✅ JWT検証ミドルウェアの実装
          </li>
          <li className="tracking-[-.01em]">
            ✅ ログイン・ダッシュボード画面の作成
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <p>ログインして家計簿アプリを使い始めましょう</p>
          <Button asChild>
            <Link href="/login">ログイン</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
