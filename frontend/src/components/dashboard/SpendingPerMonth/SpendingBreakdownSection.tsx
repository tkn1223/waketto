"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { YearMonthSelector } from "@/components/ui/YearMonthSelector.tsx";

import { SpendingDetailTable } from "@/components/dashboard/SpendingPerMonth/SpendingDetailTable.tsx";
import { SpendingDonutChart } from "@/components/dashboard/SpendingPerMonth/SpendingDonutChart.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { SpendingBreakdownSectionProps } from "@/types/summary.ts";

export function SpendingBreakdownSection({
  isAuth,
  user,
  monthlyAndYearlyDateSelector,
  monthlyDateSelector,
  householdReport,
}: SpendingBreakdownSectionProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex justify-between">
        <CardTitle>支出の内訳</CardTitle>
        <YearMonthSelector {...monthlyAndYearlyDateSelector} showMonth={true} />
      </CardHeader>
      <CardContent className="flex-1 pb-0 space-y-6">
        {/* 支出の内訳ドーナツチャート */}
        <SpendingDonutChart householdReport={householdReport} user={user} />
        {/* 支出の内訳詳細テーブル */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border">
            <SpendingDetailTable />
          </div>
          <div className="border">
            <SpendingDetailTable />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
