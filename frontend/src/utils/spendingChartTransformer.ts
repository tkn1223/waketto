import type {
  ExpenseReportData,
  CategoryWithPayments,
} from "@/types/transaction.ts";
import { ChartConfig } from "@/components/ui/chart.tsx";
import {
  CategoryTotal,
  ChartDataItem,
  CategoryTotalMapValue,
} from "@/types/summary.ts";

// 小カテゴリーごとの合計金額を計算
export function aggregateByCategory(
  expenseReportData: ExpenseReportData | undefined
): CategoryTotal[] {
  if (!expenseReportData) return [];

  // 小カテゴリーの合計金額を格納するMap（中間データ）
  const categoryTotalsMap = new Map<string, CategoryTotalMapValue>();

  Object.values(expenseReportData).forEach((categoryGroup) => {
    if (!categoryGroup) return;

    (
      Object.entries(categoryGroup.categories) as [
        string,
        CategoryWithPayments,
      ][]
    ).forEach(([categoryCode, category]) => {
      const totalAmount = category.payments.reduce((sum, payment) => {
        return sum + (payment.amount ?? 0);
      }, 0);

      // 値が0以上のカテゴリーのみを追加（0のカテゴリーは表示させない）
      if (totalAmount > 0) {
        categoryTotalsMap.set(categoryCode, {
          name: category.category_name,
          amount: totalAmount,
        });
      }
    });
  });

  // Mapを配列に変換し、金額の降順でソート
  return Array.from(categoryTotalsMap.entries())
    .map(([categoryCode, { name, amount }]) => ({
      categoryCode,
      categoryName: name,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);
}

// チャート用の色の配列（最大30色まで対応）
const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
] as const;

// 円グラフ表示用のデータを生成
export function generateChartDataAndConfig(categoryTotals: CategoryTotal[]): {
  chartData: ChartDataItem[];
  chartConfig: ChartConfig;
} {
  // 円グラフのセグメントサイズを指定（amountの値に比例）
  const chartData: ChartDataItem[] = categoryTotals.map((item) => {
    const categoryKey = sanitizeCategoryKey(item.categoryCode);
    return {
      category: categoryKey,
      amount: item.amount,
      fill: `var(--color-${categoryKey})`,
    };
  });

  // 円グラフのセグメントの色・ラベルを指定
  const chartConfig: ChartConfig = {
    amount: {
      label: "金額",
    },
    ...categoryTotals.reduce((config, item, index) => {
      const categoryKey = sanitizeCategoryKey(item.categoryCode);
      const colorIndex = index % CHART_COLORS.length;
      config[categoryKey] = {
        label: item.categoryName,
        color: CHART_COLORS[colorIndex],
      };
      return config;
    }, {} as ChartConfig),
  };

  return { chartData, chartConfig };
}

// カテゴリーコードをチャート用のキーに変換（特殊文字をアンダースコアに置換）
function sanitizeCategoryKey(categoryCode: string): string {
  return categoryCode.replace(/[^a-zA-Z0-9]/g, "_");
}
