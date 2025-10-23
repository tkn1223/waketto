import type { ExpenseReportResponse } from "./transaction.ts";

export interface DateSelector {
  year: string;
  month: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
}

export interface YearMonthSelectorProps {
  year: string;
  month: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  showMonth: boolean;
}

export interface ExpenseTableProps {
  expenseReport: ExpenseReportResponse | undefined;
  isExpenseReportLoading: boolean;
  expenseReportError: Error | undefined;
  expenseMutate: () => void;
  handleUpdte: () => void;
  expenseDateSelector: DateSelector;
}
