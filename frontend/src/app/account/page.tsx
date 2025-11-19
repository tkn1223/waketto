"use client";

import { EmailEdit } from "@/components/account/AccountInfoEdit/EmailEdit.tsx";
import { PasswordEdit } from "@/components/account/AccountInfoEdit/PasswordEdit.tsx";
import { UserInfoEdit } from "@/components/account/UserInfoEdit.tsx";
import { BackToHomeButton } from "@/components/ui/backtohomebutton.tsx";

export default function SettingPage() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 px-10">
      <h2 className="text-2xl font-bold">ユーザー情報の変更</h2>
      <UserInfoEdit />

      <h2 className="text-2xl font-bold mt-8">ログイン情報の変更</h2>
      <EmailEdit />
      <PasswordEdit />

      <BackToHomeButton />
    </div>
  );
}
