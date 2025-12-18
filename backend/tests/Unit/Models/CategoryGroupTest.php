<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\CategoryGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Database\Seeders\CategoryGroupsTableSeeder;
use Database\Seeders\CategoriesSeeder;
use Illuminate\Database\Eloquent\Collection;

class CategoryGroupTest extends TestCase
{
    use RefreshDatabase;

    /**
     * カテゴリーグループが複数のカテゴリを持つことを確認
     */
    public function test_category_group_has_many_categories()
    {
        // カテゴリーグループとカテゴリーを事前に作成
        $this->seed(CategoryGroupsTableSeeder::class);
        $this->seed(CategoriesSeeder::class);

        // カテゴリーを取得
        $categoryGroup = CategoryGroup::where('code', 'monthly_fixed_cost')->first();
        $this->assertNotNull($categoryGroup);

        // リレーションを取得、コレクションが取得できていることを確認
        $categories = $categoryGroup->category;
        $this->assertInstanceOf(Collection::class, $categories);
        $this->assertEquals(7, $categories->count(), 'カテゴリーグループが7つのカテゴリを持つことを確認');

        // リレーションが取得できることを確認
        $housingCost = $categories->where('code', 'housing_cost')->first();
        $this->assertNotNull($housingCost);
        $this->assertEquals('housing_cost', $housingCost->code);
        $this->assertEquals('住居費', $housingCost->name);
    }
}
