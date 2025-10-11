"use client";

import { useSWRConfig } from "swr";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  FinanceMode,
  UserMode,
  ViewModeContextType,
} from "@/types/viewmode";

export const ViewModeContext = createContext<ViewModeContextType | undefined>(
  undefined
);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const { mutate } = useSWRConfig();

  const [finance, setFinance] = useState<FinanceMode>(() => {
    if (typeof window !== "undefined") {
      const currentFinance = localStorage.getItem("financeMode");
      if (currentFinance === "expense" || currentFinance === "budget") {
        return currentFinance;
      }
    }
    return "expense";
  });

  const [user, setUser] = useState<UserMode>(() => {
    if (typeof window !== "undefined") {
      const currentUser = localStorage.getItem("userMode");
      if (currentUser === "alone" || currentUser === "common") {
        return currentUser;
      }
    }
    return "alone";
  });

  const currentView = `${finance}-${user}`;

  const handleFinanceChange = (mode: FinanceMode) => {
    setFinance(mode);
  };

  const handleUserChange = (mode: UserMode) => {
    setUser(mode);
    // モード切替時にデータを再取得
    mutate(
      (key) => typeof key === "string" && key.startsWith("/expense-report")
    );
  };

  // localStorageに保存（ファイナンスモード）
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("financeMode", finance);
    }
  }, [finance]);

  // localStorageに保存（ユーザーモード）
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userMode", user);
    }
  }, [user]);

  return (
    <ViewModeContext.Provider
      value={{
        finance,
        user,
        setFinance: handleFinanceChange,
        setUser: handleUserChange,
        currentView,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}
