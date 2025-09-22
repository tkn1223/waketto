import { fetchAuthSession } from "aws-amplify/auth";
import type { CategoryData } from "@/types/category.ts";

// 環境変数の型定義
const COGNITO_CONFIG = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
};

interface CategoriesResponse {
  status: boolean;
  data: CategoryData;
}

export async function getCategories(): Promise<CategoriesResponse> {
  return await fetchApi<CategoriesResponse>("/categories");
}

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
    throw new Error(`APIリクエストに失敗しました: ${response.statusText}`);
  }

  return response.json() as T;
}
