import useSWR from "swr";
import { getExpenseReport, getCategories } from "./api.ts";

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

// カスタムフック（認証済みの場合のみ取得）
export const useExpenseReport = (isAuth?: boolean) => {
  return useSWR(isAuth ? "/expense-report" : null, getExpenseReport, {
    ...swrConfig,
    refreshInterval: 30000, // 30秒ごとに更新
  });
};

export const useCategories = (isAuth?: boolean) => {
  return useSWR(isAuth ? "/categories" : null, getCategories, {
    ...swrConfig,
  });
};
