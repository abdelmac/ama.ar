import { mkdir, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const locales = ['fr', 'ar', 'de', 'en'] as const;
const paths = ['', 'products/', 'products/pain-alepin/', 'story/', 'professionals/', 'contact/', 'privacy/'];
const formEndpoint = 'https://formspree.io/**';

// An accidental submission must never reach the real contact service.
test.beforeEach(async ({ page }) => {
  await page.route(formEndpoint, route => route.abort());
});

for (const lang of locales) {
  test(`${lang}: translated pages, document direction and search metadata`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const tail of paths) {
      const response = await page.goto(`/${lang}/${tail}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('html')).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('header select')).toHaveValue(lang);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://amareine.com/${lang}/${tail}`);
      for (const alternate of locales) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${alternate}"]`)).toHaveAttribute('href', `https://amareine.com/${alternate}/${tail}`);
      }
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', `https://amareine.com/fr/${tail}`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S.{30}/);
    }
    expect(errors).toEqual([]);
  });
}

test('language selection preserves the product, query string and fragment', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('http://127.0.0.1:3000/fr/');
  await page.goto('/fr/products/pain-alepin/?ref=qa#main');
  for (const lang of ['ar', 'de', 'en', 'fr']) {
    // The server-rendered select is visible before React attaches its handler.
    // Next mounts the route announcer after hydration completes.
    await page.locator('next-route-announcer').waitFor({ state: 'attached' });
    await page.locator('header select').selectOption(lang);
    await expect(page).toHaveURL(`http://127.0.0.1:3000/${lang}/products/pain-alepin/?ref=qa#main`);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1')).toBeVisible();
  }
});

test('catalog filters, accent-insensitive search and empty-state reset', async ({ page }) => {
  await page.goto('/fr/products/');
  const cards = page.locator('.catalog-grid .product-card');
  const search = page.getByRole('searchbox', { name: 'Rechercher un produit' });
  await expect(cards).toHaveCount(6);
  await page.getByRole('button', { name: 'Les pains', exact: true }).click();
  await expect(cards).toHaveCount(3);
  await expect(cards.locator('h3')).toHaveText(['Pain alepin', 'Pain d’orge', 'Pain sandwich au sésame']);
  await page.getByRole('button', { name: 'Les douceurs', exact: true }).click();
  await expect(cards).toHaveCount(3);
  await search.fill('SESAME');
  await expect(cards).toHaveCount(2);
  await search.fill('aucun-produit-qa');
  await expect(cards).toHaveCount(0);
  await expect(page.locator('.empty-results')).toBeVisible();
  await page.getByRole('button', { name: 'Voir tous les produits', exact: true }).click();
  await expect(search).toHaveValue('');
  await expect(cards).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Tous les produits', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await cards.first().click();
  await expect(page).toHaveURL(/\/fr\/products\/pain-alepin\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pain alepin');
});

for (const lang of ['fr', 'ar'] as const) {
  test(`${lang}: mobile menu supports keyboard dismissal and pages fit the viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${lang}/`);
    const menu = page.locator('.menu-button');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#main-navigation')).toBeVisible();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();
    await menu.click();
    await page.locator('#main-navigation').getByRole('link').filter({ hasText: lang === 'fr' ? 'Nos produits' : 'منتجاتنا' }).click();
    await expect(page).toHaveURL(new RegExp(`/${lang}/products/$`));
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    for (const tail of paths) {
      await page.goto(`/${lang}/${tail}`);
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      }));
      expect(dimensions.content, `${lang}/${tail} overflows`).toBeLessThanOrEqual(dimensions.viewport + 1);
    }
  });
}

async function fillContact(page: Page) {
  await page.locator('input[name="Name"]').fill('Validation Amareine');
  await page.locator('input[name="Email"]').fill('qa@example.invalid');
  await page.locator('textarea[name="Message"]').fill('Validation locale du formulaire, sans aucun envoi réel.');
  await page.locator('input[name="consent"]').check();
}

