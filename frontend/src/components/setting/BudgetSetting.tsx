import { BudgetCategoryRow } from "@/components/setting/BudgetCategoryRow.tsx";
import type { BudgetSettingProps } from "@/types/budget.ts";

export function BudgetSetting({
  allCategories,
  handleCategoryUpdate,
}: BudgetSettingProps) {
  return (
    <>
      <div className="overflow-x-auto mt-4">
        <table className="w-full table-auto min-w-[600px]">
          <thead>
            <tr className="bg-muted">
              <th className="w-1/13"></th>
              <th className="w-6/13 py-2 text-lg border-3">固定費</th>
              <th className="w-6/13 py-2 text-lg border-3">変動費</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-lg font-bold text-center bg-muted border-3">
                毎月
              </td>
              <td className="py-4 px-2 border-2 align-top">
                <BudgetCategoryRow
                  categoryGroup={allCategories.filter(
                    (category) => category.groupCode === "monthly_fixed_cost"
                  )}
                  onUpdate={handleCategoryUpdate}
                />
              </td>
              <td className="py-4 px-2 border-2 align-top">
                <div className="grid gap-2">
                  <BudgetCategoryRow
                    categoryGroup={allCategories.filter(
                      (category) =>
                        category.groupCode === "monthly_variable_cost"
                    )}
                    onUpdate={handleCategoryUpdate}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="text-lg font-bold text-center bg-muted border-3">
                不定期
              </td>
              <td className="py-4 px-2 border-2 align-top">
                <BudgetCategoryRow
                  categoryGroup={allCategories.filter(
                    (category) => category.groupCode === "occasional_fixed_cost"
                  )}
                  onUpdate={handleCategoryUpdate}
                />
              </td>
              <td className="py-4 px-2 border-2 align-top">
                <BudgetCategoryRow
                  categoryGroup={allCategories.filter(
                    (category) =>
                      category.groupCode === "occasional_variable_cost"
                  )}
                  onUpdate={handleCategoryUpdate}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full table-auto min-w-[600px]">
          <thead>
            <tr>
              <th className="w-1/13"></th>
              <th className="w-6/13 py-2 text-lg bg-muted border-3">
                豊かな浪費
              </th>
              <th className="w-6/13 py-2 text-lg bg-muted border-3">
                貯蓄・投資
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td className="py-2 px-2 border-2">
                <BudgetCategoryRow
                  categoryGroup={allCategories.filter(
                    (category) =>
                      category.groupCode === "luxury_consumption_cost"
                  )}
                  onUpdate={handleCategoryUpdate}
                />
              </td>
              <td className="py-2 px-2 border-2 align-top">
                <BudgetCategoryRow
                  categoryGroup={allCategories.filter(
                    (category) =>
                      category.groupCode === "savings_investment_cost"
                  )}
                  onUpdate={handleCategoryUpdate}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
