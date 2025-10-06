"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useTransactionForm } from "@/hooks/useTransactionForm.tsx";
import { TransactionForm } from "./TransactionForm.tsx";

export function TransactionDetail() {
  const { userInfo } = useAuth();
  const {
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
    transactionPatch: null,
    onSuccess: () => {},
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
            deleteButtonText=""
          />
        </CardContent>
      </Card>
    </div>
  );
}
