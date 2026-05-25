# Raw Materials Trade – vizuális / reszponzív hibajavítási riport

## Javított problémák

1. **Tanúsítványkártyák tördelése**
   - A tanúsítványszámok és a „Gültig / Érvényes / Valid” jelölések nem csúsznak egymásra.
   - A certifikációs adatsorok grid alapú, stabil elrendezést kaptak.

2. **Cégadatkártyák széteső, függőleges tördelése**
   - Javítva a székhely, cégjegyzékszám, adószám / VAT ID megjelenítése.
   - A túl keskeny oszlopok helyett minimum szélességű, reszponzív grid működik.

3. **Hero tanúsítványkártyák badge-overflow hibája**
   - A zöld státusz badge nem lóg ki a kártyából.
   - Mobilon és asztali nézetben is a kártyán belül marad.

4. **Főmenü és nyelvválasztó rossz sortörése**
   - Javítva a „Ró-lunk”, „Termé-kek”, „Minő-ség” jellegű menütörés.
   - A nyelvválasztó gombok nem törnek függőlegesen betűnként.
   - Kisebb szélességnél a menü hamburger nézetre vált.

5. **Láblécben megjelenő figyelmeztető felirat eltávolítása**
   - Eltávolítva: „Címadatok B2B kommunikációban szükség esetén megerősítendők.”
   - Eltávolítva az angol megfelelője is.
   - A `.dvn` figyelmeztető blokk biztonsági okból CSS-ben is rejtve marad, ha cache-ből maradna régi elem.

6. **LinkedIn / kapcsolati blokk olvashatóság**
   - A nevek, titulusaik és LinkedIn chipek nem törnek karakterenként.
   - A linkchip hover állapota nem húzza alá zavaróan az elemet.

## Ellenőrzések

- HTML fájlok száma: 388
- JSON-LD hibák száma: 0
- Törött belső linkek száma: 0
- Automatikusan nyitott `<details open>` elemek száma: 0
- Eltávolított footer figyelmeztetés: kész
- Feltöltött `logo-transpared.png` beépítve a gyökérbe: kész

## Megjegyzés

A javítások elsősorban globális CSS- és célzott HTML-tisztítások. URL, slug, termékstruktúra és tartalmi SEO réteg nem változott, így nem keletkezett új SEO-kockázat.
