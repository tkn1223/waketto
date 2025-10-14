import { ScrollArea } from "@/components/ui/scroll-area.tsx";

export function SpendingDetailTable() {
  return (
    <>
      <div className="space-y-2">
        <ScrollArea className="h-[180px] w-full">
          <h4 className="text-sm font-medium text-gray-700 pb-1">支出管理表</h4>
          <div className="space-y-2 pr-3">
            <div className="text-sm text-gray-500">明細が未登録です</div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
