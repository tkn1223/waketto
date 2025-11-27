import type {
  ExpenseReportData,
  CategoryWithPayments,
} from "@/types/transaction.ts";
import { ChartConfig } from "@/components/ui/chart.tsx";

// 小カテゴリーごとの集計結果
export interface CategoryTotal {
  categoryCode: string;
  categoryName: string;
  amount: number;
}

// 円グラフ用のデータ形式
export interface ChartDataItem {
  category: string;
  amount: number;
  fill: string;
}

// 小カテゴリーごとの金額を集計
export function aggregateByCategory(
  expenseReportData: ExpenseReportData | undefined
): CategoryTotal[] {
  if (!expenseReportData) return [];

  const categoryTotalsMap = new Map<string, { name: string; amount: number }>();

  // すべてのカテゴリーグループを走査
  Object.values(expenseReportData).forEach((categoryGroup) => {
    if (!categoryGroup) return;

    // 各カテゴリーを走査
    (
      Object.entries(categoryGroup.categories) as [
        string,
        CategoryWithPayments,
      ][]
    ).forEach(([categoryCode, category]) => {
      // 各支払いを処理
      const totalAmount = category.payments.reduce((sum, payment) => {
        return sum + (payment.amount ?? 0);
      }, 0);

      if (totalAmount > 0) {
        // 既存のカテゴリーがある場合は合計を加算
        const existing = categoryTotalsMap.get(categoryCode);
        if (existing) {
          existing.amount += totalAmount;
        } else {
          categoryTotalsMap.set(categoryCode, {
            name: category.category_name,
            amount: totalAmount,
          });
        }
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

// チャート用の色の配列（最大10色まで対応）
const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

// カテゴリーコードをチャート用のキーに変換（特殊文字をアンダースコアに置換）
function sanitizeCategoryKey(categoryCode: string): string {
  return categoryCode.replace(/[^a-zA-Z0-9]/g, "_");
}

// 円グラフ用のデータとChartConfigを生成
export function generateChartDataAndConfig(categoryTotals: CategoryTotal[]): {
  chartData: ChartDataItem[];
  chartConfig: ChartConfig;
} {
  if (categoryTotals.length === 0) {
    return {
      chartData: [],
      chartConfig: {
        amount: {
          label: "金額",
        },
      },
    };
  }

  const chartData: ChartDataItem[] = categoryTotals.map((item, index) => {
    const categoryKey = sanitizeCategoryKey(item.categoryCode);
    const colorIndex = index % CHART_COLORS.length;
    return {
      category: categoryKey,
      amount: item.amount,
      fill: `var(--color-${categoryKey})`,
    };
  });

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
