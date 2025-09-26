import { TransactionRow } from "./TransactionRow";

export function ExpenseTable({ expenseReport }: { expenseReport: any }) {
  return (
    <>
      {expenseReport ? (
        <div className="grid grid-cols-2 gap-4">
          {/* 毎月固定費 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
              {expenseReport.data?.monthly_fixed_cost?.group_name}
            </h4>
            {Object.entries(
              expenseReport.data?.monthly_fixed_cost?.categories
            ).map(([key, category]: [string, any]) => (
              <TransactionRow key={key} category={category} />
            ))}
          </div>

          {/* 毎月変動費 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
              {expenseReport.data?.monthly_variable_cost?.group_name}
            </h4>
            {Object.entries(
              expenseReport.data?.monthly_variable_cost?.categories
            ).map(([key, category]: [string, any]) => (
              <div key={key} className="space-y-2">
                {category.payments.map((payment: any, paymentIndex: number) => (
                  <TransactionRow key={key} category={category} />
                ))}
              </div>
            ))}
          </div>

          {/* 不定期固定費 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
              {expenseReport.data?.occasional_fixed_cost?.group_name}
            </h4>
            {Object.entries(
              expenseReport.data?.occasional_fixed_cost?.categories
            ).map(([key, category]: [string, any]) => (
              <div key={key} className="space-y-2">
                {category.payments.map((payment: any, paymentIndex: number) => (
                  <TransactionRow key={key} category={category} />
                ))}
              </div>
            ))}
          </div>

          {/* 不定期変動費 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
              {expenseReport.data?.occasional_variable_cost?.group_name}
            </h4>
            {Object.entries(
              expenseReport.data?.occasional_variable_cost?.categories
            ).map(([key, category]: [string, any]) => (
              <div key={key} className="space-y-2">
                {category.payments.map((payment: any, paymentIndex: number) => (
                  <TransactionRow key={key} category={category} />
                ))}
              </div>
            ))}
          </div>

          {/* 豊かな浪費 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
              {expenseReport.data?.luxury_consumption_cost?.group_name}
            </h4>
            {Object.entries(
              expenseReport.data?.luxury_consumption_cost?.categories
            ).map(([key, category]: [string, any]) => (
              <div key={key} className="space-y-2">
                {category.payments.map((payment: any, paymentIndex: number) => (
                  <TransactionRow key={key} category={category} />
                ))}
              </div>
            ))}
          </div>

          {/* 貯蓄・投資 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
              {expenseReport.data?.savings_investment_cost?.group_name}
            </h4>
            {Object.entries(
              expenseReport.data?.savings_investment_cost?.categories
            ).map(([key, category]: [string, any]) => (
              <div key={key} className="space-y-2">
                {category.payments.map((payment: any, paymentIndex: number) => (
                  <TransactionRow key={key} category={category} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>データを読み込めませんでした。再度ログインしてください。</div>
      )}
    </>
  );
}
