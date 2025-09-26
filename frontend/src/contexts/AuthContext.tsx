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
  signOutUser,
  type User,
} from "@/lib/auth.ts";

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
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

  // ログアウト処理を Context 内に集約
  const signOut = async () => {
    try {
      await signOutUser();
      setIsAuth(false);
      setUser(null);
      setError(null);
      localStorage.clear();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        setIsAuth(authenticated);

        if (authenticated) {
          try {
            const userData = await getCurrentUserInfo();
            if (userData) {
              setUser(userData);
            } else {
              console.warn("ユーザー情報が取得できませんでした");
              setIsAuth(false); // ユーザー情報が取得できない場合は認証失敗とする
            }
          } catch (userErr) {
            console.error("ユーザー情報取得エラー:", userErr);
            setIsAuth(false); // ユーザー情報取得失敗時は認証失敗とする
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
    <AuthContext.Provider value={{ user, isAuth, isLoading, error, signOut }}>
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
