// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Przewodnik Ptaków Polski – testy e2e', () => {

  test('strona ładuje się i renderuje 65 kart gatunków', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.page--card', { timeout: 15000 });
    const count = await page.locator('.page--card').count();
    expect(count).toBe(65);
  });

  test('wyszukiwanie po nazwie filtruje karty', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.page--card');

    await page.click('#nav-search');
    await page.fill('#search-input', 'bocian');

    const visible = await page.locator('.page--card').evaluateAll(
      els => els.filter(el => el.style.display !== 'none').length
    );
    expect(visible).toBeGreaterThan(0);
    expect(visible).toBeLessThan(65);
  });

  test('filtr kategorii Ogród pokazuje podzbiór kart', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.page--card');

    await page.click('#nav-search');
    await page.click('.filter-btn[data-category="Ogród"]');
    // clicking a non-Podkarpackie category closes the overlay automatically

    const visible = await page.locator('.page--card').evaluateAll(
      els => els.filter(el => el.style.display !== 'none').length
    );
    expect(visible).toBeGreaterThan(0);
    expect(visible).toBeLessThan(65);
  });

  test('filtr Podkarpacia odsłania filtr miesięcy', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.page--card');

    await page.click('#nav-search');
    await expect(page.locator('#month-filter')).toBeHidden();

    await page.click('.filter-btn[data-category="Top Podkarpacia"]');
    await expect(page.locator('#month-filter')).toBeVisible();
  });

  test('klasy CSS kategorii renderowane przez getCategoryClass', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.cat-tag');

    // getCategoryClass: Ogród→g, Najliczniejsze→b, Najpowszechniejsze→o
    expect(await page.locator('.cat-tag.g').count()).toBeGreaterThan(0);
    expect(await page.locator('.cat-tag.b').count()).toBeGreaterThan(0);
    expect(await page.locator('.cat-tag.o').count()).toBeGreaterThan(0);
  });

  test('tekst statusu Czerwonej Księgi renderowany przez getStatusText', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.page--card');

    // getStatusText('LC') → 'gatunek najmniejszej troski'
    const lcCount = await page.locator('.rbadge').filter({ hasText: 'gatunek najmniejszej troski' }).count();
    expect(lcCount).toBeGreaterThan(0);
  });

  test('zdjęcia mają zdefiniowaną obsługę błędu ładowania', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.page--card');

    // Every rendered img should have onerror set (removed only after it fires)
    const withOnerror = await page.locator('#book-cards img[onerror]').count();
    expect(withOnerror).toBe(65);
  });

});
