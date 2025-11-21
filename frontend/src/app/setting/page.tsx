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
import { BudgetCategory } from "@/types/budget.ts";

const monthly_fixed_cost: BudgetCategory[] = [
  {
    name: "住宅費",
    code: "housing_cost",
    groupCode: "monthly_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: 100,
  },
  {
    name: "水道光熱費",
    code: "utilities_cost",
    groupCode: "monthly_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: null,
  },
  {
    name: "社会保険料",
    code: "social_insurance",
    groupCode: "monthly_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: null,
  },
  {
    name: "生命保険料",
    code: "life_insurance",
    groupCode: "monthly_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: null,
  },
  {
    name: "教育費",
    code: "education_cost",
    groupCode: "monthly_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: null,
  },
  {
    name: "通信費",
    code: "communication_cost",
    groupCode: "monthly_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: null,
  },
  {
    name: "サブスク費",
    code: "subscription_cost",
    groupCode: "monthly_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: null,
  },
];
const monthly_variable_cost: BudgetCategory[] = [
  {
    name: "食費",
    code: "food_cost",
    groupCode: "monthly_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 5000,
  },
  {
    name: "日用品費",
    code: "daily_goods_cost",
    groupCode: "monthly_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "美容費",
    code: "beauty_cost",
    groupCode: "monthly_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "被服費",
    code: "clothing_cost",
    groupCode: "monthly_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "医療費",
    code: "medical_cost",
    groupCode: "monthly_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "交通費",
    code: "transportation_cost",
    groupCode: "monthly_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "ガソリン費",
    code: "gasoline_cost",
    groupCode: "monthly_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
];
const occasional_fixed_cost: BudgetCategory[] = [
  {
    name: "税金",
    code: "tax_cost",
    groupCode: "occasional_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "火災保険料",
    code: "fire_insurance",
    groupCode: "occasional_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "自動車保険",
    code: "auto_insurance",
    groupCode: "occasional_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "年会費",
    code: "annual_fee",
    groupCode: "occasional_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "車検費",
    code: "vehicle_inspection_fee",
    groupCode: "occasional_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "教育費",
    code: "education_cost",
    groupCode: "occasional_fixed_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
];
const occasional_variable_cost: BudgetCategory[] = [
  {
    name: "家電、家具",
    code: "appliances_furniture",
    groupCode: "occasional_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "車修理費",
    code: "car_repair_cost",
    groupCode: "occasional_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "冠婚葬祭",
    code: "ceremony_cost",
    groupCode: "occasional_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "卒業入学費用",
    code: "school_event_cost",
    groupCode: "occasional_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "治療費",
    code: "treatment_cost",
    groupCode: "occasional_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "引っ越し",
    code: "moving_cost",
    groupCode: "occasional_variable_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
];
const luxury_consumption_cost: BudgetCategory[] = [
  {
    name: "交際費",
    code: "entertainment_cost",
    groupCode: "luxury_consumption_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "旅行費",
    code: "travel_cost",
    groupCode: "luxury_consumption_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
  {
    name: "娯楽費",
    code: "recreation_cost",
    groupCode: "luxury_consumption_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
];
const savings_investment_cost: BudgetCategory[] = [
  {
    name: "つみたて投資",
    code: "investment_savings",
    groupCode: "savings_investment_cost",
    period: 1,
    periodType: "monthly",
    budget: 0,
  },
];

const InitialValues = [
  monthly_fixed_cost,
  monthly_variable_cost,
  occasional_fixed_cost,
  occasional_variable_cost,
  luxury_consumption_cost,
  savings_investment_cost,
];

export default function BudgetSettingPage() {
  // 1つのstateで全カテゴリーを管理
  const [allCategories, setAllCategories] = useState<BudgetCategory[]>([
    ...InitialValues.flat(),
  ]);

  const handleCategoryUpdate = (
    code: string,
    field: keyof BudgetCategory,
    value: number | string | null
  ) => {
    setAllCategories((prev) =>
      prev.map((c) => (c.code === code ? { ...c, [field]: value } : c))
    );
  };

  const handleBudgetSave = async () => {
    console.log(allCategories);
  };

  const handleSubscriptionSave = async () => {
    console.log("サブスク管理表を保存する");
  };

  // api取得時にbudgetcategory型を付与する
  async function fetchBudgetCategories(): Promise<BudgetCategory[]> {
    const response = await fetch("/budget");
    const data = await response.json();
    return data as BudgetCategory[];
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 px-10">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold mr-8">予算設定表</h2>
        <Button
          onClick={() => void handleBudgetSave()}
          className="py-4 bg-emerald-600 hover:bg-emerald-800"
        >
          予算設定表を保存する
        </Button>
      </div>
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
              <BudgetCategoryRow
                categoryGroup={allCategories.filter(
                  (category) => category.groupCode === "monthly_fixed_cost"
                )}
                onUpdate={handleCategoryUpdate}
              />
            </td>
            <td className="py-4 px-2 border-2">
              <div className="grid gap-2">
                <BudgetCategoryRow
                  categoryGroup={allCategories.filter(
                    (category) => category.groupCode === "monthly_variable_cost"
                  )}
                  onUpdate={handleCategoryUpdate}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="text-xl font-bold text-center bg-muted border-3">
              不定期
            </td>
            <td className="py-4 px-2 border-2">
              <BudgetCategoryRow
                categoryGroup={allCategories.filter(
                  (category) => category.groupCode === "occasional_fixed_cost"
                )}
                onUpdate={handleCategoryUpdate}
              />
            </td>
            <td className="py-4 px-2 border-2">
              <BudgetCategoryRow
                categoryGroup={allCategories.filter(
                  (category) =>
                    category.groupCode === "occasional_variable_cost"
                )}
                onUpdate={handleCategoryUpdate}
              />
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
              <BudgetCategoryRow
                categoryGroup={allCategories.filter(
                  (category) => category.groupCode === "luxury_consumption_cost"
                )}
                onUpdate={handleCategoryUpdate}
              />
            </td>
            <td className="py-2 px-2 border-2">
              <BudgetCategoryRow
                categoryGroup={allCategories.filter(
                  (category) => category.groupCode === "savings_investment_cost"
                )}
                onUpdate={handleCategoryUpdate}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex items-center mt-10">
        <h2 className="text-2xl font-bold mr-8">サブスク管理表</h2>
        <Button
          onClick={() => void handleSubscriptionSave()}
          className="py-4 bg-emerald-600 hover:bg-emerald-800"
        >
          サブスク管理表を保存する
        </Button>
      </div>
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
