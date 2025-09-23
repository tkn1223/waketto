"use client";

import { useState } from "react";
import { ChevronDown, Folder } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import type {
  Category,
  CategoryData,
  CategoryListProps,
  CategorySelection,
} from "@/types/transaction.ts";

export function CategoryList({
  categories,
  selected,
  onSelectionChange,
}: CategoryListProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);

  const clearSelections = () => {
    onSelectionChange(null);
    setCategoryOpen(false);
  };

  // カテゴリーデータからタブアイテムを生成
  const tabItems = Object.entries(categories).map(([groupCode, groupData]) => ({
    key: groupCode,
    label: groupData.group_name,
  }));

  // デフォルトタブを設定（最初のタブ）
  const defaultTab = tabItems.length > 0 ? tabItems[0].key : "";

  return (
    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
      {/* カテゴリー選択ボタン */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex w-full items-center justify-between gap-2 truncate"
        >
          <Folder />
          {selected ? getSelectedCategoryName(categories, selected) : "未分類"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      {/* カテゴリー選択ポップオーバー */}
      <PopoverContent align="end" className="w-[300px] p-0">
        <Tabs defaultValue={defaultTab} className="w-full">
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
                    {categories[t.key]?.categories.map((category) => (
                      <li key={category.id}>
                        <label
                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-accent"
                          htmlFor={`${t.key}-${category.id}`}
                        >
                          <RadioGroupItem
                            id={`${t.key}-${category.id}`}
                            value={category.id.toString()}
                          />
                          <span className="flex-1 text-sm">
                            {category.name}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </RadioGroup>
              </ScrollArea>
            </TabsContent>
          ))}

          {/* タブ下部：ボタン */}
          <Separator />
          <div className="flex items-center justify-between px-3 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void clearSelections()}
            >
              クリア
            </Button>
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

// 選択されたカテゴリーの名前を取得するヘルパー関数
function getSelectedCategoryName(
  categories: CategoryData,
  selected: CategorySelection
): string {
  const group = categories[selected.type];

  if (!group) return "未分類";

  const category = group.categories.find(
    (cat: Category) => cat.id.toString() === selected.value
  );

  return category ? category.name : "未分類";
}
