import type {
  ExpenseReportData,
  SavedTransactionData,
  CategoryWithPayments,
} from "@/types/transaction.ts";

/**
 * 支払った人ごとにpaymentsをグループ化する
 * 個人モード・共有モードの両方に対応（filterByUserIdでフィルタリング可能）
 * @param expenseReportData - 支出レポートデータ
 * @returns 支払った人のIDをキーとした、支払い明細の配列のマップ
 */
export function groupPaymentsByUser(
  expenseReportData: ExpenseReportData | undefined
): Record<string, SavedTransactionData[]> {
  if (!expenseReportData) return {};

  const paymentsByUser: Record<string, SavedTransactionData[]> = {};

  // すべてのカテゴリーグループを走査
  Object.values(expenseReportData).forEach((categoryGroup) => {
    if (!categoryGroup) return;

    // 各カテゴリーを走査
    (Object.values(categoryGroup.categories) as CategoryWithPayments[]).forEach(
      (category) => {
        // categoryがnullまたはpaymentsが存在しない場合はスキップ
        if (!category || !category.payments) {
          return;
        }

        // 各支払いを支払った人ごとにグループ化
        category.payments.forEach((payment) => {
          const userId = payment.user || "unknown";
          if (!paymentsByUser[userId]) {
            paymentsByUser[userId] = [];
          }
          paymentsByUser[userId].push(payment);
        });
      }
    );
  });

  // 各ユーザーの支払いを日付順にソート
  Object.keys(paymentsByUser).forEach((userId) => {
    paymentsByUser[userId].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });
  });

  return paymentsByUser;
}
