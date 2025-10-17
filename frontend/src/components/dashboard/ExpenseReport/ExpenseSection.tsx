import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { TransactionRow } from "./TransactionRow.tsx";
import type {
  ExpenseReportResponse,
  CategoryWithPayments,
} from "@/types/transaction.ts";

export function ExpenseSection({
  expenseReport,
  onTransactionUpdate,
}: {
  expenseReport: ExpenseReportResponse;
  onTransactionUpdate: () => void;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {/* 毎月固定費 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
            {expenseReport.data?.monthly_fixed_cost?.group_name}
          </h4>
          <ScrollArea className="h-[180px] w-full">
            <div className="space-y-2 pr-3">
              {checkCategory(
                expenseReport.data?.monthly_fixed_cost?.categories
              ) ? (
                Object.entries(
                  expenseReport.data?.monthly_fixed_cost?.categories || {}
                ).map(([key, category]: [string, CategoryWithPayments]) => (
                  <TransactionRow
                    key={key}
                    category={category}
                    onTransactionUpdate={onTransactionUpdate}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500">明細が未登録です</div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* 毎月変動費 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
            {expenseReport.data?.monthly_variable_cost?.group_name}
          </h4>
          <ScrollArea className="h-[180px] w-full">
            <div className="space-y-2 pr-3">
              {checkCategory(
                expenseReport.data?.monthly_variable_cost?.categories
              ) ? (
                Object.entries(
                  expenseReport.data?.monthly_variable_cost?.categories || {}
                ).map(([key, category]: [string, CategoryWithPayments]) => (
                  <TransactionRow
                    key={key}
                    category={category}
                    onTransactionUpdate={onTransactionUpdate}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500">明細が未登録です</div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* 不定期固定費 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
            {expenseReport.data?.occasional_fixed_cost?.group_name}
          </h4>
          <ScrollArea className="h-[180px] w-full">
            <div className="space-y-2 pr-3">
              {checkCategory(
                expenseReport.data?.occasional_fixed_cost?.categories
              ) ? (
                Object.entries(
                  expenseReport.data?.occasional_fixed_cost?.categories || {}
                ).map(([key, category]: [string, CategoryWithPayments]) => (
                  <TransactionRow
                    key={key}
                    category={category}
                    onTransactionUpdate={onTransactionUpdate}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500">明細が未登録です</div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* 不定期変動費 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
            {expenseReport.data?.occasional_variable_cost?.group_name}
          </h4>
          <ScrollArea className="h-[180px] w-full">
            <div className="space-y-2 pr-3">
              {checkCategory(
                expenseReport.data?.occasional_variable_cost?.categories
              ) ? (
                Object.entries(
                  expenseReport.data?.occasional_variable_cost?.categories || {}
                ).map(([key, category]: [string, CategoryWithPayments]) => (
                  <TransactionRow
                    key={key}
                    category={category}
                    onTransactionUpdate={onTransactionUpdate}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500">明細が未登録です</div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* 豊かな浪費 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
            {expenseReport.data?.luxury_consumption_cost?.group_name}
          </h4>
          <ScrollArea className="h-[130px] w-full">
            <div className="space-y-2 pr-3">
              {checkCategory(
                expenseReport.data?.luxury_consumption_cost?.categories
              ) ? (
                Object.entries(
                  expenseReport.data?.luxury_consumption_cost?.categories || {}
                ).map(([key, category]: [string, CategoryWithPayments]) => (
                  <TransactionRow
                    key={key}
                    category={category}
                    onTransactionUpdate={onTransactionUpdate}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500">明細が未登録です</div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* 貯蓄・投資 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
            {expenseReport.data?.savings_investment_cost?.group_name}
          </h4>
          <ScrollArea className="h-[130px] w-full">
            <div className="space-y-2 pr-3">
              {checkCategory(
                expenseReport.data?.savings_investment_cost?.categories
              ) ? (
                Object.entries(
                  expenseReport.data?.savings_investment_cost?.categories || {}
                ).map(([key, category]: [string, CategoryWithPayments]) => (
                  <TransactionRow
                    key={key}
                    category={category}
                    onTransactionUpdate={onTransactionUpdate}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500">明細が未登録です</div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

const checkCategory = (
  categories: Record<string, CategoryWithPayments> | undefined
) => {
  return categories && Object.entries(categories).length > 0;
};
