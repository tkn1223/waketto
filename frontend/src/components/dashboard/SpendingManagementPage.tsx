import { CircleQuestionMark } from "lucide-react";
import { BudgetUsageList } from "@/components/dashboard/BudgetUsage/BudgetUsageList.tsx";
import { ExpenseTable } from "@/components/dashboard/ExpenseReport/ExpenseTable.tsx";
import { TransactionDetail } from "@/components/dashboard/Transaction/TransactionDetail.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { YearMonthSelector } from "@/components/ui/YearMonthSelector.tsx";
import { useBudgetUsage, useExpenseReport } from "@/lib/swr.ts";
import type { SpendingManagementPageProps } from "@/types/summary.ts";

export function SpendingManagementPage({
  isAuth,
  user,
  monthlyAndYearlyDateSelector,
  yearlyDateSelector,
}: SpendingManagementPageProps) {
  const {
    data: expenseReport,
    error: expenseReportError,
    isLoading: isExpenseReportLoading,
    mutate: expenseMutate,
  } = useExpenseReport(user, monthlyAndYearlyDateSelector, isAuth);
  const { data: budgetUsage, mutate: budgetUsageMutate } = useBudgetUsage(
    user,
    yearlyDateSelector,
    isAuth
  );

  const handleUpdte = () => {
    void expenseMutate();
    void budgetUsageMutate();
  };

  return (
    <>
      {/* 支出管理表カード */}
      <div className="order-2 lg:order-1 sm:col-span-1 lg:col-span-2">
        <ExpenseTable
          expenseReport={expenseReport}
          expenseReportError={expenseReportError}
          isExpenseReportLoading={isExpenseReportLoading}
          expenseMutate={() => void expenseMutate()}
          handleUpdte={() => void handleUpdte()}
          monthlyAndYearlyDateSelector={monthlyAndYearlyDateSelector}
        />
      </div>
      {/* 取引明細カード(mutateでデータ更新) */}
      <div className="order-1 lg:order-2 sm:col-span-1 lg:col-span-1">
        <TransactionDetail onUpdate={handleUpdte} />
      </div>
      {/* 予算消化率 */}
      <div className="order-3 lg:order-3 sm:col-span-3 lg:col-span-3 space-y-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium text-lg">予算の消化状況</span>
            {/* クエスチョンアイコン */}
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleQuestionMark className="text-gray-400 w-5" />
              </TooltipTrigger>
              <TooltipContent className="p-3 text-sm">
                <p>
                  予算設定表で「1年」を選択した項目に対して
                  <br />
                  年間の予算消化状況を表示します
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <YearMonthSelector {...yearlyDateSelector} showMonth={false} />
        </div>
        <BudgetUsageList budgetUsage={budgetUsage} />
      </div>
    </>
  );
}
