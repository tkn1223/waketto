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

export function PasswordEdit() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const handleCurrentPasswordChangePassword = (value: string) => {
    setCurrentPassword(value);
  };

  const handleNewPasswordChangePassword = (value: string) => {
    setNewPassword(value);
  };

  const handleNewPasswordConfirmChangePassword = (value: string) => {
    setNewPasswordConfirm(value);
  };

  const handlePasswordSave = () => {
    console.log("パスワードを更新します");
  };

  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            パスワードの変更（実装中）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div className="flex flex-col lg:flex-row gap-3">
              <Label className="text-lg font-bold lg:w-1/6">
                現在のパスワード
              </Label>
              <Input
                type="text"
                className="bg-white lg:w-5/6"
                placeholder="ユーザー名を入力"
                value={currentPassword}
                onChange={(e) =>
                  handleCurrentPasswordChangePassword(e.target.value)
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-lg font-bold lg:w-1/6">
                新しいパスワード
              </Label>
              <Input
                type="text"
                className="bg-white lg:w-5/6"
                placeholder="ユーザー名を入力"
                value={newPassword}
                onChange={(e) =>
                  handleNewPasswordChangePassword(e.target.value)
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-lg font-bold lg:w-1/6">
                新しいパスワード（確認）
              </Label>
              <Input
                type="text"
                className="bg-white lg:w-5/6"
                placeholder="ユーザー名を入力"
                value={newPasswordConfirm}
                onChange={(e) =>
                  handleNewPasswordConfirmChangePassword(e.target.value)
                }
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={() => void handlePasswordSave()}>
            パスワードを更新
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
