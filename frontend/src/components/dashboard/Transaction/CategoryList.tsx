"use client";

import { Folder, ChevronDown } from "lucide-react";
import { useState } from "react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  tabItems,
  optionsByKey,
  type TabKey,
} from "@/components/dashboard/Transaction/Category/categories";

interface CategoryListProps {
  selected: {
    type: TabKey;
    value: string;
  } | null;
  onSelectionChange: (
    selected: {
      type: TabKey;
      value: string;
    } | null
  ) => void;
}

export function CategoryList({
  selected,
  onSelectionChange,
}: CategoryListProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);

  const clearSelections = () => {
    onSelectionChange(null);
    setCategoryOpen(false);
  };

  return (
    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
      {/* カテゴリー選択ボタン */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex w-full items-center justify-between gap-2 truncate"
        >
          <Folder />
          {selected ? `${selected.value}` : "未分類"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      {/* カテゴリー選択ポップオーバー */}
      <PopoverContent align="end" className="w-[300px] p-0">
        <Tabs defaultValue="monthly_fixed_cost" className="w-full">
          {/* タブ上部：タブリスト */}
          <div className="sticky top-0 z-10 bg-gray-200 rounded-t-md">
            <TabsList className="grid w-full grid-cols-3 grid-rows-2 gap-1 p-1 bg-transparent h-auto">
              {tabItems.map((t) => (
                <TabsTrigger key={t.key} value={t.key} className="text-xs">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* 各タブの内容 */}
          {tabItems.map((t) => (
            <TabsContent key={t.key} value={t.key} className="m-0">
              <ScrollArea className="h-64 px-2 py-2">
                <RadioGroup
                  value={selected?.type === t.key ? selected.value : undefined}
                  onValueChange={(val) => {
                    onSelectionChange({ type: t.key, value: val });
                    setCategoryOpen(false);
                  }}
                >
                  <ul className="space-y-1">
                    {optionsByKey[t.key].map((opt) => (
                      <li key={opt}>
                        <label
                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-accent"
                          htmlFor={`${t.key}-${opt}`}
                        >
                          <RadioGroupItem id={`${t.key}-${opt}`} value={opt} />
                          <span className="flex-1 text-sm">{opt}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </RadioGroup>
              </ScrollArea>
            </TabsContent>
          ))}

          {/* タブ下部：ボタン （必要なら追って追加） */}
          <Separator />
          <div className="flex items-center justify-between px-3 py-2">
            <Button variant="ghost" size="sm" onClick={() => clearSelections()}>
              クリア
            </Button>
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
