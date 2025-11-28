import { useMemo } from "react";
import { SpendingDetailRow } from "@/components/dashboard/SpendingPerMonth/SpendingDetailRow.tsx";
import { groupPaymentsByUser } from "@/utils/spendingDetailTransformer.ts";
import { SpendingDetailListProps } from "@/types/summary.ts";

export function SpendingDetailList({
  householdReport,
  user,
  userInfo,
  onTransactionUpdate,
}: SpendingDetailListProps) {
  // 支払った人ごとにデータをグループ化
  const paymentRecordsByUser = useMemo(
    () => groupPaymentsByUser(householdReport),
    [householdReport]
  );

  const userId = userInfo.id;
  const partnerId = userInfo.partner_user_id || userInfo.couple_id;

  // 各ユーザーの支払いデータを取得
  const myPayments = paymentRecordsByUser[userId] || [];
  const partnerPayments = partnerId
    ? paymentRecordsByUser[partnerId] || []
    : [];

  return (
    <>
      {user === "common" ? (
        // 共通モード
        <div className="grid grid-cols-2 gap-4">
          {/* 自身のデータ */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
              {userInfo.name}
            </h4>
            <SpendingDetailRow
              paymentRecords={myPayments}
              onTransactionUpdate={onTransactionUpdate}
            />
          </div>

          {/* パートナーのデータ */}
          {partnerId && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                {userInfo.partner_user_id || "パートナー"}
              </h4>
              <SpendingDetailRow
                paymentRecords={partnerPayments}
                onTransactionUpdate={onTransactionUpdate}
              />
            </div>
          )}
        </div>
      ) : (
        // 個人モード
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
            {userInfo.name}
          </h4>
          <SpendingDetailRow
            paymentRecords={myPayments}
            onTransactionUpdate={onTransactionUpdate}
          />
        </div>
      )}
    </>
  );
}
