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
| **Gitarr** | Greppbräda 0–12 band, standardstämning EADGBE (höga e överst). Skala (dur/moll) eller ackord (4 typer) per grundton. Korrekta tonnamn på pricksarna, rot i orange, banddots-markörer, klick spelar rätt tonhöjd (E2–E5). |
| **SV/EN-knapp** | Knapp uppe till höger växlar hela UI:t mellan svenska och engelska. Alla texter, förklaringar och knappar översatta. Standard: svenska; valet sparas i `localStorage` (`mt-lang`). |
| **Mobilanpassning** | Responsiv CSS, scrollbar flik-nav, horisontell scroll på referenstabell och greppbräda, grid-justeringar. |

### 🔧 Buggfixar 2026-07-05

- `why-aug`-översättning saknades → quizresultat för förstärkta ackord visade rå nyckel.
- Förminskade ackord skrivs nu **vii°** (gemener + ring) konsekvent i både Skalor och Progressioner.
- Progressioner: tonartsknapparnas etiketter följer nu skalans stavning (Db i dur, C# i moll).
- Preset-etiketter genereras från skalsteg med korrekt versalisering (I–V–vi–IV; i moll i–v–VI–iv).
- Språkbyte spelar inte längre upp valt ackord (silent re-render).
- Intervallfliken stavar nu måltonen korrekt (C→Eb, inte C→D#; tritonus visar båda: F#/Gb).
- "Fjortondel" → **kvartdecima** i intervalltabellen.

---

## Arkitektur

- Ren vanilla HTML/CSS/JS, **ingen build-step, inga beroenden** (funkar direkt på GitHub Pages)
- **Tre filer** (uppdelad 2026-07-05, tidigare allt i index.html):
  - `index.html` — enbart markup (~225 rader)
  - `styles.css` — all CSS, inkl. desktop-/mobilbrytpunkter
  - `app.js` — all logik, sektionsindelad med banner-kommentarer (klassiskt script, globals)
- Web Audio API för ljud (pianolikt timbre med harmonics); `localStorage` nås alltid via
  `store.get/set` (try/catch — får aldrig krascha appen på file:// eller private mode)
- **Responsivt i tre lägen** (styrs av CSS, automatiskt per skärm):
  - Mobil (≤640px): kompaktare knappar, horisontell scroll på piano/greppbräda/tabell
  - Standard (641–1279px): max-bredd 620px
  - Desktop ≥1280px (1080p+): max-bredd 1100px, större piano och greppbräda
- Piano: 25 tangenter (C3–C5). Tangentmått ligger i CSS-variabler (`--keyw`, `--keybw`,
  `--keyh`, `--keybh`) som `app.js` läser **en gång vid load** för svarta tangenters
  `left`-position — ändra måtten i `:root`/media queries, inte i JS. Byte av brytpunkt
  kräver sidladdning (inget resize-lyssnande, medvetet enkelt).

### Språksystem
```javascript
let lang = localStorage.getItem('mt-lang') === 'en' ? 'en' : 'sv'; // default sv, persistent
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
const PRESETS            // färdiga progressioner (6 st) — etiketter genereras från degrees
const GT_TUNING          // gitarrsträngar (höga e först) med MIDI-nummer för öppen sträng
const IV_LETTER_STEPS    // bokstavssteg per intervall → korrekt stavning (spellFromRoot)
```

### Ljud
- `playFreq(freq)` är kärnan; `playNote(keyIndex)` (piano C3–C5) och `playMidi(midi)`
  (gitarren, E2 och uppåt) är tunna omslag.

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

1. **Septimackord** (maj7, m7, dom7, m7b5) — utbyggnad av ackordbyggare, quiz, progressioner och gitarrvy
2. **Rena gehörsövningar** — "endast ljud"-läge i quiz 1 + intervall-gehörsquiz
3. **Kvintcirkel** — interaktiv vy; antal #/b i skalinfon
4. **Fler skaltyper** — harmonisk/melodisk moll först, sedan dorisk, mixolydisk m.fl.
5. **Djupare progressionsanalys** — funktioner (T/S/D), varför V→I löser upp (ledtonen)
6. **Inversions i övningar** — toggle i övningsfliken för omvändningar. Just nu alltid root position.
