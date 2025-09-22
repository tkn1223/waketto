// カテゴリー関連の型定義

export interface Category {
  name: string;
  code: string;
}

export interface CategoryGroup {
  group_name: string;
  categories: Category[];
}

export type CategoryData = Record<string, CategoryGroup>;

export interface CategorySelection {
  type: string; // group_code
  value: string; // category code
}

export interface CategoryListProps {
  categories: CategoryData;
  selected: CategorySelection | null;
  onSelectionChange: (selected: CategorySelection | null) => void;
}
