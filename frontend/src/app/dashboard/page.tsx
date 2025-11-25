"use client";

import { SpendingManagementPage } from "@/components/dashboard/SpendingManagementPage";
import { HouseholdManagementPage } from "@/components/dashboard/HouseholdManagementPage";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useViewMode } from "@/contexts/ViewModeContext.tsx";
import { useDateSelector } from "@/hooks/useDateSelector.tsx";

export default function DashboardPage() {
  const { userInfo, isAuth, isLoading } = useAuth();
  const { user, finance } = useViewMode();
  const MonthlyAndYearlyDateSelector = useDateSelector(); // 支出管理および家計簿の年月セレクタ
  const MonthlyDateSelector = useDateSelector(); // 予算消化率の年月セレクタ

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
          <SpendingManagementPage
            isAuth={isAuth}
            user={user}
            monthlyAndYearlyDateSelector={MonthlyAndYearlyDateSelector}
            monthlyDateSelector={MonthlyDateSelector}
          />
        )}
        {finance === "household" && (
          <HouseholdManagementPage
            isAuth={isAuth}
            user={user}
            monthlyAndYearlyDateSelector={MonthlyAndYearlyDateSelector}
            monthlyDateSelector={MonthlyDateSelector}
          />
        )}
      </div>
    </div>
  );
}
