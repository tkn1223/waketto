import { BudgetUsageList } from "@/components/dashboard/BudgetUsage/BudgetUsageList.tsx";
import { ExpenseTable } from "@/components/dashboard/ExpenseReport/ExpenseTable.tsx";
import { TransactionDetail } from "@/components/dashboard/Transaction/TransactionDetail.tsx";
import { YearMonthSelector } from "@/components/ui/YearMonthSelector.tsx";
import { useBudgetUsage, useExpenseReport } from "@/lib/swr.ts";
import type { AnnualExpenseSummaryProps } from "@/types/summary.ts";

export function AnnualExpenseSummary({
  isAuth,
  user,
  expenseDateSelector,
  budgetUsageDateSelector,
}: AnnualExpenseSummaryProps) {
  const {
    data: expenseReport,
    error: expenseReportError,
    isLoading: isExpenseReportLoading,
    mutate: expenseMutate,
  } = useExpenseReport(user, expenseDateSelector, isAuth);
  const { data: budgetUsage, mutate: budgetUsageMutate } = useBudgetUsage(
    user,
    budgetUsageDateSelector,
    isAuth
  );

  const handleUpdte = () => {
    void expenseMutate();
    void budgetUsageMutate();
  };

  return (
    <>
      {/* 支出管理表カード */}
      <div className="lg:col-span-2">
        <ExpenseTable
          expenseReport={expenseReport}
          expenseReportError={expenseReportError}
          isExpenseReportLoading={isExpenseReportLoading}
          expenseMutate={() => void expenseMutate()}
          handleUpdte={() => void handleUpdte()}
          expenseDateSelector={expenseDateSelector}
        />
      </div>
      {/* 取引明細カード(mutateでデータ更新) */}
      <div className="lg:col-span-1">
        <TransactionDetail onUpdate={handleUpdte} />
      </div>
      {/* 予算消化率 */}
      <div className="col-span-3 space-y-3">
        <div className="flex justify-between">
          <span className="font-medium text-lg">予算の消化状況</span>
          <YearMonthSelector {...budgetUsageDateSelector} showMonth={false} />
        </div>
        <BudgetUsageList budgetUsage={budgetUsage} />
      </div>
    </>
  );
}
