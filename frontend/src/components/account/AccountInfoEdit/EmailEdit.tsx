import { useState } from "react";
import { toast } from "sonner";
import { VerificationCodeInput } from "@/components/auth/VerificationCodeInput.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { confirmEmailChange, updateEmail } from "@/lib/auth.ts";

export function EmailEdit() {
  const { userInfo, refreshUserInfo } = useAuth();
  const [newEmail, setNewEmail] = useState("");
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
        // ユーザー情報を再取得してAuthContextの状態を更新
        await refreshUserInfo();
        toast.success("メールアドレスを変更しました");

        // フォームをリセット
        setNewEmail("");
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
            メールアドレスの変更
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
                <VerificationCodeInput
                  email={newEmail}
                  code={confirmationCode}
                  onCodeChange={setConfirmationCode}
                  error={error}
                  className="mb-6"
                  errorClassName="mb-4"
                />
              </form>
            </>
          )}
        </CardContent>
        <CardFooter>
          {step === "edit" ? (
            <Button
              onClick={() => void handleEmailSave()}
              className="bg-emerald-600"
            >
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
