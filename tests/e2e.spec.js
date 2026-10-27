// @ts-check
const { test, expect } = require('@playwright/test');

// Derive expected species count from the data so adding a species doesn't break e2e.
const SPECIES_COUNT = require('../ptaki-przewodnik/data/ptaki.json').ptaki.length;

test.describe('Przewodnik Ptaków Polski – testy e2e', () => {

  test('strona ładuje się i renderuje wszystkie karty gatunków', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.page--card', { timeout: 15000 });
    const count = await page.locator('.page--card').count();
    expect(count).toBe(SPECIES_COUNT);
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
    expect(visible).toBeLessThan(SPECIES_COUNT);
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
    expect(visible).toBeLessThan(SPECIES_COUNT);
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
    expect(withOnerror).toBe(SPECIES_COUNT);
  });

  test('każda karta ma atrybucję zdjęcia zaczynającą się od "Fot. "', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.page--card');

    const credits = await page.locator('.photo-credit').allTextContents();
    expect(credits.length).toBe(SPECIES_COUNT);
    for (const credit of credits) {
      expect(credit, `Atrybucja "${credit}" powinna zaczynać się od "Fot. "`).toMatch(/^Fot\. /);
    }
  });

  test('karta z film.zrodlo pokazuje źródło w .yt-label zamiast "Leśny Budzik"', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.page--card');

    // Find a bird that has film.zrodlo set
    const data = require('../ptaki-przewodnik/data/ptaki.json');
    const birdWithZrodlo = data.ptaki.find(p => p.film && p.film.zrodlo);
    expect(birdWithZrodlo).toBeDefined();

    // Navigate to the card by searching for the bird's name
    await page.click('#nav-search');
    await page.fill('#search-input', birdWithZrodlo.nazwa);
    await page.waitForTimeout(300);

    const ytLabel = await page.locator('.page--card:visible .yt-label').first().textContent();
    expect(ytLabel).toBe(birdWithZrodlo.film.zrodlo);
    expect(ytLabel).not.toContain('Leśny Budzik');
  });

});
