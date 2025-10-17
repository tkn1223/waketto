"use client";

import { useState } from "react";

export function useDateSelector(initialDate?: Date) {
  const now = initialDate || new Date();

  const [year, setYear] = useState<string>(String(now.getFullYear()));
  const [month, setMonth] = useState<string>(String(now.getMonth() + 1));

  return { year, month, onYearChange: setYear, onMonthChange: setMonth };
}
