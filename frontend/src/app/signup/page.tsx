"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button.tsx";
import { PasswordInput } from "@/components/ui/passwordinput.tsx";
import { ValidationErrors } from "@/components/ui/validationerrors.tsx";
import { VerificationCodeInput } from "@/components/auth/VerificationCodeInput.tsx";
import { confirmSignUpWithCognito, signUpWithCognito } from "@/lib/auth.ts";
import { validatePassword, validatePasswordMatch } from "@/lib/validation.ts";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [step, setStep] = useState<"signup" | "confirm">("signup");

  const router = useRouter();
  const validationTimer = useRef<NodeJS.Timeout | null>(null);

  // アカウント作成ボタンのハンドリング
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupLoading(true);
    setError("");

    try {
      const result = await signUpWithCognito({ email, password });

      if (result.success) {
        if (result.error?.includes("確認コード")) {
          setStep("confirm");
        }
      } else {
        setError(result.error || "アカウント作成に失敗しました");
      }
    } catch (_err) {
      setError("アカウント作成中に、予期しないエラーが発生しました");
    } finally {
      setIsSignupLoading(false);
    }
  };

  // 確認コード入力画面のハンドリング
  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmLoading(true);
    setError("");

    try {
      const result = await confirmSignUpWithCognito(
        email,
        confirmationCode,
        password
      );

      if (result.success) {
        window.dispatchEvent(new CustomEvent("signedIn"));
        // signedIn後にdashboardにリダイレクト
        router.replace("/dashboard");
      } else {
        setError(result.error || "確認に失敗しました");
      }
    } catch (err) {
      console.error("予期しないエラーが発生しました２", err);
      setError("予期しないエラーが発生しました２");
    } finally {
      setIsConfirmLoading(false);
    }
  };

  // パスワードのバリデーション（デバウンス付き）
  const handlePasswordValidation = (
    password: string,
    passwordConfirm: string
  ) => {
    if (validationTimer.current) {
      clearTimeout(validationTimer.current);
    }
    validationTimer.current = setTimeout(() => {
      const errors = validatePassword(password);
      const matchError = validatePasswordMatch(password, passwordConfirm);

      // すべてのエラーを配列にまとめる
      const allErrors = [...errors];

      if (matchError) {
        allErrors.push(matchError);
      }

      setPasswordErrors(allErrors);

      if (allErrors.length > 0) {
        setError("");
      }
    }, 500);
  };

  // 確認コード入力画面
  if (step === "confirm") {
    return (
      <div className="min-h-screen flex justify-center py-8 px-4">
        <div className="max-w-xl w-full space-y-8">
          <h1 className="text-2xl font-bold text-center">メールアドレス認証</h1>

          <form
            onSubmit={(e) => void handleConfirmSubmit(e)}
            className="px-10 py-8 rounded-sm shadow-sm bg-sky-50"
          >
            <VerificationCodeInput
              email={email}
              code={confirmationCode}
              onCodeChange={setConfirmationCode}
              error={error}
              id="code"
              className="mb-12"
              labelClassName="text-gray-500"
              errorClassName="mb-8"
            />

            <div className="flex justify-center space-x-10">
              <button
                type="button"
                onClick={() => setStep("signup")}
                className="py-2 px-15 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                戻る
              </button>
              <button
                type="submit"
                disabled={isConfirmLoading}
                className="py-2 px-15 bg-amber-600 text-white rounded-md hover:bg-amber-500 disabled:opacity-50"
              >
                {isConfirmLoading ? "確認中..." : "確認"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center py-8 px-4">
      <div className="max-w-xl w-full space-y-8">
        <h1 className="text-2xl font-bold text-center">アカウント作成</h1>
        <div className="text-center">
          すでにアカウントをお持ちですか？
          <Button asChild variant="link">
            <Link href="/signin">ログインする</Link>
          </Button>
        </div>
        <form
          className="px-10 py-8 rounded-sm shadow-sm bg-sky-50 mb-15"
          onSubmit={(e) => void handleSubmit(e)}
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
            <div className="mb-2">
              <p className="text-base/6 mb-1 ml-1">パスワード</p>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full rounded-md px-3 py-2 border border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:z-10"
                placeholder="パスワード"
                value={password}
                onValueChange={(value) => {
                  setPassword(value);
                  handlePasswordValidation(value, passwordConfirm);
                }}
              />
            </div>
            <div className="mb-6">
              <p className="text-base/6 mb-1 ml-1">パスワード確認用</p>
              <label htmlFor="password-confirm" className="sr-only">
                もう一度パスワードを入力してください
              </label>
              <PasswordInput
                id="password-confirm"
                name="password-confirm"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full rounded-md px-3 py-2 border border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:z-10"
                placeholder="もう一度パスワードを入力してください"
                value={passwordConfirm}
                onValueChange={(value) => {
                  setPasswordConfirm(value);
                  handlePasswordValidation(password, value);
                }}
              />
            </div>
          </div>

          <ValidationErrors
            errors={passwordErrors}
            className="mb-2 text-center"
          />

          <div>
            <button
              type="submit"
              disabled={isSignupLoading}
              className="group relative mx-auto flex justify-center py-2 px-15 text-lg font-bold rounded-sm text-white bg-amber-600 hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSignupLoading ? "アカウント作成中..." : "アカウントを作成する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
