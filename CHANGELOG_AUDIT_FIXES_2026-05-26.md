# Audit fixes applied — 2026-05-26

Applied to the static Raw Materials Trade Kft. website package.

## Fixed
- Shortened HTML `<title>` tags across product and main pages to stay within search-result display limits.
- Shortened meta descriptions across product and main pages to stay below 160 characters.
- Added / normalized Product schema `offers.availability = https://schema.org/InStock` and `businessFunction = https://purl.org/goodrelations/v1#Sell` across embedded JSON-LD, including catalogue-level product entries.
- Updated Organization schema with `foundingDate: 2021`, `slogan: Chemical Connections`, `sameAs` (legacy site + LinkedIn company URL), `alternateName` and `currenciesAccepted` where missing.
- Corrected Nikoletta Kádár's ContactPoint email to `nikoletta.kadar@rawmaterialstrade.com` in schema and AI profile data.
- Added `Last-Updated` and `Version` to `llms.txt`.
- Added width/height attributes to logo and certificate images and normalized hero-logo `fetchpriority="high"`.
- Removed FormSubmit as the active form delivery endpoint. Forms now use a GDPR-safe `mailto:` fallback by default; a compliant server-side endpoint can be added later after DPA/processor approval.
- Updated the privacy policy wording to match the no-FormSubmit form behavior.
- Cleaned legacy typo patterns if present: Sadium/Sodium Hydroxide, Kädár/Kádár, 150/ISO 9001:2015, Silikonóle/Silikonöle.

## Not changed
- Server-side compression, DNS, SSL/TLS and CDN configuration were not changed because they are outside the static ZIP package.
- Exact employee count was not added to schema because no verified employee count was provided in the package.
