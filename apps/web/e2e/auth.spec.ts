import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should redirect unauthenticated users to sign in', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.url()).toMatch(/\/auth\/signin/)
  })

  test('should show landing page for unauthenticated users', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Callroom/)
    await expect(page.getByText(/stop negotiating/i)).toBeVisible()
  })

  test('should redirect to sign in page from auth-protected routes', async ({ page }) => {
    const protectedRoutes = ['/dashboard', '/dashboard/event-types', '/dashboard/availability']
    for (const route of protectedRoutes) {
      await page.goto(route)
      await expect(page.url()).toMatch(/\/auth\/signin/)
    }
  })
})
