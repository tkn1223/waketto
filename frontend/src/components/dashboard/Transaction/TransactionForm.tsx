"use client";

import { CategoryList } from "@/components/dashboard/Transaction/CategoryList.tsx";
import { Memo } from "@/components/dashboard/Transaction/Memo.tsx";
import { PayerSelect } from "@/components/dashboard/Transaction/PayerSelect.tsx";
import { RegisteredDate } from "@/components/dashboard/Transaction/RegisteredDate.tsx";
import { ShopInfo } from "@/components/dashboard/Transaction/ShopInfo.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CardContent } from "@/components/ui/card.tsx";
import type {
  CategorySelection,
  TransactionData,
} from "@/types/transaction.ts";
import { Amount } from "./Amount.tsx";

interface TransactionFormProps {
  // data
  userInfo: { user_id: string; name: string };
  transactionData: TransactionData;
  isSaveDisabled: boolean;
  saveButtonText: string; // ボタンのテキスト
  // handler
  onAmountChange: (amount: number) => void;
  onDateChange: (date: Date) => void;
  onCategoryChange: (category: CategorySelection | null) => void;
  onPayerChange: (payer: string) => void;
  onShopNameChange: (shop_name: string) => void;
  onMemoChange: (memo: string) => void;
  onSave: () => void;
}

export function TransactionForm({
  userInfo,
  transactionData,
  isSaveDisabled,
  onAmountChange,
  onDateChange,
  onCategoryChange,
  onPayerChange,
  onShopNameChange,
  onMemoChange,
  onSave,
  saveButtonText,
}: TransactionFormProps) {
  return (
    <>
      <CardContent className="space-y-7">
        {/* 金額 */}
        <div className="flex justify-between items-end gap-2">
          <Amount
            amount={transactionData.amount}
            onAmountChange={onAmountChange}
          />
        </div>

        <div className="flex items-center gap-4">
          {/* 登録日 */}
          <div className="w-1/2">
            <RegisteredDate
              date={transactionData.date}
              onDateChange={onDateChange}
            />
          </div>
          {/* カテゴリー */}
          <div className="w-1/2">
            <CategoryList
              selected={transactionData.category}
              onSelectionChange={onCategoryChange}
            />
          </div>
        </div>

        {/* 支払者 */}
        <div className="flex justify-between items-center">
          <PayerSelect
            userInfo={userInfo}
            payer={transactionData.payer}
            onPayerChange={onPayerChange}
          />
        </div>
        <div className="bg-gray-100 p-2 text-center">支出の詳細</div>

        {/* お店の名前 */}
        <div>
          <ShopInfo
            shop_name={transactionData.shop_name}
            onShopNameChange={onShopNameChange}
          />
        </div>

        {/* メモ */}
        <div>
          <Memo memo={transactionData.memo} onMemoChange={onMemoChange} />
        </div>

        <Button
          className="w-full text-xl h-12"
          onClick={onSave}
          disabled={isSaveDisabled}
        >
          {saveButtonText}
        </Button>
      </CardContent>
    </>
  );
}
