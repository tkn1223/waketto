"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { BackToHomeButton } from "@/components/ui/backtohomebutton.tsx";

export default function BudgetSettingPage() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 px-10">
      <Card className="mt-4 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold">予算設定</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center">comming soon...</p>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <BackToHomeButton />
    </div>
  );
}
