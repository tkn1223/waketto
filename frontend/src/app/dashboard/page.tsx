"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TransactionDetail } from "@/components/dashboard/Transaction/TransactionDetail.tsx";
import { ExpenseTable } from "@/components/dashboard/ExpenseReport/ExpenseTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useExpenseReport } from "@/lib/swr.ts";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useViewMode } from "@/contexts/ViewModeContext.tsx";

export default function DashboardPage() {
  const router = useRouter();
  const { userInfo, isAuth, isLoading } = useAuth();
  const { user } = useViewMode();

  const {
    data: expenseReport,
    error: expenseReportError,
    isLoading: isExpenseReportLoading,
    mutate,
  } = useExpenseReport(isAuth, user);

  // 認証失敗時のリダイレクト
  useEffect(() => {
    if (!isAuth && !isLoading) {
      router.push("/signin");
    }
  }, [isAuth, isLoading, router]);

  if (isLoading || !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
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
                <CardTitle>{userInfo?.name} の支出管理表</CardTitle>
              </CardHeader>
              <CardContent>
                {isExpenseReportLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">データを読み込み中...</p>
                  </div>
                ) : expenseReportError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">データの取得に失敗しました</p>
                    <Button onClick={() => mutate()} className="mt-2">
                      再試行
                    </Button>
                  </div>
                ) : expenseReport ? (
                  <ExpenseTable
                    expenseReport={expenseReport}
                    onTransactionUpdate={mutate}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">データがありません</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        {/* 取引明細カード(mutateでデータ更新) */}
        <div className="lg:col-span-1">
          <TransactionDetail onUpdate={mutate} />
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
                <Label
                  key={`month-lavel-${i}`}
                  className="p-2 text-xs bg-gray-200 flex items-center justify-center"
                >
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
                <Label
                  key={`month-lavel-${i}`}
                  className="p-2 text-xs bg-gray-200 flex items-center justify-center"
                >
                  {i + 1} 月
                </Label>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <Label
                  key={`month-lavel-${i}`}
                  className="p-2 text-xs flex items-center justify-center"
                >
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
