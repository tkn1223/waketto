import { MonthlyBarChart } from "@/components/dashboard/ExpenseGraph/MonthlyBarChart.tsx";
import { YearlyBarChart } from "@/components/dashboard/ExpenseGraph/YearlyBarChart.tsx";
import { SpendingBreakdownSection } from "@/components/dashboard/SpendingPerMonth/SpendingBreakdownSection.tsx";
import { TransactionDetail } from "@/components/dashboard/Transaction/TransactionDetail.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useExpenseReport } from "@/lib/swr.ts";
import type { HouseholdManagementPageProps } from "@/types/summary.ts";

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
  const { data: householdReport, mutate: householdMutate } = useExpenseReport(
    user,
    monthlyAndYearlyDateSelector,
    isAuth
  );
  const { userInfo } = useAuth();

  console.log(householdReport);

  return (
    <>
      {/* 支出の内訳カード */}
      <div className="lg:col-span-2 space-y-2">
        <SpendingBreakdownSection
          userInfo={userInfo}
          user={user}
          monthlyAndYearlyDateSelector={monthlyAndYearlyDateSelector}
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
