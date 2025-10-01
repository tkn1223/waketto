"use client";

import { useTransactionForm } from "@/hooks/useTransactionForm.tsx";
import { TransactionForm } from "./TransactionForm.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

export function TransactionDetail() {
  const { userInfo } = useAuth();
  const {
    categories,
    transactionData,
    isSaveDisabled,
    handleAmountChange,
    handleDateChange,
    handleCategoryChange,
    handlePayerChange,
    handleShopNameChange,
    handleMemoChange,
    handleSave,
  } = useTransactionForm({
    transactionPatch: {},
    onSaveSuccess: () => {},
  });

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <Card>
        <CardHeader>
          <CardTitle>{userInfo.name} の取引明細</CardTitle>
        </CardHeader>
        <CardContent className="space-y-7">
          <TransactionForm
            userInfo={userInfo}
            categories={categories}
            transactionData={transactionData}
            isSaveDisabled={isSaveDisabled}
            onAmountChange={handleAmountChange}
            onDateChange={handleDateChange}
            onCategoryChange={handleCategoryChange}
            onPayerChange={handlePayerChange}
            onShopNameChange={handleShopNameChange}
            onMemoChange={handleMemoChange}
            onSave={handleSave}
            saveButtonText="保存する"
          />
        </CardContent>
      </Card>
    </div>
  );
}
