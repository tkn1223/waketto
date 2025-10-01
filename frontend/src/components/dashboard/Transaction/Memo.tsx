"use client";

import { useState } from "react";
import { NotebookPen } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";

interface MemoProps {
  memo: string;
  onMemoChange: (memo: string) => void;
}

export function Memo({ memo, onMemoChange }: MemoProps) {
  const [error, setError] = useState<string | null>(null);

  const handleMemoChange = (value: string) => {
    if (value.length > 255) {
      setError("文字数の上限を超えています");

      return;
    }
    setError(null);
    onMemoChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center gap-3">
        <NotebookPen className="size-6 text-gray-500" />
        <Input
          type="text"
          placeholder="メモを入力"
          value={memo}
          onChange={(e) => handleMemoChange(e.target.value)}
          maxLength={255}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="flex justify-center mt-1">
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </>
  );
}
