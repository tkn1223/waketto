import type {
  ReactNode} from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState} from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { getCategories } from "@/lib/api.ts";
import type { CategoryContextType,CategoryData } from "@/types/transaction.ts";

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuth();
  const [categories, setCategories] = useState<CategoryData>({});
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const fetchCategories = async () => {
    if (!isAuth) return;

    setIsCategoriesLoading(true);
    try {
      const response = await getCategories();

      if (response.status) {
        setCategories(response.data);
      }
    } catch (err) {
      toast.error("カテゴリーの取得に失敗しました", {
        className: "!bg-red-600 !text-white !border-red-800",
      });
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  useEffect(() => {
    void fetchCategories();
  }, [isAuth]);

  return (
    <CategoryContext.Provider value={{ categories, isCategoriesLoading }}>
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
