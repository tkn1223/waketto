"use client";

import { useState } from "react";
import { CircleQuestionMark } from "lucide-react";
import { toast } from "sonner";
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
import { ResultDialog } from "@/components/ui/result-dialog.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useViewMode } from "@/contexts/ViewModeContext.tsx";
import { useSettingForm } from "@/hooks/useSettingForm.tsx";
import { postPartnerReset } from "@/lib/api.ts";

export function UserInfoEdit() {
  const { refreshUserInfo } = useAuth();
  const { setUser } = useViewMode();
  const {
    userInfo,
    userName,
    partnerId,
    handleUserName,
    handlePartnerId,
    handleUserInfoSave,
  } = useSettingForm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenResultDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handlePartnerReset = async () => {
    try {
      const response = await postPartnerReset();

      if (response.status) {
        await refreshUserInfo();
        setUser("alone");
        handlePartnerId("");
        setIsDialogOpen(false);
        toast.success("パートナーを解除しました");
      } else {
        toast.error(response.message, {
          className: "!bg-red-600 !text-white !border-red-800",
        });
      }
    } catch (error) {
      console.error("API呼び出しエラー:", error);
      toast.error("パートナーの解除中に サーバーエラーが発生しました", {
        className: "!bg-red-600 !text-white !border-red-800",
      });
    }
  };

  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">ユーザー情報</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex items-center gap-3 lg:w-1/3 border-b border-gray-200 pb-2">
                <p className="text-lg font-bold lg:w-1/3">ユーザーID</p>
                <p className="lg:w-2/3">{userInfo.user_id}</p>
              </div>
              <div className="flex items-center gap-3 lg:w-1/3 border-b border-gray-200 pb-2">
                <Label className="text-lg font-bold lg:w-1/3">ユーザー名</Label>
                <Input
                  type="text"
                  className="bg-white lg:w-2/3"
                  placeholder="ユーザー名を入力"
                  value={userName}
                  onChange={(e) => void handleUserName(e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex items-center gap-3 lg:w-1/3 border-b border-gray-200 pb-2">
                <div className="flex items-center gap-3 lg:w-1/3">
                  <Label className="text-lg font-bold">パートナー</Label>
                  {/* クエスチョンアイコン */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CircleQuestionMark className="text-gray-400 w-5" />
                    </TooltipTrigger>
                    <TooltipContent className="p-3 text-sm">
                      <p>
                        パートナーを登録することで、互いの支出を一緒に管理できるようになります（共有モード）
                        <br />
                        パートナーのユーザーIDを入力してください
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {/* パートナーID入力フォーム */}
                {userInfo.couple_id ? (
                  <div className="flex items-center justify-between lg:w-2/3 w-full">
                    <p>登録済：{userInfo.partner_user_id}</p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => void handleOpenResultDialog()}
                    >
                      解除
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="text"
                    className="bg-white lg:w-2/3"
                    placeholder="ユーザーIDを入力"
                    value={partnerId}
                    onChange={(e) => void handlePartnerId(e.target.value)}
                    maxLength={10}
                  />
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            onClick={() => void handleUserInfoSave()}
            className="bg-emerald-600"
          >
            更新
          </Button>
        </CardFooter>
      </Card>

      <ResultDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAccept={() => void handlePartnerReset()}
        title="パートナー情報を解除しますか？"
        content={
          <>
            <p className="mb-4">パートナー情報を解除すると</p>
            <ul className="list-disc font-bold pl-6">
              <li>振り分けを行った取引明細</li>
              <li>予算管理表の設定</li>
              <li>サブスクリプションの設定</li>
            </ul>
            <p className="mt-4">などの情報が削除され、閲覧ができなくなります</p>
          </>
        }
        acceptButtonText="解除する"
        cancelButtonText="キャンセル"
      />
    </>
  );
}
