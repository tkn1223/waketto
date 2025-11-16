import { CircleQuestionMark } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { useSettingForm } from "@/hooks/useSettingForm.tsx";

export function UserInfoEdit() {
  const {
    userInfo,
    userName,
    partnerId,
    handleUserName,
    handlePartnerId,
    handleUserInfoSave,
  } = useSettingForm();

  const handlePartnerReset = () => {
    console.log("パートナーを解除します");
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
                      variant="destructive"
                      size="sm"
                      onClick={() => void handlePartnerReset()}
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
          <Button onClick={() => void handleUserInfoSave()}>更新</Button>
        </CardFooter>
      </Card>
    </>
  );
}
