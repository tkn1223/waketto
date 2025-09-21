// カテゴリー配列
export const tabItems = [
  { key: "monthly_fixed_cost", label: "毎月固定" },
  { key: "monthly_variable_cost", label: "毎月変動" },
  { key: "occasional_fixed_cost", label: "不定期固定" },
  { key: "occasional_variable_cost", label: "不定期変動" },
  { key: "luxury_consumption_cost", label: "豊かな浪費" },
  { key: "savings_investment_cost", label: "貯蓄・投資" },
] as const;

export const optionsMFC = Array.from(
  { length: 7 },
  (_, i) => `毎月固定費 ${i + 1}`
);
export const optionsMVC = Array.from(
  { length: 7 },
  (_, i) => `毎月変動費 ${i + 1}`
);
export const optionsOFC = Array.from(
  { length: 6 },
  (_, i) => `不定期固定費 ${i + 1}`
);
export const optionsOVC = Array.from(
  { length: 6 },
  (_, i) => `不定期変動費 ${i + 1}`
);
export const optionsLCC = Array.from(
  { length: 2 },
  (_, i) => `豊かな浪費 ${i + 1}`
);
export const optionsSIC = Array.from(
  { length: 2 },
  (_, i) => `貯蓄・投資 ${i + 1}`
);

export type TabKey = (typeof tabItems)[number]["key"];

export const optionsByKey: Record<TabKey, string[]> = {
  monthly_fixed_cost: optionsMFC,
  monthly_variable_cost: optionsMVC,
  occasional_fixed_cost: optionsOFC,
  occasional_variable_cost: optionsOVC,
  luxury_consumption_cost: optionsLCC,
  savings_investment_cost: optionsSIC,
};
