import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly title: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly confirmation: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.itemTotal = page.getByText(/^Item total: \$/);
    this.tax = page.getByText(/^Tax: \$/);
    this.total = page.getByText(/^Total: \$/);
    this.confirmation = page.getByRole('heading', { name: 'Thank you for your order!', exact: true });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async enterCustomerDetails(firstName: string, lastName: string, postalCode: string) {
    await this.page.getByPlaceholder('First Name', { exact: true }).fill(firstName);
    await this.page.getByPlaceholder('Last Name', { exact: true }).fill(lastName);
    await this.page.getByPlaceholder('Zip/Postal Code', { exact: true }).fill(postalCode);
    await this.page.getByRole('button', { name: 'Continue', exact: true }).click();
  }

  async finish() {
    await this.page.getByRole('button', { name: 'Finish', exact: true }).click();
  }
}
