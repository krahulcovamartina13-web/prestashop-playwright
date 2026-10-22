import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { PRODUCT } from '../utils/testData';
import { parsePrice } from '../utils/price';

test.describe('Nákupní košík', () => {
  test('přidání produktu do košíku, změna množství a odebrání', async ({ page }) => {
    const product = new ProductPage(page);
    const cart = new CartPage(page);

    await test.step('Otevřít detail produktu', async () => {
      await product.open(PRODUCT.path);
      await expect(product.title).toHaveText(new RegExp(PRODUCT.name, 'i'));
    });

    const unitPrice = parsePrice((await product.price.textContent()) ?? '');

    await test.step('Přidat 2 ks do košíku a ověřit potvrzovací modal', async () => {
      await product.addToCart(2);
      await expect(product.cartModal).toContainText('Produkt byl úspěšně přidán do nákupního košíku');
      await expect(product.cartModal).toContainText(PRODUCT.name);
      await expect(product.cartModal).toContainText('Množství: 2');
      await product.proceedToCheckoutFromModal();
    });

    await test.step('Ověřit obsah a součet v košíku', async () => {
      await expect(cart.items).toHaveCount(1);
      await expect(cart.quantityInput(PRODUCT.name)).toHaveValue('2');
      expect(parsePrice(await cart.unitPrice(PRODUCT.name).innerText())).toBeCloseTo(unitPrice, 2);
      expect(parsePrice(await cart.lineTotal(PRODUCT.name).innerText())).toBeCloseTo(unitPrice * 2, 2);
      await expect(cart.headerCartCount).toHaveText('(2)');
    });

    await test.step('Změnit množství na 3 a ověřit přepočet', async () => {
      await cart.setQuantity(PRODUCT.name, 3);
      await expect(cart.headerCartCount).toHaveText('(3)');
      await expect
        .poll(async () => parsePrice(await cart.lineTotal(PRODUCT.name).innerText()))
        .toBeCloseTo(unitPrice * 3, 2);
      await expect(cart.productsCount).toHaveText(/^\s*3\s/); // "3 položek"
    });

    await test.step('Odebrat produkt – košík je prázdný', async () => {
      await cart.remove(PRODUCT.name);
      await expect(cart.emptyMessage).toContainText('Ve vašem košíku nejsou žádné další položky');
      await expect(cart.headerCartCount).toHaveText('(0)');
      await expect(cart.checkoutButton).toHaveCount(0);
    });
  });
});
