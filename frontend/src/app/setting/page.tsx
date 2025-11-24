"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { BudgetSetting } from "@/components/setting/BudgetSetting.tsx";
import { SubscriptionSetting } from "@/components/setting/SubscriptionSetting.tsx";
import { BackToHomeButton } from "@/components/ui/backtohomebutton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useViewMode } from "@/contexts/ViewModeContext.tsx";
import { updateBudgetSetting, updateSubscriptions } from "@/lib/api.ts";
import { useBudgetSetting, useSubscriptions } from "@/lib/swr.ts";
import type { BudgetCategory, Subscription } from "@/types/budget.ts";

export default function BudgetSettingPage() {
  const { isAuth } = useAuth();
  const { user } = useViewMode();

  const {
    data: budgetSetting,
    error: budgetSettingError,
    isLoading: isBudgetSettingLoading,
    mutate: budgetSettingMutate,
  } = useBudgetSetting(user, isAuth);

  const {
    data: subscriptionSetting,
    error: subscriptionSettingError,
    isLoading: isSubscriptionSettingLoading,
    mutate: subscriptionSettingMutate,
  } = useSubscriptions(user, isAuth);

  // 1つのstateで全カテゴリーを管理
  const [allCategories, setAllCategories] = useState<BudgetCategory[]>([]);
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [subscriptionSaveError, setSubscriptionSaveError] = useState<
    string | null
  >(null);

  // 予算設定表の状態管理
  const handleCategoryUpdate = (
    code: string,
    field: keyof BudgetCategory,
    value: number | string | null
  ) => {
    setAllCategories((prev) =>
      prev.map((c) => (c.code === code ? { ...c, [field]: value } : c))
    );
  };

  const handleSubscriptionUpdate = (subscriptions: Subscription[]) => {
    setAllSubscriptions(subscriptions);
  };

  const handleBudgetSave = async () => {
    setSaveError(null);
    try {
      const response = await updateBudgetSetting(user, allCategories);

      if (response.status) {
        toast.success("予算設定表を保存しました");
        setSaveError(null);
      } else {
        // バリデーションエラーの場合
        if (response.errors) {
          const errorMessages = Object.values(response.errors)
            .flat()
            .join(", ");
          setSaveError(errorMessages);
          toast.error("入力内容に誤りがあります。再度ご確認ください。", {
            className: "!bg-red-600 !text-white !border-red-800",
          });
        } else {
          toast.error("予算設定表の保存に失敗しました", {
            className: "!bg-red-600 !text-white !border-red-800",
          });
        }
      }
    } catch (error) {
      console.error("API呼び出しエラー:", error);
      toast.error("予算設定表の保存中に サーバーエラーが発生しました", {
        className: "!bg-red-600 !text-white !border-red-800",
      });
    }
  };

  const handleSubscriptionSave = async () => {
    setSubscriptionSaveError(null);
    try {
      // 日付を文字列に変換
      const subscriptionsWithFormattedDates = allSubscriptions.map((sub) => ({
        ...sub,
        startDate: sub.startDate ? format(sub.startDate, "yyyy-MM-dd") : null,
        finishDate: sub.finishDate
          ? format(sub.finishDate, "yyyy-MM-dd")
          : null,
      })) as Subscription[];
      const response = await updateSubscriptions(
        user,
        subscriptionsWithFormattedDates
      );

      if (response.status) {
        toast.success("サブスク管理表を保存しました");
        setSubscriptionSaveError(null);
      } else {
        // バリデーションエラーの場合
        if (response.errors) {
          const errorMessages = Object.values(response.errors)
            .flat()
            .join(", ");
          setSubscriptionSaveError(errorMessages);
          toast.error("入力内容に誤りがあります。再度ご確認ください。", {
            className: "!bg-red-600 !text-white !border-red-800",
          });
        } else {
          toast.error("サブスク管理表の保存に失敗しました", {
            className: "!bg-red-600 !text-white !border-red-800",
          });
        }
      }
    } catch (error) {
      console.error("API呼び出しエラー:", error);
      toast.error("サブスク管理表の保存中に サーバーエラーが発生しました", {
        className: "!bg-red-600 !text-white !border-red-800",
      });
    }
  };

  // APIから取得したデータでallCategoriesを更新
  useEffect(() => {
    if (budgetSetting?.data && Array.isArray(budgetSetting.data)) {
      setAllCategories(budgetSetting.data);
    }
  }, [budgetSetting?.data]);

  // APIから取得したデータでallSubscriptionsを更新
  useEffect(() => {
    if (subscriptionSetting?.data && Array.isArray(subscriptionSetting.data)) {
      // 日付文字列をDateオブジェクトに変換
      const subscriptionsWithDates = subscriptionSetting.data.map((sub) => ({
        ...sub,
        startDate: sub.startDate ? new Date(sub.startDate) : null,
        finishDate: sub.finishDate ? new Date(sub.finishDate) : null,
      }));
      setAllSubscriptions(subscriptionsWithDates);
    }
  }, [subscriptionSetting?.data]);

  // ローディング中の表示
  if (isBudgetSettingLoading || isSubscriptionSettingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (budgetSettingError || subscriptionSettingError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">データの取得に失敗しました</p>
          <Button
            onClick={() => {
              void budgetSettingMutate();
              void subscriptionSettingMutate();
            }}
            className="px-6 bg-emerald-600 hover:bg-emerald-800"
          >
            再試行
          </Button>
        </div>
      </div>
    );
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
        {saveError && (
          <span className="ml-4 text-red-600 text-sm">{saveError}</span>
        )}
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
        {subscriptionSaveError && (
          <span className="ml-4 text-red-600 text-sm">
            {subscriptionSaveError}
          </span>
        )}
      </div>
      <SubscriptionSetting
        allSubscriptions={allSubscriptions}
        handleSubscriptionUpdate={handleSubscriptionUpdate}
      />

      <BackToHomeButton />
    </div>
  );
}
