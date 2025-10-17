import { ExpenseReportResponse } from "./transaction.ts";

export interface DateSelector {
  year: string;
  month: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
}

export interface ExpenseTableProps {
  expenseReport: ExpenseReportResponse | undefined;
  isExpenseReportLoading: boolean;
  expenseReportError: Error | null;
  expenseMutate: () => void;
  handleUpdte: () => void;
  expenseDateSelector: DateSelector;
}
