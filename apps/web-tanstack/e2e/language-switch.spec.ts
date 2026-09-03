// @ts-check
import { test, expect } from '@playwright/test'

test.setTimeout(180_000)

test('language switch: no reload, instant locale change', async ({ page }) => {
  await page.goto('http://localhost:3002/')
  // hydration indicator flips to interactive
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true', { timeout: 120_000 })

  // mark the window so we can prove no full reload happens
  await page.evaluate(() => { (window as unknown as { __noReload: boolean }).__noReload = true })

  const trigger = page.locator('header button[aria-label="Select language"]')
  await expect(trigger).toBeEnabled()
  await trigger.click()
  await page.getByRole('button', { name: 'Français' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr', { timeout: 30_000 })
  const cookie = await page.context().cookies('http://localhost:3002')
  expect(cookie.find((c) => c.name === 'locale')?.value).toBe('fr')

  // switch back to English without reload
  await trigger.click()
  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en', { timeout: 30_000 })

  const noReload = await page.evaluate(() => (window as unknown as { __noReload?: boolean }).__noReload)
  expect(noReload).toBe(true)
})