test('contact requires valid fields and consent; mocked success resets the form', async ({ page }) => {
  const requests: string[] = [];
  await page.route(formEndpoint, async route => {
    requests.push(route.request().postData() ?? '');
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.goto('/fr/contact/?subject=partner&product=pain-alepin');
  const submit = page.locator('.contact-form button[type="submit"]');
  await submit.click();
  expect(await page.locator('.contact-form').evaluate((form: HTMLFormElement) => form.checkValidity())).toBe(false);
  expect(requests).toHaveLength(0);
  await fillContact(page);
  await page.locator('input[name="Email"]').fill('adresse-invalide');
  await submit.click();
  expect(requests).toHaveLength(0);
  await page.locator('input[name="Email"]').fill('qa@example.invalid');
  await page.locator('input[name="consent"]').uncheck();
  await submit.click();
  expect(requests).toHaveLength(0);
  await page.locator('input[name="consent"]').check();
  await submit.click();
  await expect(page.locator('.form-success')).toBeVisible();
  expect(requests).toHaveLength(1);
  expect(requests[0]).toContain('qa@example.invalid');
  expect(requests[0]).toContain('Devenir partenaire');
  expect(requests[0]).toContain('Pain alepin');
  expect(requests[0]).toMatch(/name="subject"\r\n\r\nAmareine\.com\r\n/);
  expect(requests[0].match(/name="subject"/g)).toHaveLength(1);
  expect(requests[0]).toMatch(/name="request_type"\r\n\r\n1\r\n/);
  await expect(page.locator('input[name="Name"]')).toHaveValue('');
  await expect(page.locator('textarea[name="Message"]')).toHaveValue('');
  await expect(page.locator('input[name="consent"]')).not.toBeChecked();
});

test('contact preserves the message on delivery failure and allows retry', async ({ page }) => {
  let attempts = 0;
  await page.route(formEndpoint, async route => {
    attempts += 1;
    await route.fulfill({ status: attempts === 1 ? 503 : 200, contentType: 'application/json', body: attempts === 1 ? '{"error":"unavailable"}' : '{"ok":true}' });
  });
  await page.goto('/ar/contact/');
  await fillContact(page);
  const message = await page.locator('textarea[name="Message"]').inputValue();
  await page.locator('.contact-form button[type="submit"]').click();
  await expect(page.locator('.contact-form').getByRole('alert')).toBeVisible();
  await expect(page.locator('textarea[name="Message"]')).toHaveValue(message);
  await expect(page.locator('.contact-form button[type="submit"]')).toBeEnabled();
  await page.locator('.contact-form button[type="submit"]').click();
  await expect(page.locator('.form-success')).toBeVisible();
  await expect(page.locator('.contact-form').getByRole('alert')).toHaveCount(0);
  expect(attempts).toBe(2);
});

for (const lang of ['fr', 'ar']) {
  for (const tail of ['', 'contact/']) {
    test(`${lang}/${tail}: automated accessibility checks`, async ({ page }) => {
      await page.goto(`/${lang}/${tail}`);
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations.map(violation => ({
        id: violation.id,
        nodes: violation.nodes.map(node => ({ target: node.target, reason: node.failureSummary })),
      }))).toEqual([]);
    });
  }
}

test('every exported locale page and its local links and images resolve', async ({ request }) => {
  const exportRoot = path.resolve('out');
  async function htmlFiles(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    const children = await Promise.all(entries.map(entry => entry.isDirectory()
      ? htmlFiles(path.join(directory, entry.name))
      : Promise.resolve(entry.name.endsWith('.html') ? [path.join(directory, entry.name)] : [])));
    return children.flat();
  }
  const files = (await htmlFiles(exportRoot)).filter(file => /[\\/](fr|ar|de|en)[\\/]/.test(file));
  expect(files.length).toBeGreaterThanOrEqual(48);
  const localUrls = new Set<string>();
  for (const file of files) {
    const route = `/${path.relative(exportRoot, file).split(path.sep).join('/').replace(/index\.html$/, '')}`;
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/<(?:a|img)\b[^>]*?\b(?:href|src)="([^"]+)"/g)) {
      const raw = match[1].replaceAll('&amp;', '&');
      const url = new URL(raw, `http://127.0.0.1:3000${route}`);
      if (url.origin === 'http://127.0.0.1:3000') localUrls.add(url.pathname);
    }
  }
  for (const url of localUrls) {
    const response = await request.head(url);
    expect(response.status(), `Broken local link or image: ${url}`).toBe(200);
  }
  const notFound = await request.get('/fr/page-qui-n-existe-pas/');
  expect(notFound.status()).toBe(404);
});

test('capture desktop, mobile and Arabic previews with loaded images', async ({ page }) => {
  await mkdir('.local', { recursive: true });
  for (const capture of [
    { lang: 'fr', width: 1440, height: 1000, file: 'desktop.png' },
    { lang: 'fr', width: 390, height: 844, file: 'mobile.png' },
    { lang: 'ar', width: 1440, height: 1000, file: 'arabic.png' },
  ]) {
    await page.setViewportSize({ width: capture.width, height: capture.height });
    await page.goto(`/${capture.lang}/`);
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
      await Promise.all([...document.images].map(img => img.decode()));
      await document.fonts.ready;
    });
    await page.screenshot({ path: `.local/${capture.file}`, fullPage: true, animations: 'disabled' });
  }
});
