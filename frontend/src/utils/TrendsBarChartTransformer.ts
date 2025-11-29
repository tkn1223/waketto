import { ChartConfig } from "@/components/ui/chart";
import { BudgetUsageResponse } from "@/types/budget.ts";

type MonthlyAmountData = { month: number; [key: string]: number | string };
type CategoryMonthlyData = {
  category: string;
  monthlyAmounts: Map<number, number>;
};

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
] as const;

/**
 * カテゴリー別の月次積み上げデータを生成
 * @param TrendsBarChartData - 予算消化状況データ
 * @returns 月ごとの合計支出データの配列
 */
export function transformTrendsBarChartData(
  TrendsBarChartData: BudgetUsageResponse | undefined
): {
  chartData: Array<MonthlyAmountData>;
  chartConfig: ChartConfig;
} {
  if (!TrendsBarChartData) {
    return {
      chartData: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        amount: 0,
      })),
      chartConfig: {},
    };
  }

  const categoryMonthlyData = new Map<string, CategoryMonthlyData>();

  // カテゴリー別の月次データを集計
  aggregateCategoryMonthlyData(TrendsBarChartData, categoryMonthlyData);
  // チャート用のデータを生成
  const chartData = generateChartData(categoryMonthlyData);
  // チャートの設定を生成
  const chartConfig = generateChartConfig(categoryMonthlyData);

  return {
    chartData,
    chartConfig,
  };
}

function aggregateCategoryMonthlyData(
  TrendsBarChartData: BudgetUsageResponse,
  categoryMonthlyData: Map<string, CategoryMonthlyData>
): void {
  // 各カテゴリーの月次データを集計
  TrendsBarChartData.data.forEach((item) => {
    const categoryKey = sanitizeCategoryKey(item.category.code);
    const categoryName = item.category.name;

    // 初期化
    if (!categoryMonthlyData.has(categoryKey)) {
      categoryMonthlyData.set(categoryKey, {
        category: categoryName,
        monthlyAmounts: new Map<number, number>(),
      });
    }

    const categoryData = categoryMonthlyData.get(categoryKey)!;

    // 月ごとの合計金額を計算
    item.monthly_data.forEach((monthData) => {
      const month = monthData.month;
      const amount = monthData.amount || 0;

      // 月ごとの合計金額を計算（初期値は0）
      const currentAmount = categoryData.monthlyAmounts.get(month) || 0;
      categoryData.monthlyAmounts.set(month, currentAmount + amount);
    });
  });
}

function generateChartData(
  categoryMonthlyData: Map<string, CategoryMonthlyData>
): Array<MonthlyAmountData> {
  // 月ごとの合計金額を計算（チャート表示）
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthData: { month: number; [key: string]: number | string } = {
      month: month,
    };

    categoryMonthlyData.forEach((categoryData, categoryKey) => {
      monthData[categoryKey] = categoryData.monthlyAmounts.get(month) || 0;
    });

    return monthData;
  });

  return chartData;
}

function generateChartConfig(
  categoryMonthlyData: Map<string, CategoryMonthlyData>
): ChartConfig {
  // 毎回新しいチャート設定を作ることで、カテゴリー数に応じて安定して色を割り当てる
  const chartConfig: ChartConfig = {};
  let colorIndex = 0;

  categoryMonthlyData.forEach((categoryData, categoryKey) => {
    chartConfig[categoryKey] = {
      label: categoryData.category,
      color: CHART_COLORS[colorIndex % CHART_COLORS.length],
    };
    colorIndex++;
  });

  return chartConfig;
}

// カテゴリーコードをチャート用のキーに変換（特殊文字をアンダースコアに置換）
function sanitizeCategoryKey(categoryCode: string): string {
  return categoryCode.replace(/[^a-zA-Z0-9]/g, "_");
}
