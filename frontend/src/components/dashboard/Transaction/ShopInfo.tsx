import { Store } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";

interface ShopInfoProps {
  shop_name: string;
  onShopNameChange: (shop_name: string) => void;
}

export function ShopInfo({ shop_name, onShopNameChange }: ShopInfoProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <>
      <Store className="size-6 text-gray-500" />
      <Input
        type="text"
        placeholder="お店の名前を入力"
        value={shop_name}
        onChange={(e) => onShopNameChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </>
  );
}
