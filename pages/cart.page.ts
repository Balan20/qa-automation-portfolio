import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.items = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  productName(productName: string) {
    return this.items.locator('[data-test="inventory-item-name"]').getByText(productName, { exact: true });
  }

  productQuantity(productName: string) {
    return this.items.filter({
      has: this.page.getByText(productName, { exact: true }),
    }).locator('[data-test="item-quantity"]');
  }

  async removeProduct(productName: string) {
    const product = this.items.filter({
      has: this.page.getByText(productName, { exact: true }),
    });
    await product.getByRole('button', { name: 'Remove', exact: true }).click();
  }

  async checkout() {
    await this.page.getByRole('button', { name: 'Checkout', exact: true }).click();
  }
}
