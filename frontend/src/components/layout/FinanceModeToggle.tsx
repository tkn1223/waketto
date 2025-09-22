"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";

interface FinanceModeToggleProps {
  finance: string;
  setFinance: (finance: string) => void;
}

export function FinanceModeToggle({
  finance,
  setFinance,
}: FinanceModeToggleProps) {
  return (
    <Tabs defaultValue={finance}>
      <TabsList className="w-45">
        <TabsTrigger
          className="w-1/2 cursor-pointer"
          value="expense"
          onClick={() => setFinance("expense")}
        >
          支出管理
        </TabsTrigger>
        <TabsTrigger
          className="w-1/2 cursor-pointer"
          value="budget"
          onClick={() => setFinance("budget")}
        >
          家計簿
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
