"use client";

import useSWR from "swr";
import type {
  BudgetSettingResponse,
  SubscriptionSettingResponse,
} from "@/types/budget.ts";
import type { DateSelector } from "@/types/expense.ts";
import type { BudgetUsageResponse } from "@/types/summary.ts";
import type {
  CategoriesResponse,
  ExpenseReportResponse,
} from "@/types/transaction.ts";
import type { UserMode } from "@/types/viewmode.ts";
import {
  getBudgetSetting,
  getBudgetUsage,
  getCategories,
  getExpenseReport,
  getSubscriptions,
} from "./api.ts";

// デフォルトfetcher
const defaultFetcher = (url: string) => fetch(url).then((res) => res.json());

export const swrConfig = {
  // デフォルトfetcher
  fetcher: defaultFetcher,

  // 再取得設定
  revalidateOnFocus: false, // フォーカス時の再取得を無効
  revalidateOnReconnect: true, // ネットワーク復旧時の再取得
  refreshInterval: 0, // 自動更新を無効（必要に応じて設定）

  // キャッシュ設定
  dedupingInterval: 2000, // 2秒間は重複リクエストを防ぐ

  // エラー時の再試行
  errorRetryCount: 3, // 最大3回再試行
  errorRetryInterval: 5000, // 5秒間隔で再試行
};

// 支出管理表データ取得用のカスタムフック
export const useExpenseReport = (
  userMode: UserMode,
  dateSelector: DateSelector,
  isAuth?: boolean
): ReturnType<typeof useSWR<ExpenseReportResponse, Error>> => {
  const key = isAuth
    ? `/expense-report/${userMode}?year=${dateSelector.year}&month=${dateSelector.month}`
    : null;

  return useSWR(key, () => getExpenseReport(userMode, dateSelector), {
    ...swrConfig,
  });
};

// カテゴリデータ取得用のカスタムフック
export const useCategories = (
  isAuth?: boolean
): ReturnType<typeof useSWR<CategoriesResponse, Error>> => {
  return useSWR(isAuth ? "/categories" : null, getCategories, {
    ...swrConfig,
  });
};

// 予実管理表データ取得用のカスタムフック
export const useBudgetUsage = (
  userMode: UserMode,
  dateSelector: DateSelector,
  isAuth?: boolean
): ReturnType<typeof useSWR<BudgetUsageResponse, Error>> => {
  const key = isAuth
    ? `/budget/usage/${userMode}?year=${dateSelector.year}`
    : null;

  return useSWR(key, () => getBudgetUsage(userMode, dateSelector), {
    ...swrConfig,
  });
};

// 予算設定データ取得用のカスタムフック
export const useBudgetSetting = (
  userMode: UserMode,
  isAuth?: boolean
): ReturnType<typeof useSWR<BudgetSettingResponse, Error>> => {
  const key = isAuth ? `/budget/setting/${userMode}` : null;

  return useSWR(key, () => getBudgetSetting(userMode), {
    ...swrConfig,
  });
};

// サブスクリプション設定データ取得用のカスタムフック
export const useSubscriptions = (
  userMode: UserMode,
  isAuth?: boolean
): ReturnType<typeof useSWR<SubscriptionSettingResponse, Error>> => {
  const key = isAuth ? `/subscription/setting/${userMode}` : null;

  return useSWR(key, () => getSubscriptions(userMode), {
    ...swrConfig,
  });
};
