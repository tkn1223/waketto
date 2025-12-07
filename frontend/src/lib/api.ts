import { fetchAuthSession } from "aws-amplify/auth";
import { checkTokenValidity, signOutUser } from "@/lib/auth.ts";
import type {
  BudgetCategory,
  BudgetSettingResponse,
  BudgetUsageResponse,
  Subscription,
  SubscriptionSettingResponse,
} from "@/types/budget.ts";
import type { DateSelector } from "@/types/expense.ts";
import type {
  CategoriesResponse,
  ExpenseReportResponse,
  HouseholdReportResponse,
  TransactionRequestData,
} from "@/types/transaction.ts";
import type { UserMode } from "@/types/viewmode.ts";

// 環境変数の型定義
const COGNITO_CONFIG = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
};

export interface Response {
  status: boolean;
  message?: string;
  errors?: Record<string, string[] | string>;
}

/*
 * 各APIリクエストの定義
 */

// カテゴリーの一覧を取得
export async function getCategories(): Promise<CategoriesResponse> {
  return await fetchApi<CategoriesResponse>("/categories");
}

// 支出管理表の一覧を取得
export async function getExpenseReport(
  userMode: UserMode,
  dateSelector: DateSelector
): Promise<ExpenseReportResponse> {
  // クエリパラメータを作成
  const params = new URLSearchParams();

  if (dateSelector.year) params.append("year", dateSelector.year);

  if (dateSelector.month) params.append("month", dateSelector.month);

  const queryString = params.toString();

  return await fetchApi<ExpenseReportResponse>(
    `/expense-report/${userMode}${queryString ? `?${queryString}` : ""}`
  );
}

// 家計簿の一覧を取得
export async function getHouseholdReport(
  userMode: UserMode,
  dateSelector: DateSelector
): Promise<HouseholdReportResponse> {
  // クエリパラメータを作成
  const params = new URLSearchParams();

  if (dateSelector.year) params.append("year", dateSelector.year);

  if (dateSelector.month) params.append("month", dateSelector.month);

  const queryString = params.toString();

  return await fetchApi<HouseholdReportResponse>(
    `/household-report/${userMode}${queryString ? `?${queryString}` : ""}`
  );
}

// 取引明細を保存
export async function postTransaction(
  requestData: TransactionRequestData,
  userMode?: UserMode
): Promise<Response> {
  return await fetchApi<Response>(`/transaction/${userMode}`, {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

// 取引明細を更新
export async function putTransaction(
  requestData: TransactionRequestData,
  id: string
): Promise<Response> {
  return await fetchApi<Response>(`/transaction/${id}`, {
    method: "PUT",
    body: JSON.stringify(requestData),
  });
}

// 取引明細を削除
export async function deleteTransaction(id: string): Promise<Response> {
  return await fetchApi(`/transaction/${id}`, {
    method: "DELETE",
  });
}

// 予算消化状況の一覧を取得
export async function getBudgetUsage(
  userMode: UserMode,
  dateSelector: DateSelector
): Promise<BudgetUsageResponse> {
  // クエリパラメータを作成
  const params = new URLSearchParams();

  if (dateSelector.year) params.append("year", dateSelector.year);

  const queryString = params.toString();

  return await fetchApi<BudgetUsageResponse>(
    `/budget/usage/${userMode}${queryString ? `?${queryString}` : ""}`
  );
}

// 予算設定の一覧を取得
export async function getBudgetSetting(
  userMode: UserMode
): Promise<BudgetSettingResponse> {
  return await fetchApi<BudgetSettingResponse>(`/budget/setting/${userMode}`);
}

// 予算設定の更新
export async function updateBudgetSetting(
  userMode: UserMode,
  budgetData: BudgetCategory[]
): Promise<Response> {
  return await fetchApi<Response>(`/budget/setting/updateBudget/${userMode}`, {
    method: "POST",
    body: JSON.stringify({ categories: budgetData }),
  });
}

// サブスクリプション設定の取得
export async function getSubscriptions(
  userMode: UserMode
): Promise<SubscriptionSettingResponse> {
  return await fetchApi<SubscriptionSettingResponse>(
    `/subscription/setting/${userMode}`
  );
}

// サブスクリプション設定の更新
export async function updateSubscriptions(
  userMode: UserMode,
  subscriptions: Subscription[]
): Promise<Response> {
  return await fetchApi<Response>(
    `/subscription/setting/updateSubscriptions/${userMode}`,
    {
      method: "POST",
      body: JSON.stringify({ subscriptions }),
    }
  );
}

// パートナー設定の保存
export async function postPartnerSetting(
  userName: string,
  partnerId?: string
): Promise<Response> {
  return await fetchApi<Response>(
    `/partner-setting/${userName}${partnerId ? `/${partnerId}` : ""}`,
    {
      method: "POST",
    }
  );
}

// パートナー設定の解除
export async function postPartnerReset(): Promise<Response> {
  return await fetchApi<Response>(`/partner-setting/reset`, {
    method: "DELETE",
  });
}

/*
 * APIリクエスト
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // トークンの有効性を確認
  const isTokenValid = await checkTokenValidity();

  if (!isTokenValid) {
    // トークン期限切れ時は自動的にサインアウトしてログイン画面にリダイレクト
    await signOutUser();
    // window.location.hrefを使わず、エラーをスローして呼び出し元で処理
    throw new Error("トークンが期限切れです。再度ログインしてください。");
  }

  // セッションを取得（トークンが期限切れの場合新しいトークンを自動取得）
  const session = await fetchAuthSession();
  const accessToken = session.tokens?.accessToken?.toString();

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    defaultHeaders.Authorization = `Bearer ${accessToken}`;
  } else {
    await signOutUser();
    throw new Error("IDトークンが取得できませんでした");
  }

  // ヘッダー情報が上書きされないよう事前にマージする
  const mergedHeaders: Record<string, string> = {
    ...defaultHeaders,
    // 将来的な拡張のため、オプションでヘッダーを追加可能にする
    ...(options.headers as Record<string, string>),
  };

  const url = `${COGNITO_CONFIG.apiBaseUrl}/api${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  if (!response.ok) {
    if (response.status === 401) {
      await signOutUser();
      throw new Error("認証に失敗しました。再度ログインしてください。");
    }

    const errorData = (await response
      .json()
      .catch(() => null)) as Response | null;
    console.error("API Error:", {
      status: response.status,
      statusText: response.statusText,
      errorData,
    });

    // エラーデータがある場合は、それを返す（バリデーションエラーなど）
    if (errorData && typeof errorData === "object" && "status" in errorData) {
      return errorData as T;
    }

    throw new Error(`APIリクエストに失敗しました: ${response.statusText}`);
  }

  return response.json() as T;
}
