import { DateSelector } from "@/types/expense.ts";
import { UserMode } from "@/types/viewmode.ts";
import { TransactionData } from "@/types/transaction.ts";
import { ExpenseReportData } from "@/types/transaction.ts";

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
  isAuth: boolean;
  user: UserMode;
  monthlyAndYearlyDateSelector: DateSelector;
  monthlyDateSelector: DateSelector;
  householdReport: ExpenseReportData;
}

// カテゴリー毎の合計
export interface CategoryTotal {
  [categoryCode: string]: number;
}

// user毎の合計
export interface UserTotal {
  [userId: string]: number;
}

// user毎の明細レコード
export interface UserRecord {
  [userId: string]: TransactionData[];
}

// Props
export interface ExpenseReportTransformProps {
  CategoryTotals: CategoryTotal;
  UserTotals: UserTotal;
  UserRecords: UserRecord;
}

// ユーザーごとの合計値と全体の合計値を格納する型
export interface ExpenseReportTotals {
  totalAmount: number;
  userTotals: Record<string, number>;
}
