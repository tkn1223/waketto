import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useBudgetUsage } from "@/lib/swr";
import { useViewMode } from "@/contexts/ViewModeContext.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { formatToMan } from "@/types/displayFormat.ts";

export function BudgetUsageList() {
  const router = useRouter();
  const { isAuth } = useAuth();
  const { user } = useViewMode();
  const { data: budget } = useBudgetUsage(user, isAuth);

  console.log(budget);

  if (budget?.status !== true) {
    return (
      <div className="text-center py-8 border border-gray-300 rounded-md">
        <p className="text-gray-500">データの取得に失敗しました</p>
      </div>
    );
  }

  if (budget?.data.length === 0) {
    return (
      <div className="text-center py-8 space-y-4 border border-gray-300 rounded-md">
        <p className="text-lg text-gray-500">予算が登録されていません</p>
        <Button onClick={() => router.push("/setting")}>予算を設定する</Button>
      </div>
    );
  }

  return (
    <>
      {budget?.data.map((item, i) => (
        <div
          key={`budget-usage-${i}`}
          className="p-3 border border-gray-300 space-y-2"
        >
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-end justify-center">
              <span className="text-gray-500">項目：</span>
              <span className="text-lg font-medium">{item.category.name}</span>
            </div>
            <div className="flex items-end justify-center">
              <span className="text-gray-500">予算：</span>
              <span className="text-lg font-medium">
                {formatToMan(item.amount)}
              </span>
            </div>
            <div className="flex items-end justify-center">
              <span className="text-gray-500">残り：</span>
              <span className="text-lg font-medium">12万</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 12 }, (_, i) => (
              <Label
                key={`month-lavel-${i}`}
                className="p-2 text-xs bg-gray-200 flex items-center justify-center"
              >
                {i + 1} 月
              </Label>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-1">
            <span className="p-2 text-base flex items-center justify-center">
              ¥0
            </span>
            <span className="p-2 text-base flex items-center justify-center">
              ¥50,000
            </span>
            <span className="p-2 text-base flex items-center justify-center">
              ¥0
            </span>
            <span className="p-2 text-base flex items-center justify-center">
              ¥0
            </span>
            <span className="p-2 text-base flex items-center justify-center">
              ¥0
            </span>
            <span className="p-2 text-base flex items-center justify-center">
              ¥0
            </span>
            <span className="p-2 text-base flex items-center justify-center">
              ¥70,000
            </span>
            <span className="p-2 text-base flex items-center justify-center">
              ¥0
            </span>
            <span className="p-2 text-base flex items-center justify-center">
              ¥0
            </span>
            <span className="p-2 text-base flex items-center justify-center">
              ¥0
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
