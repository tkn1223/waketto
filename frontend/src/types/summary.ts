export interface BudgetUsageResponse {
  status: boolean;
  data: Array<{
    id: number;
    couple_id: number | null;
    recorded_by_user_id: number;
    category: {
      id: number;
      name: string;
      code: string;
      group_code: string;
      type: string;
      recorded_by_user_id: number | null;
      couple_id: number | null;
    };
    amount: number;
  }>;
}
