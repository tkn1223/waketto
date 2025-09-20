"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getCurrentUserInfo,
  isAuthenticated,
  signOutUser,
  type User,
} from "@/lib/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Check,
  ChevronDownIcon,
  ChevronsUpDown,
  Command as CommandIcon,
  Folder,
  Store,
  NotebookPen,
  ChevronDown,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// カテゴリー配列
const tabItems = [
  { key: "monthly_fixed_cost", label: "毎月固定" },
  { key: "monthly_variable_cost", label: "毎月変動" },
  { key: "occasional_fixed_cost", label: "不定期固定" },
  { key: "occasional_variable_cost", label: "不定期変動" },
  { key: "luxury_consumption_cost", label: "豊かな浪費" },
  { key: "savings_investment_cost", label: "貯蓄・投資" },
] as const;

const optionsMFC = Array.from({ length: 7 }, (_, i) => `毎月固定費 ${i + 1}`);
const optionsMVC = Array.from({ length: 7 }, (_, i) => `毎月変動費 ${i + 1}`);
const optionsOFC = Array.from({ length: 6 }, (_, i) => `不定期固定費 ${i + 1}`);
const optionsOVC = Array.from({ length: 6 }, (_, i) => `不定期変動費 ${i + 1}`);
const optionsLCC = Array.from({ length: 2 }, (_, i) => `豊かな浪費 ${i + 1}`);
const optionsSIC = Array.from({ length: 2 }, (_, i) => `貯蓄・投資 ${i + 1}`);

