import type {
  CategoryGroupData,
  CategoryWithPayments,
  ExpenseReportData,
  PaymentWithCategory,
  SavedTransactionData,
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
  (
    Object.values(expenseReportData) as (CategoryGroupData | undefined)[]
  ).forEach((categoryGroup) => {
    if (!categoryGroup) return;

    // 各カテゴリーを走査
    Object.values(categoryGroup.categories).forEach(
      (category: CategoryWithPayments) => {
        // categoryがnullまたはpaymentsが存在しない場合はスキップ
        if (!category || !category.payments) {
          return;
        }

        // 各支払いを支払った人ごとにグループ化
        category.payments.forEach((payment: SavedTransactionData) => {
          const userId = payment.user || "unknown";

          if (!paymentsByUser[userId]) {
            paymentsByUser[userId] = [];
          }
          // category_nameを付与してPaymentWithCategoryとして追加
          const userPaymentsArray = paymentsByUser[userId];

          if (userPaymentsArray) {
            userPaymentsArray.push({
              ...payment,
              category_name: category.category_name,
            });
          }
        });
      }
    );
  });

  // 各ユーザーの支払いを日付順にソート
  Object.keys(paymentsByUser).forEach((userId) => {
    const userPayments = paymentsByUser[userId];

    if (userPayments) {
      userPayments.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;

        return dateA - dateB;
      });
    }
  });

  return paymentsByUser;
}
