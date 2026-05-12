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
    await expect(page.url()).not.toBe('/dashboard')
  })
})

test.describe('Booking Page', () => {
  test('should show 404 for non-existent user handle', async ({ page }) => {
    await page.goto('/nonexistent-user/test-event')
    await expect(page.getByText(/404|not found|page not found/i)).toBeVisible()
  })

  test('should display not-found page with homepage link', async ({ page }) => {
    await page.goto('/nonexistent')
    await expect(page.getByRole('link', { name: /go to homepage/i })).toBeVisible()
  })
})

test.describe('Booking Creation', () => {
  test.skip('should create a booking end-to-end', async ({ page }) => {
    // This test requires a pre-existing user with event types
    // It serves as a template for actual booking flow testing
    // TODO: Set up test fixtures with authenticated user and event types
  })

  test.skip('should cancel a booking with cancel token', async ({ page }) => {
    // This test requires a pre-created booking with a cancel token
    // It serves as a template for cancel flow testing
    // TODO: Set up test fixtures
  })
})
