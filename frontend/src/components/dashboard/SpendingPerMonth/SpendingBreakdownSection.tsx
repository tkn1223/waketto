"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import type { ChartConfig } from "@/components/ui/chart.tsx";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { SpendingDetailTable } from "@/components/dashboard/SpendingPerMonth/SpendingDetailTable.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";

export const description = "A donut chart";

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

export function SpendingBreakdownSection() {
  const { userInfo } = useAuth();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>支出の内訳</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 space-y-6">
        {/* SpendingDonutChart */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
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
            <div className="space-y-2">
              <div>
                <span>合計</span>
                <span>¥100,000</span>
              </div>
              <div>
                <span>{userInfo.name}</span>
                <span>¥100,000</span>
              </div>
              <div>
                <span>{userInfo.partner_user_id}</span>
                <span>¥100,000</span>
              </div>
            </div>
          </div>
        </div>
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
