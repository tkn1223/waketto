import type { UserInfo } from "@/types/auth.ts";
import type { DateSelector } from "@/types/expense.ts";
import type { ExpenseReportData } from "@/types/transaction.ts";
import type { UserMode } from "@/types/viewmode.ts";

// 支出管理ページのprops型定義
export interface SpendingManagementPageProps {
  isAuth: boolean;
  user: UserMode;
  monthlyAndYearlyDateSelector: DateSelector;
  monthlyDateSelector: DateSelector;
}

// 家計簿ページのprops型定義
export interface HouseholdManagementPageProps {
  isAuth: boolean;
  user: UserMode;
  monthlyAndYearlyDateSelector: DateSelector;
  monthlyDateSelector: DateSelector;
}

// 支出の内訳カードのprops型定義
export interface SpendingBreakdownSectionProps {
  userInfo: UserInfo;
  user: UserMode;
  monthlyAndYearlyDateSelector: DateSelector;
  householdReport: ExpenseReportData;
  onTransactionUpdate: () => void;
}

// 円グラフ表示用のデータを生成するためのprops型定義
export interface SpendingDonutChartProps {
  householdReport: ExpenseReportData;
  user: UserMode;
}

// ユーザーごとの合計値と全体の合計値を格納する型
export interface ExpenseReportTotals {
  totalAmount: number;
  userTotals: Record<string, number>;
}

// 円グラフ用のデータ形式
export interface ChartDataItem {
  category: string;
  amount: number;
  fill: string;
}

// 小カテゴリーごとの集計結果
export interface CategoryTotal {
  categoryCode: string;
  categoryName: string;
  amount: number;
}

// カテゴリー合計のMapに格納する値の型
export interface CategoryTotalMapValue {
  name: string;
  amount: number;
}

// 支出の内訳詳細リストのprops型定義
export interface SpendingDetailListProps {
  householdReport: ExpenseReportData;
  user: UserMode;
  userInfo: UserInfo;
  onTransactionUpdate: () => void;
}
