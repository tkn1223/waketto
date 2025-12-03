import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useTransactionForm } from "@/hooks/useTransactionForm.tsx";
import type { SavedTransactionData } from "@/types/transaction.ts";
import { TransactionForm } from "./TransactionForm.tsx";

interface TransactionDetailDialogProps {
  payment: SavedTransactionData;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const TransactionDetailDialog = memo(function TransactionDetailDialog({
  payment,
  isOpen,
  onClose,
  onUpdate,
}: TransactionDetailDialogProps) {
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
    handleUpdate,
    handleDelete,
  } = useTransactionForm({
    transactionPatch: payment,
    onSuccess: () => {
      onClose();
      onUpdate();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>明細の編集</DialogTitle>
        </DialogHeader>
        <div className="space-y-7">
          <TransactionForm
            userInfo={userInfo}
            transactionData={transactionData}
            isSaveDisabled={isSaveDisabled}
            isSubscription={payment.is_subscription}
            onAmountChange={handleAmountChange}
            onDateChange={handleDateChange}
            onCategoryChange={handleCategoryChange}
            onPayerChange={handlePayerChange}
            onShopNameChange={handleShopNameChange}
            onMemoChange={handleMemoChange}
            onUpdate={() => void handleUpdate()}
            onDelete={() => void handleDelete()}
            saveButtonText="更新する"
            deleteButtonText="削除する"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
});
