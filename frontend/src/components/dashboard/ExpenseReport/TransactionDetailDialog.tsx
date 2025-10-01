import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { updateTransactionData } from "@/types/transaction.ts";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useTransactionForm } from "@/hooks/useTransactionForm.tsx";
import { TransactionForm } from "../Transaction/TransactionForm";

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
            saveButtonText="更新する"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
