import { test, expect } from '@playwright/test';

const testPost = {
  title: '測試餐廳',
  id: `test-${Date.now()}`,
  coverImage: '/tests/cover.png',
  rating: 4,
  price: 500,
  igUrl: 'https://www.instagram.com/test/',
  country: 'tw',
  region: 'tp',
  type: 'taiwanese',
  contentText: '這是測試內容',
};

test.describe('食帳 CRUD 測試', () => {

  test('新增文章', async ({ page }) => {
    await page.goto('/admin/posts/new');

    // 標題 / ID
    await page.fill('input[placeholder="餐廳名稱"]', testPost.title);
    await page.fill('input[placeholder="文章 ID (英文)"]', testPost.id);

    // 評分 / 價格 / IG
    await page.fill('input[type="number"]:nth-of-type(1)', testPost.rating.toString());
    await page.fill('input[type="number"]:nth-of-type(2)', testPost.price.toString());
    await page.fill('input[type="url"]', testPost.igUrl);

    // 分類選擇
    await page.selectOption('select', testPost.country); // 國家
    await page.selectOption('select:nth-of-type(2)', testPost.region); // 地區
    await page.selectOption('select:nth-of-type(3)', testPost.type); // 類型

    // 文字內容
    await page.click('button:has-text("+ 文字")');
    await page.fill('textarea', testPost.contentText);

    // 發布
    await page.click('button:has-text("發布食帳")');

    // 驗證跳轉到首頁
    //await expect(page).toHaveURL('/');

    // 驗證文章存在首頁
    await expect(page.locator(`text=${testPost.title}`)).toBeVisible();
  });

  test('編輯文章', async ({ page }) => {
    await page.goto(`/admin/posts/edit/${testPost.id}`);

    const newTitle = testPost.title + ' 編輯';
    await page.fill('input[placeholder="餐廳名稱"]', newTitle);

    // 儲存
    await page.click('button:has-text("儲存修改")');

    // 驗證修改完成
    //await expect(page).toHaveURL('/');
    await expect(page.locator(`text=${newTitle}`)).toBeVisible();
  });

});
