"use client";

import { useState } from "react";
import { BackToHomeButton } from "@/components/ui/backtohomebutton.tsx";
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
import { BudgetCategoryRow } from "@/components/setting/BudgetCategoryRow.tsx";

const monthly_fixed_cost = [
  { name: "住宅費", code: "housing_cost", period: 1, budget: 0 },
  { name: "水道光熱費", code: "utilities_cost", period: 1, budget: 0 },
  { name: "社会保険料", code: "social_insurance", period: 1, budget: 0 },
  { name: "生命保険料", code: "life_insurance", period: 1, budget: 0 },
  { name: "教育費", code: "education_cost", period: 1, budget: 0 },
  { name: "通信費", code: "communication_cost", period: 1, budget: 0 },
  { name: "サブスク費", code: "subscription_cost", period: 1, budget: 0 },
];
const monthly_variable_cost = [
  { name: "食費", code: "food_cost", period: 1, budget: 0 },
  { name: "日用品費", code: "daily_goods_cost", period: 1, budget: 0 },
  { name: "美容費", code: "beauty_cost", period: 1, budget: 0 },
  { name: "被服費", code: "clothing_cost", period: 1, budget: 0 },
  { name: "医療費", code: "medical_cost", period: 1, budget: 0 },
  { name: "交通費", code: "transportation_cost", period: 1, budget: 0 },
  { name: "ガソリン費", code: "gasoline_cost", period: 1, budget: 0 },
];
const occasional_fixed_cost = [
  { name: "税金", code: "tax_cost", period: 1, budget: 0 },
  { name: "火災保険料", code: "fire_insurance", period: 1, budget: 0 },
  { name: "自動車保険", code: "auto_insurance", period: 1, budget: 0 },
  { name: "年会費", code: "annual_fee", period: 1, budget: 0 },
  { name: "車検費", code: "vehicle_inspection_fee", period: 1, budget: 0 },
  { name: "教育費", code: "education_cost", period: 1, budget: 0 },
];
const occasional_variable_cost = [
  { name: "家電、家具", code: "appliances_furniture", period: 1, budget: 0 },
  { name: "車修理費", code: "car_repair_cost", period: 1, budget: 0 },
  { name: "冠婚葬祭", code: "ceremony_cost", period: 1, budget: 0 },
  { name: "卒業入学費用", code: "school_event_cost", period: 1, budget: 0 },
  { name: "治療費", code: "treatment_cost", period: 1, budget: 0 },
  { name: "引っ越し", code: "moving_cost", period: 1, budget: 0 },
];
const luxury_consumption_cost = [
  { name: "交際費", code: "entertainment_cost", period: 1, budget: 0 },
  { name: "旅行費", code: "travel_cost", period: 1, budget: 0 },
  { name: "娯楽費", code: "entertainment_cost", period: 1, budget: 0 },
];
const savings_investment_cost = [
  {
    name: "つみたて投資",
    code: "savings_investment_cost",
    period: 1,
    budget: 0,
  },
];

type BudgetCategory = {
  name: string;
  code: string;
  period: number; // 期間（1-12）
  periodType: "monthly" | "yearly"; // 期間の単位
  budget: number; // 予算額
};

export default function BudgetSettingPage() {
  // 1つのstateで全カテゴリーを管理
  const [allCategories, setAllCategories] = useState<BudgetCategory[]>(() => {
    // 初期値：全配列を結合
    return [
      ...monthly_fixed_cost.map((c) => ({
        ...c,
        periodType: "monthly" as const,
      })),
      ...monthly_variable_cost.map((c) => ({
        ...c,
        periodType: "monthly" as const,
      })),
      ...occasional_fixed_cost.map((c) => ({
        ...c,
        periodType: "monthly" as const,
      })),
      ...occasional_variable_cost.map((c) => ({
        ...c,
        periodType: "monthly" as const,
      })),
      ...luxury_consumption_cost.map((c) => ({
        ...c,
        periodType: "monthly" as const,
      })),
      ...savings_investment_cost.map((c) => ({
        ...c,
        periodType: "monthly" as const,
      })),
    ];
  });

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 px-10">
      <h2 className="text-2xl font-bold">予算設定表</h2>
      <table className="w-full table-auto mt-4">
        <thead>
          <tr className="bg-muted">
            <th className="w-1/13"></th>
            <th className="w-6/13 py-2 text-xl border-3">固定費</th>
            <th className="w-6/13 py-2 text-xl border-3">変動費</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-xl font-bold text-center bg-muted border-3">
              毎月
            </td>
            <td className="py-4 px-2 border-2">
              <BudgetCategoryRow categoryGroup={monthly_fixed_cost} />
            </td>
            <td className="py-4 px-2 border-2">
              <div className="grid gap-2">
                {monthly_variable_cost.map((category) => (
                  <span
                    key={category.code}
                    className="py-1 px-3 flex items-center justify-between bg-white border border-gray-100 shadow-sm hover:border-blue-400 hover:border-1 hover:shadow-md"
                  >
                    <span className="w-1/3">{category.name}</span>
                    <div className="flex items-center justify-end gap-4 w-2/3">
                      <div className="flex justify-end gap-1 w-1/2">
                        <Input
                          className="w-1/4 px-0.5 py-0.5 text-center hover:border-blue-400 hover:border-1"
                          type="number"
                          min={1}
                          max={12}
                          defaultValue={1}
                        />
                        <Select defaultValue="monthly">
                          <SelectTrigger className="hover:border-blue-400 hover:border-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="monthly">カ月</SelectItem>
                              <SelectItem value="yearly">年</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-end gap-2 w-1/2">
                        <Input
                          className="text-center hover:border-blue-400 hover:border-1"
                          type="number"
                          placeholder="0"
                        />
                        <span>円</span>
                      </div>
                    </div>
                  </span>
                ))}
              </div>
            </td>
          </tr>
          <tr>
            <td className="text-xl font-bold text-center bg-muted border-3">
              不定期
            </td>
            <td className="py-4 px-2 border-2">
              <BudgetCategoryRow categoryGroup={occasional_fixed_cost} />
            </td>
            <td className="py-4 px-2 border-2">
              <BudgetCategoryRow categoryGroup={occasional_variable_cost} />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="w-full table-auto mt-4">
        <thead>
          <tr className="">
            <th className="w-1/13"></th>
            <th className="w-6/13 py-2 text-xl bg-muted border-3">
              豊かな浪費
            </th>
            <th className="w-6/13 py-2 text-xl bg-muted border-3">
              貯蓄・投資
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-xl font-bold text-center"></td>
            <td className="py-2 px-2 border-2">
              <BudgetCategoryRow categoryGroup={luxury_consumption_cost} />
            </td>
            <td className="py-2 px-2 border-2">
              <BudgetCategoryRow categoryGroup={savings_investment_cost} />
            </td>
          </tr>
        </tbody>
      </table>
      <h2 className="text-2xl font-bold mt-8">サブスク管理表</h2>
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

      <BackToHomeButton />
    </div>
  );
}
