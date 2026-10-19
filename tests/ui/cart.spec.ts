import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';

test('user can add a backpack to the cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const productName = 'Sauce Labs Backpack';

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addProductToCart(productName);

  await expect(inventoryPage.cartBadge).toHaveText('1');

  await inventoryPage.openCart();

  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(cartPage.items).toHaveCount(1);
  await expect(cartPage.productName(productName)).toBeVisible();
  await expect(cartPage.productQuantity(productName)).toHaveText('1');
});

test('user can remove the only product from the cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const productName = 'Sauce Labs Backpack';

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addProductToCart(productName);
  await inventoryPage.openCart();

  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(cartPage.productName(productName)).toBeVisible();
  await expect(cartPage.cartBadge).toHaveText('1');

  await cartPage.removeProduct(productName);

  await expect(cartPage.items).toHaveCount(0);
  await expect(cartPage.cartBadge).toHaveCount(0);
});
