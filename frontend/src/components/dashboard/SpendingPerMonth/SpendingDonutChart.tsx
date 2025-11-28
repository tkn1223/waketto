import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import type { SpendingDonutChartProps } from "@/types/summary.ts";
import { calculateExpenseTotals } from "@/utils/expenseReportTransformer.ts";
import {
  aggregateByCategory,
  generateChartDataAndConfig,
} from "@/utils/spendingChartTransformer.ts";

export function SpendingDonutChart({
  householdReport,
  user,
}: SpendingDonutChartProps) {
  const { userInfo } = useAuth();

  // ユーザーごとの合計値と全体の合計値を計算
  const viewData = useMemo(
    () => calculateExpenseTotals(householdReport),
    [householdReport]
  );

  // 円グラフ表示用のデータを生成
  const { chartData, chartConfig } = useMemo(() => {
    const categoryTotals = aggregateByCategory(householdReport);

    return generateChartDataAndConfig(categoryTotals);
  }, [householdReport]);

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
            dataKey="amount"
            nameKey="category"
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
                ¥{viewData?.totalAmount ?? "-"}
              </td>
            </tr>
            <tr>
              <td className="text-lg py-2">
                {userInfo.name ?? "ユーザー"} の負担
              </td>
              <td className="text-4xl text-left py-2">
                ¥{viewData?.userTotals[userInfo.id] ?? "-"}
              </td>
            </tr>
            {user === "common" && userInfo.partner_user_id && (
              <tr>
                <td className="text-lg py-2">
                  {userInfo.partner_user_id ?? "パートナー"}の負担
                </td>
                <td className="text-4xl text-left py-2">
                  ¥{viewData?.userTotals[userInfo.partner_user_id] ?? "-"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
