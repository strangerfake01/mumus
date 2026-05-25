# Javítási összefoglaló

Elvégzett módosítások:

1. **Kontakt szekció – sortörés és tördelés javítása**
   - A kapcsolattartói blokkban a név, LinkedIn és telefonszám elemek egymás alá / jól tördelhető layoutba kerültek.
   - Mobil és asztali nézetben is javított responsív viselkedés.

2. **Exporttag 2026 szekció – felesleges üres tér és kontraszt javítása**
   - Új, célzott CSS került az `exporttag-section`, `exporttag-panel` és `exporttag-card` elemekhez.
   - A halvány / nehezen olvasható kártya kontrasztja javítva lett.
   - A nagy, vizuálisan üres blokkok csökkentve lettek.
   - Mobil nézetben egy oszlopos, tiszta tördelés.

3. **Social media megosztási kép frissítése**
   - A központi `social-share.png` fájl új, letisztultabb és elegánsabb verzióra lett cserélve.
   - Mivel a teljes site ezt a fájlt használja OG/Twitter képként, a csere minden olyan oldalon érvényesül, ahol ez szerepelt.

4. **Meta / integráció**
   - Az OG és Twitter meta hivatkozások változatlanul a `social-share.png` fájlra mutatnak, ezért külön HTML meta átírásra nem volt szükség.

Érintett fő fájlok:
- `style.css`
- `social-share.png`
- minden oldal, amely a közös CSS-t és a `social-share.png` fájlt használja
