import { useState } from "react";
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
  transactionPatch: Partial<updateTransactionData>;
  onSaveSuccess: () => void;
}

export const useTransactionForm = ({
  transactionPatch,
  onSaveSuccess,
}: UseTransactionFormProps) => {
  const { userInfo } = useAuth();
  const { categories, isCategoriesLoading } = useCategory();
  const [transactionData, setTransactionData] = useState<TransactionData>(
    transactionPatch
      ? {
          user: userInfo.user_id,
          amount: transactionPatch.amount || 0,
          date: transactionPatch.payment_date
            ? new Date(transactionPatch.payment_date)
            : new Date(),
          category: transactionPatch.category_id
            ? {
                type: "category",
                value: transactionPatch.category_id.toString(),
              }
            : null,
          payer: transactionPatch.paid_by_user_id || userInfo.user_id,
          shop_name: transactionPatch.store_name || "",
          memo: transactionPatch.note || "",
        }
      : {
          user: userInfo.user_id,
          amount: 0,
          date: new Date(),
          category: null,
          payer: userInfo.user_id,
          shop_name: "",
          memo: "",
        }
  );

  console.log("transactionData", transactionData);

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
