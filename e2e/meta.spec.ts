import { expectNoA11yViolations } from './a11y'
import { expect, test } from './fixtures'

test.describe('metadata and discovery', () => {
  test('pages carry titles, descriptions and Open Graph images', async ({ page }) => {
    await page.goto('/work/ledgerline')
    await expect(page).toHaveTitle(/Ledgerline/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /cash-flow/)
    const og = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(og).toContain('/work/ledgerline/opengraph-image')
    const image = await page.request.get(new URL(og!).pathname)
    expect(image.headers()['content-type']).toBe('image/png')
  })

  test('sitemap lists every page and case study; robots points to it', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    for (const path of ['/work', '/contact', '/work/tidewater-clinics', '/work/ridgeway-fitness']) {
      expect(sitemap).toContain(path)
    }
    expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:')
  })
})

test.describe('not found', () => {
  test('unknown pages get the designed 404 with a way back', async ({ page }) => {
    const response = await page.goto('/no-such-page')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1, name: /different route/ })).toBeVisible()
    await page.getByRole('link', { name: 'Back to home' }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('has no detectable a11y violations', async ({ page }) => {
    await page.goto('/no-such-page')
    await expectNoA11yViolations(page)
  })
})
