// 予算カテゴリーの型定義
export interface BudgetCategory {
  name: string;
  code: string;
  groupCode: string;
  period: number; // 期間（1-12）
  periodType: "monthly" | "yearly"; // 期間の単位
  amount: number | null; // 予算額
}

// 予算カテゴリー行の型定義
export interface BudgetCategoryRowProps {
  categoryGroup: BudgetCategory[];
  onUpdate: (
    code: string,
    field: keyof BudgetCategory,
    value: number | string | null
  ) => void;
}

// 予算設定の型定義
export interface BudgetSettingProps {
  allCategories: BudgetCategory[];
  handleCategoryUpdate: (
    code: string,
    field: keyof BudgetCategory,
    value: number | string | null
  ) => void;
}
