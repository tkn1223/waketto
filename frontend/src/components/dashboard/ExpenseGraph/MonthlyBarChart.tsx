import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { transformTrendsBarChartData } from "@/utils/TrendsBarChartTransformer.ts";
import type { BudgetUsageResponse } from "@/types/budget.ts";

export function MonthlyBarChart({
  TrendsReport,
}: {
  TrendsReport: BudgetUsageResponse;
}) {
  const { chartData, chartConfig } = useMemo(() => {
    return transformTrendsBarChartData(TrendsReport);
  }, [TrendsReport]);

  const categoryKeys = Object.keys(chartConfig);

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto w-full h-[400px]"
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => {
              return `${value}月`;
            }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {categoryKeys.map((categoryKey, _index) => (
            <Bar
              key={categoryKey}
              dataKey={categoryKey}
              stackId="a"
              fill={`var(--color-${categoryKey})`}
              radius={[0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </>
  );
}
