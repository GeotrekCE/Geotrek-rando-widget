import { test } from '@stencil/playwright';
import { expect } from '@playwright/test';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe('grw-app', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const harPath = join(__dirname, '../../../../hars', `grw-app-${testInfo.title.replace(/\s+/g, '-')}.har`);

    await page.routeFromHAR(harPath, {
      url: '**/api/v2/**',
      update: false,
      updateContent: "embed"
    });
    await page.goto('/components/grw-app/test/grw-app.e2e.html');
  });

  test('search', async ({ page }) => {
    const searchInput = await page.getByPlaceholder('Rechercher');
    const numberOfRoutesDiv = await page.locator('grw-treks-list').locator('div', { hasText: 'itinéraire' });
    await searchInput.fill('abcdef');
    await expect(numberOfRoutesDiv).toHaveText('0 itinéraire');
    await searchInput.fill('boucle de');
    await expect(numberOfRoutesDiv).toHaveText('2 itinéraires');
    await searchInput.fill('');
    await expect(numberOfRoutesDiv).toHaveText('24 itinéraires');
  });

  test('filter', async ({ page }) => {
    await page.getByRole('button', { name: 'Filtrer' }).click();
    await page.getByRole('button', { name: 'VTT' }).click();
    await expect(page.locator('grw-filters')).toContainText('1 itinéraire');
    await expect(page.locator('grw-filters')).toContainText('Itinéraires (1)');
    await page.getByRole('button', { name: 'VALIDER' }).click();
    await expect(page.locator('grw-common-button')).toContainText('Filtrer (1)');
    await expect(page.locator('grw-treks-list')).toContainText('1 itinéraire');
    await page.getByRole('button', { name: 'Filtrer (1)' }).click();
    await page.getByRole('button', { name: 'EFFACER' }).click();
    await expect(page.locator('grw-filters')).toContainText('24 itinéraires');
    await expect(page.locator('grw-filters')).toContainText('Itinéraires');
    await page.getByRole('button', { name: 'VALIDER' }).click();
    await expect(page.locator('grw-common-button')).toContainText('Filtrer');
    await expect(page.locator('grw-treks-list')).toContainText('24 itinéraires');
  });

  test('trek', async ({ page }) => {
    await expect(page.getByText('itinéraires')).toBeVisible();
    await page.getByText('Boucle de Pouzol').click();
    await expect(page.locator('.swiper-slide > .trek-img').first()).toBeVisible();
    await page.locator('.swiper-button-next').first().click();
    await expect(page.locator('div:nth-child(2) > .trek-img')).toBeVisible();
    await page.locator('.swiper-button-prev').first().click();
    await expect(page.locator('.swiper-slide > .trek-img').first()).toBeVisible();
    await expect(page.locator('.overlay')).toBeVisible();
    await page.getByRole('button', { name: 'Cacher le dénivelé' }).click();
    await expect(page.locator('.overlay')).toBeHidden();
    await page.locator('a').filter({ hasText: 'Description' }).click();
    await expect(page.locator('div').filter({ hasText: /^Description$/ })).toBeVisible();
    await page.locator('button').first().click();
    await expect(page.getByText('itinéraires')).toBeVisible();
  });

  test('steps', async ({ page }) => {
    await page.getByText('Boucle de Pouzol').click();
    await expect(page.locator('.swiper-slide > .trek-img').first()).toBeVisible();
    await expect(page.locator('grw-loader')).toBeHidden();
    await page.getByText('Etape GR09 Étang Rond-Refuge').click();
    await expect(page.getByText('Etape GR09 Étang Rond-Refuge').first()).toBeVisible({ timeout: 10000 });
  });

  test('touristic content', async ({ page }) => {
    await page.getByText('Boucle du Pic de Ruhle').click();
    await expect(page.locator('.swiper-slide > .trek-img').first()).toBeVisible();
    await expect(page.locator('grw-loader')).toBeHidden();
    await page.locator('grw-touristic-content-card').filter({ hasText: 'Bureau des' }).getByRole('button').click();
    await expect(page.getByText("Bureau des guides d'Ariège")).toBeVisible({ timeout: 10000 });
  });

  test('touristic event', async ({ page }) => {
    await page.getByPlaceholder('Rechercher').click();
    await page.getByPlaceholder('Rechercher').fill('vallée');
    await page.getByText('Itinérance de la vallée de').first().click();
    await expect(page.locator('.swiper-slide > .trek-img').first()).toBeVisible();
    await expect(page.locator('grw-loader')).toBeHidden();
    await page.getByText('De Bethmale au col de la Core').click();
    await expect(page.getByText("De Bethmale au col de la Core").first()).toBeVisible({ timeout: 10000 });
  });
});
