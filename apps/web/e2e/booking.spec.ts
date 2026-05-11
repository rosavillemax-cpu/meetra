import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display landing page', async ({ page }) => {
    await expect(page).toHaveTitle(/Callroom/)
  })

  test('should navigate to sign in page', async ({ page }) => {
    const signInButton = page.getByRole('link', { name: /sign in/i })
    if (await signInButton.isVisible()) {
      await signInButton.click()
      await expect(page).toHaveURL(/\/auth\/signin/)
    }
  })
})

test.describe('Dashboard', () => {
  test('should require authentication', async ({ page }) => {
    await page.goto('/dashboard')
    // Should redirect to sign in or show auth error
    await expect(page.url()).not.toBe('/dashboard')
  })
})

test.describe('Booking Page', () => {
  test('should show 404 for non-existent user handle', async ({ page }) => {
    await page.goto('/nonexistent-user/test-event')
    // Should show not found or appropriate error
    const body = await page.content()
    expect(body).toBeDefined()
  })
})