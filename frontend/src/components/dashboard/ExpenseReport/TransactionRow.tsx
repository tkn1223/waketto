import { useCallback, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { formatDate } from "@/types/displayFormat.ts";
import type {
  SavedTransactionData,
  TransactionRowProps,
} from "@/types/transaction.ts";
import { TransactionDetailDialog } from "../Transaction/TransactionDetailDialog.tsx";

export function TransactionRow({
  category,
  onTransactionUpdate,
}: TransactionRowProps) {
  const [selectedPayment, setSelectedPayment] =
    useState<SavedTransactionData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 合計金額を計算
  const totalAmount = category.payments.reduce(
    (sum, payment) => sum + (payment.amount ?? 0),
    0
  );

  const handleOpneDialog = useCallback((payment: SavedTransactionData) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  }, []); // 依存関係なし

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedPayment(null);
  }, []); // 依存関係なし

  const handleUpdate = useCallback(() => {
    onTransactionUpdate();
  }, [onTransactionUpdate]); // 依存関係を明示

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={category.category_name} className="space-y-1.5">
        <AccordionTrigger className="grid grid-cols-12 items-center p-1.5 rounded shadow-sm border-1 border-gray-50 hover:bg-gray-200 hover:border-gray-200 hover:shadow-none hover:no-underline cursor-pointer">
          <span className="col-span-4">{category.category_name}</span>
          <span className="col-span-7 text-right">
            {totalAmount.toLocaleString()} 円
          </span>
        </AccordionTrigger>

        {/* アコーディオンの中身 */}
        <AccordionContent className="space-y-1.5 w-11/12 ml-auto">
          {category.payments.map((payment, paymentIndex: number) => (
            <button
              key={`payment-${paymentIndex}`}
              type="button"
              onClick={() => {
                handleOpneDialog(payment);
              }}
              className="grid grid-cols-12 items-center p-1.5 rounded shadow-sm border-1 border-gray-50 hover:bg-gray-200 hover:border-gray-200 hover:shadow-none cursor-pointer w-full text-left"
            >
              <span className="col-span-3 text-sm">
                {formatDate(payment.date ?? Date.now().toString())}
              </span>
              <span className="col-span-6 text-sm">
                {payment.shop_name ?? category.category_name}
              </span>
              <span className="col-span-3 text-right">
                {payment.amount?.toLocaleString()} 円
              </span>
            </button>
          ))}
        </AccordionContent>

        {selectedPayment && (
          <TransactionDetailDialog
            payment={selectedPayment}
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            onUpdate={handleUpdate}
          />
        )}
      </AccordionItem>
    </Accordion>
  );
}
