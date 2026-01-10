"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useCategory } from "@/contexts/CategoryContext.tsx";
import { useViewMode } from "@/contexts/ViewModeContext.tsx";
import {
  deleteTransaction,
  postTransaction,
  putTransaction,
} from "@/lib/api.ts";
import type {
  CategorySelection,
  SavedTransactionData,
  TransactionData,
} from "@/types/transaction.tsx";

interface UseTransactionFormProps {
  transactionPatch: SavedTransactionData | null;
  onSuccess: () => void;
}

export const useTransactionForm = ({
  transactionPatch,
  onSuccess,
}: UseTransactionFormProps) => {
  const { userInfo } = useAuth();
  const { categories, isCategoriesLoading } = useCategory();
  const { user } = useViewMode();

  // 無限レンダリング対策: createTransactionData関数をメモ化してuseEffectの不要な実行を防ぐ
  const createTransactionData = useCallback(
    (patch: SavedTransactionData | null): TransactionData => {
      if (patch) {
        return {
          user: userInfo.user_id,
          amount: patch.amount || 0,
          date: patch.date ? new Date(patch.date) : new Date(),
          category: {
            type: patch.category_group_code || "category",
            value: patch.category ? patch.category.toString() : "",
          },
          payer: String(patch.user || userInfo.id),
          shop_name: patch.shop_name || "",
          memo: patch.memo || "",
        };
      } else {
        return {
          user: userInfo.user_id,
          amount: 0,
          date: new Date(),
          category: null,
          payer: userInfo.id,
          shop_name: "",
          memo: "",
        };
      }
    },
    [userInfo.user_id, userInfo.id]
  );

  const [transactionData, setTransactionData] = useState<TransactionData>(
    createTransactionData(transactionPatch)
  );

  useEffect(() => {
    setTransactionData(createTransactionData(transactionPatch));
  }, [transactionPatch, createTransactionData]);

  const handleAmountChange = (amount: number) => {
    setTransactionData((prev) => ({ ...prev, amount }));
  };

  const handleDateChange = (date: Date) => {
    setTransactionData((prev) => ({ ...prev, date }));
  };

  const handleCategoryChange = (category: CategorySelection | null) => {
    setTransactionData((prev) => ({ ...prev, category }));
  };

  const handlePayerChange = (payer: string) => {
    setTransactionData((prev) => ({ ...prev, payer }));
  };

  const handleShopNameChange = (shop_name: string) => {
    setTransactionData((prev) => ({ ...prev, shop_name }));
  };

  const handleMemoChange = (memo: string) => {
    setTransactionData((prev) => ({ ...prev, memo }));
  };

  const handleSave = async () => {
    try {
      const requestData = {
        ...transactionData,
        payer: String(transactionData.payer),
        date: format(transactionData.date, "yyyy-MM-dd"),
        category: transactionData.category?.value || "",
      };

      const response = await postTransaction(requestData, user);

      if (response.status) {
        toast.success("取引明細を保存しました");
        resetForm();
        onSuccess();
      } else {
        toast.error("取引明細の保存に失敗しました", {
          className: "!bg-red-600 !text-white !border-red-800",
        });
      }
    } catch (_error) {
      toast.error("取引明細の保存中に サーバーエラーが発生しました", {
        className: "!bg-red-600 !text-white !border-red-800",
      });
    }
  };

  const handleUpdate = async () => {
    if (!transactionPatch?.id) {
      toast.error("更新対象の取引が指定されていません", {
        className: "!bg-red-600 !text-white !border-red-800",
      });

      return;
    }

    try {
      const requestData = {
        ...transactionData,
        payer: String(transactionData.payer),
        date: format(transactionData.date, "yyyy-MM-dd"),
        category: transactionData.category?.value || "",
      };

      const response = await putTransaction(requestData, user, transactionPatch?.id);

      if (response.status) {
        toast.success("取引明細を更新しました");
        resetForm();
        onSuccess();
      } else {
        toast.error("取引明細の更新に失敗しました", {
          className: "!bg-red-600 !text-white !border-red-800",
        });
      }
    } catch (_error) {
      toast.error("取引明細の更新中に サーバーエラーが発生しました", {
        className: "!bg-red-600 !text-white !border-red-800",
      });
    }
  };

  const handleDelete = async () => {
    if (!transactionPatch?.id) {
      toast.error("削除対象の取引が指定されていません", {
        className: "!bg-red-600 !text-white !border-red-800",
      });

      return;
    }

    try {
      const response = await deleteTransaction(user, transactionPatch?.id);

      if (response.status) {
        toast.success("取引明細を削除しました");
        resetForm();
        onSuccess();
      } else {
        toast.error("取引明細の削除に失敗しました", {
          className: "!bg-red-600 !text-white !border-red-800",
        });
      }
    } catch (_error) {
      toast.error("取引明細の削除中に サーバーエラーが発生しました", {
        className: "!bg-red-600 !text-white !border-red-800",
      });
    }
  };

  const resetForm = () => {
    setTransactionData({
      user: userInfo.user_id,
      amount: 0,
      date: new Date(),
      category: null,
      payer: userInfo.id,
      shop_name: "",
      memo: "",
    });
  };

  // 保存/更新ボタンの無効化
  const isSaveDisabled =
    transactionData.amount <= 0 || transactionData.category === null;

  return {
    categories,
    isCategoriesLoading,
    transactionData,
    isSaveDisabled,
    handleAmountChange,
    handleDateChange,
    handleCategoryChange,
    handlePayerChange,
    handleShopNameChange,
    handleMemoChange,
    handleSave,
    handleUpdate,
    handleDelete,
  };
};
