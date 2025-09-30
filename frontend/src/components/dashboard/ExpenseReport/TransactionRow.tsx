import { formatDate } from "@/types/displayFormat.ts";

export function TransactionRow({ category }: { category: any }) {
  return (
    <div className="space-y-1.5">
      {category.payments.map((payment: any, paymentIndex: number) => (
        <div
          key={`payment-${paymentIndex}`}
          className="grid grid-cols-12 items-center p-1.5 rounded shadow-sm border-1 border-gray-50 hover:bg-gray-200 hover:border-gray-200 cursor-pointer"
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
      ))}
    </div>
  );
}
