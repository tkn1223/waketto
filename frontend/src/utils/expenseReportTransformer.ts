import type {
  ExpenseReportData,
  CategoryWithPayments,
} from "@/types/transaction.ts";

/**
 * 合計値とユーザーごとの合計値を計算
 */
export interface ExpenseReportTotals {
  totalAmount: number;
  userTotals: Record<string, number>;
}

/**
 * ExpenseReportDataから合計値とユーザーごとの合計値を計算
 * @param expenseReportData - 変換元のデータ
 * @returns 合計値とユーザーごとの合計値（nullの場合はデータなし）
 */
export function calculateExpenseTotals(
  expenseReportData: ExpenseReportData | undefined
): ExpenseReportTotals | null {
  if (!expenseReportData) return null;

  const userTotals: Record<string, number> = {};
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
          const userId = String(payment.user ?? "unknown");

          // ユーザーごとの合計を計算
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
