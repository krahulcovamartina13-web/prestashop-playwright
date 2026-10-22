import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CUSTOMER, PRODUCT, uniqueEmail } from '../utils/testData';

test.describe('Objednávka', () => {
  test('dokončení objednávky jako host (end-to-end)', async ({ page }) => {
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const email = uniqueEmail('pw.guest');

    await test.step('Přidat produkt do košíku a přejít do pokladny', async () => {
      await product.open(PRODUCT.path);
      await product.addToCart(1);
      await product.proceedToCheckoutFromModal();
      await cart.checkoutButton.click();
      await expect(page).toHaveURL(/objednavka/);
    });

    await test.step('1. Osobní údaje (host)', async () => {
      await checkout.fillGuestPersonalInfo({
        firstName: CUSTOMER.firstName,
        lastName: CUSTOMER.lastName,
        email,
      });
    });

    await test.step('2. Adresa', async () => {
      await checkout.fillAddress(CUSTOMER);
    });

    await test.step('3. Způsob přepravy', async () => {
      await checkout.chooseDelivery('Click and collect');
    });

    await test.step('4. Platba a odeslání objednávky', async () => {
      await checkout.payAndPlaceOrder('Zaplatit bankovním převodem');
    });

    await test.step('Ověřit potvrzení objednávky', async () => {
      await expect(page).toHaveURL(/potvrzeni-objednavky|order-confirmation/);
      const confirmation = page.locator('#content-hook_order_confirmation');
      await expect(confirmation).toContainText(/objednávka je potvrzena/i);
      await expect(confirmation).toContainText(email);
      await expect(page.locator('#order-items')).toContainText(PRODUCT.name);
      await expect(page.locator('#order-details')).toContainText(/Kód objednávky: \w+/);
    });
  });
});
