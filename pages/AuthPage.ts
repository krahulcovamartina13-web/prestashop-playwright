import { expect, type Locator, type Page } from '@playwright/test';

export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

/** Formulář osobních údajů – sdílený registrací i 1. krokem pokladny. */
export async function fillCustomerForm(form: Locator, data: PersonalData) {
  await form.locator('input[name="id_gender"][value="2"]').check();
  await form.locator('input[name="firstname"]').fill(data.firstName);
  await form.locator('input[name="lastname"]').fill(data.lastName);
  await form.locator('input[name="email"]').fill(data.email);
  if (data.password) await form.locator('input[name="password"]').fill(data.password);
  await form.locator('input[name="psgdpr"]').check();
  await form.locator('input[name="customer_privacy"]').check();
}

export class AuthPage {
  readonly userInfo: Locator;
  readonly signInLink: Locator;
  readonly logoutLink: Locator;
  readonly accountName: Locator;

  constructor(private readonly page: Page) {
    this.userInfo = page.locator('#_desktop_user_info');
    this.signInLink = this.userInfo.getByRole('link', { name: /přihlásit se/i });
    this.logoutLink = this.userInfo.getByRole('link', { name: /odhlásit/i });
    this.accountName = this.userInfo.locator('a.account');
  }

  async register(data: Required<PersonalData>) {
    await this.page.goto('registrace');
    const form = this.page.locator('#customer-form');
    await fillCustomerForm(form, data);
    await form.getByRole('button', { name: /uložit/i }).click();
  }

  async login(email: string, password: string) {
    await this.page.goto('');
    await this.signInLink.click();
    const form = this.page.locator('#login-form');
    await form.locator('input[name="email"]').fill(email);
    await form.locator('input[name="password"]').fill(password);
    await form.getByRole('button', { name: /přihlásit se/i }).click();
  }

  async logout() {
    await this.logoutLink.click();
    await expect(this.signInLink).toBeVisible();
  }

  async expectLoggedInAs(fullName: string) {
    await expect(this.logoutLink).toBeVisible();
    await expect(this.accountName).toContainText(fullName);
  }
}
