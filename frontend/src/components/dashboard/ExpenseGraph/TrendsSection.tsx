import { MonthlyBarChart } from "@/components/dashboard/ExpenseGraph/MonthlyBarChart.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { YearMonthSelector } from "@/components/ui/YearMonthSelector.tsx";
import type { BudgetUsageResponse } from "@/types/budget.ts";
import type { DateSelector } from "@/types/expense.ts";

export interface TrendsSectionProps {
  yearlyDateSelector: DateSelector;
  TrendsReport: BudgetUsageResponse;
}

export function TrendsSection({
  yearlyDateSelector,
  TrendsReport,
}: TrendsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>支出の推移</CardTitle>
        <YearMonthSelector {...yearlyDateSelector} showMonth={false} />
      </CardHeader>
      <CardContent>
        <MonthlyBarChart TrendsReport={TrendsReport} />
      </CardContent>
    </Card>
  );
}
