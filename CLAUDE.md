# CLAUDE.md — Musikteori App

## Projektbeskrivning

Interaktiv musikteori-webapp för Tobbe, gitarrist och pianist på avancerad nybörjarnivå. En enda fil: `index.html`. Fokus på konceptuell förståelse — varför saker fungerar, inte bara vad man ska göra.

**Live:** https://tobiaspettersson.github.io/music-theory/
**Repo:** https://github.com/TobiasPettersson/music-theory (publikt)

---

## Nuvarande status — vad som är byggt

### ✅ Klart

| Flik | Innehåll |
|------|----------|
| **Intervaller** | Klicka två tangenter → se intervallnamn, halvtoner, skalsteg. Referenstabell (collapsible). |
| **Skalor** | Dur + naturlig mollskala. Piano-highlighting, tonbubblor med stegmönster (H/h). Diatoniska ackord med klickbara kort. Relativ skala visas. |
| **Ackord** | Välj grundton + typ (Dur/Moll/Dim/Aug). Pianohighlight, tontabell (ton/halvtoner/skalsteg), intervalstruktur med förklaring. |
| **Progressioner** | Palett med 7 diatoniska ackord, bygg sekvens, presets (I–IV–V etc.), BPM-slider, loop, uppspelning med pianohighlight. |
| **Övning** | Quiz 1: gissa ackordtyp. Quiz 2: hitta ackordtoner på piano. Poängräkning. |
| **SV/EN-knapp** | Knapp uppe till höger växlar hela UI:t mellan svenska och engelska. Alla texter, förklaringar och knappar översatta. |
| **Mobilanpassning** | Responsiv CSS, scrollbar flik-nav, horisontell scroll på referenstabell, grid-justeringar. |

### ❌ Återstår

- **Gitarrvy** — ackord och skalor på gitarrhals (inget påbörjat)

---

## Arkitektur

- Ren vanilla HTML/CSS/JS, **ingen build-step, inga beroenden**
- Allt i en fil: `index.html`
- Web Audio API för ljud (pianolikt timbre med harmonics)
- Piano: 25 tangenter (C3–C5), `W = 38px` för vita tangenter — svarta tangenternas `left`-position beräknas i JS baserat på detta värde. **Ändra inte CSS-bredden utan att även uppdatera `W` i JS.**

### Språksystem
```javascript
let lang = 'sv'; // eller 'en'
const TRANSLATIONS = { sv: {...}, en: {...} };
function t(key) { ... }       // hämta översättning
function toggleLang() { ... } // växla språk
function applyLang() { ... }  // uppdaterar data-i18n-element + anropar renderfunktioner
```
- Statiska HTML-element har `data-i18n="nyckel"` — uppdateras av `applyLang()`
- Dynamiska texter använder `t('nyckel')` direkt i JS
- `renderChordBuilder(silent = false)` — skicka `true` för att undvika ljuduppspelning (t.ex. vid språkbyte eller sidladdning)

### Viktiga konstanter
```javascript
const SCALE_PATTERNS     // halvtonsoffsets för dur/moll
const SCALE_NOTE_NAMES   // korrekt notnamnstavning för alla 24 tonarter
const CHORD_QUALITIES    // diatoniska ackordtyper per skalsteg
const CB_CHORD_TYPES     // ackordtyper med intervall och skalsteg
const INTERVALS          // alla 13 intervaller med sv/en-namn
const PRESETS            // färdiga progressioner (6 st)
```

---

## Musikteori-referens

### Skalor
- **Durskala:** H–H–h–H–H–H–h (H = helmtonsteg = 2 ht, h = halvtonsteg = 1 ht)
- **Naturlig mollskala:** H–h–H–H–h–H–H
- C-dur och A-moll delar samma sju toner (relativa skalor)

### De fyra grundackordtyperna
| Typ | Skalsteg | Halvtoner |
|-----|----------|-----------|
| Major | 1 – 3 – 5 | 0 – 4 – 7 |
| Minor | 1 – b3 – 5 | 0 – 3 – 7 |
| Diminished | 1 – b3 – b5 | 0 – 3 – 6 |
| Augmented | 1 – 3 – #5 | 0 – 4 – 8 |

- Varje ton i ett ackord ska ha ett unikt bokstavsnamn (Eb, inte D#, i C-moll)

### Diatoniska ackord
**Dur:** I(M) – ii(m) – iii(m) – IV(M) – V(M) – vi(m) – vii°(dim)
**Moll:** i(m) – ii°(dim) – III(M) – iv(m) – v(m) – VI(M) – VII(M)

---

## Pedagogiska principer

- Visa alltid tre system parallellt: **namn** / **halvtoner** / **skalsteg**
- Förklara *varför*, inte bara *vad*
- Undvik att föregripa — låt användaren utforska
- Piano är verktyget för teoriförståelse (inte nödvändigtvis för att spela)
- Exempel utgår från C-dur och A-moll som bas

---

## Nästa steg (förslag)

1. **Gitarrvy** — visa skalor/ackord på gitarrhals (6 strängar, standardstämning EADGBE)
2. **Fler skaltyper** — harmonisk moll, dorisk, mixolydisk m.fl.
3. **Djupare progressionsanalys** — förklara varför ackord rör sig mot varandra (V→I, II→V etc.)
4. **Inversions i övningar** — toggle i övningsfliken för att inkludera omvändningar (1st/2nd inversion). Just nu spelas alltid root position. Inget påbörjat.