type TabKey = (typeof tabItems)[number]["key"];
type SingleSelection = { tab: TabKey; value: string } | null;

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selected, setSelected] = useState<{
    tab: TabKey;
    value: string;
  } | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 認証チェック
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          router.push("/signin");
          return;
        }

        // ユーザー情報を取得
        try {
          const userData = await getCurrentUserInfo();

          if (userData) {
            setUser(userData);
            setIsLoading(false);
          }
        } catch (error) {
          setError("ユーザー情報の取得に失敗しました");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setError("認証チェックに失敗しました");
        setIsLoading(false);
      }
    };

    void checkAuth();
  }, [router]);

  const handleLogout = () => {
    void signOutUser();
  };

  const optionsByKey: Record<TabKey, string[]> = useMemo(
    () => ({
      monthly_fixed_cost: optionsMFC,
      monthly_variable_cost: optionsMVC,
      occasional_fixed_cost: optionsOFC,
      occasional_variable_cost: optionsOVC,
      luxury_consumption_cost: optionsLCC,
      savings_investment_cost: optionsSIC,
    }),
    []
  );

  const clearSelections = (tab?: TabKey) => {
    if (!tab || selected?.tab === tab) {
      setSelected(null);
    }
    setCategoryOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/signin")}>
            ログインページに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 px-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 支出管理表カード */}
        <div className="lg:col-span-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <Card>
              <CardHeader>
                <CardTitle>{user?.name} の支出管理表</CardTitle>
              </CardHeader>
              <CardContent>
                {/* 2x2グリッドレイアウト */}
                <div className="grid grid-cols-2 gap-4">
                  {/* １行目 */}
                  {/* 左: 固定費 - 毎月 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      固定費 - 毎月
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">通信費</span>
                        <span className="font-medium">3,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">家賃</span>
                        <span className="font-medium">50,000円</span>
                      </div>
                    </div>
                  </div>

                  {/* 左: 変動費 - 毎月 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      変動費 - 毎月
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">食費</span>
                        <span className="font-medium">30,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">交通費</span>
                        <span className="font-medium">5,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">日用品</span>
                        <span className="font-medium">3,000円</span>
                      </div>
                    </div>
                  </div>

                  {/* ２行目 */}
                  {/* 右: 固定費 - 不定期 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      固定費 - 不定期
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">税金(自動車税)</span>
                        <span className="font-medium">35,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">保険料</span>
                        <span className="font-medium">15,000円</span>
                      </div>
                    </div>
                  </div>

                  {/* 右: 変動費 - 不定期 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      変動費 - 不定期
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">家具家電</span>
                        <span className="font-medium">10,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">医療費</span>
                        <span className="font-medium">5,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">外食費</span>
                        <span className="font-medium">15,000円</span>
                      </div>
                    </div>
                  </div>

                  {/* ３行目 */}
                  {/* 左: 豊かな浪費 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      豊かな浪費
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">外食費</span>
                        <span className="font-medium">10,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">美容費</span>
                        <span className="font-medium">5,000円</span>
                      </div>
                    </div>
                  </div>

                  {/* 右: 貯蓄・投資 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      貯蓄・投資
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">教育費</span>
                        <span className="font-medium">30,000円</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">旅行費</span>
                        <span className="font-medium">15,000円</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* 取引明細カード */}
        <div className="lg:col-span-1">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <Card>
              <CardHeader>
                <CardTitle>取引明細</CardTitle>
              </CardHeader>
              <CardContent className="space-y-7">
                <div className="flex justify-end items-end gap-2">
                  <p>¥</p>
                  <p className="text-5xl font-bold">0</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* 登録日 */}
                  <div className="w-1/2">
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          data-empty={!date}
                          className="data-[empty=true]:text-muted-foreground justify-between w-full"
                        >
                          <CalendarIcon />
                          {date ? format(date, "yyyy/M/d") : null}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setDate(date ?? new Date());
                            setCalendarOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* カテゴリー */}
                  <div className="w-1/2">
                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                      {/* カテゴリー選択ボタン */}
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="inline-flex w-full items-center justify-between gap-2 truncate"
                        >
                          <Folder />
                          {selected ? `${selected.value}` : "未分類"}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      {/* カテゴリー選択ポップオーバー */}
                      <PopoverContent align="end" className="w-[300px] p-0">
                        <Tabs
                          defaultValue="monthly_fixed_cost"
                          className="w-full"
                        >
                          {/* タブ上部：タブリスト */}
                          <div className="sticky top-0 z-10 bg-gray-200 rounded-t-md">
                            <TabsList className="grid w-full grid-cols-3 grid-rows-2 gap-1 p-1 bg-transparent h-auto">
                              {tabItems.map((t) => (
                                <TabsTrigger
                                  key={t.key}
                                  value={t.key}
                                  className="text-xs"
                                >
                                  {t.label}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                            <Separator />
                          </div>

                          {/* 各タブの内容 */}
                          {tabItems.map((t) => (
                            <TabsContent
                              key={t.key}
                              value={t.key}
                              className="m-0"
                            >
                              <ScrollArea className="h-64 px-2 py-2">
                                <RadioGroup
                                  value={
                                    selected?.tab === t.key
                                      ? selected.value
                                      : undefined
                                  }
                                  onValueChange={(val) =>
                                    setSelected({ tab: t.key, value: val })
                                  }
                                >
                                  <ul className="space-y-1">
                                    {optionsByKey[t.key].map((opt) => (
                                      <li key={opt}>
                                        <label
                                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-accent"
                                          htmlFor={`${t.key}-${opt}`}
                                        >
                                          <RadioGroupItem
                                            id={`${t.key}-${opt}`}
                                            value={opt}
                                          />
                                          <span className="flex-1 text-sm">
                                            {opt}
                                          </span>
                                        </label>
                                      </li>
                                    ))}
                                  </ul>
                                </RadioGroup>
                              </ScrollArea>
                            </TabsContent>
                          ))}

                          <Separator />
                          {/* フッター操作 */}
                          <div className="flex items-center justify-between px-3 py-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => clearSelections()}
                            >
                              クリア
                            </Button>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCategoryOpen(false)}
                              >
                                キャンセル
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => setCategoryOpen(false)}
                              >
                                適用
                              </Button>
                            </div>
                          </div>
                        </Tabs>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>支払った人</div>
                  <div className="flex gap-2">
                    <Button>たかな</Button>
                    <Button className="bg-white text-black border border-gray-300">
                      パートナー
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-100 p-2 text-center">支出の詳細</div>

                <div className="flex justify-between items-center gap-3">
                  <Store className="size-6 text-gray-500" />
                  <Input
                    id="shop_name"
                    type="text"
                    placeholder="お店の名前を入力"
                  />
                </div>
                <div className="flex justify-between items-center gap-3">
                  <NotebookPen className="size-6 text-gray-500" />
                  <Input id="memo" type="text" placeholder="メモを入力" />
                </div>
                <Button className="w-full text-xl h-12">保存する</Button>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* 予算消化率 */}
        <div className="col-span-3 space-y-3">
          <div className="font-medium text-lg">予算の消化状況</div>

          {/* 予算１つ目：旅行費 */}
          <div className="p-2 border border-gray-300 space-y-1">
            <div className="grid grid-cols-3 gap-2">
              <Label className="text-md p-2 flex items-center justify-center">
                項目：旅行費
              </Label>
              <Label className="text-md p-2 flex items-center justify-center">
                予算：24万
              </Label>
              <Label className="text-md p-2 flex items-center justify-center">
                残り：12万
              </Label>
            </div>

            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <Label className="p-2 text-xs bg-gray-200 flex items-center justify-center">
                  {i + 1} 月
                </Label>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-1">
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥50,000
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥70,000
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
              <Label className="p-2 text-xs flex items-center justify-center">
                ¥0
              </Label>
            </div>
          </div>

          {/* 予算２つ目：家具家電 */}
          <div className="p-2 border border-gray-300 space-y-1">
            <div className="grid grid-cols-3 gap-2">
              <Label className="text-md p-2 flex items-center justify-center">
                項目：旅行費
              </Label>
              <Label className="text-md p-2 flex items-center justify-center">
                予算：24万
              </Label>
              <Label className="text-md p-2 flex items-center justify-center">
                残り：12万
              </Label>
            </div>

            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <Label className="p-2 text-xs bg-gray-200 flex items-center justify-center">
                  {i + 1} 月
                </Label>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <Label className="p-2 text-xs flex items-center justify-center">
                  月の支出
                </Label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
