/** Převede cenu ve formátu "1 234,50 Kč" na číslo 1234.5 */
export function parsePrice(text: string): number {
  const normalized = text
    .replace(/\s|\u00a0/g, '')
    .replace(/[^\d,.-]/g, '')
    .replace(',', '.');
  const value = Number.parseFloat(normalized);
  if (Number.isNaN(value)) throw new Error(`Nelze převést cenu: "${text}"`);
  return value;
}
