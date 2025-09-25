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
  const [expenseReport, setExpenseReport] = useState<any>();
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
      try {
        setIsLoading(true);
        const response = await getExpenseReport();
        setExpenseReport(response);
        setIsLoading(false);
      } catch (error) {
        console.error("支出管理表の取得に失敗しました:", error);
        setError("支出管理表の取得に失敗しました");
        setIsLoading(false);
      }
    };

    // ユーザー情報が取得できてからデータ取得を実行
    if (user) {
      void fetchExpenseReport();
    }
  }, [user]); // userが変更された時に実行

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
                {expenseReport ? (
                  <div className="grid grid-cols-2 gap-4">
                    {/* 左: 固定費 - 毎月 */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                        {expenseReport.data?.monthly_fixed_cost?.group_name}
                      </h4>
                      {Object.entries(
                        expenseReport.data?.monthly_fixed_cost?.categories
                      ).map(([key, category]: [string, any]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                        >
                          <span className="text-sm">
                            {category.category_name}
                          </span>
                          <div className="space-y-1">
                            {category.payments.map(
                              (payment: any, paymentIndex: number) => (
                                <div key={`${key}-payment-${paymentIndex}`}>
                                  <span className="font-medium">
                                    {payment.amount.toLocaleString()}円
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 左: 変動費 - 毎月 */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                        {expenseReport.data?.monthly_variable_cost?.group_name}
                      </h4>
                      {Object.entries(
                        expenseReport.data?.monthly_variable_cost?.categories
                      ).map(([key, category]: [string, any]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                        >
                          <span className="text-sm">
                            {category.category_name}
                          </span>
                          <div className="space-y-1">
                            {category.payments.map(
                              (payment: any, paymentIndex: number) => (
                                <div key={`${key}-payment-${paymentIndex}`}>
                                  <span className="font-medium">
                                    {payment.amount.toLocaleString()}円
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ２行目 */}
                    {/* 右: 固定費 - 不定期 */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                        {expenseReport.data?.occasional_fixed_cost?.group_name}
                      </h4>
                      {Object.entries(
                        expenseReport.data?.occasional_fixed_cost?.categories
                      ).map(([key, category]: [string, any]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                        >
                          <span className="text-sm">
                            {category.category_name}
                          </span>
                          <div className="space-y-1">
                            {category.payments.map(
                              (payment: any, paymentIndex: number) => (
                                <div key={`${key}-payment-${paymentIndex}`}>
                                  <span className="font-medium">
                                    {payment.amount.toLocaleString()}円
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 右: 変動費 - 不定期 */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                        {
                          expenseReport.data?.occasional_variable_cost
                            ?.group_name
                        }
                      </h4>
                      {Object.entries(
                        expenseReport.data?.occasional_variable_cost?.categories
                      ).map(([key, category]: [string, any]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                        >
                          <span className="text-sm">
                            {category.category_name}
                          </span>
                          <div className="space-y-1">
                            {category.payments.map(
                              (payment: any, paymentIndex: number) => (
                                <div key={`${key}-payment-${paymentIndex}`}>
                                  <span className="font-medium">
                                    {payment.amount.toLocaleString()}円
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ３行目 */}
                    {/* 左: 豊かな浪費 */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                        {
                          expenseReport.data?.luxury_consumption_cost
                            ?.group_name
                        }
                      </h4>
                      {Object.entries(
                        expenseReport.data?.luxury_consumption_cost?.categories
                      ).map(([key, category]: [string, any]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                        >
                          <span className="text-sm">
                            {category.category_name}
                          </span>
                          <div className="space-y-1">
                            {category.payments.map(
                              (payment: any, paymentIndex: number) => (
                                <div key={`${key}-payment-${paymentIndex}`}>
                                  <span className="font-medium">
                                    {payment.amount.toLocaleString()}円
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 右: 貯蓄・投資 */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                        {
                          expenseReport.data?.savings_investment_cost
                            ?.group_name
                        }
                      </h4>
                      {Object.entries(
                        expenseReport.data?.savings_investment_cost?.categories
                      ).map(([key, category]: [string, any]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                        >
                          <span className="text-sm">
                            {category.category_name}
                          </span>
                          <div className="space-y-1">
                            {category.payments.map(
                              (payment: any, paymentIndex: number) => (
                                <div key={`${key}-payment-${paymentIndex}`}>
                                  <span className="font-medium">
                                    {payment.amount.toLocaleString()}円
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    データを読み込めませんでした。再度ログインしてください。
                  </div>
                )}
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
