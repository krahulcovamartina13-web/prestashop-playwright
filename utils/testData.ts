export const PRODUCT = {
  name: 'Mug The best is yet to come',
  path: 'home-accessories/6-mug-the-best-is-yet-to-come.html',
};

export function uniqueEmail(prefix = 'pw'): string {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${prefix}.${Date.now()}.${rnd}@example.com`;
}

export const CUSTOMER = {
  firstName: 'Jana',
  lastName: 'Testova',
  password: 'Pw-Test.Heslo-2026!',
  address: 'Testovací 123',
  postcode: '110 00',
  city: 'Praha',
};
