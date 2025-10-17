"use client";

import { useEffect } from "react";
import { DateSelector } from "@/types/expense.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

export function YearMonthSelector({
  year,
  month,
  onYearChange,
  onMonthChange,
}: DateSelector) {
  const now = new Date();

  const months: string[] = [];
  for (let i = 0; i < 12; i++) {
    months.push((i + 1).toString());
  }

  const years: string[] = [];
  for (let i = now.getFullYear() - 4; i <= now.getFullYear() + 1; i++) {
    years.push(i.toString());
  }

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue={month} onValueChange={onMonthChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}月
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={year} onValueChange={onYearChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}年
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
