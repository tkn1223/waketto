"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithCognito } from "@/lib/auth";

export default function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithCognito({ email, password });

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "ログインに失敗しました");
      }
    } catch (err) {
      setError("予期しないエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-8 px-4">
      <div className="max-w-xl w-full space-y-8">
        <div className="max-w-sm mx-auto flex flex-col items-center">
          <h2 className="mb-5 text-2xl text-center font-extrabold text-gray-900">
            ふたりの支出、ピタっと管理
          </h2>
          <ol className="text-sm/6 text-left space-y-2">
            <li className="tracking-[-.01em]">
              💡 予算と実績をまとめて管理できる 【 支出管理表 × 家計簿 】
            </li>
            <li className="tracking-[-.01em]">
              📊 月ごと・年ごとの支出がひと目でわかる。
            </li>
            <li className="tracking-[-.01em">
              👥 ひとりでもふたりでも。個人モード/共有モードで家計管理を分担。
            </li>
          </ol>
          <p className="text-base/6 mt-6">
            【 わけっと 】 で、ラクに・的確に家計管理を始めましょう！
          </p>
        </div>
        <form
          className="px-10 py-8 rounded-sm shadow-sm bg-sky-50 mb-15"
          onSubmit={handleSubmit}
        >
          <div>
            <div className="mb-6">
              <p className="text-base/6 mb-1 ml-1">メールアドレス</p>
              <label htmlFor="email" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full rounded-md px-3 py-2 border border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:z-10"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <p className="text-base/6 mb-1 ml-1">パスワード</p>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full rounded-md px-3 py-2 border border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:z-10"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative mx-auto flex justify-center py-2 px-15 text-lg font-bold rounded-sm text-white bg-amber-600 hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>
          </div>
        </form>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="mx-auto flex justify-center py-2 px-15 text-base rounded-sm text-blue-700 bg-white border border-blue-700 hover:bg-blue-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "サインアップページへ移動中..."
              : "アカウントを新規作成"}
          </button>

          <div className="mt-6 relative">
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 shadow-sm">
              <div className="mx-auto flex items-start justify-center">
                <div>
                  <svg
                    className="h-5 w-5 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-zinc-700">
                    初めてご利用の方は、上記ボタンを押してアカウントを作成してください
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-zinc-50 border-l border-t border-zinc-200 transform rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
