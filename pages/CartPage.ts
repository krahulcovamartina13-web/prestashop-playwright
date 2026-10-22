import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly productsCount: Locator;
  readonly total: Locator;
  readonly emptyMessage: Locator;
  readonly headerCartCount: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.locator('.cart-item');
    this.productsCount = page.locator('.js-subtotal');
    this.total = page.locator('.cart-summary-totals .cart-total .value');
    this.emptyMessage = page.locator('.no-items');
    this.headerCartCount = page.locator('#_desktop_cart .cart-products-count');
    this.checkoutButton = page.locator('.cart-detailed-actions').getByRole('link', { name: /pokračovat do pokladny/i });
  }

  async open() {
    await this.page.goto('kosik?action=show');
  }

  item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  quantityInput(productName: string): Locator {
    return this.item(productName).locator('input.js-cart-line-product-quantity');
  }

  unitPrice(productName: string): Locator {
    return this.item(productName).locator('.product-line-info .current-price .price');
  }

  lineTotal(productName: string): Locator {
    return this.item(productName).locator('.product-price strong');
  }

  async setQuantity(productName: string, quantity: number) {
    const input = this.quantityInput(productName);
    const updated = this.page.waitForResponse(
      (r) => r.url().includes('kosik') && r.request().method() === 'POST',
    );
    await input.fill(String(quantity));
    await input.press('Enter');
    await updated;
    await expect(input).toHaveValue(String(quantity));
  }

  async remove(productName: string) {
    await this.item(productName).locator('.remove-from-cart').click();
    await expect(this.item(productName)).toHaveCount(0);
  }
}
