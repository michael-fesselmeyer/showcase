import type { Page } from '@playwright/test'
import { expectNoA11yViolations } from './a11y'
import { expect, test } from './fixtures'

/** Opens the contact page and waits until the form has hydrated. */
async function openForm(page: Page) {
  await page.goto('/contact')
  await expect
    .poll(() => page.locator('form').evaluate((f: HTMLFormElement) => f.noValidate))
    .toBe(true)
}

async function fillValidEnquiry(page: Page) {
  await page.getByLabel('Your name').fill('Avery Example')
  await page.getByLabel('Email').fill('avery@example.test')
  await page.getByText('Web app', { exact: true }).click()
  await page.getByText('$25k–50k', { exact: true }).click()
  await page.getByText('1–3 months', { exact: true }).click()
  await page
    .getByLabel('Project details')
    .fill('We need a booking portal for our clinics with online payments.')
}

test.describe('enquiry form', () => {
  test('shows field errors and focuses the first one', async ({ page }) => {
    await openForm(page)
    await page.getByRole('button', { name: 'Send enquiry' }).click()
    await expect(page.locator('#form-summary')).toHaveText('Please check the 6 highlighted fields.')
    await expect(page.getByLabel('Your name')).toBeFocused()
    await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Please choose a budget range.')).toBeVisible()
    await expectNoA11yViolations(page)
  })

  test('keeps what was typed when something is wrong', async ({ page }) => {
    await openForm(page)
    await page.getByLabel('Your name').fill('Avery Example')
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByRole('button', { name: 'Send enquiry' }).click()
    await expect(page.getByLabel('Email')).toBeFocused()
    await expect(page.getByLabel('Your name')).toHaveValue('Avery Example')
    await expect(page.getByLabel('Email')).toHaveValue('not-an-email')
  })

  test('confirms a valid enquiry', async ({ page }) => {
    await openForm(page)
    await fillValidEnquiry(page)
    // Wind the time-to-submit clock back so the test is not mistaken for a bot.
    await page
      .locator('input[name="startedAt"]')
      .evaluate((el: HTMLInputElement) => (el.value = String(Date.now() - 30_000)))
    await page.getByRole('button', { name: 'Send enquiry' }).click()
    const heading = page.getByRole('heading', { name: /Your enquiry is in/ })
    await expect(heading).toBeVisible()
    await expect(heading).toBeFocused()
  })

  test('hides the booking link while it is switched off', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByText('Prefer to talk?')).toHaveCount(0)
    await expectNoA11yViolations(page)
  })

  test('home call to action leads to the form', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('region', { name: 'Have something in mind?' }).getByRole('link').click()
    await expect(page).toHaveURL(/\/contact$/)
  })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('the enquiry form still submits', async ({ page }) => {
    await page.goto('/contact')
    await fillValidEnquiry(page)
    await page.getByRole('button', { name: 'Send enquiry' }).click()
    await expect(page.getByRole('heading', { name: /Your enquiry is in/ })).toBeVisible()
  })
})
