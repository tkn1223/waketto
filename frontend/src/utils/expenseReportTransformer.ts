import type {
  ExpenseReportData,
  CategoryWithPayments,
} from "@/types/transaction.ts";
import type { ExpenseReportTotals } from "@/types/summary.ts";

// ExpenseReportDataから合計値とユーザーごとの合計値を計算
export function calculateExpenseTotals(
  expenseReportData: ExpenseReportData | undefined
): ExpenseReportTotals | null {
  // データが存在しない場合
  if (!expenseReportData) return null;

  // ユーザーごとの合計を格納するオブジェクト
  const userTotals: Record<string, number> = {};
  // 全体の合計を格納する変数
  let totalAmount = 0;

  // すべてのカテゴリーグループを走査
  Object.values(expenseReportData).forEach((categoryGroup) => {
    if (!categoryGroup) return;

    // 各カテゴリーを走査
    (Object.values(categoryGroup.categories) as CategoryWithPayments[]).forEach(
      (category) => {
        // 各支払いを処理
        category.payments.forEach((payment) => {
          const amount = payment.amount ?? 0;
          const userId = payment.user ?? "??";

          // ユーザーごとの合計を計算（userTotals[userId]の初期値がundefinedの場合は0を返す）
          userTotals[userId] = (userTotals[userId] ?? 0) + amount;

          // 全体の合計を計算
          totalAmount += amount;
        });
      }
    );
  });

  return {
    totalAmount,
    userTotals,
  };
}
