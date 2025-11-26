import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import type { ChartConfig } from "@/components/ui/chart.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import type { ExpenseReportData } from "@/types/transaction.ts";
import { calculateExpenseTotals } from "@/utils/expenseReportTransformer.ts";

interface SpendingDonutChartProps {
  householdReport: ExpenseReportData;
}

const chartConfig: ChartConfig = {
  monthly_fixed_cost: { color: "#0088FE" },
  monthly_variable_cost: { color: "#00C49F" },
  occasional_fixed_cost: { color: "#FFBB28" },
  occasional_variable_cost: { color: "#FF8042" },
};

const chartData = [
  { name: "Chrome", value: 4000 },
  { name: "Firefox", value: 3000 },
  { name: "Safari", value: 2000 },
  { name: "Opera", value: 2780 },
  { name: "Navigator", value: 1890 },
];

export function SpendingDonutChart({
  householdReport,
}: SpendingDonutChartProps) {
  const { userInfo } = useAuth();

  // 合計値とユーザーごとの合計値を計算
  const totals = useMemo(
    () => calculateExpenseTotals(householdReport),
    [householdReport]
  );

  // 現在のユーザーIDを取得（データベースIDを使用）
  // payment.userはpaid_by_user_id（データベースID）なので、userInfo.idと比較する
  const currentUserId = String(userInfo?.id ?? "");
  const currentUserTotal = totals?.userTotals[currentUserId] ?? 0;

  // パートナーのIDを取得（現在のユーザー以外のID）
  const partnerUserId = totals
    ? (Object.keys(totals.userTotals).find((id) => id !== currentUserId) ?? "")
    : "";
  const partnerTotal = totals?.userTotals[partnerUserId] ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] w-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="browser"
            innerRadius={60}
          />
        </PieChart>
      </ChartContainer>

      <div className="flex flex-col justify-center">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="text-2xl py-2">合計</td>
              <td className="text-4xl text-left py-2">
                ¥{totals?.totalAmount.toLocaleString() ?? "0"}
              </td>
            </tr>
            <tr>
              <td className="text-lg py-2">
                {userInfo?.name ?? "ユーザー"} の負担
              </td>
              <td className="text-4xl text-left py-2">
                ¥{currentUserTotal.toLocaleString()}
              </td>
            </tr>
            {partnerUserId && partnerTotal > 0 && (
              <tr>
                <td className="text-lg py-2">パートナーの負担</td>
                <td className="text-4xl text-left py-2">
                  ¥{partnerTotal.toLocaleString()}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
