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
import { UserMode } from "@/types/viewmode.ts";

interface SpendingDonutChartProps {
  householdReport: ExpenseReportData;
  user: UserMode;
}

// const chartConfig: ChartConfig = {
//   monthly_fixed_cost: { color: "#0088FE" },
//   monthly_variable_cost: { color: "#00C49F" },
//   occasional_fixed_cost: { color: "#FFBB28" },
//   occasional_variable_cost: { color: "#FF8042" },
// };

// const chartData = [
//   { name: "Chrome", value: 4000 },
//   { name: "Firefox", value: 3000 },
//   { name: "Safari", value: 2000 },
//   { name: "Opera", value: 2780 },
//   { name: "Navigator", value: 1890 },
// ];

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function SpendingDonutChart({
  householdReport,
  user,
}: SpendingDonutChartProps) {
  const { userInfo } = useAuth();
  console.log(userInfo);

  // 表示用にデータの変換（円グラフ、各ユーザーの合計）
  const viewData = useMemo(
    () => calculateExpenseTotals(householdReport),
    [householdReport]
  );

  // データが存在しない場合
  if (!viewData) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="text-center text-2xl font-bold">
          データが存在しません
        </div>
      </div>
    );
  }

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
                ¥{viewData.totalAmount ?? "-"}
              </td>
            </tr>
            <tr>
              <td className="text-lg py-2">
                {userInfo.name ?? "ユーザー"} の負担
              </td>
              <td className="text-4xl text-left py-2">
                ¥{viewData.userTotals[userInfo.id]}
              </td>
            </tr>
            {user === "common" && userInfo.partner_user_id && (
              <tr>
                <td className="text-lg py-2">
                  {userInfo.partner_user_id ?? "パートナー"}の負担
                </td>
                <td className="text-4xl text-left py-2">
                  ¥{viewData.userTotals[userInfo.partner_user_id] ?? "-"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
