import { expectNoA11yViolations } from './a11y'
import { expect, test } from './fixtures'

test.describe('work index', () => {
  test('lists every project as a card linking to its case study', async ({ page }) => {
    await page.goto('/work')
    await expect(page.getByRole('heading', { level: 1, name: /Selected work/ })).toBeVisible()
    const cards = page.locator('main article')
    await expect(cards).toHaveCount(6)
    await expect(cards.first().getByText('Sample project')).toBeVisible()
    await expectNoA11yViolations(page)
  })

  test('opening a card shows its case study', async ({ page }) => {
    await page.goto('/work')
    await page.getByRole('link', { name: /Ledgerline/ }).click()
    await expect(page).toHaveURL(/\/work\/ledgerline$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Ledgerline' })).toBeVisible()
  })
})

test.describe('case study', () => {
  test('shows the sample notice, results and sections', async ({ page }) => {
    await page.goto('/work/tidewater-clinics')
    await expect(page.getByRole('heading', { level: 1, name: 'Tidewater Clinics' })).toBeVisible()
    await expect(page.getByText(/Sample project\./)).toBeVisible()
    await expect(page.getByRole('region', { name: 'Results' })).toBeVisible()
    for (const name of ['The problem', 'What was built', 'Highlights', 'Stack', 'Links']) {
      await expect(page.getByRole('heading', { name: new RegExp(name) })).toBeVisible()
    }
    await expectNoA11yViolations(page)
  })

  test('links to the next project', async ({ page }) => {
    await page.goto('/work/tidewater-clinics')
    await page.getByRole('navigation', { name: 'Next project' }).getByRole('link').click()
    await expect(page).toHaveURL(/\/work\/fernhill-coffee$/)
  })

  test('unknown projects return a 404', async ({ page }) => {
    const response = await page.goto('/work/not-a-project')
    expect(response?.status()).toBe(404)
  })
})

test.describe('featured gallery', () => {
  test('pins and slides sideways with scroll on larger screens', async ({ page, isMobile }) => {
    test.skip(isMobile, 'phones get a native swipe row')
    await page.goto('/')
    const gallery = page.locator('[data-gallery]')
    const before = await gallery.evaluate((el) => getComputedStyle(el).transform)
    await page.locator('#selected-work').scrollIntoViewIfNeeded()
    await page.mouse.wheel(0, 1600)
    await expect
      .poll(() => gallery.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(before)
  })

  test('is a native scroll row on phones', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'larger screens pin the gallery')
    await page.goto('/')
    const gallery = page.locator('[data-gallery]')
    await expect(gallery).toHaveCSS('overflow-x', 'auto')
    const overflows = await gallery.evaluate((el) => el.scrollWidth > el.clientWidth)
    expect(overflows).toBe(true)
  })

  test('falls back to a native row with reduced motion', async ({ page, isMobile }) => {
    test.skip(isMobile, 'covered by the phone test')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const gallery = page.locator('[data-gallery]')
    await expect(gallery).toHaveCSS('overflow-x', 'auto')
  })
})
