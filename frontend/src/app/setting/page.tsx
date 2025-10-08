"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useSettingForm } from "@/hooks/useSettingForm.tsx";

export default function SettingPage() {
  const { partnerId, handlePartnerId, handleSave } = useSettingForm();

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 px-10">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">設定画面</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Label className="text-lg font-bold min-w-32">
                パートナー設定
              </Label>
              <Input
                type="text"
                className="max-w-35"
                placeholder="ユーザーIDを入力"
                value={partnerId}
                onChange={(e) => handlePartnerId(e.target.value)}
                maxLength={10}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>保存</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
