import { MonthlyBarChart } from "@/components/dashboard/ExpenseGraph/MonthlyBarChart.tsx";
import { YearlyBarChart } from "@/components/dashboard/ExpenseGraph/YearlyBarChart.tsx";
import { SpendingDetailTable } from "@/components/dashboard/SpendingPerMonth/SpendingDetailTable.tsx";
import { SpendingDonutChart } from "@/components/dashboard/SpendingPerMonth/SpendingDonutChart.tsx";
import { TransactionDetail } from "@/components/dashboard/Transaction/TransactionDetail.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useExpenseReport } from "@/lib/swr.ts";
import type { UserMode } from "@/types/viewmode";

export function AnnualBudgetSummary({
  isAuth,
  user,
}: {
  isAuth: boolean;
  user: UserMode;
}) {
  const { userInfo: _userInfo } = useAuth();
  const {
    data: _expenseReport,
    error: _expenseReportError,
    isLoading: _isExpenseReportLoading,
    mutate,
  } = useExpenseReport(
    user,
    {
      year: "2025",
      month: "1",
      onYearChange: () => {
        // Empty function for ESLint
      },
      onMonthChange: () => {
        // Empty function for ESLint
      },
    },
    isAuth
  );

  return (
    <>
      {/* 支出管理表カード */}
      <div className="lg:col-span-2 space-y-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <SpendingDonutChart />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <SpendingDetailTable />
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <SpendingDetailTable />
          </div>
        </div>
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
