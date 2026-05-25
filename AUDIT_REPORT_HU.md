# Raw Materials Trade Kft. — szigorú SEO / GEO / Schema / nyelvi / GDPR / technikai audit

**Audit dátuma:** 2026-05-25  
**Cél domain:** https://www.rawmaterialstrade.com/  
**Telepítési cél:** GitHub Pages  
**Kapcsolati e-mail:** office@rawmaterialstrade.com

## Vezetői összefoglaló

Az oldal alapja erős: többnyelvű, termékszintű, strukturált, B2B-orientált és AI számára is jól értelmezhető. A szigorú audit alapján azonban volt néhány launch-kritikus hiba:

1. A gyökér `index.html` noindex állapotban volt és JavaScript alapú automatikus nyelvi átirányítást használt. Ez SEO és Google Business szempontból gyenge belépési pont.
2. Nem volt `CNAME` fájl a GitHub Pages custom domainhez.
3. A `robots.txt` nem tartalmazott külön AI crawler irányelveket.
4. A GDPR/form szöveg ellentmondásos volt: a felület azt állította, hogy nincs harmadik félnek továbbítás, miközben a statikus űrlap FormSubmit kézbesítőt használ.
5. Három terméknél a CAS mezőben magyar belső placeholder szerepelt. Ezeket pontosítottam product-specific / composition-dependent megfogalmazásra.
6. A német és magyar főoldali JSON-LD leírásban maradt néhány angol GEO-mondat. Ezeket nyelvileg tisztítottam.
7. A főoldali statisztikai blokkban szereplő `~€2M annual gross turnover` forrás nélkül üzletileg és jogilag kockázatos volt; ezt tanúsított minőségirányítási jelzésre cseréltem.

## Javított főbb elemek

### SEO

- A gyökéroldal most indexelhető.
- A `canonical` érték a gyökéren most `https://www.rawmaterialstrade.com/`.
- A sitemap tartalmazza a gyökér URL-t.
- Minden HTML oldal rendelkezik title, description és canonical elemmel.
- A fő nyelvi oldalak indexelhetőek: `en.html`, `hu.html`, `de-at.html`.
- A jogi oldalak `noindex,follow` állapotban maradtak, mert elérhetőségük fontos, de nem szükséges őket kereskedelmi keresési találatként rangsorolni.

### GEO / AI-kereshetőség

- Frissített `llms.txt`.
- Frissített `robots.txt` AI crawler irányelvekkel.
- Megmaradtak az AI profilok: `ai-profile.html`, `ai-profile-hu.html`, `ai-profile-de-at.html`.
- A termékoldalak AI-readable összefoglalót és gépi feldolgozásra alkalmas termékstruktúrát tartalmaznak.
- A termékadatoknál mindenhol egyértelmű figyelmeztetés szerepel: a végleges alkalmasságot SDS/TDS/CoA és beszállítói dokumentáció alapján kell megerősíteni.

### Schema

- 388 HTML fájl JSON-LD hibamentesen parse-olható.
- Használt típusok: `Organization`, `WebSite`, `WebPage`, `Product`, `Service`, `BreadcrumbList`, `FAQPage`, `Offer`, `ContactPoint`, `PrivacyPolicy`, `EducationalOccupationalCredential`.
- A céges entitás egységes: Raw Materials Trade Kft.; jogi név; cégjegyzékszám; EU VAT ID; székhely; office@rawmaterialstrade.com; Sajbán-Frőhner Alexandra / Alexandra Sajbán-Frőhner.
- A német és magyar structured data nyelvi keveredése javítva.

### GDPR / adatvédelem

- A FormSubmit használata most már átláthatóan szerepel az adatvédelmi tájékoztatóban.
- A form alatti félrevezető „nem adjuk át harmadik félnek” mondatot javítottam, mert a kézbesítés technikailag külső statikus form service-en keresztül történik.
- A privacy oldal tartalmazza: adatkezelő, cél, jogalap, kezelt adatok, kézbesítési szolgáltatás, cookie/localStorage, hosting logok, megőrzés, érintetti jogok, NAIH panaszlehetőség.
- Nincs külső script, külső CSS, iframe, Google Fonts, Meta Pixel vagy Google Analytics betöltés.
- Csak egy localStorage alapú essential notice működik.

**Fontos launch-feltétel:** ha a FormSubmit nincs szerződésesen jóváhagyva adatfeldolgozóként, éles indulás előtt javasolt Google Workspace / Apps Script / CRM alapú jóváhagyott form endpointot használni.

### Nyelv és C-level érthetőség

