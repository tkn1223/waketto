"use client";

import { useEffect, useState } from "react";
import { CategoryList } from "@/components/dashboard/Transaction/CategoryList.tsx";
import { Memo } from "@/components/dashboard/Transaction/Memo.tsx";
import { PayerSelect } from "@/components/dashboard/Transaction/PayerSelect.tsx";
import { RegisteredDate } from "@/components/dashboard/Transaction/RegisteredDate.tsx";
import { ShopInfo } from "@/components/dashboard/Transaction/ShopInfo.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { getCategories } from "@/lib/api.ts";
import { type User } from "@/lib/auth.ts";
import type { CategoryData, CategorySelection } from "@/types/category.ts";
import { Amount } from "./Amount.tsx";

interface TransactionData {
  user: User;
  amount: number;
  date: Date;
  category: CategorySelection | null;
  payer: string;
  shop_name: string;
  memo: string;
}

export function TransactionDetail({ user }: { user: User }) {
  const [_isLoading, setIsLoading] = useState(false);
  const [_error, _setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryData>({});
  const [transactionData, setTransactionData] = useState<TransactionData>({
    user: user,
    amount: 0,
    date: new Date(),
    category: null,
    payer: user.user_id,
    shop_name: "",
    memo: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await getCategories();

        if (response.status) {
          setCategories(response.data);
          console.log(response);
        }
      } catch (error) {
        console.error("カテゴリーの取得に失敗しました", error);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchCategories();
  }, []);

  const handleAmountChange = (amount: number) => {
    setTransactionData((prev) => ({ ...prev, amount }));
  };

  const handleDateChange = (date: Date) => {
    setTransactionData((prev) => ({ ...prev, date }));
  };

  const handleCategoryChange = (category: CategorySelection | null) => {
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
                categories={categories}
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
