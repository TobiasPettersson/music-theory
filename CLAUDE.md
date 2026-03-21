# CLAUDE.md — Musikteori App

## Projektbeskrivning

Bygg en interaktiv musikteori-webapp för Tobbe, gitarrist och pianist på avancerad nybörjarnivå. Appen ska hjälpa användaren utforska och förstå musikteori visuellt och interaktivt. Undervisningsspråk: **svenska**.

Fokus ligger på konceptuell förståelse — varför saker fungerar, inte bara vad man ska göra.

---

## Vad appen ska täcka

### 1. Skalor
- **Durskala:** H–H–h–H–H–H–h
- **Naturlig mollskala:** H–h–H–H–h–H–H
- Visuell representation på pianotangentbord och gitarrhalsar
- C-dur och A-moll som genomgående exempel (delar samma toner — relativ mollskala)

### 2. Intervaller
| Intervall | Halvtoner |
|---|---|
| Prim (unison) | 0 |
| Liten sekund | 1 |
| Stor sekund | 2 |
| Liten ters | 3 |
| Stor ters | 4 |
| Kvart | 5 |
| Tritonus | 6 |
| Kvint | 7 |
| Liten sext | 8 |
| Stor sext | 9 |
| Liten septima | 10 |
| Stor septima | 11 |
| Oktav | 12 |

- Stor = major, Liten = minor
- Rena intervall: kvart och kvint (finns bara i en variant)

### 3. De fyra grundackordtyperna
| Typ | Skalsteg | Halvtoner |
|---|---|---|
| Major | 1 – 3 – 5 | 0 – 4 – 7 |
| Minor | 1 – b3 – 5 | 0 – 3 – 7 |
| Diminished | 1 – b3 – b5 | 0 – 3 – 6 |
| Augmented | 1 – 3 – #5 | 0 – 4 – 8 |

- Varje ton i ett ackord ska ha ett unikt bokstavsnamn (Eb, inte D#, i ett C-moll-ackord)
- Tre parallella system används genomgående: **namn**, **halvtoner**, **skalsteg**

### 4. Diatoniska ackord
**Durskala:**
| I | II | III | IV | V | VI | VII |
|---|---|---|---|---|---|---|
| Major | Minor | Minor | Major | Major | Minor | Dim |
| C | Dm | Em | F | G | Am | Bdim |

**Mollskala:**
| I | II | III | IV | V | VI | VII |
|---|---|---|---|---|---|---|
| Minor | Dim | Major | Minor | Minor | Major | Major |

### 5. Ackordprogressioner (nästa steg att bygga ut)
- Romerska siffror (I–VII) för att beskriva progressioner
- Vanliga progressioner: I–IV–V, I–V–VI–IV, II–V–I osv.
- Visa hur ackord "vill" röra sig mot varandra

---

## Funktioner att prioritera

1. **Interaktivt pianotangentbord** — markera toner i skalor och ackord
2. **Ackordbyggare** — välj grundton och typ, se toner + intervall + skalsteg
3. **Skalutforskare** — välj tonart och skala, se diatoniska ackord
4. **Progressionsverktyg** — bygg och spela upp ackordprogressioner med romerska siffror
5. **Övningsläge** — gissa ackordtyp givet toner, eller toner givet ackordnamn

---

## Tekniska önskemål

- **Tvåspråkig:** Svenska och engelska parallellt (t.ex. "Kvint / Perfect Fifth")
- Visuellt piano som hjälpmedel (Tobbe använder piano för att förstå teori, inte nödvändigtvis för att spela)
- Gitarrvy som komplement
- Ljud om möjligt (Web Audio API)
- Mobilanpassad

---

## Pedagogiska principer

- Visa alltid alla tre systemen parallellt: **namn** / **halvtoner** / **skalsteg**
- Förklara *varför*, inte bara *vad*
- Undvik att föregripa — låt användaren utforska och dra egna slutsatser
- Exempel utgår från C-dur och A-moll som bas
