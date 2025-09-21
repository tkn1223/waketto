"use client";

import { useState } from "react";
import { Store, NotebookPen } from "lucide-react";
import { type User } from "@/lib/auth";

import { RegisteredDate } from "@/components/dashboard/Transaction/RegisteredDate";
import { CategoryList } from "@/components/dashboard/Transaction/CategoryList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { type TabKey } from "@/components/dashboard/Transaction/Category/categories";
import { PayerSelect } from "@/components/dashboard/Transaction/PayerSelect";
import { ShopInfo } from "@/components/dashboard/Transaction/ShopInfo";
import { Memo } from "@/components/dashboard/Transaction/Memo";
import { Amount } from "./Amount";

interface TransactionData {
  user: User;
  amount: number;
  date: Date;
  category: { type: TabKey; value: string } | null;
  payer: string;
  shop_name: string;
  memo: string;
}

export function TransactionDetail({ user }: { user: User }) {
  // 状態管理と初期値設定
  const [transactionData, setTransactionData] = useState<TransactionData>({
    user: user,
    amount: 0,
    date: new Date(),
    category: null,
    payer: user.user_id,
    shop_name: "",
    memo: "",
  });

  const handleAmountChange = (amount: number) => {
    setTransactionData((prev) => ({ ...prev, amount }));
  };

  const handleDateChange = (date: Date) => {
    setTransactionData((prev) => ({ ...prev, date }));
  };

  const handleCategoryChange = (
    category: { type: TabKey; value: string } | null
  ) => {
    setTransactionData((prev) => ({ ...prev, category }));
  };

  const handlePayerChange = (payer: string) => {
    setTransactionData((prev) => ({ ...prev, payer }));
  };

  const handleShopNameChange = (shop_name: string) => {
    setTransactionData((prev) => ({ ...prev, shop_name }));
  };

  const handleMemoChange = (memo: string) => {
    setTransactionData((prev) => ({ ...prev, memo }));
  };

  const handleSave = () => {
    console.log(transactionData);
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <Card>
        <CardHeader>
          <CardTitle>{user.name} の取引明細</CardTitle>
        </CardHeader>
        <CardContent className="space-y-7">
          {/* 金額 */}
          <div className="flex justify-between items-end gap-2">
            <Amount
              amount={transactionData.amount}
              onAmountChange={handleAmountChange}
            />
          </div>

          <div className="flex items-center gap-4">
            {/* 登録日 */}
            <div className="w-1/2">
              <RegisteredDate
                date={transactionData.date}
                onDateChange={handleDateChange}
              />
            </div>
            {/* カテゴリー */}
            <div className="w-1/2">
              <CategoryList
                selected={transactionData.category}
                onSelectionChange={handleCategoryChange}
              />
            </div>
          </div>

          {/* 支払者 */}
          <div className="flex justify-between items-center">
            <PayerSelect
              user={user}
              payer={transactionData.payer}
              onPayerChange={handlePayerChange}
            />
          </div>
          <div className="bg-gray-100 p-2 text-center">支出の詳細</div>

          {/* お店の名前 */}
          <div className="flex justify-between items-center gap-3">
            <ShopInfo
              shop_name={transactionData.shop_name}
              onShopNameChange={handleShopNameChange}
            />
          </div>

          {/* メモ */}
          <div className="flex justify-between items-center gap-3">
            <Memo memo={transactionData.memo} onMemoChange={handleMemoChange} />
          </div>

          <Button className="w-full text-xl h-12" onClick={handleSave}>
            保存する
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
