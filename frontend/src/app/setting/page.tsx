"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useViewMode } from "@/contexts/ViewModeContext.tsx";
import { useBudgetSetting } from "@/lib/swr.ts";
import { BackToHomeButton } from "@/components/ui/backtohomebutton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { BudgetSetting } from "@/components/setting/BudgetSetting.tsx";
import { BudgetCategory } from "@/types/budget.ts";
import { SubscriptionSetting } from "@/components/setting/SubscriptionSetting";
import { toast } from "sonner";
import { updateBudgetSetting } from "@/lib/api.ts";

export default function BudgetSettingPage() {
  const { isAuth } = useAuth();
  const { user } = useViewMode();

  const {
    data: budgetSetting,
    error: budgetSettingError,
    isLoading: isBudgetSettingLoading,
  } = useBudgetSetting(user, isAuth);

  // 1つのstateで全カテゴリーを管理
  const [allCategories, setAllCategories] = useState<BudgetCategory[]>([]);
  const [allSubscriptions, setAllSubscriptions] = useState<any[]>([]);

  // APIから取得したデータでallCategoriesを更新
  useEffect(() => {
    if (budgetSetting?.data && Array.isArray(budgetSetting.data)) {
      setAllCategories(budgetSetting.data as BudgetCategory[]);
    }
  }, [budgetSetting?.data]);

  const handleCategoryUpdate = (
    code: string,
    field: keyof BudgetCategory,
    value: number | string | null
  ) => {
    setAllCategories((prev) =>
      prev.map((c) => (c.code === code ? { ...c, [field]: value } : c))
    );
  };

  const handleSubscriptionUpdate = () => {
    console.log("サブスク管理表の状態管理");
  };

  const handleBudgetSave = async () => {
    try {
      const response = await updateBudgetSetting(user, allCategories);
      if (response.status) {
        toast.success("予算設定表を保存しました");
      } else {
        toast.error("予算設定表の保存に失敗しました", {
          className: "!bg-red-600 !text-white !border-red-800",
        });
      }
    } catch (error) {
      console.error("API呼び出しエラー:", error);
      toast.error("予算設定表の保存中に サーバーエラーが発生しました", {
        className: "!bg-red-600 !text-white !border-red-800",
      });
    }
  };

  const handleSubscriptionSave = async () => {
    console.log("サブスク管理表を保存する");
  };

  // api取得時にbudgetcategory型を付与する
  async function fetchBudgetCategories(): Promise<BudgetCategory[]> {
    const response = await fetch("/budget");
    const data = await response.json();
    return data as BudgetCategory[];
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 px-10">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold mr-8">予算設定表</h2>
        <Button
          onClick={() => void handleBudgetSave()}
          className="px-6 bg-emerald-600 hover:bg-emerald-800"
        >
          予算設定表を保存する
        </Button>
      </div>
      <BudgetSetting
        allCategories={allCategories}
        handleCategoryUpdate={handleCategoryUpdate}
      />
      <div className="flex items-center mt-10">
        <h2 className="text-2xl font-bold mr-8">サブスク管理表</h2>
        <Button
          onClick={() => void handleSubscriptionSave()}
          className="px-6 bg-emerald-600 hover:bg-emerald-800"
        >
          サブスク管理表を保存する
        </Button>
      </div>
      <SubscriptionSetting
        allSubscriptions={allSubscriptions}
        handleSubscriptionUpdate={handleSubscriptionUpdate}
      />

      <BackToHomeButton />
    </div>
  );
}
