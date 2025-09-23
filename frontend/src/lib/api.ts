import { fetchAuthSession } from "aws-amplify/auth";
import type {
  TransactionRequestData,
  CategoriesResponse,
} from "@/types/transaction.ts";

// 環境変数の型定義
const COGNITO_CONFIG = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
};

/*
 * 各APIリクエストの定義
 */

// カテゴリーの一覧を取得
export async function getCategories(): Promise<CategoriesResponse> {
  return await fetchApi<CategoriesResponse>("/categories");
}

// 取引明細を保存
export async function postTransaction(
  requestData: TransactionRequestData
): Promise<Response> {
  return await fetchApi<Response>("/transactions", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

/*
 * APIリクエスト
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // congnitoのidトークンを取得
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (idToken) {
    defaultHeaders.Authorization = `Bearer ${idToken}`;
  } else {
    throw new Error("IDトークンが取得できませんでした");
    // 取得できなかった時のエラーハンドリングが必要
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
