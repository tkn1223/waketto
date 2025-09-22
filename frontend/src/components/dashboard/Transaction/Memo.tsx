import { NotebookPen } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";

interface MemoProps {
  memo: string;
  onMemoChange: (memo: string) => void;
}

export function Memo({ memo, onMemoChange }: MemoProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <>
      <NotebookPen className="size-6 text-gray-500" />
      <Input
        type="text"
        placeholder="メモを入力"
        value={memo}
        onChange={(e) => onMemoChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </>
  );
}
