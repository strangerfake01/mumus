# Root index + nyelvfelismerés + hero logó frissítés

Elvégzett módosítások:

- A gyökér `index.html` most teljes értékű angol kezdőoldal lett, nem külön köztes nyelvválasztó oldal.
- Böngészőnyelv-alapú, visszafogott átirányítás került az angol kezdőoldalra:
  - magyar böngészőnyelv esetén: `hu.html`
  - német böngészőnyelv esetén: `de-at.html`
  - minden más esetben: angol root kezdőoldal marad.
- A kézi nyelvválasztást a nyelvgombok `localStorage` értékkel megjegyzik, ezért a felhasználó választását nem írja felül az automatikus felismerés.
- A jelenlegi kezdőlapi `logo-transpared.png` elegáns hero brand elemként bekerült mindhárom fő nyelvi hero szekcióba:
  - angol `index.html` / kompatibilitási `en.html`
  - magyar `hu.html`
  - német `de-at.html`
- A home oldalak hreflang jelölése frissült: az angol és az `x-default` a root kezdőoldalra mutat.
- A sitemap kezdőoldali blokkjait frissítettem, az angol főoldal root URL-ként szerepel.

Nem módosítottam:

- termékoldali slugokat;
- termékadatokat;
- designrendszer alapstruktúráját;
- meglévő termékoldali hreflang rendszert.
