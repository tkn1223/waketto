import { Button } from "@/components/ui/button.tsx";

export function SubscriptionSetting({
  allSubscriptions,
  handleSubscriptionUpdate,
}: any) {
  return (
    <table className="w-full table-auto mt-4">
      <thead>
        <tr className="bg-muted border-3">
          <th className="py-2 text-xl border-3">名称</th>
          <th className="py-2 text-xl border-3">更新期間</th>
          <th className="py-2 text-xl border-3">金額</th>
          <th className="py-2 text-xl border-3">契約期間</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-2">
          <td className="text-center">chatGPT</td>
          <td className="text-center">月</td>
          <td className="text-center">1,000</td>
          <td className="text-center">1年</td>
          <td className="text-center">
            <Button>削除</Button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
