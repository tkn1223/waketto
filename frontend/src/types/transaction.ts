// 取引明細の型定義
export interface TransactionData {
  user: string;
  amount: number;
  date: Date;
  category: CategorySelection | null;
  payer: string;
  shop_name: string;
  memo: string;
}

// 編集用の取引明細の型定義
export interface Payment {
  id: number;
  amount: number;
  category_id: number;
  payment_date: string;
  paid_by_user_id: number;
  couple_id: number | null;
  store_name: string | null;
  note: string | null;
}

// API送信用の型（日付は文字列）
export interface TransactionRequestData {
  user: string;
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
