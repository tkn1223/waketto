// フロントエンドで扱う際の取引明細の型
export interface TransactionData {
  user: string;
  amount: number;
  date: Date;
  category: CategorySelection | null;
  payer: string;
  shop_name: string;
  memo: string;
}

// バックエンドに渡すときの取引明細の型
export interface TransactionRequestData {
  user: string;
  amount: number;
  date: string; // 事前に文字列に変換する
  category: string;
  payer: string;
  shop_name: string | null;
  memo: string | null;
}

// バックエンドから取得した取引明細の型（APIからの戻り値に確実性がないためオプショナルを設定）
export interface SavedTransactionData {
  id: string;
  user?: string;
  amount?: number;
  date?: string;
  category?: string;
  shop_name?: string | null;
  memo?: string | null;
  category_group_code?: string;
}

// 支出管理表のAPIレスポンス型定義
export interface ExpenseReportResponse {
  status: boolean;
  data: ExpenseReportData;
}

// 支出管理表の型定義（カテゴリーグループ）
export interface ExpenseReportData {
  monthly_fixed_cost?: CategoryGroupData;
  monthly_variable_cost?: CategoryGroupData;
  occasional_fixed_cost?: CategoryGroupData;
  occasional_variable_cost?: CategoryGroupData;
  luxury_consumption_cost?: CategoryGroupData;
  savings_investment_cost?: CategoryGroupData;
}

// 支出管理表の型定義（カテゴリーグループとカテゴリ詳細）
export interface CategoryGroupData {
  group_name: string;
  categories: Record<string, CategoryWithPayments>;
}

// 支出管理表の型定義（カテゴリと取引明細詳細）
export interface CategoryWithPayments {
  category_name: string;
  payments: SavedTransactionData[];
}

// 支出管理表の型定義（取引明細）
export interface TransactionRowProps {
  category: CategoryWithPayments;
  onTransactionUpdate: () => void;
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

// 金額（取引明細）
export interface AmountProps {
  amount: number;
  onAmountChange: (amount: number) => void;
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
  onSave?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}
