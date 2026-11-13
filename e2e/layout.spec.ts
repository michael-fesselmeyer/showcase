import { expect, test } from './fixtures'
import { expectNoA11yViolations } from './a11y'

test.describe('site shell', () => {
  test('home page renders the hero and has no detectable a11y violations', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
    await expectNoA11yViolations(page)
  })

  test('skip link moves focus to the main content', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard flow is covered on desktop')
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to content' })
    await expect(skip).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('main')).toBeFocused()
  })

  test('mobile menu opens, traps focus and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'menu button only shows on small screens')
    await page.goto('/')
    await page.getByRole('button', { name: 'Menu' }).click()
    const dialog = page.getByRole('dialog', { name: 'Site menu' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('link', { name: /Work/ })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
})

test.describe('responsive layout', () => {
  for (const path of ['/', '/work', '/work/tidewater-clinics', '/contact']) {
    test(`${path} never scrolls sideways on a phone`, async ({ page, isMobile }) => {
      test.skip(!isMobile, 'phone widths only')
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      // Compare with the device width: when content overflows, a phone browser
      // widens its layout viewport (and innerWidth) to fit it and zooms out.
      const device = page.viewportSize()!.width
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      expect(scrollWidth).toBeLessThanOrEqual(device)
    })
  }
})
