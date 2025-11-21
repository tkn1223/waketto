// 予算カテゴリーの型定義
export interface BudgetCategory {
  name: string;
  code: string;
  groupCode: string;
  period: number; // 期間（1-12）
  periodType: "monthly" | "yearly"; // 期間の単位
  budget: number | null; // 予算額
}
