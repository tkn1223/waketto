import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { BudgetCategory } from "@/types/budget.ts";

export function BudgetCategoryRow({
  categoryGroup,
  onUpdate,
}: {
  categoryGroup: BudgetCategory[];
  onUpdate: (
    code: string,
    field: keyof BudgetCategory,
    value: number | string | null
  ) => void;
}) {
  return (
    <div className="grid gap-2">
      {categoryGroup.map((category) => (
        <span
          key={category.code}
          className="py-1 px-3 flex items-center justify-between bg-white border border-gray-100 shadow-sm hover:border-blue-400 hover:border-1 hover:shadow-md"
        >
          <span className="w-1/3">{category.name}</span>
          <div className="flex items-center justify-end gap-4 w-2/3">
            <div className="flex justify-end gap-1 w-1/2">
              <Input
                className="w-1/4 px-0.5 py-0.5 text-center hover:border-blue-400 hover:border-1"
                type="number"
                min={1}
                max={12}
                value={category.period}
                onChange={(e) => {
                  onUpdate(category.code, "period", Number(e.target.value));
                }}
              />
              <Select
                value={category.periodType}
                onValueChange={(value) => {
                  onUpdate(
                    category.code,
                    "periodType",
                    value as "monthly" | "yearly"
                  );
                }}
              >
                <SelectTrigger className="hover:border-blue-400 hover:border-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="monthly">カ月</SelectItem>
                    <SelectItem value="yearly">年</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-end gap-2 w-1/2">
              <Input
                className="text-center hover:border-blue-400 hover:border-1"
                type="number"
                placeholder="0"
                value={category.budget || ""}
                onChange={(e) => {
                  onUpdate(category.code, "budget", Number(e.target.value));
                }}
              />
              <span>円</span>
            </div>
          </div>
        </span>
      ))}
    </div>
  );
}
