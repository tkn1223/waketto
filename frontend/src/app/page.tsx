import Link from "next/link";
import { Button } from "@/components/ui/button.tsx";

export default function Home() {
  return (
    <div className="font-sans grid-rows-[20px_1fr_20px] items-center justify-items-center pb-20 gap-16 sm:p-10">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold text-center">家計簿アプリ</h1>

        <p className="text-xl font-medium">作業手順</p>
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">必要な機能を洗い出す</li>
          <li className="mb-2 tracking-[-.01em]">
            必要な画面のデザインを作成する
          </li>
          <li className="tracking-[-.01em]">必要な機能を実装する</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <p>本アプリはshadcn/uiを使って作成しています</p>
          <Button asChild variant="outline">
            <Link
              href="https://www.shadcn.net/ja/docs/components/button"
              rel="noopener noreferrer"
              target="_blank"
            >
              shadcn/uiとは
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
