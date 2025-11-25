import { MonthlyBarChart } from "@/components/dashboard/ExpenseGraph/MonthlyBarChart.tsx";
import { YearlyBarChart } from "@/components/dashboard/ExpenseGraph/YearlyBarChart.tsx";
import { SpendingBreakdownSection } from "@/components/dashboard/SpendingPerMonth/SpendingBreakdownSection";
import { TransactionDetail } from "@/components/dashboard/Transaction/TransactionDetail.tsx";
import { useExpenseReport } from "@/lib/swr.ts";
import type { HouseholdManagementPageProps } from "@/types/summary.ts";

export function HouseholdManagementPage({
  isAuth,
  user,
  monthlyAndYearlyDateSelector,
  monthlyDateSelector,
}: HouseholdManagementPageProps) {
  const { mutate } = useExpenseReport(
    user,
    monthlyAndYearlyDateSelector,
    isAuth
  );

  return (
    <>
      {/* 支出管理表カード */}
      <div className="lg:col-span-2 space-y-2">
        <SpendingBreakdownSection />
      </div>
      {/* 取引明細カード(mutateでデータ更新) */}
      <div className="lg:col-span-1">
        <TransactionDetail onUpdate={() => void mutate()} />
      </div>
      <div className="col-span-2">
        <MonthlyBarChart />
      </div>
      <div className="col-span-1">
        <YearlyBarChart />
      </div>
    </>
  );
}
