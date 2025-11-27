import { MonthlyBarChart } from "@/components/dashboard/ExpenseGraph/MonthlyBarChart.tsx";
import { YearlyBarChart } from "@/components/dashboard/ExpenseGraph/YearlyBarChart.tsx";
import { SpendingBreakdownSection } from "@/components/dashboard/SpendingPerMonth/SpendingBreakdownSection";
import { TransactionDetail } from "@/components/dashboard/Transaction/TransactionDetail.tsx";
import { useExpenseReport } from "@/lib/swr.ts";
import type { HouseholdManagementPageProps } from "@/types/summary.ts";
import { useAuth } from "@/contexts/AuthContext.tsx";

export function HouseholdManagementPage({
  isAuth,
  user,
  monthlyAndYearlyDateSelector,
  monthlyDateSelector,
}: HouseholdManagementPageProps) {
  const { mutate } = useExpenseReport(
    user,
    monthlyAndYearlyDateSelector,
    isAuth
  );
  const {
    data: householdReport,
    error: householdReportError,
    isLoading: isHouseholdReportLoading,
    mutate: householdMutate,
  } = useExpenseReport(user, monthlyAndYearlyDateSelector, isAuth);
  const { userInfo } = useAuth();

  console.log(householdReport);

  return (
    <>
      {/* 支出の内訳カード */}
      <div className="lg:col-span-2 space-y-2">
        <SpendingBreakdownSection
          userInfo={userInfo}
          isAuth={isAuth}
          user={user}
          monthlyAndYearlyDateSelector={monthlyAndYearlyDateSelector}
          monthlyDateSelector={monthlyDateSelector}
          householdReport={householdReport?.data ?? {}}
          onTransactionUpdate={() => void householdMutate()}
        />
      </div>
      {/* 取引明細カード(mutateでデータ更新) */}
      <div className="lg:col-span-1">
        <TransactionDetail onUpdate={() => void mutate()} />
      </div>
      {/* 支出の推移グラフ */}
      <div className="col-span-2">
        <MonthlyBarChart />
      </div>
      <div className="col-span-1">
        <YearlyBarChart />
      </div>
    </>
  );
}
