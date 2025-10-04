// 取引明細
export interface TransactionData {
  user: string;
  amount: number;
  date: Date;
  category: CategorySelection | null;
  payer: string;
  shop_name: string;
  memo: string;
}

// 編集用の取引明細（APIからの戻り値に確実性がないためオプショナルを設定）
export interface updateTransactionData {
  id: string;
  amount?: number;
  category_id?: string;
  category_group_code?: string;
  payment_date?: string;
  paid_by_user_id?: string;
  couple_id?: string | null;
  store_name?: string | null;
  note?: string | null;
}

// API送信用日付は文字列）
export interface TransactionRequestData {
  user: string;
  amount: number;
  date: string;
  category: string;
  payer: string;
  shop_name: string | null;
  memo: string | null;
}

// カテゴリー関連
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
  selected: CategorySelection | null;
  onSelectionChange: (selected: CategorySelection | null) => void;
}

export interface CategoriesResponse {
  status: boolean;
  data: CategoryData;
}

export interface CategoryContextType {
  categories: CategoryData;
  isCategoriesLoading: boolean;
}

// 支払者選択用
export interface PayerSelectProps {
  userInfo: { id: string; user_id: string; name: string };
  payer: string;
  onPayerChange: (payer: string) => void;
}

// 取引明細フォーム用
export interface TransactionFormProps {
  // data
  userInfo: { id: string; user_id: string; name: string };
  transactionData: TransactionData;
  isSaveDisabled: boolean;
  saveButtonText: string; // ボタンのテキスト
  deleteButtonText: string; // ボタンのテキスト
  // handler
  onAmountChange: (amount: number) => void;
  onDateChange: (date: Date) => void;
  onCategoryChange: (category: CategorySelection | null) => void;
  onPayerChange: (payer: string) => void;
  onShopNameChange: (shop_name: string) => void;
  onMemoChange: (memo: string) => void;
  onSave: () => void;
  onDelete: () => void;
}
