import type { Category } from "@/types/transaction.ts";

export interface BudgetUsageResponse {
  status: boolean;
  data: Array<{
    id: number;
    category: Category;
    budget_amount: number;
    monthly_data: Array<{
      month: number;
      category_id: number;
      amount: number;
      payment_ids: string;
    }>;
    residue_budget: number;
  }>;
}
