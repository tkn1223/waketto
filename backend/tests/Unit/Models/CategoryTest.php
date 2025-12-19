<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Category;
use App\Models\CategoryGroup;
use Database\Seeders\CategoryGroupsTableSeeder;
use Database\Seeders\CategoriesSeeder;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    /*
     * テストデータの作成
     */
    public function setUp(): void
    {
        parent::setUp();

        // テストデータの作成
        $this->seed(CategoryGroupsTableSeeder::class);
        $this->seed(CategoriesSeeder::class);
    }

    /**
     * 現状確認：カテゴリーがカテゴリーグループに所属していることを確認
     */
    public function test_category_belongs_to_category_group()
    {
        // カテゴリーを取得
        $category = Category::where('code', 'housing_cost')->first();

        // リレーションが取得できることを確認
        $this->assertInstanceOf(CategoryGroup::class, $category->categoryGroup);
        $this->assertEquals('monthly_fixed_cost', $category->categoryGroup->code);
        $this->assertEquals('毎月固定費', $category->categoryGroup->name);
    }

    /**
     * カテゴリーのgroup_idとリレーション経由のidが一致することを確認
     */
    public function test_category_group_id_matches_relation_id()
    {
        // カテゴリーを取得
        $category = Category::where('code', 'housing_cost')->first();

        // group_id属性とリレーション経由のidが一致することを確認
        $this->assertNotNull($category->group_id, 'カテゴリーにgroup_id属性が存在すること');
        $this->assertEquals(
            $category->group_id,
            $category->categoryGroup->id,
            'group_id属性とリレーション経由のidが一致すること'
        );
    }
}
