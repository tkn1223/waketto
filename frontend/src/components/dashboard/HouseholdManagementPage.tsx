import { TrendsSection } from "@/components/dashboard/ExpenseGraph/TrendsSection.tsx";
import { SpendingBreakdownSection } from "@/components/dashboard/SpendingPerMonth/SpendingBreakdownSection.tsx";
import { TransactionDetail } from "@/components/dashboard/Transaction/TransactionDetail.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useBudgetUsage, useHouseholdReport } from "@/lib/swr.ts";
import type { HouseholdManagementPageProps } from "@/types/summary.ts";

export function HouseholdManagementPage({
  isAuth,
  user,
  monthlyAndYearlyDateSelector,
  yearlyDateSelector,
}: HouseholdManagementPageProps) {
  const { data: householdReport, mutate } = useHouseholdReport(
    user,
    monthlyAndYearlyDateSelector,
    isAuth
  );
  const { data: budgetUsage, mutate: budgetUsageMutate } = useBudgetUsage(
    user,
    yearlyDateSelector,
    isAuth
  );
  const { userInfo } = useAuth();

  const handleUpdate = () => {
    void mutate();
    void budgetUsageMutate();
  };

  return (
    <>
      {/* 支出の内訳カード */}
      <div className="lg:col-span-2 space-y-2">
        <SpendingBreakdownSection
          userInfo={userInfo}
          user={user}
          monthlyAndYearlyDateSelector={monthlyAndYearlyDateSelector}
          householdReport={householdReport?.data ?? {}}
          onTransactionUpdate={handleUpdate}
        />
      </div>
      {/* 取引明細カード(mutateでデータ更新) */}
      <div className="lg:col-span-1">
        <TransactionDetail onUpdate={handleUpdate} />
      </div>
      {/* 支出の推移グラフ */}
      <div className="lg:col-span-3">
        <TrendsSection
          yearlyDateSelector={yearlyDateSelector}
          TrendsReport={budgetUsage ?? { status: false, data: [] }}
        />
      </div>
    </>
  );
}
