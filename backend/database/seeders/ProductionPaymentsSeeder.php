<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductionPaymentsSeeder extends Seeder
{
    /**
     * 本番環境用のPaymentテストデータを作成
     * 2025年1月〜2026年3月の15ヶ月分
     * 個人モードと共有モードの両方を作成
     */
    public function run(): void
    {
        $userId = 1;
        $partnerId = 2;
        $coupleId = 28;

        // カテゴリーIDを取得
        $categoryIds = $this->getCategoryIds();
        if (! $categoryIds) {
            $this->command->error('カテゴリーが見つかりません。先にCategoriesSeederを実行してください。');

            return;
        }

        $payments = [];

        // 個人モードのデータ作成（2025年1月1日〜2026年3月31日）
        $payments = array_merge($payments, $this->generateAloneModePayments($categoryIds, $userId));

        // 共有モードのデータ作成（週末のみ、2025年1月1日〜2026年3月31日）
        $payments = array_merge($payments, $this->generateCommonModePayments($categoryIds, $userId, $partnerId, $coupleId));

        // 一括挿入
        if (! empty($payments)) {
            // チャンクに分けて挿入（大量データ対策）
            $chunks = array_chunk($payments, 500);
            foreach ($chunks as $chunk) {
                DB::table('payments')->insert($chunk);
            }
            $this->command->info('Paymentテストデータを作成しました: '.count($payments).'件');
        }
    }

    /**
     * カテゴリーIDを取得
     */
    private function getCategoryIds(): ?array
    {
        $categories = [
            '住居費', '水道光熱費', '社会保険料', '生命保険料', '通信費',
            '食費', '日用品費', '美容費', '被服費', '医療費', '交通費',
            '税金', '年会費', '家電、家具', '冠婚葬祭', '治療費', '引っ越し',
            '交際費', '旅行費', '娯楽費', 'つみたて投資',
        ];

        $ids = [];
        foreach ($categories as $name) {
            $id = DB::table('categories')->where('name', $name)->value('id');
            if ($id) {
                $ids[$name] = $id;
            }
        }

        return count($ids) === count($categories) ? $ids : null;
    }

    /**
     * 個人モードのデータを生成
     */
    private function generateAloneModePayments(array $categoryIds, int $userId): array
    {
        $payments = [];
        $startDate = Carbon::create(2025, 1, 1);
        $endDate = Carbon::create(2026, 3, 31);

        $currentDate = $startDate->copy();

        while ($currentDate->lte($endDate)) {
            $year = $currentDate->year;
            $month = $currentDate->month;

            // 固定費（月初1-5日）
            $fixedCostDay = rand(1, 5);
            $fixedCostDate = Carbon::create($year, $month, $fixedCostDay);

            // 住居費（月1回、80,000-90,000円）
            $payments[] = [
                'payment_date' => $fixedCostDate->format('Y-m-d'),
                'category_id' => $categoryIds['住居費'],
                'paid_by_user_id' => $userId,
                'recorded_by_user_id' => $userId,
                'couple_id' => null,
                'amount' => 95000,
                'store_name' => '家賃',
                'note' => null,
            ];

            // 水道光熱費（月1回、5,000-8,000円）
            $payments[] = [
                'payment_date' => $fixedCostDate->copy()->addDays(rand(0, 2))->format('Y-m-d'),
                'category_id' => $categoryIds['水道光熱費'],
                'paid_by_user_id' => $userId,
                'recorded_by_user_id' => $userId,
                'couple_id' => null,
                'amount' => rand(5000, 8000),
                'store_name' => '電気・ガス・水道',
                'note' => null,
            ];

            // 通信費（月1回、3,000-5,000円）
            $payments[] = [
                'payment_date' => $fixedCostDate->copy()->addDays(rand(0, 2))->format('Y-m-d'),
                'category_id' => $categoryIds['通信費'],
                'paid_by_user_id' => $userId,
                'recorded_by_user_id' => $userId,
                'couple_id' => null,
                'amount' => 3000,
                'store_name' => '携帯電話',
                'note' => null,
            ];

            // つみたて投資（月1回、10,000-30,000円）
            $payments[] = [
                'payment_date' => $fixedCostDate->copy()->addDays(rand(0, 2))->format('Y-m-d'),
                'category_id' => $categoryIds['つみたて投資'],
                'paid_by_user_id' => $userId,
                'recorded_by_user_id' => $userId,
                'couple_id' => null,
                'amount' => rand(10000, 30000),
                'store_name' => null,
                'note' => null,
            ];

            // 食費（週2-3回、1,000-8,000円）
            $foodCount = rand(8, 12); // 月8-12回
            for ($i = 0; $i < $foodCount; $i++) {
                $day = rand(1, $currentDate->daysInMonth);
                $foodDate = Carbon::create($year, $month, $day);
                $stores = ['スーパー', 'コンビニ', '外食', 'デリバリー', 'スーパー', 'コンビニ'];
                $payments[] = [
                    'payment_date' => $foodDate->format('Y-m-d'),
                    'category_id' => $categoryIds['食費'],
                    'paid_by_user_id' => $userId,
                    'recorded_by_user_id' => $userId,
                    'couple_id' => null,
                    'amount' => rand(1000, 8000),
                    'store_name' => $stores[array_rand($stores)],
                    'note' => null,
                ];
            }

            // 日用品費（週1-2回、500-3,000円）
            $dailyGoodsCount = rand(4, 8); // 月4-8回
            for ($i = 0; $i < $dailyGoodsCount; $i++) {
                $day = rand(1, $currentDate->daysInMonth);
                $dailyGoodsDate = Carbon::create($year, $month, $day);
                $stores = ['ドラッグストア', '100円ショップ', 'ドラッグストア', 'スーパー'];
                $payments[] = [
                    'payment_date' => $dailyGoodsDate->format('Y-m-d'),
                    'category_id' => $categoryIds['日用品費'],
                    'paid_by_user_id' => $userId,
                    'recorded_by_user_id' => $userId,
                    'couple_id' => null,
                    'amount' => rand(500, 3000),
                    'store_name' => $stores[array_rand($stores)],
                    'note' => null,
                ];
            }

            // 美容費（2ヶ月に1回、5000-7000円）
            // 月のインデックス（0から開始）を使って2ヶ月に1回を判定
            $monthIndex = ($year - 2025) * 12 + ($month - 1);
            if ($monthIndex % 2 === 1) { // 奇数月（1, 3, 5, ...）に理髪（交通費とは異なる月）
                $day = rand(1, $currentDate->daysInMonth);
                $beautyDate = Carbon::create($year, $month, $day);
                $payments[] = [
                    'payment_date' => $beautyDate->format('Y-m-d'),
                    'category_id' => $categoryIds['美容費'],
                    'paid_by_user_id' => $userId,
                    'recorded_by_user_id' => $userId,
                    'couple_id' => null,
                    'amount' => rand(5000, 7000),
                    'store_name' => '理髪店',
                    'note' => null,
                ];
            }

            // 被服費（月1-2回、2,000-15,000円）
            $clothingCount = rand(1, 2);
            for ($i = 0; $i < $clothingCount; $i++) {
                $day = rand(1, $currentDate->daysInMonth);
                $clothingDate = Carbon::create($year, $month, $day);
                $stores = ['ユニクロ', 'GU', 'ZARA', 'アパレル店'];
                $payments[] = [
                    'payment_date' => $clothingDate->format('Y-m-d'),
                    'category_id' => $categoryIds['被服費'],
                    'paid_by_user_id' => $userId,
                    'recorded_by_user_id' => $userId,
                    'couple_id' => null,
                    'amount' => rand(2000, 15000),
                    'store_name' => $stores[array_rand($stores)],
                    'note' => null,
                ];
            }

            // 医療費（月0-1回、1,000-5,000円）
            if (rand(1, 3) <= 2) { // 2/3の確率
                $day = rand(1, $currentDate->daysInMonth);
                $medicalDate = Carbon::create($year, $month, $day);
                $payments[] = [
                    'payment_date' => $medicalDate->format('Y-m-d'),
                    'category_id' => $categoryIds['医療費'],
                    'paid_by_user_id' => $userId,
                    'recorded_by_user_id' => $userId,
                    'couple_id' => null,
                    'amount' => rand(1000, 5000),
                    'store_name' => '病院',
                    'note' => null,
                ];
            }

            // 交通費（2ヶ月に1回、5000円固定）
            // 月のインデックス（0から開始）を使って2ヶ月に1回を判定
            $monthIndex = ($year - 2025) * 12 + ($month - 1);
            if ($monthIndex % 2 === 0) { // 偶数月（0, 2, 4, ...）にチャージ
                $day = rand(1, $currentDate->daysInMonth);
                $transportDate = Carbon::create($year, $month, $day);
                $payments[] = [
                    'payment_date' => $transportDate->format('Y-m-d'),
                    'category_id' => $categoryIds['交通費'],
                    'paid_by_user_id' => $userId,
                    'recorded_by_user_id' => $userId,
                    'couple_id' => null,
                    'amount' => 5000,
                    'store_name' => 'チャージ',
                    'note' => null,
                ];
            }

            // 不定期固定費
            // 税金（年2-3回、10,000-50,000円）
            if ($month === 2 || $month === 6 || $month === 12) {
                if (rand(1, 2) === 1) {
                    $day = rand(1, $currentDate->daysInMonth);
                    $taxDate = Carbon::create($year, $month, $day);
                    $payments[] = [
                        'payment_date' => $taxDate->format('Y-m-d'),
                        'category_id' => $categoryIds['税金'],
                        'paid_by_user_id' => $userId,
                        'recorded_by_user_id' => $userId,
                        'couple_id' => null,
                        'amount' => rand(10000, 50000),
                        'store_name' => null,
                        'note' => null,
                    ];
                }
            }

            // 家電・家具（数ヶ月に1回、5,000-50,000円）
            if (rand(1, 4) === 1) {
                $day = rand(1, $currentDate->daysInMonth);
                $applianceDate = Carbon::create($year, $month, $day);
                $stores = ['家電量販店', 'IKEA', 'ニトリ', 'ネット通販'];
                $payments[] = [
                    'payment_date' => $applianceDate->format('Y-m-d'),
                    'category_id' => $categoryIds['家電、家具'],
                    'paid_by_user_id' => $userId,
                    'recorded_by_user_id' => $userId,
                    'couple_id' => null,
                    'amount' => rand(5000, 50000),
                    'store_name' => $stores[array_rand($stores)],
                    'note' => null,
                ];
            }

            // 冠婚葬祭（年1-2回、5,000-30,000円）
            if (rand(1, 8) === 1) {
                $day = rand(1, $currentDate->daysInMonth);
                $ceremonyDate = Carbon::create($year, $month, $day);
                $payments[] = [
                    'payment_date' => $ceremonyDate->format('Y-m-d'),
                    'category_id' => $categoryIds['冠婚葬祭'],
                    'paid_by_user_id' => $userId,
                    'recorded_by_user_id' => $userId,
                    'couple_id' => null,
                    'amount' => rand(5000, 30000),
                    'store_name' => null,
                    'note' => null,
                ];
            }

            $currentDate->addMonth();
        }

        return $payments;
    }

    /**
     * 共有モードのデータを生成（週末のみ）
     */
    private function generateCommonModePayments(array $categoryIds, int $userId, int $partnerId, int $coupleId): array
    {
        $payments = [];
        $startDate = Carbon::create(2025, 1, 1);
        $endDate = Carbon::create(2026, 3, 31);

        $currentDate = $startDate->copy();

        // 旅行のタイミングを決定（5回程度）
        $travelDates = [];
        // 2025年3月、7月、9月、12月、2026年2月
        $travelDatesConfig = [
            ['year' => 2025, 'month' => 3],
            ['year' => 2025, 'month' => 7],
            ['year' => 2025, 'month' => 9],
            ['year' => 2025, 'month' => 12],
            ['year' => 2026, 'month' => 2],
        ];

        foreach ($travelDatesConfig as $config) {
            $year = $config['year'];
            $month = $config['month'];

            // その月の週末（金・土・日）を取得
            $weekendDates = $this->getWeekendDates($year, $month);
            if (! empty($weekendDates)) {
                // 連続する週末を選ぶ（旅行用）
                $travelStart = $weekendDates[array_rand($weekendDates)];
                $travelDates[] = $travelStart;
            }
        }

        while ($currentDate->lte($endDate)) {
            $year = $currentDate->year;
            $month = $currentDate->month;

            // その月の週末（金・土・日）を取得
            $weekendDates = $this->getWeekendDates($year, $month);

            // 月2-3回のデート
            $dateCount = rand(2, 3);
            $selectedWeekends = [];

            // 旅行日を除外して週末を選択
            $availableWeekends = array_filter($weekendDates, function ($date) use ($travelDates) {
                foreach ($travelDates as $travelDate) {
                    if ($date->format('Y-m-d') === $travelDate->format('Y-m-d')) {
                        return false;
                    }
                }

                return true;
            });

            if (count($availableWeekends) > 0) {
                $selectedWeekends = array_rand(array_values($availableWeekends), min($dateCount, count($availableWeekends)));
                if (! is_array($selectedWeekends)) {
                    $selectedWeekends = [$selectedWeekends];
                }

                foreach ($selectedWeekends as $index) {
                    $weekendDate = array_values($availableWeekends)[$index];

                    // 交際費（2,000-10,000円）
                    $paidBy = rand(1, 2) === 1 ? $userId : $partnerId;
                    $recordedBy = rand(1, 2) === 1 ? $userId : $partnerId;
                    $restaurants = ['レストラン', '居酒屋', 'カフェ', 'イタリアン', '和食', '焼肉'];
                    $payments[] = [
                        'payment_date' => $weekendDate->format('Y-m-d'),
                        'category_id' => $categoryIds['交際費'],
                        'paid_by_user_id' => $paidBy,
                        'recorded_by_user_id' => $recordedBy,
                        'couple_id' => $coupleId,
                        'amount' => rand(2000, 10000),
                        'store_name' => $restaurants[array_rand($restaurants)],
                        'note' => null,
                    ];

                    // 娯楽費（1,000-5,000円、確率的に追加）
                    if (rand(1, 2) === 1) {
                        $paidBy = rand(1, 2) === 1 ? $userId : $partnerId;
                        $recordedBy = rand(1, 2) === 1 ? $userId : $partnerId;
                        $entertainments = ['映画館', 'ゲームセンター', 'ボウリング', 'カラオケ', '美術館'];
                        $payments[] = [
                            'payment_date' => $weekendDate->format('Y-m-d'),
                            'category_id' => $categoryIds['娯楽費'],
                            'paid_by_user_id' => $paidBy,
                            'recorded_by_user_id' => $recordedBy,
                            'couple_id' => $coupleId,
                            'amount' => rand(1000, 5000),
                            'store_name' => $entertainments[array_rand($entertainments)],
                            'note' => null,
                        ];
                    }
                }
            }

            // 旅行日の処理
            foreach ($travelDates as $travelDate) {
                if ($travelDate->year === $year && $travelDate->month === $month) {
                    // 旅行日は複数レコードで合計金額を分散
                    $totalTravelAmount = rand(20000, 150000);

                    // ホテル代（30,000-80,000円）
                    $hotelAmount = min(rand(30000, 80000), $totalTravelAmount * 0.6);
                    $paidBy = rand(1, 2) === 1 ? $userId : $partnerId;
                    $payments[] = [
                        'payment_date' => $travelDate->format('Y-m-d'),
                        'category_id' => $categoryIds['旅行費'],
                        'paid_by_user_id' => $paidBy,
                        'recorded_by_user_id' => $userId,
                        'couple_id' => $coupleId,
                        'amount' => $hotelAmount,
                        'store_name' => 'ホテル',
                        'note' => null,
                    ];

                    // 交通費（新幹線など、10,000-50,000円）
                    $transportAmount = min(rand(10000, 50000), ($totalTravelAmount - $hotelAmount) * 0.6);
                    $paidBy = rand(1, 2) === 1 ? $userId : $partnerId;
                    $payments[] = [
                        'payment_date' => $travelDate->format('Y-m-d'),
                        'category_id' => $categoryIds['旅行費'],
                        'paid_by_user_id' => $paidBy,
                        'recorded_by_user_id' => $userId,
                        'couple_id' => $coupleId,
                        'amount' => $transportAmount,
                        'store_name' => '新幹線',
                        'note' => null,
                    ];

                    // 食事代（残り）
                    $remainingAmount = $totalTravelAmount - $hotelAmount - $transportAmount;
                    if ($remainingAmount > 0) {
                        $paidBy = rand(1, 2) === 1 ? $userId : $partnerId;
                        $payments[] = [
                            'payment_date' => $travelDate->format('Y-m-d'),
                            'category_id' => $categoryIds['旅行費'],
                            'paid_by_user_id' => $paidBy,
                            'recorded_by_user_id' => $userId,
                            'couple_id' => $coupleId,
                            'amount' => $remainingAmount,
                            'store_name' => '観光地レストラン',
                            'note' => null,
                        ];
                    }
                }
            }

            $currentDate->addMonth();
        }

        return $payments;
    }

    /**
     * 指定年月の週末（金・土・日）の日付を取得
     */
    private function getWeekendDates(int $year, int $month): array
    {
        $dates = [];
        $daysInMonth = Carbon::create($year, $month, 1)->daysInMonth;

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = Carbon::create($year, $month, $day);
            $weekday = $date->dayOfWeek; // 0=日曜、5=金曜、6=土曜
            if ($weekday === 0 || $weekday === 5 || $weekday === 6) {
                $dates[] = $date;
            }
        }

        return $dates;
    }
}
