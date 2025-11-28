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

export function SpendingBreakdownSection({
  userInfo,
  isAuth,
  user,
  monthlyAndYearlyDateSelector,
  monthlyDateSelector,
  householdReport,
  onTransactionUpdate,
}: SpendingBreakdownSectionProps) {
  // householdReportのデータの有無を確認
  const isEmptyReport = Object.values(householdReport).every(
    (group) => Object.values(group.categories).length === 0
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex justify-between">
        <CardTitle>支出の内訳</CardTitle>
        <YearMonthSelector {...monthlyAndYearlyDateSelector} showMonth={true} />
      </CardHeader>
      {isEmptyReport ? (
        <CardContent className="flex items-center justify-center lg:p-54">
          <div className="text-center text-2xl font-bold text-zinc-400">
            明細が未登録です
          </div>
        </CardContent>
      ) : (
        <CardContent className="flex-1 pb-0 space-y-6">
          {/* 支出の内訳 */}
          <SpendingDonutChart householdReport={householdReport} user={user} />
          {/* 支出の内訳詳細リスト */}
          <div className="space-y-4">
            <h3 className="font-bold pb-1">１カ月の明細</h3>
            <SpendingDetailList
              householdReport={householdReport}
              user={user}
              userInfo={userInfo}
              onTransactionUpdate={onTransactionUpdate}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
