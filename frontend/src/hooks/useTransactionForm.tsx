import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useCategory } from "@/contexts/CategoryContext.tsx";
import { postTransaction } from "@/lib/api.ts";
import type {
  CategorySelection,
  TransactionData,
  updateTransactionData,
} from "@/types/transaction.tsx";

interface UseTransactionFormProps {
  transactionPatch: updateTransactionData | null;
  onSaveSuccess: () => void;
}

export const useTransactionForm = ({
  transactionPatch,
  onSaveSuccess,
}: UseTransactionFormProps) => {
  const { userInfo } = useAuth();
  const { categories, isCategoriesLoading } = useCategory();

  // transactionPatchからTransactionDataを作成する共通関数
  const createTransactionData = useMemo(() => {
    return (patch: updateTransactionData | null): TransactionData => {
      if (patch) {
        return {
          user: userInfo.user_id,
          amount: patch.amount || 0,
          date: patch.payment_date ? new Date(patch.payment_date) : new Date(),
          category: {
            type: "category",
            value: patch.category_id || "",
          },
          payer: patch.paid_by_user_id || userInfo.id,
          shop_name: patch.store_name || "",
          memo: patch.note || "",
        };
      } else {
        return {
          user: userInfo.user_id,
          amount: 0,
          date: new Date(),
          category: null,
          payer: userInfo.user_id,
          shop_name: "",
          memo: "",
        };
      }
    };
  }, [userInfo.user_id, userInfo.id]);

  const [transactionData, setTransactionData] = useState<TransactionData>(
    createTransactionData(transactionPatch)
  );

  // transactionPatchの変更を監視してtransactionDataを更新
  useEffect(() => {
    setTransactionData(createTransactionData(transactionPatch));
  }, [
    transactionPatch?.id,
    transactionPatch?.amount,
    transactionPatch?.payment_date,
    transactionPatch?.category_id,
    transactionPatch?.paid_by_user_id,
    transactionPatch?.store_name,
    transactionPatch?.note,
    createTransactionData,
  ]);

  // console.log("transactionData", transactionData);

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
        date: format(transactionData.date, "yyyy-MM-dd"),
        category: transactionData.category?.value || "",
      };

      const response = await postTransaction(requestData);

      if (response.status) {
        toast.success("取引明細を保存しました", {
          className: "!bg-yellow-600 !text-white !border-yellow-800",
        });
        onSaveSuccess();
      } else {
        toast.error("取引明細の保存に失敗しました", {
          className: "!bg-red-600 !text-white !border-red-800",
        });
      }
    } catch (error) {
      toast.error("取引明細の保存に失敗しました", {
        className: "!bg-red-600 !text-white !border-red-800",
      });
    } finally {
      resetForm();
    }
  };

  const resetForm = () => {
    setTransactionData({
      user: userInfo.user_id,
      amount: 0,
      date: new Date(),
      category: null,
      payer: userInfo.user_id,
      shop_name: "",
      memo: "",
    });
  };

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
    resetForm,
  };
};
