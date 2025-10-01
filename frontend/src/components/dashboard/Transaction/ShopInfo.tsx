import { useState } from "react";
import { Store } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";

interface ShopInfoProps {
  shop_name: string;
  onShopNameChange: (shop_name: string) => void;
}

export function ShopInfo({ shop_name, onShopNameChange }: ShopInfoProps) {
  const [error, setError] = useState<string | null>(null);

  const handleShopNameChange = (value: string) => {
    if (value.length > 255) {
      setError("文字数の上限を超えています");

      return;
    }
    setError(null);
    onShopNameChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center gap-3">
        <Store className="size-6 text-gray-500" />
        <Input
          type="text"
          placeholder="お店の名前を入力"
          value={shop_name}
          onChange={(e) => handleShopNameChange(e.target.value)}
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
