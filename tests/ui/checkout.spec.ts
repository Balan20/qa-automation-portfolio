import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';

test('user can complete a demo order for a backpack', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const productName = 'Sauce Labs Backpack';

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addProductToCart(productName);
  await inventoryPage.openCart();
  await expect(cartPage.productName(productName)).toBeVisible();
  await cartPage.checkout();

  await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  await checkoutPage.enterCustomerDetails('Test', 'Customer', '12345');

  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(checkoutPage.title).toHaveText('Checkout: Overview');
  await expect(cartPage.items).toHaveCount(1);
  await expect(cartPage.productName(productName)).toBeVisible();
  await expect(cartPage.productQuantity(productName)).toHaveText('1');
  await expect(checkoutPage.itemTotal).toHaveText('Item total: $29.99');
  await expect(checkoutPage.tax).toHaveText('Tax: $2.40');
  await expect(checkoutPage.total).toHaveText('Total: $32.39');
  await checkoutPage.finish();

  await expect(page).toHaveURL(/\/checkout-complete\.html$/);
  await expect(checkoutPage.confirmation).toBeVisible();
  await expect(cartPage.cartBadge).toHaveCount(0);
});

const requiredFieldCases = [
  {
    missingField: 'first name',
    firstName: '',
    lastName: 'Customer',
    postalCode: '12345',
    error: 'Error: First Name is required',
  },
  {
    missingField: 'last name',
    firstName: 'Test',
    lastName: '',
    postalCode: '12345',
    error: 'Error: Last Name is required',
  },
  {
    missingField: 'postal code',
    firstName: 'Test',
    lastName: 'Customer',
    postalCode: '',
    error: 'Error: Postal Code is required',
  },
];

for (const scenario of requiredFieldCases) {
  test(`checkout cannot continue without ${scenario.missingField}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');

    await checkoutPage.enterCustomerDetails(
      scenario.firstName, scenario.lastName, scenario.postalCode,
    );

    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toHaveText(scenario.error);
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  });
}