- Az angol, magyar és osztrák német főoldal vezetői nyelvezete érthető és B2B-döntéshozói szintre emelt.
- A túlzott vagy nem bizonyított állításokat visszafogtam.
- A német oldalon a „REACH / CLP konform” túl erős általános állítást „REACH / CLP-Dokumentation” megfogalmazásra cseréltem.
- A pénzügyi volumenállítást forrás hiányában eltávolítottam.

### Termékinformációk hitelessége

- 126 termék szerepel 3 nyelven: 378 termékoldal.
- Minden termékoldal tartalmaz: név, kategória, CAS/main component mező, dokumentációs státusz, alkalmazási terület, SDS/TDS/CoA figyelmeztetés, Wikipedia hivatkozás általános tájékozódásra.
- Három nem szabványos CAS placeholder javítva:
  - `termékspecifikus` → `Product-specific — confirm exact CAS/component identity from SDS/TDS`
  - `terméktípustól függ` → `Product type-specific — confirm exact CAS/component identity from SDS/TDS`
  - `összetételtől függ` → `Composition-dependent — confirm exact CAS/component identity from SDS/TDS`

### Reszponzivitás és dizájn

- A CSS grid és mobile breakpoint struktúra megmaradt.
- A mobil hamburger menü accessibility viselkedése javítva: linkre kattintáskor és Escape-re bezár, az `aria-expanded` állapot frissül.
- A gyökér landing oldal mobilon is egyszerű, gyors és C-level tisztaságú.
- Külső font nincs, így GDPR/privacy és teljesítmény szempontból is jobb.

## Automatizált ellenőrzési eredmények

- HTML fájlok: 388
- Termékoldalak: 378
- Fő/AI/jogi/technikai oldalak: 10
- Sitemap URL-ek: 385
- JSON-LD parse hibák: 0
- Hiányzó title/description/canonical: 0
- Hiányzó lokális fájlreferencia: 0
- Külső script: 0
- Külső CSS: 0
- iframe: 0
- CNAME létrehozva: `www.rawmaterialstrade.com`
- GitHub Pages helper: `.nojekyll` létrehozva

## Launch utáni kézi teendők

1. GitHub repository rootba töltsd fel a zip tartalmát, ne almappába.
2. GitHub Pages → Custom domain: `www.rawmaterialstrade.com`.
3. Enforce HTTPS bekapcsolása, ha elérhető.
4. Search Console → Domain property: `rawmaterialstrade.com`.
5. Sitemap beküldése: `https://www.rawmaterialstrade.com/sitemap.xml`.
6. Google Business Profile → Website: `https://www.rawmaterialstrade.com/`.
7. Első éles formteszt: ellenőrizni kell, hogy a FormSubmit aktivációs e-mail megérkezik-e az `office@rawmaterialstrade.com` címre.
8. Ha a FormSubmit nem vállalható adatfeldolgozóként, cserélni kell jóváhagyott Google Workspace / Apps Script endpointtal.

## Musk / Jobs / Buffett szemüvegen keresztüli ítélet

**Elon Musk-szűrő:** az oldal gépi olvashatósága, adatszerkezete és AI-orientált rétege erős. A gyökér noindex és a gyenge crawler-policy javítása kritikus volt.

**Steve Jobs-szűrő:** a belépési élménynek egyszerűnek kell lennie. Az új index oldal letisztult, gyors, nem magyarázza túl magát, és azonnal nyelvválasztást ad.

**Warren Buffett-szűrő:** csak olyan állítás maradhat, amelyet dokumentáció vagy konzervatív megfogalmazás támaszt alá. A nem igazolt forgalmi állítást eltávolítottam; a tanúsítványi és dokumentációs logika maradt.

## Végső státusz

Az oldal GitHub Pages-re feltölthető, SEO/GEO/schema szempontból sokkal erősebb, és a jogi/GDPR szövegek átláthatóbbak. Egyetlen piros launch-feltétel maradt: az űrlapkézbesítő szolgáltató adatfeldolgozói megfelelőségének üzleti/jogi jóváhagyása.


## Kiegészítő javítás — SDS/TDS/CoA információkérés

- Minden termékoldalon és katalógus-kártyán az SDS/TDS gomb SDS/TDS/CoA információkérésre lett bővítve.
- A gomb minden nyelven az adott nyelvű főoldal kapcsolatfelvételi űrlapjára ugrik, termék- és dokumentáció-előtöltéssel.
- A magyar és német űrlapokba is bekerült az „Igényelt dokumentáció / információ” mező.
- Az ajánlatkérő üzenet előtöltése kezeli az SDS/TDS/CoA kérést.
