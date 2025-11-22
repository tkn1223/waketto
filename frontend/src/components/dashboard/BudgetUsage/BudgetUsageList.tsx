import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button.tsx";
import { formatToMan } from "@/types/displayFormat.ts";
import type { BudgetUsageResponse } from "@/types/summary.ts";

export function BudgetUsageList({
  budgetUsage,
}: {
  budgetUsage: BudgetUsageResponse | undefined;
}) {
  const router = useRouter();

  if (budgetUsage?.status !== true) {
    return (
      <div className="text-center py-8 border border-gray-300 rounded-md">
        <p className="text-gray-500">データの取得に失敗しました</p>
      </div>
    );
  }

  if (budgetUsage?.data.length === 0) {
    return (
      <div className="text-center py-8 space-y-4 border border-gray-300 rounded-md">
        <p className="text-lg text-gray-500">予算が登録されていません</p>
        <Button onClick={() => router.push("/setting")}>予算を設定する</Button>
      </div>
    );
  }

  return (
    <>
      {budgetUsage.data.map((item, i) => (
        <div key={`budget-usage-${i}`} className="p-3 border border-gray-300">
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="flex items-end justify-center">
              <span className="text-gray-500">項目：</span>
              <span className="text-lg font-medium">{item.category.name}</span>
            </div>
            <div className="flex items-end justify-center">
              <span className="text-gray-500">予算：</span>
              <span className="text-lg font-medium">
                {formatToMan(item.budget_amount)}
              </span>
            </div>
            <div className="flex items-end justify-center">
              <span className="text-gray-500">残り：</span>
              <span className="text-lg font-medium">
                {formatToMan(item.residue_budget)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 12 }, (_, i) => (
              <span
                key={`month-lavel-${i}`}
                className="p-2 text-x flex items-center justify-center bg-gray-200 border border-gray-200"
              >
                {i + 1} 月
              </span>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-1">
            {item.monthly_data.map((monthData, i) => (
              <span
                key={`month-data-${i}`}
                className="p-2 font-medium flex items-center justify-center border-b border-r border-l border-gray-200"
              >
                {monthData.amount.toLocaleString()} 円
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
