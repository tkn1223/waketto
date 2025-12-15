import {
  confirmSignUp,
  confirmUserAttribute,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signIn,
  signOut,
  signUp,
  updatePassword,
  updateUserAttributes,
} from "aws-amplify/auth";
import type {
  AuthResult,
  ChangePasswordProps,
  InfomationForLogin,
  SignUpCredentials,
  User,
  UserInfo,
} from "@/types/auth.ts";

// 環境変数の型定義
const COGNITO_CONFIG = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
};

/**
 * Cognitoにサインアップしてユーザーを作成
 */
export async function signUpWithCognito(
  credentials: SignUpCredentials
): Promise<AuthResult> {
  try {
    const { isSignUpComplete, nextStep } = await signUp({
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
  code: string,
  password: string
): Promise<AuthResult> {
  try {
    const { isSignUpComplete } = await confirmSignUp({
      username: email,
      confirmationCode: code,
    });

    if (!isSignUpComplete) {
      return {
        success: false,
        error: "確認コードが正しくありません",
      };
    }

    // サインアップ完了後、自動的にログインを実行
    const signInResult = await signIn({
      username: email,
      password: password,
    });

    if (!signInResult.isSignedIn) {
      return {
        success: false,
        error: "ログインに失敗しました",
      };
    }

    return {
      success: true,
      error: undefined,
    };
  } catch (error: unknown) {
    let errorMessage = "確認に失敗しました";

    if (error instanceof Error) {
      if (error.name === "CodeMismatchException") {
        errorMessage = "確認コードが正しくありません";
      } else if (error.name === "ExpiredCodeException") {
        errorMessage = "確認コードの有効期限が切れています";
      } else if (error.name === "NotAuthorizedException") {
        errorMessage = "ユーザーが見つかりません";
      } else {
        errorMessage = "API接続に失敗しました";
      }
    }

    console.error("Backend API connection error:", errorMessage);

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
  infomation: InfomationForLogin
): Promise<AuthResult> {
  // ログインの有無を確認
  const isAlreadySignedIn = await isAuthenticated();

  if (isAlreadySignedIn) {
    return {
      success: true,
      error: undefined,
    };
  }

  try {
    const { isSignedIn } = await signIn({
      username: infomation.email, // メールアドレスでログイン
      password: infomation.password,
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

    if (!user) {
      return false;
    }

    return true;
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
    // トークンの有効性を確認
    const isTokenValid = await checkTokenValidity();

    if (!isTokenValid) {
      throw new Error("トークンが期限切れです");
    }

    // congnitoのアクセストークンを取得
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      defaultHeaders.Authorization = `Bearer ${accessToken}`;
    } else {
      throw new Error("アクセストークンが取得できませんでした");
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

    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

/**
 * ユーザー情報を取得
 */
export async function getCurrentUserInfo(): Promise<UserInfo | null> {
  try {
    const response = await createAuthenticatedRequest("/user", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user = (await response.json()) as User;

    let email: string | null = null;

    // 最新のメールアドレスを取得
    try {
      const userAttributes = await fetchUserAttributes();
      email = userAttributes.email || null;
    } catch {
      // fetchUserAttributes()が失敗した場合は無視
    }

    // フォールバックとしてsignInDetailsから取得
    if (!email) {
      const currentUser = await getCurrentUser();
      email = currentUser?.signInDetails?.loginId || null;
    }

    const userInfo = {
      id: String(user.id),
      user_id: user.user_id,
      name: user.name,
      couple_id: user.couple_id || null,
      partner_user_id: user.partner_user_id || null,
      partner_id: user.partner_id ? String(user.partner_id) : null,
      email: email,
    };

    return userInfo;
  } catch (error) {
    console.error("Failed to get current user:", error);

    return null;
  }
}

/**
 * トークンを手動更新
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const session = await fetchAuthSession({ forceRefresh: true });

    if (session.tokens?.accessToken && session.tokens?.idToken) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("トークン更新エラー:", error);

    return false;
  }
}

/**
 * トークンの有効性を確認
 */
export async function checkTokenValidity(): Promise<boolean> {
  try {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    if (!accessToken) {
      return false;
    }

    // トークンの有効期限を確認
    const payload = JSON.parse(atob(accessToken.split(".")[1])) as Record<
      string,
      unknown
    >;
    const currentTime = Math.floor(Date.now() / 1000);

    // 有効期限が5分以内の場合に更新を行う
    const timeUntilExpiry = (payload.exp as number) - currentTime;

    if (timeUntilExpiry < 300) {
      const refreshSuccess = await refreshToken();

      if (!refreshSuccess) {
        // リフレッシュ失敗時は強制的にサインアウト
        await signOutUser();

        return false;
      }

      return true;
    }

    return true;
  } catch (error) {
    console.error("トークン有効性確認エラー:", error);
    await signOutUser();

    return false;
  }
}

/**
 * メールアドレスを変更
 */
export async function updateEmail(email: string): Promise<boolean> {
  try {
    await updateUserAttributes({
      userAttributes: {
        email: email,
      },
    });

    return true;
  } catch (error: unknown) {
    console.error("メールアドレス変更エラー:", error);

    return false;
  }
}

/**
 * メールアドレス変更の確認コードを検証
 */
export async function confirmEmailChange(code: string): Promise<AuthResult> {
  try {
    await confirmUserAttribute({
      userAttributeKey: "email",
      confirmationCode: code,
    });

    return { success: true, error: undefined };
  } catch (error: unknown) {
    console.error("メールアドレス確認エラー:", error);
    let errorMessage = "確認コードの検証に失敗しました";

    if (error instanceof Error) {
      if (error.name === "CodeMismatchException") {
        errorMessage = "確認コードが正しくありません";
      } else if (error.name === "ExpiredCodeException") {
        errorMessage = "確認コードの有効期限が切れています";
      } else if (error.name === "NotAuthorizedException") {
        errorMessage = "認証に失敗しました";
      }
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * パスワードを変更
 */
export async function changePassword({
  currentPassword,
  newPassword,
}: ChangePasswordProps): Promise<boolean> {
  try {
    await updatePassword({
      oldPassword: currentPassword,
      newPassword: newPassword,
    });

    return true;
  } catch (error: unknown) {
    console.error("パスワード変更エラー:", error);

    return false;
  }
}
