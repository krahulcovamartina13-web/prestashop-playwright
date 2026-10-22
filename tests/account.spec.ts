import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { CUSTOMER, uniqueEmail } from '../utils/testData';

test.describe('Zákaznický účet', () => {
  test('registrace nového zákazníka, odhlášení a opětovné přihlášení', async ({ page }) => {
    const auth = new AuthPage(page);
    const user = {
      firstName: CUSTOMER.firstName,
      lastName: CUSTOMER.lastName,
      email: uniqueEmail('pw.reg'),
      password: CUSTOMER.password,
    };
    const fullName = `${user.firstName} ${user.lastName}`;

    await test.step('Registrace', async () => {
      await auth.register(user);
      await auth.expectLoggedInAs(fullName);
    });

    await test.step('Odhlášení', async () => {
      await auth.logout();
    });

    await test.step('Přihlášení vytvořeným účtem', async () => {
      await auth.login(user.email, user.password);
      await auth.expectLoggedInAs(fullName);
    });
  });

  test('přihlášení se špatným heslem zobrazí chybu', async ({ page }) => {
    const auth = new AuthPage(page);

    await auth.login(uniqueEmail('pw.nonexistent'), 'SpatneHeslo123!');

    await expect(page.locator('#content .alert-danger')).toContainText('Ověření se nezdařilo');
    await expect(auth.signInLink).toBeVisible();
    await expect(auth.logoutLink).toHaveCount(0);
  });
});
