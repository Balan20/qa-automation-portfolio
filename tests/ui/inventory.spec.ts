import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

for (const direction of ['ascending', 'descending'] as const) {
  test(`user can sort all products by price in ${direction} order`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(inventoryPage.productPrices).toHaveCount(6);

    // Preserve the original price list to check both ordering and product count.
    const originalPrices = await inventoryPage.productPrices.allTextContents();
    const expectedPrices = [...originalPrices].sort((a, b) => {
      const difference = Number(a.replace('$', '')) - Number(b.replace('$', ''));
      return direction === 'ascending' ? difference : -difference;
    });

    await inventoryPage.sortByPrice(direction);

    await expect(inventoryPage.productPrices).toHaveText(expectedPrices);
  });
}
