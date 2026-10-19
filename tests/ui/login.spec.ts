import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test('standard user can log in and see the product catalog', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  // Public demo credentials displayed on the SauceDemo login page.
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
});

test('user cannot log in with an incorrect password', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'incorrect_password');

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toHaveText(
    'Epic sadface: Username and password do not match any user in this service',
  );
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(loginPage.loginButton).toBeVisible();
});

test('locked out user cannot log in with the correct password', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('locked_out_user', 'secret_sauce');

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toHaveText(
    'Epic sadface: Sorry, this user has been locked out.',
  );
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(loginPage.loginButton).toBeVisible();
});
