"use client";

import { useRouter } from "next/navigation";
import { CategoryList } from "@/components/dashboard/Transaction/CategoryList.tsx";
import { Memo } from "@/components/dashboard/Transaction/Memo.tsx";
import { PayerSelect } from "@/components/dashboard/Transaction/PayerSelect.tsx";
import { RegisteredDate } from "@/components/dashboard/Transaction/RegisteredDate.tsx";
import { ShopInfo } from "@/components/dashboard/Transaction/ShopInfo.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { TransactionFormProps } from "@/types/transaction.ts";
import { Amount } from "./Amount.tsx";

export function TransactionForm({
  userInfo,
  transactionData,
  isSaveDisabled,
  saveButtonText,
  deleteButtonText,
  isSubscription = false,
  onAmountChange,
  onDateChange,
  onCategoryChange,
  onPayerChange,
  onShopNameChange,
  onMemoChange,
  onSave,
  onUpdate,
  onDelete,
}: TransactionFormProps) {
  const router = useRouter();

  return (
    <>
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

      {isSubscription ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-center mb-2 text-gray-500">
            サブスクリプションの変更は予算設定から行えます
          </p>
          <Button
            className="w-full py-6 rounded-md"
            onClick={() => router.push("/setting#subscription")}
          >
            予算設定へ
          </Button>
        </div>
      ) : (
        <>
          {deleteButtonText ? (
            <div className="flex gap-4">
              <Button
                className="flex-[2] text-xl py-6"
                onClick={onUpdate}
                disabled={isSaveDisabled}
              >
                {saveButtonText}
              </Button>
              <Button
                className="flex-[1] text-md py-6 rounded-full"
                variant="destructive"
                onClick={onDelete}
              >
                {deleteButtonText}
              </Button>
            </div>
          ) : (
            <Button
              className="w-full text-xl py-6"
              onClick={onSave}
              disabled={isSaveDisabled}
            >
              {saveButtonText}
            </Button>
          )}
        </>
      )}
    </>
  );
}
