import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useTransactionForm } from "@/hooks/useTransactionForm.tsx";
import type { updateTransactionData } from "@/types/transaction.ts";
import { TransactionForm } from "./TransactionForm.tsx";

interface TransactionDetailDialogProps {
  payment: updateTransactionData;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailDialog({
  payment,
  isOpen,
  onClose,
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
    handleSave,
  } = useTransactionForm({
    transactionPatch: { ...payment },
    onSaveSuccess: onClose,
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
            onAmountChange={handleAmountChange}
            onDateChange={handleDateChange}
            onCategoryChange={handleCategoryChange}
            onPayerChange={handlePayerChange}
            onShopNameChange={handleShopNameChange}
            onMemoChange={handleMemoChange}
            onSave={handleSave}
            saveButtonText="更新する"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
