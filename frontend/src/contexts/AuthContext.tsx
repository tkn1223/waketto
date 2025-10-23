"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUserInfo,
  isAuthenticated,
  signInWithCognito,
  signOutUser,
} from "@/lib/auth.ts";
import type { InfomationForLogin, UserInfo } from "@/types/auth.ts";

interface AuthContextType {
  userInfo: UserInfo;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (infomation: InfomationForLogin) => Promise<void>;
  signOut: () => Promise<void>;
}

/* eslint-disable react-refresh/only-export-components */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: "",
    user_id: "",
    name: "",
    couple_id: null,
  });
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const _router = useRouter();

  // ログイン処理
  const signIn = async (infomation: InfomationForLogin) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signInWithCognito(infomation);

      if (result.success) {
        // ログイン後にユーザー情報を取得するため待機
        await new Promise((resolve) => setTimeout(resolve, 100));

        const userInfo = await getCurrentUserInfo();

        if (userInfo) {
          setUserInfo(userInfo);
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
      setUserInfo({ id: "", user_id: "", name: "", couple_id: null });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ログアウト処理
  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signOutUser();
      setIsAuth(false);
      setUserInfo({ id: "", user_id: "", name: "", couple_id: null });
      localStorage.clear();
      sessionStorage.clear();
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
        const authenticated = await isAuthenticated();
        setIsAuth(authenticated);

        if (authenticated) {
          const userId = await getCurrentUserInfo();

          if (userId) {
            setUserInfo(userId);
          } else {
            console.warn("ユーザー情報が取得できませんでした");
            setIsAuth(false);
            setUserInfo({ id: "", user_id: "", name: "", couple_id: null });
          }
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        setIsAuth(false);
        setUserInfo({ id: "", user_id: "", name: "", couple_id: null });
      } finally {
        setIsLoading(false);
      }
    };

    void checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userInfo, isAuth, isLoading, error, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* eslint-disable react-refresh/only-export-components */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
