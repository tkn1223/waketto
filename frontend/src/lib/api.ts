import { fetchAuthSession } from "aws-amplify/auth";
import { checkTokenValidity, signOutUser } from "@/lib/auth.ts";
import type {
  CategoriesResponse,
  TransactionRequestData,
  ExpenseReportResponse,
} from "@/types/transaction.ts";
import { UserMode } from "@/types/viewmode.ts";

// 環境変数の型定義
const COGNITO_CONFIG = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
};

export type Response = {
  status: boolean;
  message?: string;
  errors?: Record<string, string>;
};

/*
 * 各APIリクエストの定義
 */

// カテゴリーの一覧を取得
export async function getCategories(): Promise<CategoriesResponse> {
  return await fetchApi<CategoriesResponse>("/categories");
}

// 支出管理表の一覧を取得
export async function getExpenseReport(
  userMode?: UserMode
): Promise<ExpenseReportResponse> {
  return await fetchApi<ExpenseReportResponse>(`/expense-report/${userMode}`);
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

// パートナー設定の保存
export async function postPartnerSetting(partnerId: string): Promise<Response> {
  return await fetchApi<Response>(`/partner-setting/${partnerId}`, {
    method: "POST",
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
    window.location.href = "/signin";
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

    const errorData = await response.json().catch(() => null);
    console.error("API Error:", {
      status: response.status,
      statusText: response.statusText,
      errorData,
    });
    throw new Error(`APIリクエストに失敗しました: ${response.statusText}`);
  }

  return response.json() as T;
}
