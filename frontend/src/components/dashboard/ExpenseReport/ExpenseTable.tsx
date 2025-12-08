import { ExpenseSection } from "@/components/dashboard/ExpenseReport/ExpenseSection.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card.tsx";
import { YearMonthSelector } from "@/components/ui/YearMonthSelector.tsx";
import type { ExpenseTableProps } from "@/types/expense.ts";

export function ExpenseTable({
  expenseReport,
  isExpenseReportLoading,
  expenseReportError,
  expenseMutate,
  handleUpdte,
  monthlyAndYearlyDateSelector,
}: ExpenseTableProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <Card>
        <CardHeader className="flex justify-between">
          {expenseReport?.data && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 bg-stone-200 px-3 py-1 rounded">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">予算</p>
                  <p className="text-lg">
                    ¥{expenseReport.data.totalBudget?.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">支出</p>
                  <p className="text-lg">
                    ¥{expenseReport.data.totalPayment?.toLocaleString()}
                  </p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded ${
                  (expenseReport.data.defference ?? 0) >= 0
                    ? "bg-blue-200"
                    : "bg-red-200"
                }`}
              >
                <p className="text-lg">
                  残り{" "}
                  <strong>
                    ¥{expenseReport.data.defference?.toLocaleString()}
                  </strong>
                </p>
              </div>
            </div>
          )}
          <YearMonthSelector
            {...monthlyAndYearlyDateSelector}
            showMonth={true}
          />
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
