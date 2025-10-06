import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useCategories } from "@/lib/swr.ts";
import type { CategoryContextType } from "@/types/transaction.ts";

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuth();

  // SWRでカテゴリーデータを取得（認証済みの場合のみ）
  const {
    data: categories,
    error,
    isLoading: isCategoriesLoading,
  } = useCategories(isAuth);

  // エラーハンドリング
  if (error) {
    toast.error("カテゴリーの取得に失敗しました", {
      className: "!bg-red-600 !text-white !border-red-800",
    });
  }

  return (
    <CategoryContext.Provider
      value={{
        categories: categories?.data || {},
        isCategoriesLoading: isCategoriesLoading,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export function useCategory() {
  const context = useContext(CategoryContext);

  if (context === undefined) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }

  return context;
}
