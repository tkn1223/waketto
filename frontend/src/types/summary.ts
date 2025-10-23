import type { DateSelector } from "@/types/expense.ts";
import type { Category } from "@/types/transaction.ts";
import type { UserMode } from "@/types/viewmode.ts";

export interface AnnualExpenseSummaryProps {
  isAuth: boolean;
  user: UserMode;
  expenseDateSelector: DateSelector;
  budgetUsageDateSelector: DateSelector;
}

export interface BudgetUsageResponse {
  status: boolean;
  data: {
    id: number;
    category: Category;
    budget_amount: number;
    monthly_data: {
      month: number;
      category_id: number;
      amount: number;
      payment_ids: string;
    }[];
    residue_budget: number;
  }[];
}
