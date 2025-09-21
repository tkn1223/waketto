"use client";

import { useState } from "react";
import { Store, NotebookPen } from "lucide-react";

import { RegisteredDate } from "@/components/dashboard/Transaction/RegisteredDate";
import { CategoryList } from "@/components/dashboard/Transaction/CategoryList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { type TabKey } from "@/components/dashboard/Transaction/Category/categories";

interface TransactionData {
  date: Date;
  category: { type: TabKey; value: string } | null;
}

export function TransactionDetail() {
  // 状態管理と初期値設定
  const [transactionData, setTransactionData] = useState<TransactionData>({
    date: new Date(),
    category: null,
  });

  const handleDateChange = (date: Date) => {
    setTransactionData((prev) => ({ ...prev, date }));
  };

  const handleCategoryChange = (
    category: { type: TabKey; value: string } | null
  ) => {
    setTransactionData({ ...transactionData, category });
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <Card>
        <CardHeader>
          <CardTitle>取引明細</CardTitle>
        </CardHeader>
        <CardContent className="space-y-7">
          <div className="flex justify-end items-end gap-2">
            <p>¥</p>
            <p className="text-5xl font-bold">0</p>
          </div>

          <div className="flex items-center gap-4">
            {/* 登録日 */}
            <RegisteredDate
              date={transactionData.date}
              onDateChange={handleDateChange}
            />
            {/* カテゴリー */}
            <div className="w-1/2">
              <CategoryList
                selected={transactionData.category}
                onSelectionChange={handleCategoryChange}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>支払った人</div>
            <div className="flex gap-2">
              <Button>たかな</Button>
              <Button className="bg-white text-black border border-gray-300">
                パートナー
              </Button>
            </div>
          </div>
          <div className="bg-gray-100 p-2 text-center">支出の詳細</div>

          <div className="flex justify-between items-center gap-3">
            <Store className="size-6 text-gray-500" />
            <Input id="shop_name" type="text" placeholder="お店の名前を入力" />
          </div>
          <div className="flex justify-between items-center gap-3">
            <NotebookPen className="size-6 text-gray-500" />
            <Input id="memo" type="text" placeholder="メモを入力" />
          </div>
          <Button className="w-full text-xl h-12">保存する</Button>
        </CardContent>
      </Card>
    </div>
  );
}
