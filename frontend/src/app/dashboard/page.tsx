"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useDateSelector } from "@/hooks/useDateSelector.tsx";
import { useViewMode } from "@/contexts/ViewModeContext.tsx";
import { AnnualExpenseSummary } from "@/components/dashboard/AnnualExpenseSummary.tsx";
import { AnnualBudgetSummary } from "@/components/dashboard/AnnualBudgetSummary.tsx";

export default function DashboardPage() {
  const router = useRouter();
  const { userInfo, isAuth, isLoading } = useAuth();
  const { user, finance } = useViewMode();
  const expenseDateSelector = useDateSelector(); // 支出管理表の年月セレクタ
  const budgetUsageDateSelector = useDateSelector(); // 予算消化率の年月セレクタ

  // 認証失敗時のリダイレクト
  useEffect(() => {
    if (!isAuth && !isLoading) {
      router.push("/signin");
    }
  }, [isAuth, isLoading, router]);

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {finance === "expense" && (
          <AnnualExpenseSummary
            isAuth={isAuth}
            user={user}
            expenseDateSelector={expenseDateSelector}
            budgetUsageDateSelector={budgetUsageDateSelector}
          />
        )}
        {finance === "budget" && (
          <AnnualBudgetSummary isAuth={isAuth} user={user} />
        )}
      </div>
    </div>
  );
}
