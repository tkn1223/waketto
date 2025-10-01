import { useState } from "react";
import { formatDate } from "@/types/displayFormat.ts";
import { updateTransactionData } from "@/types/transaction.ts";
import { TransactionDetailDialog } from "./TransactionDetailDialog.tsx";

export function TransactionRow({ category }: { category: any }) {
  const [selectedPayment, setSelectedPayment] =
    useState<updateTransactionData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpneDialog = (payment: updateTransactionData) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-1.5">
      {category.payments.map(
        (payment: updateTransactionData, paymentIndex: number) => (
          <div
            key={`payment-${paymentIndex}`}
            onClick={() => {
              handleOpneDialog(payment);
            }}
            className="grid grid-cols-12 items-center p-1.5 rounded shadow-sm border-1 border-gray-50 hover:bg-gray-200 hover:border-gray-200 hover:shadow-none cursor-pointer"
          >
            <span className="col-span-3 text-sm">
              {formatDate(payment.payment_date)}
            </span>
            <span className="col-span-6 text-sm">
              {payment.store_name ?? category.category_name}
            </span>
            <span className="col-span-3 font-medium text-right">
              {payment.amount.toLocaleString()} 円
            </span>
          </div>
        )
      )}

      {selectedPayment && (
        <TransactionDetailDialog
          payment={selectedPayment}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
}
