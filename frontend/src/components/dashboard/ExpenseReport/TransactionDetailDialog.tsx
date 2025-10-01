import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { CategoryList } from "@/components/dashboard/Transaction/CategoryList.tsx";
import { Memo } from "@/components/dashboard/Transaction/Memo.tsx";
import { PayerSelect } from "@/components/dashboard/Transaction/PayerSelect.tsx";
import { RegisteredDate } from "@/components/dashboard/Transaction/RegisteredDate.tsx";
import { ShopInfo } from "@/components/dashboard/Transaction/ShopInfo.tsx";
import { Amount } from "@/components/dashboard/Transaction/Amount.tsx";
import { Payment, CategoryData, TransactionData } from "@/types/transaction.ts";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { getCategories } from "@/lib/api.ts";
import { toast } from "sonner";
import { format } from "date-fns";
import { postTransaction } from "@/lib/api.ts";
import { CategorySelection } from "@/types/transaction.ts";

interface TransactionDetailDialogProps {
  payment: Payment;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailDialog({
  payment,
  isOpen,
  onClose,
}: TransactionDetailDialogProps) {
  const [categories, setCategories] = useState<CategoryData>({});
  const { userInfo, isAuth } = useAuth();
  const [transactionData, setTransactionData] = useState<TransactionData>({
    user: userInfo.user_id,
    amount: 0,
    date: new Date(),
    category: null,
    payer: userInfo.user_id,
    shop_name: "",
    memo: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();

        if (response.status) {
          setCategories(response.data);
        }
      } catch (err) {
        toast.error("カテゴリーの取得に失敗しました", {
          className: "!bg-red-600 !text-white !border-red-800",
        });
      }
    };

    if (isAuth) {
      void fetchCategories();
    }
  }, []);

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

  const isSaveDisabled =
    transactionData.amount <= 0 || transactionData.category === null;

  const handleSave = async () => {
    try {
      const requestData = {
        ...transactionData,
        date: format(transactionData.date, "yyyy-MM-dd"),
        category: parseInt(transactionData.category?.value || ""),
      };

      const response = await postTransaction(requestData);

      if (response.status) {
        toast.success("取引明細を保存しました", {
          className: "!bg-yellow-600 !text-white !border-yellow-800",
        });
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
      setTransactionData((prev) => ({
        ...prev,
        amount: 0,
        date: new Date(),
        category: null,
        payer: userInfo.user_id,
        shop_name: "",
        memo: "",
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>明細の編集</DialogTitle>
        </DialogHeader>
        <div className="space-y-7">
          {/* 金額 */}
          <div className="flex justify-between items-end gap-2">
            <Amount
              amount={transactionData.amount}
              onAmountChange={handleAmountChange}
            />
          </div>

          <div className="flex items-center gap-4">
            {/* 登録日 */}
            <div className="w-1/2">
              <RegisteredDate
                date={transactionData.date}
                onDateChange={handleDateChange}
              />
            </div>
            {/* カテゴリー */}
            <div className="w-1/2">
              <CategoryList
                categories={categories}
                selected={transactionData.category}
                onSelectionChange={handleCategoryChange}
              />
            </div>
          </div>

          {/* 支払者 */}
          <div className="flex justify-between items-center">
            <PayerSelect
              userInfo={userInfo}
              payer={transactionData.payer}
              onPayerChange={handlePayerChange}
            />
          </div>
          <div className="bg-gray-100 p-2 text-center">支出の詳細</div>

          {/* お店の名前 */}
          <div>
            <ShopInfo
              shop_name={transactionData.shop_name}
              onShopNameChange={handleShopNameChange}
            />
          </div>

          {/* メモ */}
          <div>
            <Memo memo={transactionData.memo} onMemoChange={handleMemoChange} />
          </div>

          <Button
            className="w-full text-xl h-12"
            onClick={handleSave}
            disabled={isSaveDisabled}
          >
            保存する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
