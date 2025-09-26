import { formatDate } from "@/types/displayFormat.ts";

export function TransactionRow({
  key,
  category,
}: {
  key: string;
  category: any;
}) {
  return (
    <div key={key} className="space-y-2">
      {category.payments.map((payment: any, paymentIndex: number) => (
        <div
          key={`${key}-payment-${paymentIndex}`}
          className="grid grid-cols-12 items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
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
