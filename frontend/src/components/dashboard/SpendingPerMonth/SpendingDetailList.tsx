import { useCallback, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { formatDate } from "@/types/displayFormat.ts";
import type { SavedTransactionData } from "@/types/transaction.ts";
import { TransactionDetailDialog } from "../Transaction/TransactionDetailDialog.tsx";
import { groupPaymentsByUser } from "@/utils/spendingDetailTransformer.ts";
import type { ExpenseReportData } from "@/types/transaction.ts";

interface SpendingDetailListProps {
  householdReport: ExpenseReportData;
  onTransactionUpdate: () => void;
  filterByUserId?: string; // 特定のユーザーIDでフィルタリング（オプション）
}

export function SpendingDetailList({
  householdReport,
  onTransactionUpdate,
  filterByUserId,
}: SpendingDetailListProps) {
  const [selectedPayment, setSelectedPayment] =
    useState<SavedTransactionData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 支払った人ごとにグループ化し、指定されたユーザーIDの配列を取得
  const allPayments = useMemo(() => {
    const paymentsByUser = groupPaymentsByUser(householdReport);

    // 特定のユーザーIDが指定されている場合、そのユーザーの配列を返す
    if (filterByUserId) {
      return paymentsByUser[filterByUserId] || [];
    }

    // 指定されていない場合、すべてのユーザーの配列を結合（個人モード用）
    return Object.values(paymentsByUser).flat();
  }, [householdReport, filterByUserId]);

  const handleOpenDialog = useCallback((payment: SavedTransactionData) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedPayment(null);
  }, []);

  const handleUpdate = useCallback(() => {
    onTransactionUpdate();
  }, [onTransactionUpdate]);

  return (
    <>
      <ScrollArea className="h-[180px] w-full">
        <div className="space-y-2 pr-3">
          {allPayments.length > 0 ? (
            allPayments.map((payment, index) => (
              <button
                key={`payment-${payment.id ?? index}`}
                type="button"
                onClick={() => {
                  handleOpenDialog(payment);
                }}
                className="grid grid-cols-12 items-center p-1.5 rounded shadow-sm border-1 border-gray-50 hover:bg-gray-200 hover:border-gray-200 hover:shadow-none cursor-pointer w-full text-left"
              >
                <span className="col-span-3 text-sm">
                  {formatDate(payment.date ?? Date.now().toString())}
                </span>
                <span className="col-span-6 text-sm">
                  {payment.shop_name ?? "未設定"}
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
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
