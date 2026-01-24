import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { PasswordInput } from "@/components/ui/passwordinput.tsx";
import { ValidationErrors } from "@/components/ui/validationerrors.tsx";
import { changePassword } from "@/lib/auth.ts";
import { validatePassword, validatePasswordMatch } from "@/lib/validation.ts";

export function PasswordEdit() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validationTimer = useRef<NodeJS.Timeout | null>(null);

  // パスワードと確認用パスワードをバリデーションし、エラー配列を返す
  const validatePasswords = (
    password: string,
    passwordConfirm: string
  ): string[] => {
    const errors = validatePassword(password);
    const matchError = validatePasswordMatch(password, passwordConfirm);

    if (matchError) {
      errors.push(matchError);
    }

    return errors;
  };

  // 入力されたパスワードと確認用パスワードをバリデーション（デバウンス付き）
  const handlePasswordValidation = (
    password: string,
    passwordConfirm: string
  ) => {
    if (validationTimer.current) {
      clearTimeout(validationTimer.current);
    }
    validationTimer.current = setTimeout(() => {
      const allErrors = validatePasswords(password, passwordConfirm);
      setPasswordErrors(allErrors);
    }, 500);
  };

  // パスワードを更新する
  const handlePasswordSave = async () => {
    // デバウンスタイマーをクリアして、即座に最新の値をバリデーション
    if (validationTimer.current) {
      clearTimeout(validationTimer.current);
    }

    const allErrors = validatePasswords(newPassword, newPasswordConfirm);

    if (allErrors.length > 0) {
      setPasswordErrors(allErrors);

      return;
    }

    // パスワード変更実行
    try {
      setPasswordErrors([]);
      const result = await changePassword({
        currentPassword,
        newPassword,
      });

      if (result) {
        toast.success("パスワードを更新しました");
        // フォームをリセット
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
      } else {
        toast.error("パスワードの更新に失敗しました", {
          className: "!bg-red-600 !text-white !border-red-800",
        });
      }
    } catch (error) {
      console.error("パスワード変更エラー:", error);
      toast.error("パスワードの更新に失敗しました", {
        className: "!bg-red-600 !text-white !border-red-800",
      });
    }
  };

  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">パスワードの変更</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div className="flex flex-col lg:flex-row gap-3">
              <Label className="text-lg font-bold lg:w-1/6">
                現在のパスワード
              </Label>
              <div className="lg:w-1/3">
                <PasswordInput
                  className="bg-white"
                  placeholder="現在のパスワードを入力"
                  value={currentPassword}
                  onValueChange={setCurrentPassword}
                  autoComplete="current-password"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-lg font-bold lg:w-1/6">
                新しいパスワード
              </Label>
              <div className="lg:w-1/3">
                <PasswordInput
                  className="bg-white"
                  placeholder="新しいパスワードを入力"
                  value={newPassword}
                  onValueChange={(value) => {
                    setNewPassword(value);
                    handlePasswordValidation(value, newPasswordConfirm);
                  }}
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-lg font-bold lg:w-1/6">
                新しいパスワード（確認）
              </Label>
              <div className="lg:w-1/3">
                <PasswordInput
                  className="bg-white"
                  placeholder="新しいパスワード（確認）を入力"
                  value={newPasswordConfirm}
                  onValueChange={(value) => {
                    setNewPasswordConfirm(value);
                    handlePasswordValidation(newPassword, value);
                  }}
                  autoComplete="new-password"
                />
              </div>
            </div>
            <ValidationErrors errors={passwordErrors} className="mt-2" />
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => void handlePasswordSave()}
            className="bg-emerald-600"
          >
            パスワードを更新
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
