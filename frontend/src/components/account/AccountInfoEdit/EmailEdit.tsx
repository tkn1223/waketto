import { useState } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp.tsx";
import { Label } from "@/components/ui/label.tsx";
import { PasswordInput } from "@/components/ui/passwordinput.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import {
  confirmEmailChange,
  getCurrentUserInfo,
  updateEmail,
} from "@/lib/auth.ts";
import { toast } from "sonner";

export function EmailEdit() {
  const { userInfo } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [step, setStep] = useState<"edit" | "confirm">("edit");
  const [error, setError] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const handleEmailSave = async () => {
    setError("");
    if (newEmail === "") {
      setError("新しいメールアドレスを入力してください");
      return;
    }
    if (!userInfo.email) {
      setError("ユーザー情報を取得できませんでした");
      return;
    }
    if (userInfo.email === newEmail) {
      setError("新しいメールアドレスと現在のメールアドレスが同じです");
      return;
    }

    const result = await updateEmail(newEmail);
    if (result) {
      setStep("confirm");
      toast.success(`${newEmail} に確認コードを送信しました`);
    } else {
      console.error("メールアドレス更新エラー:", error);
      setError("メールアドレスの更新に失敗しました");
    }
  };

  const handleConfirmCode = async () => {
    setIsConfirmLoading(true);
    setError("");

    try {
      const result = await confirmEmailChange(confirmationCode);

      if (result.success) {
        // ユーザー情報を再取得
        await getCurrentUserInfo();
        toast.success("メールアドレスを変更しました");
        // フォームをリセット
        setNewEmail("");
        setCurrentPassword("");
        setConfirmationCode("");
        setStep("edit");
      } else {
        setError(result.error || "確認コードの検証に失敗しました");
      }
    } catch (err) {
      console.error("確認コード検証エラー:", err);
      setError("予期しないエラーが発生しました");
    } finally {
      setIsConfirmLoading(false);
    }
  };

  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            メールアドレスの変更（実装中）
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === "edit" ? (
            <>
              <form className="space-y-5">
                <div className="flex flex-col lg:flex-row gap-6">
                  <p className="text-lg font-bold lg:w-1/6">
                    現在のメールアドレス
                  </p>
                  <p className="lg:w-5/6">{userInfo.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-lg font-bold lg:w-1/6">
                    新しいメールアドレス
                  </Label>
                  <Input
                    type="text"
                    className="bg-white lg:w-1/3"
                    placeholder="新しいメールアドレスを入力"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}
              </form>
            </>
          ) : (
            <>
              <form className="space-y-5">
                <div className="mb-6 flex flex-col items-center">
                  <Label className="block text-gray-700 mb-6 leading-relaxed text-center">
                    {newEmail} に確認コードを送信しました。
                    <br />
                    メールに記載された6桁のコードを入力してください。
                  </Label>
                  <InputOTP
                    required
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    value={confirmationCode}
                    onChange={(code) => setConfirmationCode(code)}
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
                  <div className="text-red-600 text-sm text-center mb-4">
                    {error}
                  </div>
                )}
              </form>
            </>
          )}
        </CardContent>
        <CardFooter>
          {step === "edit" ? (
            <Button onClick={() => void handleEmailSave()}>
              メールアドレスを更新
            </Button>
          ) : (
            <div className="flex justify-center space-x-4 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep("edit");
                  setConfirmationCode("");
                  setError("");
                }}
              >
                戻る
              </Button>
              <Button
                onClick={() => void handleConfirmCode()}
                disabled={isConfirmLoading || confirmationCode.length !== 6}
              >
                {isConfirmLoading ? "確認中..." : "確認"}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
