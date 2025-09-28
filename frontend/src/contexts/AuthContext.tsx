"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  isAuthenticated,
  getCurrentUserInfo,
  signInWithCognito,
  signOutUser,
  type User,
} from "@/lib/auth.ts";
import { InfomationForLogin } from "@/lib/auth.ts";

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (infomation: InfomationForLogin) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (infomation: InfomationForLogin) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signInWithCognito(infomation);
      if (result.success) {
        const userData = await getCurrentUserInfo();
        if (userData) {
          setUser(userData);
          setIsAuth(true);
        } else {
          throw new Error("ユーザー情報の取得に失敗しました");
        }
      } else {
        throw new Error(result.error || "ログインに失敗しました");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "ログインに失敗しました"
      );
      setIsAuth(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ログアウト処理を Context 内に集約
  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signOutUser();
      setIsAuth(false);
      setUser(null);
      localStorage.clear();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "ログアウトに失敗しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Amplifyが設定されているかチェック
        try {
          const { Amplify } = await import("aws-amplify");
          const config = Amplify.getConfig();
          if (!config.Auth?.Cognito?.userPoolId) {
            console.warn(
              "⚠️ Amplifyが正しく設定されていません。少し待ってから再試行します..."
            );
            setTimeout(() => {
              void checkAuth();
            }, 1000);
            return;
          }
        } catch (configErr) {
          console.error("Amplify設定チェックエラー:", configErr);
          setError("アプリケーションの初期化に失敗しました");
          setIsLoading(false);
          return;
        }

        const authenticated = await isAuthenticated();
        setIsAuth(authenticated);

        if (authenticated) {
          try {
            const userData = await getCurrentUserInfo();
            if (userData) {
              setUser(userData);
            } else {
              console.warn("ユーザー情報が取得できませんでした");
              setIsAuth(false);
            }
          } catch (userErr) {
            console.error("ユーザー情報取得エラー:", userErr);
            setIsAuth(false);
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        setError("認証チェックに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    void checkAuth();
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, isAuth, isLoading, error, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
