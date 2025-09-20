"use client";

import { signUpWithCognito, confirmSignUpWithCognito } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const [error, setError] = useState("");
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
    } catch (err) {
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
        router.push("/dashboard");
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

  // パスワードのバリデーション
  const validatePassword = (password: string) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("8文字以上で入力してください");
    }
    if (!/\d/.test(password)) {
      errors.push("少なくとも1つの数字を含めてください");
    }
    const specialChars = /[$*.[\]{}()?\-"!@#%&/\\,><':;|_~`+=]/;
    if (!specialChars.test(password)) {
      errors.push(
        "少なくとも1つの特殊文字を含めてください（例: ~ $ * . [ ] { } ( ) ? - \" ! @ # % & / \\ , > < ' : ; | _ ` + =）"
      );
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("少なくとも1つの大文字を含めてください");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("少なくとも1つの小文字を含めてください");
    }
    return errors;
  };

  const validatePasswordMatch = (password: string, passwordConfirm: string) => {
    if (validationTimer.current) {
      clearTimeout(validationTimer.current);
    }
    validationTimer.current = setTimeout(() => {
      const passwordErrors = validatePassword(password);

      if (passwordErrors.length > 0) {
        setError(passwordErrors[0]);
      } else if (password !== passwordConfirm) {
        setError("パスワードが一致しません");
      } else {
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
            onSubmit={handleConfirmSubmit}
            className="px-10 py-8 rounded-sm shadow-sm bg-sky-50"
          >
            <div className="mb-12 flex flex-col items-center">
              <label
                htmlFor="code"
                className="block text-gray-500 mb-6 leading-relaxed"
              >
                {email} に確認コードを送信しました。
                <br />
                メールに記載された6桁のコードを入力してください。
              </label>
              <InputOTP
                id="code"
                required
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                value={confirmationCode}
                onChange={(confirmationCode) =>
                  setConfirmationCode(confirmationCode)
                }
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="w-13 h-13 text-xl bg-zinc-50"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-13 h-13 text-xl bg-zinc-50"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-13 h-13 text-xl bg-zinc-50"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-13 h-13 text-xl bg-zinc-50"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-13 h-13 text-xl bg-zinc-50"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-13 h-13 text-xl bg-zinc-50"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center mb-8">
                {error}
              </div>
            )}

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
            <div className="mb-2">
              <p className="text-base/6 mb-1 ml-1">パスワード</p>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full rounded-md px-3 py-2 pr-10 border border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:z-10"
                  placeholder="パスワード"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePasswordMatch(e.target.value, passwordConfirm);
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center w-8 h-full text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "パスワードを隠す" : "パスワードを表示"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-base/6 mb-1 ml-1">パスワード確認用</p>
              <label htmlFor="password-confirm" className="sr-only">
                もう一度パスワードを入力してください
              </label>
              <div className="relative">
                <input
                  id="password-confirm"
                  name="password-confirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full rounded-md px-3 py-2 pr-10 border border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:z-10"
                  placeholder="もう一度パスワードを入力してください"
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                    validatePasswordMatch(password, e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center w-8 h-full text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  aria-label={
                    showPasswordConfirm
                      ? "パスワードを隠す"
                      : "パスワードを表示"
                  }
                >
                  {showPasswordConfirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center mb-6">{error}</div>
          )}

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
