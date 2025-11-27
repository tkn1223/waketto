"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { YearMonthSelector } from "@/components/ui/YearMonthSelector.tsx";

import { SpendingDetailList } from "@/components/dashboard/SpendingPerMonth/SpendingDetailList.tsx";
import { SpendingDonutChart } from "@/components/dashboard/SpendingPerMonth/SpendingDonutChart.tsx";
import { SpendingBreakdownSectionProps } from "@/types/summary.ts";
import { groupPaymentsByUser } from "@/utils/spendingDetailTransformer.ts";

export function SpendingBreakdownSection({
  userInfo,
  isAuth,
  user,
  monthlyAndYearlyDateSelector,
  monthlyDateSelector,
  householdReport,
  onTransactionUpdate,
}: SpendingBreakdownSectionProps) {
  // 支払った人ごとにグループ化
  const paymentsByUser = useMemo(
    () => groupPaymentsByUser(householdReport),
    [householdReport]
  );

  // 支払った人の一覧を取得（データから実際に支払いがある人のIDを取得）
  const payerIds = useMemo(() => {
    const userIds = Object.keys(paymentsByUser);

    // 個人モードの場合、自分のIDのみ
    if (user === "alone") {
      return userIds.filter((id) => id === userInfo.id);
    }

    // 共通モードの場合、自分とパートナーのIDを優先順位で並べる
    const sortedIds: string[] = [];

    // 自分のIDを最初に
    if (userIds.includes(userInfo.id)) {
      sortedIds.push(userInfo.id);
    }

    // パートナーのIDを次に（partner_user_idまたはcouple_idで代用）
    const partnerId = userInfo.partner_user_id || userInfo.couple_id;
    if (
      partnerId &&
      userIds.includes(partnerId) &&
      !sortedIds.includes(partnerId)
    ) {
      sortedIds.push(partnerId);
    }

    // その他のID（もしあれば）
    userIds.forEach((id) => {
      if (!sortedIds.includes(id)) {
        sortedIds.push(id);
      }
    });

    return sortedIds;
  }, [paymentsByUser, userInfo, user]);

  // 支払った人の名前を取得する関数
  const getPayerName = (payerId: string): string => {
    if (payerId === userInfo.id) {
      return userInfo.name;
    }
    // パートナーの場合
    if (
      payerId === userInfo.partner_user_id ||
      payerId === userInfo.couple_id
    ) {
      return userInfo.partner_user_id || "パートナー";
    }
    // その他の場合（IDをそのまま表示）
    return payerId;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex justify-between">
        <CardTitle>支出の内訳</CardTitle>
        <YearMonthSelector {...monthlyAndYearlyDateSelector} showMonth={true} />
      </CardHeader>
      <CardContent className="flex-1 pb-0 space-y-6">
        {/* 支出の内訳 */}
        <SpendingDonutChart householdReport={householdReport} user={user} />
        {/* 支出の内訳詳細リスト */}
        <div className="space-y-4">
          <CardTitle>１カ月の明細</CardTitle>
          {user === "common" ? (
            // 共通モード：支払った人ごとに分けて表示
            payerIds.map((payerId) => {
              const payerPayments = paymentsByUser[payerId] || [];
              return (
                <div key={payerId} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                    {getPayerName(payerId)}
                  </h4>
                  <SpendingDetailList
                    householdReport={householdReport}
                    onTransactionUpdate={onTransactionUpdate}
                    filterByUserId={payerId}
                  />
                </div>
              );
            })
          ) : (
            // 個人モード：自分のみ表示
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                {userInfo.name}
              </h4>
              <SpendingDetailList
                householdReport={householdReport}
                onTransactionUpdate={onTransactionUpdate}
                filterByUserId={userInfo.id}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
