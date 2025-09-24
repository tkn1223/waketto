"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionDetail } from "@/components/dashboard/Transaction/TransactionDetail.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { getCurrentUserInfo, isAuthenticated, type User } from "@/lib/auth.ts";
import { getExpenseReport } from "@/lib/api.ts";

export default function DashboardPage() {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // 認証チェック
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();

        if (!authenticated) {
          router.push("/signin");

          return;
        }

        // ユーザー情報を取得
        try {
          const userData = await getCurrentUserInfo();

          if (userData) {
            setUser(userData);
            setIsLoading(false);
          }
        } catch (_err) {
          setError("ユーザー情報の取得に失敗しました");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        setError("認証チェックに失敗しました");
        setIsLoading(false);
      }
    };

    void checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchExpenseReport = async () => {
      const response = await getExpenseReport();
      if (response.status) {
        console.log(response.data);
      } else {
        console.error("支出管理表の取得に失敗しました");
      }
    };
    void fetchExpenseReport();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/signin")}>
            ログインページに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 px-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 支出管理表カード */}
        <div className="lg:col-span-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <Card>
              <CardHeader>
                <CardTitle>{user?.name} の支出管理表</CardTitle>
              </CardHeader>
              <CardContent>
                {/* 2x2グリッドレイアウト */}
                <div className="grid grid-cols-2 gap-4">
                  {/* １行目 */}
                  {/* 左: 固定費 - 毎月 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      固定費 - 毎月
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">通信費</span>
                        <span className="font-medium">3,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">家賃</span>
                        <span className="font-medium">50,000円</span>
                      </div>
                    </div>
                  </div>

                  {/* 左: 変動費 - 毎月 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      変動費 - 毎月
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">食費</span>
                        <span className="font-medium">30,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">交通費</span>
                        <span className="font-medium">5,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">日用品</span>
                        <span className="font-medium">3,000円</span>
                      </div>
                    </div>
                  </div>

                  {/* ２行目 */}
                  {/* 右: 固定費 - 不定期 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      固定費 - 不定期
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">税金(自動車税)</span>
                        <span className="font-medium">35,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">保険料</span>
                        <span className="font-medium">15,000円</span>
                      </div>
                    </div>
                  </div>

                  {/* 右: 変動費 - 不定期 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      変動費 - 不定期
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">家具家電</span>
                        <span className="font-medium">10,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">医療費</span>
                        <span className="font-medium">5,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">外食費</span>
                        <span className="font-medium">15,000円</span>
                      </div>
                    </div>
                  </div>

                  {/* ３行目 */}
                  {/* 左: 豊かな浪費 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      豊かな浪費
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">外食費</span>
                        <span className="font-medium">10,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">美容費</span>
                        <span className="font-medium">5,000円</span>
                      </div>
                    </div>
                  </div>

                  {/* 右: 貯蓄・投資 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      貯蓄・投資
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">教育費</span>
                        <span className="font-medium">30,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">旅行費</span>
                        <span className="font-medium">15,000円</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* 取引明細カード */}
        <div className="lg:col-span-1">
          <TransactionDetail user={user!} />
        </div>
        {/* 予算消化率 */}
        <div className="col-span-3 space-y-3">
          <div className="font-medium text-lg">予算の消化状況</div>

          {/* 予算１つ目：旅行費 */}
          <div className="p-2 border border-gray-300 space-y-1">
            <div className="grid grid-cols-3 gap-2">
              <Label className="text-md p-2 flex items-center justify-center">
                項目：旅行費
              </Label>
              <Label className="text-md p-2 flex items-center justify-center">
                予算：24万
              </Label>
              <Label className="text-md p-2 flex items-center justify-center">
                残り：12万
              </Label>
            </div>

            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <Label className="p-2 text-xs bg-gray-200 flex items-center justify-center">
                  {i + 1} 月
                </Label>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-1">
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥50,000
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥70,000
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
            </div>
          </div>

          {/* 予算２つ目：家具家電 */}
          <div className="p-2 border border-gray-300 space-y-1">
            <div className="grid grid-cols-3 gap-2">
              <Label className="text-md p-2 flex items-center justify-center">
                項目：旅行費
              </Label>
              <Label className="text-md p-2 flex items-center justify-center">
                予算：24万
              </Label>
              <Label className="text-md p-2 flex items-center justify-center">
                残り：12万
              </Label>
            </div>

            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <Label className="p-2 text-xs bg-gray-200 flex items-center justify-center">
                  {i + 1} 月
                </Label>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <Label className="p-2 text-xs flex items-center justify-center">
                  月の支出
                </Label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
