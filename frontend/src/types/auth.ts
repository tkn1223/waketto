// ユーザー情報の型定義（バックエンドから返される完全な情報）
export interface User {
  id: string;
  name: string;
  user_id: string;
  cognito_sub: string;
  couple_id: string | null;
  partner_user_id: string | null;
  created_at: string;
}

// ユーザー情報の型定義（フロントエンドで使用する最小限の情報）
export interface UserInfo {
  id: string;
  user_id: string;
  name: string;
  couple_id: string | null;
  partner_user_id: string | null;
  email: string | null;
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

// パスワード変更情報の型定義
export interface ChangePasswordProps {
  currentPassword: string;
  newPassword: string;
}
