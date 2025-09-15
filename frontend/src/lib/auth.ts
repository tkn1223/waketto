import {
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";

// 環境変数の型定義
const COGNITO_CONFIG = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
};

// ユーザー情報の型定義
export interface User {
  id: number;
  name: string;
  email: string;
  cognito_sub: string;
  created_at: string;
}

// ログイン情報の型定義
export interface LoginCredentials {
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

/**
 * Cognitoにサインアップしてユーザーを作成
 */
export async function signUpWithCognito(
  credentials: SignUpCredentials
): Promise<AuthResult> {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: credentials.email,
      password: credentials.password,
      options: {
        userAttributes: {
          email: credentials.email,
        },
        autoSignIn: false, // 自動ログインは無効
      },
    });

    if (isSignUpComplete) {
      return {
        success: true,
        error: undefined,
      };
    } else if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
      return {
        success: true,
        error: "確認コードを送信しました。メールをご確認ください。",
      };
    }

    return {
      success: false,
      error: "サインアップに失敗しました",
    };
  } catch (error: unknown) {
    console.error("Cognito sign up error:", error);

    let errorMessage = "サインアップに失敗しました";

    if (error instanceof Error) {
      if (error.name === "UsernameExistsException") {
        errorMessage = "このメールアドレスは既に使用されています";
      } else if (error.name === "InvalidPasswordException") {
        errorMessage = "パスワードが要件を満たしていません";
      } else if (error.name === "InvalidParameterException") {
        errorMessage = "入力内容に問題があります";
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 確認コードでサインアップを完了
 */
export async function confirmSignUpWithCognito(
  email: string,
  code: string
): Promise<AuthResult> {
  try {
    const { isSignUpComplete } = await confirmSignUp({
      username: email,
      confirmationCode: code,
    });

    if (isSignUpComplete) {
      // バックエンドAPIでユーザー情報を取得/作成
      try {
        const userResponse = await createAuthenticatedRequest("/user");
        if (userResponse.ok) {
          return {
            success: true,
            error: undefined,
          };
        } else {
          console.error("Backend API error:", userResponse.status);
          return {
            success: false,
            error: "ユーザー情報の取得に失敗しました",
          };
        }
      } catch (apiError) {
        console.error("Backend API connection error:", apiError);
        return {
          success: false,
          error: `サーバーとの通信に失敗しました: ${apiError instanceof Error ? apiError.message : "Unknown error"}`,
        };
      }
    }

    return {
      success: false,
      error: "確認コードが正しくありません",
    };
  } catch (error: unknown) {
    console.error("Cognito confirm sign up error:", error);

    let errorMessage = "確認に失敗しました";

    if (error instanceof Error) {
      if (error.name === "CodeMismatchException") {
        errorMessage = "確認コードが正しくありません";
      } else if (error.name === "ExpiredCodeException") {
        errorMessage = "確認コードの有効期限が切れています";
      } else if (error.name === "NotAuthorizedException") {
        errorMessage = "ユーザーが見つかりません";
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Cognitoにログインしてトークンを取得
 */
export async function signInWithCognito(
  credentials: LoginCredentials
): Promise<AuthResult> {
  try {
    // 既存のセッションがある場合は先にサインアウト
    try {
      await signOut();
    } catch {
      // サインアウトに失敗しても続行（セッションがない場合など）
    }

    const { isSignedIn } = await signIn({
      username: credentials.email, // メールアドレスでログイン
      password: credentials.password,
    });

    if (isSignedIn) {
      // Amplifyが自動でセキュアストレージにトークンを保存
      // localStorageは使用せず、Amplifyのセキュアストレージを活用
      const session = await fetchAuthSession();
      const { accessToken, idToken } = session.tokens ?? {};

      return {
        success: true,
        accessToken: accessToken?.toString(),
        idToken: idToken?.toString(),
        refreshToken: undefined, // Amplifyが内部で管理
      };
    }

    return {
      success: false,
      error: "ログイン中にエラーが発生しました",
    };
  } catch (error: unknown) {
    console.error("Cognito sign in error:", error);

    let errorMessage = "ログインに失敗しました";

    if (error instanceof Error) {
      if (error.name === "NotAuthorizedException") {
        errorMessage = "メールアドレスまたはパスワードが正しくありません";
      } else if (error.name === "UserNotFoundException") {
        errorMessage = "ユーザーが見つかりません";
      } else if (error.name === "UserNotConfirmedException") {
        errorMessage = "メールアドレスが確認されていません";
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 現在のユーザーがログインしているかチェック
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch {
    return false;
  }
}

/**
 * ログアウト
 */
export async function signOutUser() {
  try {
    await signOut();

    // 必要に応じてページをリロードまたはリダイレクト
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
  } catch (error) {
    console.error("Sign out error:", error);
  }
}

/**
 * 認証済みAPIリクエストの作成
 */
export async function createAuthenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (idToken) {
      headers.Authorization = `Bearer ${idToken}`;
    }

    const response = await fetch(
      `${COGNITO_CONFIG.apiBaseUrl}/api${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    // 401エラー時に自動ログアウト
    if (response.status === 401) {
      await signOutUser();
      throw new Error("Unauthorized");
    }

    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

/**
 * ユーザー情報を取得
 */
export async function getCurrentUserInfo(): Promise<User | null> {
  try {
    const response = await createAuthenticatedRequest("/user");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user = await response.json();
    return user as User;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}
