import { test as base } from '@playwright/test'

/**
 * Most tests are about content, not the opening sequence, so they start as a
 * repeat visit. Tests of the sequence itself use `firstVisit` from Playwright.
 */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem('intro-seen', '1')
      } catch {}
    })
    await provide(page)
  },
})

export { test as firstVisit } from '@playwright/test'
export { expect } from '@playwright/test'
