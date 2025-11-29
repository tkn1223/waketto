import { MonthlyBarChart } from "@/components/dashboard/ExpenseGraph/MonthlyBarChart.tsx";
import { YearlyBarChart } from "@/components/dashboard/ExpenseGraph/YearlyBarChart.tsx";
import { YearMonthSelector } from "@/components/ui/YearMonthSelector.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import type { DateSelector } from "@/types/expense.ts";

export interface TrendsSectionProps {
  yearlyDateSelector: DateSelector;
}

export function TrendsSection({ yearlyDateSelector }: TrendsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>支出の推移</CardTitle>
        <YearMonthSelector {...yearlyDateSelector} showMonth={false} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <MonthlyBarChart />
          </div>
          <div className="col-span-1">
            <YearlyBarChart />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
