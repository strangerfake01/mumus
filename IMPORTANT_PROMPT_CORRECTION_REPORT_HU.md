# IMPORTANT prompt correction report — Raw Materials Trade website

Date: 2026-05-25

## Corrected scope
- Main pages: `en.html`, `hu.html`, `de-at.html`, language selector, AI profile files and all product detail pages.
- Product catalogue files and JSON product data: `products-multilingual.json`, `products-en.json`, `ai-company-profile.json`.
- Global CSS: `style.css`.

## Key corrections performed
1. **Chemical naming**
   - Removed `Trilon` as a standalone product/material name from visible content and metadata.
   - Replaced it with EDTA-based terminology:
     - EN: EDTA disodium and tetrasodium salts
     - HU: EDTA dinátrium- és tetranátriumsók
     - DE: EDTA Dinatrium- und Tetranatriumsalze
   - Original URL slugs containing `trilon` were intentionally retained to avoid SEO/link breakage.

2. **Packaging terminology**
   - Standardized inconsistent packaging labels into the approved HU/EN/DE terminology.
   - Required terms now used consistently in visible product text where applicable:
     - HU: zsákos, BigBag, ömlesztett
     - EN: bagged, BigBag, bulk
     - DE: Sackware, BigBag, lose Ware

3. **KTPP / Potassium tripolyphosphate CAS handling**
   - The KTPP pages no longer display a specific CAS number.
   - The CAS field now uses the requested controlled wording:
     - HU: CAS szám specifikáció alapján vagy kérésre elérhető.
     - EN: CAS number available upon request/specification confirmation.
     - DE: CAS-Nummer auf Anfrage bzw. gemäß Spezifikation verfügbar.

4. **Regulatory data safety**
   - Uncertain/product-specific CAS placeholders were replaced with “available upon request / specification confirmation” wording.
   - English placeholders accidentally present in HU/DE pages were localized.
   - No new CAS/EC/UN/HS identifiers were invented.

5. **Global layout and responsive text fix**
   - Removed/overrode unsafe letter-by-letter wrapping behavior.
   - Added global text wrapping safeguards for product titles, navigation, language buttons, cards, company data, product DL tables and CTAs.
   - Long chemical names now wrap by words instead of breaking character-by-character.

6. **Header/navigation fix**
   - Menu labels and language switcher buttons received no-letter-break overrides.
   - Desktop and mobile navigation now maintain readable labels.

7. **Specialty category expansion**
   Added multilingual specialty categories:
   - Process & Performance Additives / Technológiai és teljesítményfokozó adalékok / Prozess- und Leistungsadditive
   - Silicone based antifoams / Szilikon bázisú habzásgátlók / Silikonbasierte Entschäumer
   - Non-silicone antifoams / Nem szilikon bázisú habzásgátlók / Nicht silikonbasierte Entschäumer
   - Defoamers / Habzásgátlók / Entschäumer
   - Silicone oils / Szilikon olajok / Silikonöle
   - Processing additives / Technológiai adalékok / Verarbeitungsadditive
   - Flow aids / Folyást segítő adalékok / Fließhilfsmittel
   - Technical additives / Technikai adalékok / Technische Additive

8. **Manufacturer / supplier network section**
   - Rebuilt into a more professional B2B sourcing capability section.
   - Added country-level network visualization only.
   - No supplier names, exact addresses or factory details are disclosed in the visualization.

9. **International supplier country network**
   Added highlighted countries:
   - Europe: Poland, Romania, Austria, Germany, Belgium, Italy, Netherlands
   - North America: Mexico, United States (Michigan)
   - Asia: China, Thailand

10. **Contact visibility and trust**
   - Added visible phone contacts to main contact sections and product page trust/contact areas.
   - Contacts used consistently:
     - Alexandra Sajbán-Frőhner / Sajbán-Frőhner Alexandra — +36 30 160 1960
     - Nikoletta Kádár / Kádár Nikoletta — +36 20 556 7917
   - Kept the presentation subtle and B2B-oriented.

11. **B2B contact block simplification**
   - Reduced personal role / B2B-contact style wording.
   - Replaced B2B contact/B2B contact emphasis with neutral B2B contact and company-data wording.
   - Kept necessary corporate identifiers: registered office, company registration number, EU VAT and contact details.

## SEO-safe modifications
- No product page files were renamed.
- No canonical URLs or hreflang structures were intentionally broken.
- Product URL slugs were preserved, including legacy `trilon` slugs, to avoid 404 and SEO disruption.
- Metadata and JSON-LD were adjusted only where terminology/contact/regulatory safety required it.

## Remaining manual review suggestions
- Final CAS/EC/REACH/UN/HS confirmation should still be matched against official SDS/TDS/CoA documents per supplier and product grade.
- If the company wants exact pack sizes displayed later, confirm them from supplier documentation before publishing.
- Run a browser QA pass on mobile widths below 390px for the longest product names.
- Validate Schema.org JSON-LD in Google Rich Results Test after deployment because the pages contain large generated Product schema blocks.


## Záró technikai tisztítás
- A személyes szerepkört sugalló meta mezők semleges `company-b2b-contact` néven szerepelnek.
- A maradék nem egységes BigBag-előfordulások is jóváhagyott formára lettek hozva.
- A magyar oldalakban a fő csomagolási megnevezések magyarosítva szerepelnek: `hordó`, `IBC`, `tartályautó`, `zsákos`, `BigBag`, `ömlesztett`.


## Automatikus záróellenőrzés
- JSON-LD parse hibák: 0.
- JSON fájl parse hibák: 0.
- Hiányzó lokális HTML linkek / asset hivatkozások: 0.
- Tiltott sor-/betűtörési szabályok: 0.
- Nem egységes csomagolási kifejezések: 0.
- Látható Trilon terméknév-előfordulás: 0.
- Régi személyes szerepköri megfogalmazások a renderelt HTML-ben: 0.
- A részletes eredmény az `IMPORTANT_PROMPT_VALIDATION.json` fájlban található.
