import React, { useEffect, useState } from "react";
import type { AmountProps } from "@/types/transaction.ts";

// [表示用] 数値をカンマ区切りの文字列に変換
const formatNumber = (num: number): string => {
  return num.toLocaleString("ja-JP");
};

// [保存用] カンマ区切りの文字列を数値に変換
const parseNumber = (str: string): number => {
  return parseInt(str.replace(/,/g, ""), 10) || 0;
};

export function Amount({ amount, onAmountChange }: AmountProps) {
  const [displayValue, setDisplayValue] = useState(() => formatNumber(amount));

  // 金額が変更されたときに表示を更新（リセット時に必須）
  useEffect(() => {
    setDisplayValue(formatNumber(amount));
  }, [amount]);

  // フォーカスが外れたときに数値を保存
  const handleBlur = () => {
    const numericValue = parseNumber(displayValue);
    onAmountChange(numericValue);
    setDisplayValue(formatNumber(numericValue));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // カンマを削除して数値のみを取得
    const value = e.target.value.replace(/,/g, "");

    if (/^[0-9]*$/.test(value)) {
      const numericValue = parseInt(value || "0", 10);
      setDisplayValue(formatNumber(numericValue));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <>
      <p className="text-xl font-bold mb-2">¥</p>
      <input
        type="text"
        inputMode="numeric"
        className="text-5xl font-bold text-right w-full border-0 border-b-2 border-gray-200 focus:border-gray-500 focus:outline-none font-mono"
        value={displayValue}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="0"
      />
    </>
  );
}
