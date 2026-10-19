import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly cartBadge: Locator;
  readonly productPrices: Locator;
  private readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async addProductToCart(productName: string) {
    const product = this.page.locator('[data-test="inventory-item"]').filter({
      has: this.page.getByText(productName, { exact: true }),
    });
    await product.getByRole('button', { name: 'Add to cart', exact: true }).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async sortByPrice(direction: 'ascending' | 'descending') {
    await this.page.locator('[data-test="product-sort-container"]').selectOption({
      label: direction === 'ascending' ? 'Price (low to high)' : 'Price (high to low)',
    });
  }
}
