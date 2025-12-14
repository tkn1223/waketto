import { useCallback, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { formatDate } from "@/types/displayFormat.ts";
import type {
  PaymentWithCategory,
  SavedTransactionData,
} from "@/types/transaction.ts";
import { TransactionDetailDialog } from "../Transaction/TransactionDetailDialog.tsx";

interface SpendingDetailRowProps {
  paymentRecords: PaymentWithCategory[];
  onTransactionUpdate: () => void;
}

export function SpendingDetailRow({
  paymentRecords,
  onTransactionUpdate,
}: SpendingDetailRowProps) {
  const [selectedPayment, setSelectedPayment] =
    useState<SavedTransactionData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = useCallback((payment: SavedTransactionData) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedPayment(null);
  }, []);

  return (
    <>
      <ScrollArea className="h-[180px] w-full">
        <div className="space-y-2 pr-3">
          {paymentRecords.length > 0 ? (
            paymentRecords.map((payment, index) => (
              <button
                key={`payment-${payment.id ?? index}`}
                type="button"
                onClick={() => {
                  handleOpenDialog(payment);
                }}
                className="grid grid-cols-12 items-center p-1.5 rounded shadow-sm border-1 border-gray-50 hover:bg-gray-100 hover:border-blue-400 hover:shadow-none cursor-pointer w-full text-left"
              >
                <span className="col-span-3 text-sm">
                  {formatDate(payment.date ?? Date.now().toString())}
                </span>
                <span className="col-span-6 text-sm">
                  {payment.shop_name ?? payment.category_name ?? "未設定"}
                </span>
                <span className="col-span-3 text-right">
                  {payment.amount?.toLocaleString()} 円
                </span>
              </button>
            ))
          ) : (
            <div className="text-sm text-gray-500">明細が未登録です</div>
          )}
        </div>
      </ScrollArea>

      {selectedPayment && (
        <TransactionDetailDialog
          payment={selectedPayment}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onUpdate={onTransactionUpdate}
        />
      )}
    </>
  );
}
