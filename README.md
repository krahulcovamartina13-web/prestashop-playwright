# PrestaShop – automatizované E2E testy

Playwright + TypeScript testy pro demo e-shop [prestashop.tesena.com/cs](https://prestashop.tesena.com/cs/). Testy běží v Chromiu.

## Pokryté flow

| Spec | Scénář |
|---|---|
| `tests/cart.spec.ts` | Detail produktu → přidání 2 ks do košíku → kontrola modalu, ceny a součtu → změna množství na 3 → odebrání → prázdný košík |
| `tests/account.spec.ts` | Registrace nového zákazníka → odhlášení → přihlášení; negativní test: přihlášení se špatnými údaji |
| `tests/checkout.spec.ts` | E2E objednávka jako host: košík → osobní údaje → adresa → doprava → platba → potvrzení objednávky |

## Struktura

```
pages/      Page Objecty (ProductPage, CartPage, AuthPage, CheckoutPage)
tests/      Testy
utils/      Testovací data, pomocné funkce (parsování cen)
.github/workflows/playwright.yml   CI pipeline (GitHub Actions)
```

## Spuštění

```bash
npm ci
npx playwright install chromium
npm test              # headless
npm run test:headed   # s viditelným prohlížečem
npm run test:ui       # Playwright UI mode
npm run report        # HTML report posledního běhu
npm run typecheck     # kontrola TypeScriptu
```

Jiné prostředí: `BASE_URL=https://jina-instance/cs/ npm test`

## CI

GitHub Actions (`.github/workflows/playwright.yml`) se spouští při pushi a PR do `main`, každý všední den v 6:00 UTC a ručně (`workflow_dispatch`). HTML report (trace, screenshoty a video u selhaných testů) se ukládá jako artefakt `playwright-report`.

## Poznámky

- Každý test si generuje unikátní e-mail, takže testy jsou nezávislé a dají se pouštět paralelně i opakovaně.
- Checkout test na sdíleném demo prostředí opravdu vytvoří objednávku (platba bankovním převodem, osobní odběr).
- Vyhledávání na webu nevrací žádné výsledky (ani pro produkty, které existují, např. „mug“), proto ho testy nepokrývají. Vypadá to na chybu v prostředí, nejspíš chybí vyhledávací index.
