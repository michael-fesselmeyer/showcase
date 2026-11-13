import { expect, firstVisit, test } from './fixtures'

firstVisit.describe('opening sequence', () => {
  firstVisit('plays once on the first visit, then gets out of the way', async ({ page }) => {
    await page.goto('/')
    const intro = page.locator('.intro')
    await expect(intro).toBeVisible()
    await expect(intro).toBeHidden({ timeout: 3_000 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    await page.reload()
    await expect(page.locator('html')).not.toHaveAttribute('data-intro')
    await expect(intro).toBeHidden()
  })

  firstVisit('never plays with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('html')).not.toHaveAttribute('data-intro')
    await expect(page.locator('.intro')).toBeHidden()
  })
})

test.describe('pointer effects', () => {
  test('custom cursor appears only on fine pointers', async ({ page, isMobile }) => {
    await page.goto('/')
    await page.mouse.move(200, 200)
    const html = page.locator('html')
    if (isMobile) {
      await expect(html).not.toHaveClass(/has-custom-cursor/)
    } else {
      await expect(html).toHaveClass(/has-custom-cursor/)
    }
  })

  test('custom cursor stays off with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.mouse.move(200, 200)
    await expect(page.locator('html')).not.toHaveClass(/has-custom-cursor/)
  })
})
