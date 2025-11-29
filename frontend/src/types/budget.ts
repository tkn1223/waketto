import type { Category } from "./transaction.ts";

// 予算カテゴリーの型定義
export interface BudgetCategory {
  name: string;
  code: string;
  groupCode: string;
  period: number | null; // 拡張予定。予算の期間（1-12）
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

// 予算設定APIレスポンスの型定義
export interface BudgetSettingResponse {
  status: boolean;
  data: BudgetCategory[];
}

// サブスクリプションの型定義
export interface Subscription {
  id?: string;
  name: string;
  updatePeriod: string; // "monthly" | "yearly"
  amount: number | null; // 数値または空文字列
  startDate: Date | null;
  finishDate: Date | null;
}

// サブスクリプション設定コンポーネントのprops型定義
export interface SubscriptionSettingProps {
  allSubscriptions: Subscription[];
  handleSubscriptionUpdate: (subscriptions: Subscription[]) => void;
}

// サブスクリプション設定APIレスポンスの型定義
export interface SubscriptionSettingResponse {
  status: boolean;
  data: Subscription[];
}

// 予算使用量APIレスポンスの型定義
export interface BudgetUsageResponse {
  status: boolean;
  data: {
    id: number;
    category: Category;
    budget_amount: number;
    monthly_data: {
      month: number;
      category_id: number;
      amount: number;
      payment_ids: string;
    }[];
    residue_budget: number;
  }[];
}
