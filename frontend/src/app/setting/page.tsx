"use client";

import { useAuth } from "@/contexts/AuthContext.tsx";
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
import { useSettingForm } from "@/hooks/useSettingForm.tsx";

export default function SettingPage() {
  const { partnerId, handlePartnerId, handleUserInfoSave } = useSettingForm();
  const { userInfo } = useAuth();

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 px-10">
      <h2 className="text-2xl font-bold">ユーザー情報の変更</h2>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">ユーザー情報</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex items-center gap-3 lg:w-1/4 border-b border-gray-200 pb-2">
                <p className="text-lg font-bold lg:w-1/3">ユーザーID</p>
                <p className="lg:w-2/3">{userInfo.user_id}</p>
              </div>
              <div className="flex items-center gap-3 lg:w-1/4 border-b border-gray-200 pb-2">
                <Label className="text-lg font-bold lg:w-1/3">ユーザー名</Label>
                <Input
                  type="text"
                  className="bg-white lg:w-2/3"
                  placeholder="ユーザー名を入力"
                  value={userInfo.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex items-center gap-3 lg:w-1/4 border-b border-gray-200 pb-2">
                <Label className="text-lg font-bold lg:w-1/3">パートナー</Label>
                <Input
                  type="text"
                  className="bg-white lg:w-2/3"
                  placeholder="ユーザーIDを入力"
                  value={partnerId}
                  onChange={(e) => handlePartnerId(e.target.value)}
                  maxLength={10}
                />
              </div>
              {partnerId ?? (
                <>
                  <p>⇒ 登録されるパートナーのユーザー名</p>
                  <p>たかな</p>
                </>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={() => void handleUserInfoSave()}>更新</Button>
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-bold mt-8">ログイン情報の変更</h2>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            メールアドレスの変更
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div className="flex flex-col lg:flex-row gap-6">
              <p className="text-lg font-bold lg:w-1/6">現在のメールアドレス</p>
              <p className="lg:w-5/6">{userInfo.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-lg font-bold lg:w-1/6">
                新しいメールアドレス
              </Label>
              <Input
                type="text"
                className="bg-white lg:w-5/6"
                placeholder="ユーザー名を入力"
                value={userInfo.name}
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
                value={userInfo.name}
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

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">パスワードの変更</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div className="flex flex-col lg:flex-row gap-6">
              <Label className="text-lg font-bold lg:w-1/6">
                現在のパスワード
              </Label>
              <Input
                type="text"
                className="bg-white lg:w-5/6"
                placeholder="ユーザー名を入力"
                value={userInfo.name}
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
                value={userInfo.name}
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
                value={userInfo.name}
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
    </div>
  );
}
