import { SpendingDonutChart } from "@/components/dashboard/SpendingPerMonth/SpendingDonutChart.tsx";
import { SpendingDetailTable } from "@/components/dashboard/SpendingPerMonth/SpendingDetailTable.tsx";
import { TransactionDetail } from "@/components/dashboard/Transaction/TransactionDetail.tsx";
import { MonthlyBarChart } from "@/components/dashboard/ExpenseGraph/MonthlyBarChart.tsx";
import { YearlyBarChart } from "@/components/dashboard/ExpenseGraph/YearlyBarChart.tsx";
import { UserMode } from "@/types/viewmode";
import { useExpenseReport } from "@/lib/swr";
import { useAuth } from "@/contexts/AuthContext.tsx";

export function AnnualBudgetSummary({
  isAuth,
  user,
}: {
  isAuth: boolean;
  user: UserMode;
}) {
  const { userInfo } = useAuth();
  const {
    data: expenseReport,
    error: expenseReportError,
    isLoading: isExpenseReportLoading,
    mutate,
  } = useExpenseReport(isAuth, user);

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
        <TransactionDetail onUpdate={mutate} />
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
