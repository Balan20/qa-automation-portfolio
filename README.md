# QA Automation Portfolio

A QA automation portfolio demonstrating browser and HTTP API testing with
Playwright and TypeScript. The suite covers an e-commerce shopping journey,
negative validation, and REST API responses using public demo applications.

## At a glance

| Area | Coverage |
| --- | --- |
| UI | 11 scenarios against SauceDemo, Chromium desktop |
| API | 3 scenarios against DummyJSON, without a browser |
| Environment | 1 independent local browser smoke test |
| Architecture | Page Object Model, isolated tests, data-driven cases |
| Reporting | HTML report, screenshots and traces on failure |
| CI | GitHub Actions workflow; first hosted run pending publication |

## Test coverage

| Feature | Scenarios |
| --- | --- |
| Login | Successful login; incorrect password; locked out account |
| Cart | Add a named product; remove the only product |
| Checkout | Complete a demo order; missing first name, last name, or postal code |
| Catalog | Sort all six prices ascending and descending |
| Product API | GET existing product; GET missing product; simulated POST creation |
| Setup | Fill a field on a local page |

## Design decisions

Page objects own locators and user actions; test files own expected results.
Every test receives a fresh browser context or request context from Playwright,
and shopping tests prepare their own state instead of relying on previous tests.
Required-field and sorting cases use parameterization with separate report entries.
Locator assertions wait for the expected UI state without fixed sleeps.

API tests use Playwright's `request` fixture in a separate project with its own
base URL. They check HTTP status codes and response data. These are focused field
assertions, not full JSON Schema validation.

## Current status

Eleven UI tests against [SauceDemo](https://www.saucedemo.com/) and one local environment smoke test.
Three API tests use [DummyJSON](https://dummyjson.com/docs/products), a separate demo
service, not SauceDemo's backend. They cover GET product (200 and response fields),
GET nonexistent product (404 and message), and POST product (201 and echoed data).
DummyJSON simulates creation without persisting the product, so the POST test does
not attempt to fetch or delete the returned ID.
The UI tests verify successful login, rejection of an incorrect password, and rejection
of a locked out user with the correct password. Negative scenarios check the error
message and that the user remains on the login page.
The local smoke test checks the tooling independently of the demo website.
The cart scenarios verify adding a named product (badge, contents, and quantity),
and removing the only product (empty cart and absent badge). Each test prepares its own cart.
The checkout scenario uses fictional customer details and verifies the product,
quantity, subtotal ($29.99), tax ($2.40), total ($32.39), order confirmation,
and cleared cart badge. It runs only against the demo shop and involves no real payment.
Three independent, data-driven checkout tests omit first name, last name, or postal
code while filling the other fields. They verify the specific validation message
and that checkout stays on the customer information step.
Two catalog tests verify ascending and descending price sorting across all six
products, comparing the displayed prices with a numerically sorted copy of the
original price list (including duplicate prices).

## Structure

- `pages/login.page.ts`: login page locators and reusable actions (Page Object Model).
- `pages/inventory.page.ts`: add a named product, open the cart, and sort prices.
- `pages/cart.page.ts`: cart items, product names, quantities, and removal.
- `pages/checkout.page.ts`: customer information, order summary, and confirmation.
- `tests/ui/login.spec.ts`: successful and unsuccessful login scenarios and result assertions.
- `tests/ui/cart.spec.ts`: adding and removing a product from the cart.
- `tests/ui/checkout.spec.ts`: completing a demo order and required-field validation.
- `tests/ui/inventory.spec.ts`: ascending and descending price sorting.
- `tests/api/products.spec.ts`: product API responses and simulated creation.
- `tests/setup.spec.ts`: local environment smoke test.
- `playwright.config.ts`: browser, base URL, reports, and failure artifacts.

The credentials in the login test are public demo credentials shown by SauceDemo.
Never commit credentials for real accounts.

## Setup

Install Node.js 24 LTS and Git, then run from this directory:

```sh
npm ci
npx playwright install chromium
npm test
```

## Commands

```sh
npm test                # Run tests in the background
npm run test:api        # Run API tests without launching a browser
npm run test:browser    # Run UI and local browser smoke tests
npm run test:headed    # Run tests with a visible browser
npm run test:ui        # Open the interactive test runner
npm run typecheck      # Check TypeScript types
npm run report         # Open the HTML report after a test run
npx playwright test tests/ui/login.spec.ts # Run only the login scenario
```

## Validation status and next steps

- All 15 tests passed locally on Windows, including a run with `CI=true`.
- TypeScript validation passed with `npm run typecheck`.
- UI coverage: 11 scenarios using Page Object Model.
- API coverage: 3 scenarios against DummyJSON.
- GitHub Actions workflow prepared; first hosted run pending repository publication.

## Scope and limitations

This is a learning portfolio, not a production test suite. Browser coverage is
currently Chromium desktop only. It does not cover accessibility, performance,
visual regression, real payment integrations, or exhaustive API contracts.
Demo product data and displayed checkout prices may change independently of this
repository. Public demo credentials are used solely for SauceDemo.

## Continuous integration

The workflow in `.github/workflows/playwright.yml` runs on pushes, pull requests,
and manual dispatch. It installs Node.js 24 and locked dependencies, checks
TypeScript, installs Chromium with Linux dependencies, and runs all 15 tests.
CI uses one worker and up to two retries for failed tests, as configured in
`playwright.config.ts`. A failed test still fails the job if retries do not pass.

Publish the contents of this project directory as the repository root so that
`.github/workflows/`, `package.json`, and `package-lock.json` are at the root.
No repository secrets are required for these public demo services.

After a run, open **Actions → Playwright tests → the run → Artifacts** and download
`playwright-results`. Extract it and, from the project directory, run
`npx playwright show-report <path-to-extracted-playwright-report>` to view the HTML
report. Failed tests also retain screenshots and traces in the uploaded artifacts.
Open a trace with `npx playwright show-trace <path-to-trace.zip>`.
Artifacts are retained for 14 days. A failed test step still allows artifact upload.

Both demo services are external dependencies: an outage, rate limit, or changed
demo data can cause failures. Inspect the report before attributing a failure to
the test code. The workflow has not yet been executed on GitHub.

## Documentation

- [Playwright documentation](https://playwright.dev/docs/intro)
- [Playwright continuous integration](https://playwright.dev/docs/ci)
