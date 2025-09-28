// ユーザー情報の型定義
export interface User {
  id: number;
  name: string;
  user_id: string;
  email: string;
  cognito_sub: string;
  created_at: string;
}

// ログイン情報の型定義
export interface InfomationForLogin {
  email: string;
  password: string;
}

// サインアップ情報の型定義
export interface SignUpCredentials {
  email: string;
  password: string;
}

// 認証結果の型定義
export interface AuthResult {
  success: boolean;
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  error?: string;
}
