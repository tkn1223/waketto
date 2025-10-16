import { TransactionDetail } from "@/components/dashboard/Transaction/TransactionDetail.tsx";
import { ExpenseTable } from "@/components/dashboard/ExpenseReport/ExpenseTable.tsx";
import { BudgetUsageList } from "@/components/dashboard/BudgetUsage/BudgetUsageList.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useExpenseReport, useBudgetUsage } from "@/lib/swr.ts";
import { UserMode } from "@/types/viewmode";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { mutate } from "swr";

export function AnnualExpenseSummary({
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
    mutate: expenseMutate,
  } = useExpenseReport(user, isAuth);

  const { data: budgetUsage, mutate: budgetUsageMutate } = useBudgetUsage(
    user,
    isAuth
  );

  const handleUpdte = () => {
    expenseMutate();
    budgetUsageMutate();
  };

  return (
    <>
      {/* 支出管理表カード */}
      <div className="lg:col-span-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <Card>
            <CardHeader>
              <CardTitle>{userInfo?.name} の支出管理表</CardTitle>
            </CardHeader>
            <CardContent>
              {isExpenseReportLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">データを読み込み中...</p>
                </div>
              ) : expenseReportError ? (
                <div className="text-center py-8">
                  <p className="text-red-600">データの取得に失敗しました</p>
                  <Button onClick={() => expenseMutate()} className="mt-2">
                    再試行
                  </Button>
                </div>
              ) : expenseReport ? (
                <ExpenseTable
                  expenseReport={expenseReport}
                  onTransactionUpdate={handleUpdte}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">データがありません</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* 取引明細カード(mutateでデータ更新) */}
      <div className="lg:col-span-1">
        <TransactionDetail onUpdate={handleUpdte} />
      </div>
      {/* 予算消化率 */}
      <div className="col-span-3 space-y-3">
        <div className="font-medium text-lg">予算の消化状況</div>
        <BudgetUsageList />
      </div>
    </>
  );
}
