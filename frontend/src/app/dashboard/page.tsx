"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  getCurrentUserInfo,
  isAuthenticated,
  signOutUser,
  type User,
} from "@/lib/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 認証チェック
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          router.push("/signin");
          return;
        }

        // Laravel API未実装のため、認証確認後にローディング解除
        setIsLoading(false);

        // ユーザー情報を取得（laravelAPI実装後に有効化）
        // try {
        //   const userData = await getCurrentUserInfo();

        //   if (userData) {
        //     setUser(userData);
        //   } else {
        //     setError("ユーザー情報の取得に失敗しました");
        //   }
        // } catch (error) {
        //   setError("ユーザー情報の取得に失敗しました");
        //   console.error("Failed to fetch user:", error);
        // }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setError("認証チェックに失敗しました");
        setIsLoading(false);
      }
    };

    void checkAuth();
  }, [router]);

  const handleLogout = () => {
    void signOutUser();
  };

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/signin")}>
            ログインページに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-6 px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                家計簿機能
              </h2>
              <p className="text-gray-600 mb-4">
                正しくログインが行えました！
                <br />
                今後ここに家計簿の機能を追加していきます。
              </p>
              <div className="mt-6 flex space-x-4">
                <Button>収入を記録</Button>
                <Button variant="outline">支出を記録</Button>
                <Button variant="outline">レポートを見る</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
