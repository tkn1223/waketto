import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";

interface PayerSelectProps {
  userInfo: { user_id: string; name: string };
  payer: string;
  onPayerChange: (payer: string) => void;
}

export function PayerSelect({
  userInfo,
  payer,
  onPayerChange,
}: PayerSelectProps) {
  const partner = "partner";

  return (
    <>
      <p>支払った人</p>

      <ToggleGroup
        className="flex overflow-hidden rounded-xl border shadow-sm"
        type="single"
        value={payer}
        onValueChange={(value) => onPayerChange(value || userInfo.user_id)}
      >
        <ToggleGroupItem
          variant={undefined}
          className={[
            "px-6 py-2 text-sm outline-none transition",
            payer === userInfo.user_id
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
            payer === partner
              ? "!bg-sky-600 !text-white"
              : "bg-white text-slate-700 hover:bg-slate-50",
          ].join(" ")}
          value={partner}
        >
          パートナー
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}
