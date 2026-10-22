import { expect, type Locator, type Page } from '@playwright/test';

export class ProductPage {
  readonly title: Locator;
  readonly price: Locator;
  readonly quantity: Locator;
  readonly addToCartButton: Locator;
  readonly cartModal: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('h1');
    this.price = page.locator('.product-prices .current-price [content]').first();
    this.quantity = page.locator('#quantity_wanted');
    this.addToCartButton = page.getByRole('button', { name: 'Přidat do košíku' });
    this.cartModal = page.locator('#blockcart-modal');
  }

  async open(path: string) {
    await this.page.goto(path);
    await expect(this.addToCartButton).toBeEnabled();
  }

  async addToCart(quantity = 1) {
    await this.quantity.fill(String(quantity));
    await this.addToCartButton.click();
    await expect(this.cartModal).toBeVisible();
  }

  async proceedToCheckoutFromModal() {
    await this.cartModal.getByRole('link', { name: /pokračovat do pokladny/i }).click();
    await this.page.waitForURL(/kosik/);
  }
}
