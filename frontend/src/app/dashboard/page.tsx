"use client";

import { AnnualHouseholdSummary } from "@/components/dashboard/AnnualHouseholdSummary.tsx";
import { AnnualExpenseSummary } from "@/components/dashboard/AnnualExpenseSummary.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useViewMode } from "@/contexts/ViewModeContext.tsx";
import { useDateSelector } from "@/hooks/useDateSelector.tsx";

export default function DashboardPage() {
  const { userInfo, isAuth, isLoading } = useAuth();
  const { user, finance } = useViewMode();
  const expenseDateSelector = useDateSelector(); // 支出管理表の年月セレクタ
  const budgetUsageDateSelector = useDateSelector(); // 予算消化率の年月セレクタ

  // リダイレクト処理はAuthContextで実施

  if (isLoading || !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 px-10">
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
        {finance === "expense" && (
          <AnnualExpenseSummary
            isAuth={isAuth}
            user={user}
            expenseDateSelector={expenseDateSelector}
            budgetUsageDateSelector={budgetUsageDateSelector}
          />
        )}
        {finance === "household" && (
          <AnnualHouseholdSummary isAuth={isAuth} user={user} />
        )}
      </div>
    </div>
  );
}
