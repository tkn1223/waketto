import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import type { PayerSelectProps } from "@/types/transaction.ts";

export function PayerSelect({
  userInfo,
  payer,
  onPayerChange,
}: PayerSelectProps) {
  // 選択された支払者を取得
  const getSelectedPayer = () => {
    if (payer === userInfo.id) {
      return userInfo.id;
    }

    // partnerのidは取得していないので、couple_idで代用
    return userInfo.couple_id || "";
  };

  return (
    <>
      <p>支払った人</p>

      <ToggleGroup
        className="flex overflow-hidden rounded-xl border shadow-sm"
        type="single"
        value={getSelectedPayer()}
        onValueChange={(value) => onPayerChange(value || userInfo.id)}
      >
        <ToggleGroupItem
          variant={undefined}
          className={[
            "px-6 py-2 text-sm outline-none transition",
            getSelectedPayer() === userInfo.id
              ? "!bg-sky-600 !text-white"
              : "bg-white text-slate-700 hover:bg-slate-50",
          ].join(" ")}
          value={userInfo.id}
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
