import { expectNoA11yViolations } from './a11y'
import { expect, test } from './fixtures'

test.describe('skills constellation', () => {
  test('lights connections on focus and opens case studies', async ({ page, isMobile }) => {
    test.skip(isMobile, 'phones get the list')
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    const map = page.getByRole('group', { name: /Stack map/ })
    await map.scrollIntoViewIfNeeded()
    await expect(map).toBeVisible()

    const postgres = map.getByRole('button', { name: /^PostgreSQL: used in/ })
    await postgres.focus()
    await expect(map.getByRole('link', { name: 'Ledgerline' })).toHaveClass(/bg-paper/)
    await expect(map.getByRole('link', { name: 'Kiteboard' })).toHaveClass(/opacity-25/)

    await postgres.press('Enter')
    await expect(postgres).toHaveAttribute('aria-pressed', 'true')

    await map.getByRole('link', { name: 'Kiteboard' }).click()
    await expect(page).toHaveURL(/\/work\/kiteboard$/)
  })

  test('can switch to the list view', async ({ page, isMobile }) => {
    test.skip(isMobile, 'phones only have the list')
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Show as list' }).click()
    await expect(page.getByRole('group', { name: /Stack map/ })).toBeHidden()
    await expect(page.getByRole('heading', { name: 'Payments', level: 3 })).toBeVisible()
  })

  test('is a grouped list on phones', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'desktop shows the map')
    await page.goto('/')
    await expect(page.getByRole('group', { name: /Stack map/ })).toBeHidden()
    await expect(page.getByRole('heading', { name: 'Front end', level: 3 })).toBeVisible()
  })

  test('is a grouped list with reduced motion', async ({ page, isMobile }) => {
    test.skip(isMobile, 'covered by the phone test')
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.getByRole('group', { name: /Stack map/ })).toBeHidden()
    await expect(page.getByRole('heading', { name: 'Testing', level: 3 })).toBeVisible()
  })
})

test.describe('marquee', () => {
  test('exposes each band once to assistive tech', async ({ page }) => {
    await page.goto('/')
    const region = page.getByRole('region', { name: 'Services and stack' })
    await expect(region.getByRole('listitem').filter({ hasText: 'Web apps' })).toHaveCount(1)
  })

  test('moves, and holds still with reduced motion', async ({ page, isMobile }) => {
    test.skip(isMobile, 'same code path on every size')
    await page.goto('/')
    const region = page.getByRole('region', { name: 'Services and stack' })
    const row = region.locator('[data-marquee-row]').first()
    await region.scrollIntoViewIfNeeded()
    const first = await row.evaluate((el) => getComputedStyle(el).transform)
    await expect.poll(() => row.evaluate((el) => getComputedStyle(el).transform)).not.toBe(first)

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    await region.scrollIntoViewIfNeeded()
    await expect(row).toHaveCSS('transform', 'none')
  })
})

test('home page sections have no detectable a11y violations', async ({ page }) => {
  await page.goto('/')
  for (const id of ['#process', '#about']) {
    await expect(page.locator(id)).toBeAttached()
  }
  await expectNoA11yViolations(page)
})
