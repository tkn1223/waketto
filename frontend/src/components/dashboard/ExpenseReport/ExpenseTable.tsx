import { ExpenseSection } from "@/components/dashboard/ExpenseReport/ExpenseSection";
import { YearMonthSelector } from "@/components/ui/YearMonthSelector.tsx";
import { ExpenseTableProps } from "@/types/expense.ts";
import { useAuth } from "@/contexts/AuthContext.tsx";

import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

export function ExpenseTable({
  expenseReport,
  isExpenseReportLoading,
  expenseReportError,
  expenseMutate,
  handleUpdte,
  expenseDateSelector,
}: ExpenseTableProps) {
  const { userInfo } = useAuth();

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>{userInfo?.name} の支出管理表</CardTitle>
          <YearMonthSelector {...expenseDateSelector} />
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
            <ExpenseSection
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
  );
}
