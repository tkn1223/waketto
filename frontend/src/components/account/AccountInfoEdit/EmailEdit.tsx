import { useState } from "react";
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
import { PasswordInput } from "@/components/ui/passwordinput.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { toast } from "sonner";

export function EmailEdit() {
  const { userInfo } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailSave = () => {
    if (newEmail === "") {
      setError("新しいメールアドレスを入力してください");
      return;
    }
    if (currentPassword === "") {
      setError("現在のパスワードを入力してください");
      return;
    }

    try {
      // const response = await updateEmail(newEmail, currentPassword);
      toast.success("メールアドレスを更新しました");
    } catch (error) {
      console.error("メールアドレス更新エラー:", error);
      setError("メールアドレスの更新に失敗しました");
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
          <form className="space-y-5">
            <div className="flex flex-col lg:flex-row gap-6">
              <p className="text-lg font-bold lg:w-1/6">現在のメールアドレス</p>
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
            <div className="flex items-center gap-3">
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
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={() => void handleEmailSave()}>
            メールアドレスを更新
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
