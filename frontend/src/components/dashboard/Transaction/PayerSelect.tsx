import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { PayerSelectProps } from "@/types/transaction.ts";

export function PayerSelect({
  userInfo,
  payer,
  onPayerChange,
}: PayerSelectProps) {
  const getSelectedPayer = () => {
    // ユーザー確認
    if (payer === userInfo.id || payer === userInfo.user_id) {
      return userInfo.user_id;
    }
    // パートナー確認
    return userInfo.couple_id || "";
  };

  return (
    <>
      <p>支払った人</p>

      <ToggleGroup
        className="flex overflow-hidden rounded-xl border shadow-sm"
        type="single"
        value={getSelectedPayer()}
        onValueChange={(value) => onPayerChange(value || userInfo.user_id)}
      >
        <ToggleGroupItem
          variant={undefined}
          className={[
            "px-6 py-2 text-sm outline-none transition",
            getSelectedPayer() === userInfo.user_id
              ? "!bg-sky-600 !text-white"
              : "bg-white text-slate-700 hover:bg-slate-50",
          ].join(" ")}
          value={userInfo.user_id}
        >
          {userInfo.name}
        </ToggleGroupItem>
        <ToggleGroupItem
          className={[
            "px-6 py-2 text-sm outline-none transition",
            getSelectedPayer() === userInfo.couple_id
              ? "!bg-sky-600 !text-white"
              : "bg-white text-slate-700 hover:bg-slate-50",
          ].join(" ")}
          value={userInfo.couple_id || ""}
        >
          パートナー
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}
