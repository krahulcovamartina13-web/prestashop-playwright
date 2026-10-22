import { expect, type Locator, type Page } from '@playwright/test';
import { fillCustomerForm, type PersonalData } from './AuthPage';

export interface Address {
  address: string;
  postcode: string;
  city: string;
}

export class CheckoutPage {
  readonly personalStep: Locator;
  readonly addressStep: Locator;
  readonly deliveryStep: Locator;
  readonly paymentStep: Locator;

  constructor(private readonly page: Page) {
    this.personalStep = page.locator('#checkout-personal-information-step');
    this.addressStep = page.locator('#checkout-addresses-step');
    this.deliveryStep = page.locator('#checkout-delivery-step');
    this.paymentStep = page.locator('#checkout-payment-step');
  }

  async expectCurrent(step: Locator) {
    await expect(step).toHaveClass(/-current/);
  }

  async fillGuestPersonalInfo(data: PersonalData) {
    await this.expectCurrent(this.personalStep);
    await fillCustomerForm(this.personalStep.locator('#customer-form'), data);
    await this.personalStep.getByRole('button', { name: /pokračovat/i }).click();
    await expect(this.personalStep).toHaveClass(/-complete/);
  }

  async fillAddress(addr: Address) {
    await this.expectCurrent(this.addressStep);
    await this.addressStep.locator('input[name="address1"]').fill(addr.address);
    await this.addressStep.locator('input[name="postcode"]').fill(addr.postcode);
    await this.addressStep.locator('input[name="city"]').fill(addr.city);
    await this.addressStep.getByRole('button', { name: /pokračovat/i }).click();
    await expect(this.addressStep).toHaveClass(/-complete/);
  }

  async chooseDelivery(carrierName: string | RegExp) {
    await this.expectCurrent(this.deliveryStep);
    await this.deliveryStep.locator('.delivery-option', { hasText: carrierName }).locator('input[type="radio"]').check();
    await this.deliveryStep.getByRole('button', { name: /pokračovat/i }).click();
    await expect(this.deliveryStep).toHaveClass(/-complete/);
  }

  async payAndPlaceOrder(paymentLabel: string | RegExp) {
    await this.expectCurrent(this.paymentStep);
    await this.paymentStep.getByLabel(paymentLabel).check();
    const placeOrder = this.page.locator('#payment-confirmation button[type="submit"]');
    await expect(placeOrder).toBeDisabled();
    await this.paymentStep.locator('input[name="conditions_to_approve[terms-and-conditions]"]').check();
    await expect(placeOrder).toBeEnabled();
    await placeOrder.click();
  }
}
