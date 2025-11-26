export type FinanceMode = "expense" | "household"; // expense(支出管理) household(家計簿)
export type UserMode = "alone" | "common"; // alone(個人) common(共有)

// ビューモードの型定義
export interface ViewModeContextType {
  finance: FinanceMode;
  user: UserMode;
  setFinance: (mode: FinanceMode) => void;
  setUser: (mode: UserMode) => void;
}

// ファイナンスモードの型定義
export interface FinanceModeToggleProps {
  finance: FinanceMode;
  setFinance: (finance: FinanceMode) => void;
}

// ユーザーモードの型定義
export interface UserModeToggleProps {
  user: UserMode;
  setUser: (user: UserMode) => void;
}
