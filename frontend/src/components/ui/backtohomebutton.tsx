import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button.tsx";

export function BackToHomeButton() {
  const router = useRouter();

  return (
    <div className="flex justify-end mt-10">
      <Button
        onClick={() => router.push("/dashboard")}
        className="text-lg px-7 py-5"
      >
        戻る
      </Button>
    </div>
  );
}
