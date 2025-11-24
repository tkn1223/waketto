import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { CirclePlus } from "lucide-react";
import { RegisteredDate } from "@/components/dashboard/Transaction/RegisteredDate.tsx";
import type { Subscription, SubscriptionSettingProps } from "@/types/budget.ts";

export function SubscriptionSetting({
  allSubscriptions,
  handleSubscriptionUpdate,
}: SubscriptionSettingProps) {
  const handleAddRow = () => {
    const newSubscription: Subscription = {
      id: `temp-${Date.now()}`,
      name: "",
      updatePeriod: "monthly",
      amount: null,
      startDate: new Date(),
      finishDate: new Date(),
    };
    handleSubscriptionUpdate([...allSubscriptions, newSubscription]);
  };

  const handleDeleteRow = (id: string) => {
    handleSubscriptionUpdate(allSubscriptions.filter((s) => s.id !== id));
  };

  const handleFieldUpdate = (
    id: string | undefined,
    field: keyof Subscription,
    value: string | number | Date | null
  ) => {
    if (!id) return;
    handleSubscriptionUpdate(
      allSubscriptions.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <table className="w-full table-auto mt-4">
      <thead>
        <tr className="bg-muted">
          <th className="py-2 text-lg border-3 w-4/12">名称</th>
          <th className="py-2 text-lg border-3 w-1/12">更新間隔</th>
          <th className="py-2 text-lg border-3 w-2/12">金額</th>
          <th className="py-2 text-lg border-3 w-3/12">契約期間</th>
          <th className="py-2 text-lg border-3 w-1/12"></th>
        </tr>
      </thead>
      <tbody>
        {allSubscriptions.map((subscription) => (
          <tr key={subscription.id}>
            <td className="text-center px-1 border-2">
              <Input
                className="text-center border-0 shadow-none hover:border-blue-400 hover:border-1"
                type="text"
                placeholder="サービス名を入力"
                value={subscription.name || ""}
                onChange={(e) => {
                  handleFieldUpdate(subscription.id!, "name", e.target.value);
                }}
              />
            </td>
            <td className="text-center px-1 border-2">
              <Select
                value={subscription.updatePeriod}
                onValueChange={(value) => {
                  handleFieldUpdate(subscription.id!, "updatePeriod", value);
                }}
              >
                <SelectTrigger className="w-full hover:border-blue-400 hover:border-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="monthly">カ月</SelectItem>
                    <SelectItem value="yearly">年</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </td>
            <td className="text-center px-1 border-2">
              <Input
                className="text-center border-0 shadow-none hover:border-blue-400 hover:border-1"
                type="text"
                placeholder="金額を入力"
                value={
                  subscription.amount === null
                    ? ""
                    : String(subscription.amount)
                }
                onChange={(e) => {
                  const value = e.target.value;
                  // 空文字列の場合はnull、それ以外は数値に変換
                  const numValue = value === "" ? null : Number(value);
                  handleFieldUpdate(
                    subscription.id!,
                    "amount",
                    numValue !== null && isNaN(numValue) ? null : numValue
                  );
                }}
              />
            </td>
            <td className="text-center px-1 border-2">
              <div className="flex items-center gap-2 w-full min-w-0">
                <div className="flex-1 min-w-0">
                  <RegisteredDate
                    className="hover:border-blue-400 hover:border-1"
                    date={subscription.startDate ?? new Date()}
                    onDateChange={(date) => {
                      handleFieldUpdate(subscription.id!, "startDate", date);
                    }}
                  />
                </div>
                <span className="flex-shrink-0">~</span>
                <div className="flex-1 min-w-0">
                  <RegisteredDate
                    className="hover:border-blue-400 hover:border-1"
                    date={subscription.finishDate ?? new Date()}
                    onDateChange={(date) => {
                      handleFieldUpdate(subscription.id!, "finishDate", date);
                    }}
                  />
                </div>
              </div>
            </td>
            <td className="text-center py-2 px-2 border-2">
              <Button
                className="text-xs h-7 px-3 py-1 bg-red-600 hover:bg-red-800"
                onClick={() => {
                  if (subscription.id) {
                    handleDeleteRow(subscription.id);
                  }
                }}
              >
                削除
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={5} className="text-center py-2">
            <Button
              className="small bg-white border-black border-1 text-black hover:bg-black hover:text-white"
              onClick={handleAddRow}
            >
              <CirclePlus className="size-4" />
              追加
            </Button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
