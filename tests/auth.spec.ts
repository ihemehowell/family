import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should show forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByRole('heading', { name: 'Forgot Password?' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
  });

  test('should show register page with invite', async ({ page }) => {
    await page.goto('/register?invite=test-token');
    await expect(page.getByText('Not Authorized')).toBeVisible();
  });

  test('should navigate to register from login', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL(/register/);
  });
});