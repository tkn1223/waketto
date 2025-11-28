import type {
  ExpenseReportData,
  SavedTransactionData,
  CategoryWithPayments,
  PaymentWithCategory,
} from "@/types/transaction.ts";

/**
 * 支払った人ごとにpaymentsをグループ化する
 * カテゴリー名を含むPaymentWithCategory[]を返す
 */
export function groupPaymentsByUser(
  expenseReportData: ExpenseReportData | undefined
): Record<string, PaymentWithCategory[]> {
  if (!expenseReportData) return {};

  const paymentsByUser: Record<string, PaymentWithCategory[]> = {};

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
          // category_nameを付与してPaymentWithCategoryとして追加
          paymentsByUser[userId].push({
            ...payment,
            category_name: category.category_name,
          });
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
