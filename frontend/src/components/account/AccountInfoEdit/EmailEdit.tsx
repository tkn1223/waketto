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

export function EmailEdit() {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNewEmailChangeEmail = (value: string) => {
    setNewEmail(value);
  };

  const handlePasswordChangeEmail = (value: string) => {
    setPassword(value);
  };

  const handleEmailSave = () => {
    console.log("メールアドレスを更新します");
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
              <p className="lg:w-5/6">********@example.com</p>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-lg font-bold lg:w-1/6">
                新しいメールアドレス
              </Label>
              <Input
                type="text"
                className="bg-white lg:w-5/6"
                placeholder="ユーザー名を入力"
                value={newEmail}
                onChange={(e) => handleNewEmailChangeEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-lg font-bold lg:w-1/6">
                現在のパスワード
              </Label>
              <Input
                type="text"
                className="bg-white lg:w-5/6"
                placeholder="ユーザー名を入力"
                value={password}
                onChange={(e) => handlePasswordChangeEmail(e.target.value)}
              />
            </div>
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
