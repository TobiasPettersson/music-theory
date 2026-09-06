# Ljudkrediter

Alla sampel i den här katalogen kommer från fria källor. Varje ton är
nedsamplad till var tredje halvton — mellanliggande toner spelas genom att
pitcha närmaste inspelning högst en halvton, vilket inte hörs.

## `piano/` — Salamander Grand Piano V2

En inspelad Yamaha C5.

- **Titel:** Salamander Grand Piano V2
- **Upphovsperson:** Alexander Holm
- **Licens:** [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)
- **Källa:** <https://github.com/Tonejs/audio/tree/master/salamander>

CC BY kräver att upphovspersonen anges. Krediten visas i appens sidfot och får
inte tas bort utan att ersättas med en likvärdig.

Urval: `Ds2 Fs2 A2 C3 Ds3 Fs3 A3 C4 Ds4 Fs4 A4 C5 Ds5 Fs5` (14 filer, ~1,0 MB),
vilket täcker klaviaturens C3–C5 med marginal.

## `guitar/` — FluidR3 GM, acoustic guitar (steel)

- **Titel:** FluidR3 GM — `acoustic_guitar_steel`
- **Upphovsperson:** Frank Wen
- **Licens:** MIT
- **Källa:** <https://github.com/gleitz/midi-js-soundfonts> (`FluidR3_GM`)

Ingen kreditering krävs formellt, men den står i sidfoten ändå.

Urval: `E2 G2 Bb2 Db3 E3 G3 Bb3 Db4 E4 G4 Bb4 Db5 E5` (13 filer, ~268 KB),
vilket täcker greppbrädans E2–E5 (låga E öppen sträng till höga e band 12).

**Kandidat för uppgradering:** stålsträngad akustisk från University of Iowa
Electronic Music Studios, via
[tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments)
(`samples/guitar-acoustic`, CC BY 3.0). Låter klart bättre men väger ~2,1 MB
för samma omfång. Byte kräver bara nya filer här plus `files`-tabellen i
`INSTRUMENTS` i `app.js` — motorn behöver inte röras.
