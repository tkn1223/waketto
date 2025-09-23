import type { User } from "@/lib/auth.ts";

// 取引明細の型定義

export interface TransactionData {
  user: User;
  amount: number;
  date: Date;
  category: CategorySelection | null;
  payer: string;
  shop_name: string;
  memo: string;
}

// API送信用の型（日付は文字列）
export interface TransactionRequestData {
  user: User;
  amount: number;
  date: string;
  category: number;
  payer: string;
  shop_name: string | null;
  memo: string | null;
}

// カテゴリー関連の型定義

export interface Category {
  id: number;
  code: string;
  name: string;
}

export interface CategoryGroup {
  group_name: string;
  categories: Category[];
}

export type CategoryData = Record<string, CategoryGroup>;

export interface CategorySelection {
  type: string;
  value: string;
}

export interface CategoryListProps {
  categories: CategoryData;
  selected: CategorySelection | null;
  onSelectionChange: (selected: CategorySelection | null) => void;
}

export interface CategoriesResponse {
  status: boolean;
  data: CategoryData;
}
