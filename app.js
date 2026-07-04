// ═══════════════════════════════════════════════════════════
// SHARED CONSTANTS
// ═══════════════════════════════════════════════════════════
const NOTES     = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const WHITE_POS = [0, null, 1, null, 2, 3, null, 4, null, 5, null, 6];
// Key sizes live in CSS (--keyw/--keybw, larger on desktop); read them once at
// load since the black keys' left offsets are computed from them in JS.
const cssPx = (name, fallback) =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || fallback;
const W  = cssPx('--keyw', 38);
const BW = cssPx('--keybw', 24);
const START_OCT = 3;
const SPAN      = 25; // C3–C5

// ═══════════════════════════════════════════════════════════
// LANGUAGE
// ═══════════════════════════════════════════════════════════
// localStorage can throw (file://, some private modes) — never let that kill the app.
const store = {
  get(k)    { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* unavailable */ } },
};

// Swedish is the default; the choice persists across visits.
let lang = store.get('mt-lang') === 'en' ? 'en' : 'sv';

const TRANSLATIONS = {
  sv: {
    'app-title': 'Musikteori',
    'lang-btn': 'EN',
    'tab-intervals': 'Intervaller',
    'tab-scales': 'Skalor',
    'tab-chords': 'Ackord',
    'tab-prog': 'Progressioner',
    'tab-quiz': 'Övning',
    'audio-on': '♪ Ljud: På',
    'audio-off': '♪ Ljud: Av',
    'iv-hint': '<strong>1.</strong> Klicka på en ton → grundton&nbsp;&nbsp;<strong>2.</strong> Klicka på en annan ton → se intervallet',
    'iv-reset': 'Återställ',
    'iv-root-chosen': 'Grundton vald — klicka på en annan ton',
    'iv-stat-semi': 'Halvtoner',
    'iv-stat-degree': 'Skalsteg',
    'iv-stat-notes': 'Toner',
    'iv-dir-up': '↑ upp',
    'iv-dir-down': '↓ ned',
    'ref-show': 'Visa alla intervaller ▾',
    'ref-hide': 'Dölj intervaller ▴',
    'ref-th-semi': 'Halvtoner',
    'ref-th-sv': 'Svenska',
    'ref-th-en': 'English',
    'ref-th-deg': 'Skalsteg',
    'sc-root-label': 'Grundton',
    'sc-type-label': 'Skala',
    'sc-btn-major': 'Durskala',
    'sc-btn-minor': 'Naturlig mollskala',
    'sc-dia-label': 'Diatoniska ackord',
    'sc-chord-hint': 'Klicka på ett ackord för att se och höra det',
    'scale-name-major': 'durskala',
    'scale-name-minor': 'naturlig mollskala',
    'scale-explain-major': 'Mönstret är <strong>H–H–h–H–H–H–h</strong> (H = heltonsteg = 2 halvtoner, h = halvtonsteg = 1 halvton). Den ljusa, "glada" karaktären kommer framför allt från <strong>stor ters</strong> (4 halvtoner upp till steg 3).',
    'scale-explain-minor': 'Mönstret är <strong>H–h–H–H–h–H–H</strong>. Halvtonsstegen faller nu på 2→3 och 5→6. Det är framför allt <strong>liten ters</strong> (3 halvtoner upp till steg 3) som ger den mörkare, "sorgsnare" karaktären.',
    'scale-rel-major': 'mollskalan',
    'scale-rel-minor': 'durskalan',
    'scale-rel-shares': 'är den relativa {relType} — den delar exakt samma sju toner.',
    'badge-major': 'Dur',
    'badge-minor': 'Moll',
    'badge-dim': 'Förminskad',
    'why-major': '<strong>Stor ters</strong> (4 ht) + <strong>liten ters</strong> (3 ht) → durklang',
    'why-minor': '<strong>Liten ters</strong> (3 ht) + <strong>stor ters</strong> (4 ht) → mollklang',
    'why-dim':   '<strong>Liten ters</strong> (3 ht) + <strong>liten ters</strong> (3 ht) → förminskad',
    'why-aug':   '<strong>Stor ters</strong> (4 ht) + <strong>stor ters</strong> (4 ht) → förstärkt',
    'cb-root-label': 'Grundton',
    'cb-type-label': 'Ackordtyp',
    'cb-hint': 'Välj grundton och typ ovan',
    'ctt-note': 'Ton',
    'ctt-semi': 'Halvtoner',
    'ctt-degree': 'Skalsteg',
    'int-major-third': 'Stor ters',
    'int-minor-third': 'Liten ters',
    'int-perf-fourth': 'Kvart',
    'int-perf-fifth': 'Kvint (7 ht)',
    'int-dim-fifth': 'Förminskad kvint (6 ht)',
    'int-aug-fifth': 'Förstärkt kvint (8 ht)',
    'cb-why-major': 'Durackord: stor ters ger den ljusa karaktären, liten ters kompletterar till kvint.',
    'cb-why-minor': 'Mollackord: liten ters ger den mörkare karaktären, stor ters kompletterar till kvint.',
    'cb-why-dim':   'Förminskad: två lika liten-terskombinationer ger en spänd, instabil klang.',
    'cb-why-aug':   'Förstärkt: stor ters + stor ters — kvinten är höjd ett halvsteg, ger en öppen, oavgjord klang.',
    'cb-type-major': 'Dur',
    'cb-type-minor': 'Moll',
    'cb-type-dim': 'Förminskad',
    'cb-type-aug': 'Förstärkt',
    'prog-key-label': 'Tonart',
    'prog-scale-major': 'Dur',
    'prog-scale-minor': 'Moll',
    'prog-empty': 'Klicka på ackord ovan för att bygga din progression',
    'prog-presets-label': 'Färdiga progressioner',
    'btn-play': '▶ Spela',
    'btn-stop': '■ Stopp',
    'btn-clear': 'Rensa',
    'btn-loop-on': '⟳ Loop: På',
    'btn-loop-off': '⟳ Loop: Av',
    'prog-type-major': 'Dur',
    'prog-type-minor': 'Moll',
    'prog-type-dim': 'Dim',
    'preset-desc-0': 'Blues & rock-klassiker',
    'preset-desc-1': 'Popens vanligaste progression',
    'preset-desc-2': '50-tals & doowop',
    'preset-desc-3': 'Jazzens grundrörelse',
    'preset-desc-4': 'Klassisk blues-loop',
    'preset-desc-5': 'Mörk pop (börjar på VI)',
    'qsub-type': 'Gissa ackordtyp',
    'qsub-tones': 'Hitta ackordtoner',
    'quiz-score-lbl': 'Poäng',
    'q1-instruction': 'Lyssna och titta på ackordet. Vilken typ är det?',
    'q1-replay': '♪ Spela igen',
    'q-next': 'Nästa fråga →',
    'q2-instruction': 'Klicka på de tre tonerna som bildar detta ackord på pianot',
    'q2-progress-of': 'toner funna',
    'q2-reveal-btn': 'Visa svar',
    'q2-result-ok': '✓ Rätt! Alla tre toner hittade utan felklick.',
    'q2-result-found': 'Bra jobbat! Du hittade alla toner',
    'q2-result-wrongs': 'felklick',
    'q2-answer-prefix': 'Svaret är:',
    'q1-correct': '✓ Rätt!',
    'q1-wrong': '✗ Fel.',
    'q1-it-was': 'Det var',
    'prog-remove': 'Klicka för att ta bort',
    'iv-oct': 'okt',
    'reset-score': 'Återställ poäng',
    'quiz-type-major': 'Dur',
    'quiz-type-minor': 'Moll',
    'quiz-type-dim': 'Förminskad',
    'quiz-type-aug': 'Förstärkt',
    'tab-guitar': 'Gitarr',
    'gt-root-label': 'Grundton',
    'gt-mode-label': 'Visa',
    'gt-mode-scale': 'Skala',
    'gt-mode-chord': 'Ackord',
    'gt-type-label': 'Typ',
    'gt-hint': 'Standardstämning EADGBE · klicka var som helst på greppbrädan för att höra tonen',
    'gt-tones-label': 'Toner',
    'prog-tempo': 'Tempo:',
  },
  en: {
    'app-title': 'Music Theory',
    'lang-btn': 'SV',
    'tab-intervals': 'Intervals',
    'tab-scales': 'Scales',
    'tab-chords': 'Chords',
    'tab-prog': 'Progressions',
    'tab-quiz': 'Practice',
    'audio-on': '♪ Sound: On',
    'audio-off': '♪ Sound: Off',
    'iv-hint': '<strong>1.</strong> Click a note → root&nbsp;&nbsp;<strong>2.</strong> Click another note → see the interval',
    'iv-reset': 'Reset',
    'iv-root-chosen': 'Root selected — click another note',
    'iv-stat-semi': 'Semitones',
    'iv-stat-degree': 'Scale Degree',
    'iv-stat-notes': 'Notes',
    'iv-dir-up': '↑ up',
    'iv-dir-down': '↓ down',
    'ref-show': 'Show all intervals ▾',
    'ref-hide': 'Hide intervals ▴',
    'ref-th-semi': 'Semitones',
    'ref-th-sv': 'Swedish',
    'ref-th-en': 'Interval name',
    'ref-th-deg': 'Scale degree',
    'sc-root-label': 'Root note',
    'sc-type-label': 'Scale type',
    'sc-btn-major': 'Major Scale',
    'sc-btn-minor': 'Natural Minor Scale',
    'sc-dia-label': 'Diatonic Chords',
    'sc-chord-hint': 'Click a chord to see and hear it',
    'scale-name-major': 'Major Scale',
    'scale-name-minor': 'Natural Minor Scale',
    'scale-explain-major': 'The pattern is <strong>W–W–H–W–W–W–H</strong> (W = whole step = 2 semitones, H = half step = 1 semitone). The bright, "happy" character comes mainly from the <strong>major third</strong> (4 semitones up to step 3).',
    'scale-explain-minor': 'The pattern is <strong>W–H–W–W–H–W–W</strong>. The half steps now fall on 2→3 and 5→6. It\'s mainly the <strong>minor third</strong> (3 semitones up to step 3) that gives the darker, "sadder" character.',
    'scale-rel-major': 'minor scale',
    'scale-rel-minor': 'major scale',
    'scale-rel-shares': 'is the relative {relType} — it shares the exact same seven notes.',
    'badge-major': 'Major',
    'badge-minor': 'Minor',
    'badge-dim': 'Diminished',
    'why-major': '<strong>Major third</strong> (4 st) + <strong>minor third</strong> (3 st) → major chord',
    'why-minor': '<strong>Minor third</strong> (3 st) + <strong>major third</strong> (4 st) → minor chord',
    'why-dim':   '<strong>Minor third</strong> (3 st) + <strong>minor third</strong> (3 st) → diminished chord',
    'why-aug':   '<strong>Major third</strong> (4 st) + <strong>major third</strong> (4 st) → augmented chord',
    'cb-root-label': 'Root note',
    'cb-type-label': 'Chord type',
    'cb-hint': 'Choose root note and type above',
    'ctt-note': 'Note',
    'ctt-semi': 'Semitones',
    'ctt-degree': 'Degree',
    'int-major-third': 'Major third',
    'int-minor-third': 'Minor third',
    'int-perf-fourth': 'Perfect fourth',
    'int-perf-fifth': 'Perfect fifth (7 st)',
    'int-dim-fifth': 'Diminished fifth (6 st)',
    'int-aug-fifth': 'Augmented fifth (8 st)',
    'cb-why-major': 'Major chord: the major third gives the bright character, minor third completes to a fifth.',
    'cb-why-minor': 'Minor chord: the minor third gives the darker character, major third completes to a fifth.',
    'cb-why-dim':   'Diminished: two stacked minor thirds create a tense, unstable sound.',
    'cb-why-aug':   'Augmented: major third + major third — the fifth is raised a half step, giving an open, unresolved sound.',
    'cb-type-major': 'Major',
    'cb-type-minor': 'Minor',
    'cb-type-dim': 'Diminished',
    'cb-type-aug': 'Augmented',
    'prog-key-label': 'Key',
    'prog-scale-major': 'Major',
    'prog-scale-minor': 'Minor',
    'prog-empty': 'Click chords above to build your progression',
    'prog-presets-label': 'Presets',
    'btn-play': '▶ Play',
    'btn-stop': '■ Stop',
    'btn-clear': 'Clear',
    'btn-loop-on': '⟳ Loop: On',
    'btn-loop-off': '⟳ Loop: Off',
    'prog-type-major': 'Major',
    'prog-type-minor': 'Minor',
    'prog-type-dim': 'Dim',
    'preset-desc-0': 'Blues & rock classic',
    'preset-desc-1': 'Most common pop progression',
    'preset-desc-2': '50s & doo-wop',
    'preset-desc-3': "Jazz's basic movement",
    'preset-desc-4': 'Classic blues loop',
    'preset-desc-5': 'Dark pop (starts on VI)',
    'qsub-type': 'Guess chord type',
    'qsub-tones': 'Find chord tones',
    'quiz-score-lbl': 'Score',
    'q1-instruction': 'Listen and look at the chord. What type is it?',
    'q1-replay': '♪ Play again',
    'q-next': 'Next question →',
    'q2-instruction': 'Click the three notes that form this chord on the piano',
    'q2-progress-of': 'notes found',
    'q2-reveal-btn': 'Show answer',
    'q2-result-ok': '✓ Correct! All three notes found without mistakes.',
    'q2-result-found': 'Well done! You found all notes',
    'q2-result-wrongs': 'wrong clicks',
    'q2-answer-prefix': 'The answer is:',
    'q1-correct': '✓ Correct!',
    'q1-wrong': '✗ Wrong.',
    'q1-it-was': 'It was',
    'prog-remove': 'Click to remove',
    'iv-oct': 'oct',
    'reset-score': 'Reset score',
    'quiz-type-major': 'Major',
    'quiz-type-minor': 'Minor',
    'quiz-type-dim': 'Diminished',
    'quiz-type-aug': 'Augmented',
    'tab-guitar': 'Guitar',
    'gt-root-label': 'Root note',
    'gt-mode-label': 'Show',
    'gt-mode-scale': 'Scale',
    'gt-mode-chord': 'Chord',
    'gt-type-label': 'Type',
    'gt-hint': 'Standard tuning EADGBE · click anywhere on the fretboard to hear the note',
    'gt-tones-label': 'Notes',
    'prog-tempo': 'Tempo:',
  },
};

function t(key) { return TRANSLATIONS[lang][key] ?? TRANSLATIONS['sv'][key] ?? key; }

function toggleLang() {
  lang = lang === 'sv' ? 'en' : 'sv';
  store.set('mt-lang', lang);
  applyLang();
}

function applyLang() {
  // Update static data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = TRANSLATIONS[lang][el.dataset.i18n];
    if (val !== undefined) el.innerHTML = val;
  });
  document.getElementById('lang-toggle').classList.toggle('is-en', lang === 'en');
  document.getElementById('refTable').classList.toggle('lang-en', lang === 'en');

  // Update audio buttons (state-dependent)
  document.querySelectorAll('.audio-btn').forEach(btn => {
    if (btn.dataset.i18n) {
      btn.innerHTML = audioEnabled ? t('audio-on') : t('audio-off');
      btn.dataset.i18n = audioEnabled ? 'audio-on' : 'audio-off';
      btn.classList.toggle('muted', !audioEnabled);
    }
  });

  // Update play/loop buttons (state-dependent)
  const playBtn = document.getElementById('play-btn');
  if (playBtn) { playBtn.innerHTML = progPlaying ? t('btn-stop') : t('btn-play'); }
  const loopBtn = document.getElementById('loop-btn');
  if (loopBtn) { loopBtn.innerHTML = progLoop ? t('btn-loop-on') : t('btn-loop-off'); }

  // Update chord type buttons in chord builder
  CB_CHORD_TYPES.forEach(ct => {
    const btn = document.getElementById(`cb-type-btn-${ct.id}`);
    if (btn) btn.textContent = t('cb-type-' + ct.id);
  });

  // Update quiz answer buttons
  QUIZ_TYPES.forEach(qt => {
    const btn = document.getElementById(`q1-ans-${qt.id}`);
    if (btn) btn.textContent = t('quiz-type-' + qt.id);
  });

  // Rebuild presets (descriptions change)
  renderPresets();

  // Re-render dynamic sections (silent — a language switch must never play audio)
  renderScale(true);
  renderChordBuilder(true);
  renderGtTypeBtns();
  renderGuitar();
  renderProgPalette();
  renderProgSeq();
  updateQuizScore();
  if (q2State.root !== null) updateQ2Progress();
}

// ═══════════════════════════════════════════════════════════
// AUDIO
// ═══════════════════════════════════════════════════════════
let audioCtx     = null;
let masterOut    = null;
let audioEnabled = true;

function initAudio() {
  if (audioCtx) { if (audioCtx.state === 'suspended') audioCtx.resume(); return; }
  audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
  masterOut = audioCtx.createDynamicsCompressor();
  masterOut.connect(audioCtx.destination);
}

function noteToFreq(keyIndex) {
  const midi = (START_OCT + Math.floor(keyIndex / 12) + 1) * 12 + (keyIndex % 12);
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function playNote(keyIndex) { playFreq(noteToFreq(keyIndex)); }
function playMidi(midi)     { playFreq(440 * Math.pow(2, (midi - 69) / 12)); }

function playFreq(freq) {
  if (!audioEnabled) return;
  initAudio();
  const now  = audioCtx.currentTime;
  const env  = audioCtx.createGain();
  env.connect(masterOut);
  [
    { mult: 1, gain: 0.55, type: 'triangle' },
    { mult: 2, gain: 0.18, type: 'sine' },
    { mult: 3, gain: 0.09, type: 'sine' },
    { mult: 4, gain: 0.04, type: 'sine' },
  ].forEach(h => {
    const osc = audioCtx.createOscillator();
    const g   = audioCtx.createGain();
    osc.type = h.type; osc.frequency.value = freq * h.mult; g.gain.value = h.gain;
    osc.connect(g); g.connect(env); osc.start(now); osc.stop(now + 2.5);
  });
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(0.5,    now + 0.012);
  env.gain.exponentialRampToValueAtTime(0.18, now + 0.35);
  env.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  document.querySelectorAll('.audio-btn').forEach(btn => {
    btn.innerHTML = audioEnabled ? t('audio-on') : t('audio-off');
    if (btn.dataset.i18n) btn.dataset.i18n = audioEnabled ? 'audio-on' : 'audio-off';
    btn.classList.toggle('muted', !audioEnabled);
  });
}

// ═══════════════════════════════════════════════════════════
// PIANO BUILDER
// ═══════════════════════════════════════════════════════════
function buildPiano(containerId, km, onClick) {
  const piano = document.getElementById(containerId);
  piano.innerHTML = '';
  const wPos = []; let wCount = 0;
  for (let i = 0; i < SPAN; i++)
    wPos.push(WHITE_POS[i % 12] !== null ? wCount++ : null);

  piano.style.cssText = `width:${wCount * W}px;position:relative;`;

  for (let i = 0; i < SPAN; i++) {
    if (wPos[i] === null) continue;
    const ni = i % 12, oct = START_OCT + Math.floor(i / 12);
    const el = document.createElement('div');
    el.className = 'key-w';
    el.innerHTML = `<span class="k-label">${NOTES[ni]}<br><span style="font-size:0.55rem;color:#aaa">${oct}</span></span>`;
    el.addEventListener('click', () => onClick(i));
    piano.appendChild(el);
    km[i] = { el, isWhite: true, noteIndex: ni, octave: oct };
  }
  for (let i = 0; i < SPAN; i++) {
    if (wPos[i] !== null) continue;
    const ni = i % 12, oct = START_OCT + Math.floor(i / 12);
    const left = wPos[i - 1] * W + W - BW / 2;
    const el = document.createElement('div');
    el.className  = 'key-b';
    el.style.left = left + 'px';
    el.innerHTML  = '<span class="k-label-b"></span>';
    el.addEventListener('click', () => onClick(i));
    piano.appendChild(el);
    km[i] = { el, isWhite: false, noteIndex: ni, octave: oct };
  }
}

function setKeyClass(km, i, cls) {
  const k = km[i]; if (!k) return;
  k.el.className = (k.isWhite ? 'key-w' : 'key-b') + (cls ? ' ' + cls : '');
}

// ═══════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════
function showTab(name) {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.getElementById('tab-btn-' + name).classList.add('active');
}

// ═══════════════════════════════════════════════════════════
// INTERVALS
// ═══════════════════════════════════════════════════════════
const INTERVALS = [
  { sv: 'Prim',          en: 'Unison',       degree: '1',     semitones: 0  },
  { sv: 'Liten sekund',  en: 'Minor 2nd',    degree: 'b2',    semitones: 1  },
  { sv: 'Stor sekund',   en: 'Major 2nd',    degree: '2',     semitones: 2  },
  { sv: 'Liten ters',    en: 'Minor 3rd',    degree: 'b3',    semitones: 3  },
  { sv: 'Stor ters',     en: 'Major 3rd',    degree: '3',     semitones: 4  },
  { sv: 'Kvart',         en: 'Perfect 4th',  degree: '4',     semitones: 5  },
  { sv: 'Tritonus',      en: 'Tritone',      degree: '#4/b5', semitones: 6  },
  { sv: 'Kvint',         en: 'Perfect 5th',  degree: '5',     semitones: 7  },
  { sv: 'Liten sext',    en: 'Minor 6th',    degree: 'b6',    semitones: 8  },
  { sv: 'Stor sext',     en: 'Major 6th',    degree: '6',     semitones: 9  },
  { sv: 'Liten septima', en: 'Minor 7th',    degree: 'b7',    semitones: 10 },
  { sv: 'Stor septima',  en: 'Major 7th',    degree: '7',     semitones: 11 },
  { sv: 'Oktav',         en: 'Octave',       degree: '8 (1)', semitones: 12 },
];

const COMPOUND_INTERVALS = {
  13: { sv: 'Liten nona',         en: 'Minor 9th',       degree: 'b9'  },
  14: { sv: 'Stor nona',          en: 'Major 9th',       degree: '9'   },
  15: { sv: 'Liten decima',       en: 'Minor 10th',      degree: 'b10' },
  16: { sv: 'Stor decima',        en: 'Major 10th',      degree: '10'  },
  17: { sv: 'Ren undecima',       en: 'Perfect 11th',    degree: '11'  },
  18: { sv: 'Förhöjd undecima',   en: 'Aug 11th',        degree: '#11' },
  19: { sv: 'Ren duodecima',      en: 'Perfect 12th',    degree: '12'  },
  20: { sv: 'Liten tredecima',    en: 'Minor 13th',      degree: 'b13' },
  21: { sv: 'Stor tredecima',     en: 'Major 13th',      degree: '13'  },
  22: { sv: 'Liten kvartdecima',  en: 'Minor 14th',      degree: 'b14' },
  23: { sv: 'Stor kvartdecima',   en: 'Major 14th',      degree: '14'  },
  24: { sv: 'Dubbeloktav',        en: 'Double octave',   degree: '15'  },
};

// ── Correct interval spelling ────────────────────────────────
// A minor third from C is Eb, not D# — the target note's letter is fixed by
// the interval's scale degree, the accidental follows from the semitones.
// Letter steps per simple interval 0–11 (tritone is ambiguous, handled below).
const IV_LETTER_STEPS = [0, 1, 1, 2, 2, 3, null, 4, 5, 5, 6, 6];

function spellFromRoot(rootNi, letterSteps, semis, dir) {
  const targetLetter = ((PREF_LETTER[rootNi] + dir * letterSteps) % 7 + 7) % 7;
  const natSemi      = LTR_SEMI[targetLetter];
  const actualSemi   = ((rootNi + dir * semis) % 12 + 12) % 12;
  let acc = actualSemi - natSemi;
  if (acc >  6) acc -= 12;
  if (acc < -6) acc += 12;
  const accStr = acc ===  1 ? '#' : acc === -1 ? 'b' :
                 acc ===  2 ? '##': acc === -2 ? 'bb' : '';
  return LTR[targetLetter] + accStr;
}

function intervalTargetName(rootNi, absSemi, dir) {
  const simple = absSemi % 12;
  if (simple === 6) {
    // Tritone: both enharmonic spellings (#4 and b5) are equally valid
    return `${spellFromRoot(rootNi, 3, absSemi, dir)}/${spellFromRoot(rootNi, 4, absSemi, dir)}`;
  }
  return spellFromRoot(rootNi, IV_LETTER_STEPS[simple], absSemi, dir);
}

const ivKm = {};
buildPiano('piano-iv', ivKm, onIvKey);

let ivRoot = null, ivTarget = null;
const infoIv = document.getElementById('info-iv');

function onIvKey(i) {
  if (ivRoot === null) {
    ivRoot = i; setKeyClass(ivKm, i, 'is-root');
    infoIv.innerHTML = `<div><div class="root-note">${CB_ROOT_NAMES[ivKm[i].noteIndex]}${ivKm[i].octave}</div><div class="hint">${t('iv-root-chosen')}</div></div>`;
    playNote(i);
  } else if (i === ivRoot) {
    resetIv();
  } else {
    if (ivTarget !== null) setKeyClass(ivKm, ivTarget, null);
    ivTarget = i; setKeyClass(ivKm, i, 'is-target');
    const rawSemi = i - ivRoot;
    const absSemi = Math.abs(rawSemi);
    const isCompound = absSemi > 12;
    const iv = isCompound ? COMPOUND_INTERVALS[absSemi] : INTERVALS[absSemi];
    const simpleIv = isCompound ? INTERVALS[absSemi - 12] : null;
    const octaveWord = lang === 'sv' ? 'oktav' : 'octave';
    const compoundNote = simpleIv ? `= ${lang === 'sv' ? simpleIv.sv.toLowerCase() : simpleIv.en.toLowerCase()} + ${octaveWord}` : '';
    const rk = ivKm[ivRoot], tk = ivKm[i];
    const rootName   = CB_ROOT_NAMES[rk.noteIndex];
    const targetName = intervalTargetName(rk.noteIndex, absSemi, rawSemi >= 0 ? 1 : -1);
    infoIv.innerHTML = `<div style="width:100%">
      <div class="result-name-sv">${lang === 'sv' ? iv.sv : iv.en}</div>
      ${lang === 'sv' ? `<div class="result-name-en">${iv.en}</div>` : ''}
      ${compoundNote ? `<div class="compound-note">${compoundNote}</div>` : ''}
      <div class="stats">
        <div class="stat"><div class="stat-label">${t('iv-stat-semi')}</div><div class="stat-value">${absSemi}</div><div class="stat-sub">${rawSemi >= 0 ? t('iv-dir-up') : t('iv-dir-down')}</div></div>
        <div class="stat"><div class="stat-label">${t('iv-stat-degree')}</div><div class="stat-value">${iv.degree}</div></div>
        <div class="stat"><div class="stat-label">${t('iv-stat-notes')}</div><div class="stat-value" style="font-size:1.1rem">${rootName} → ${targetName}</div><div class="stat-sub">${t('iv-oct')} ${rk.octave} → ${tk.octave}</div></div>
      </div></div>`;
    playNote(ivRoot); setTimeout(() => playNote(i), 550);
  }
}

function resetIv() {
  if (ivRoot   !== null) setKeyClass(ivKm, ivRoot,   null);
  if (ivTarget !== null) setKeyClass(ivKm, ivTarget, null);
  ivRoot = null; ivTarget = null;
  infoIv.innerHTML = `<p class="hint">${t('iv-hint')}</p>`;
}

const refBody = document.getElementById('refBody');
INTERVALS.forEach(iv => {
  const tr = document.createElement('tr');
  tr.innerHTML = `<td class="td-sem">${iv.semitones}</td><td class="td-sv">${iv.sv}</td><td>${iv.en}</td><td class="td-deg">${iv.degree}</td>`;
  refBody.appendChild(tr);
});

function toggleRef() {
  const tbl = document.getElementById('refTable');
  const btn = document.getElementById('ref-toggle-btn');
  tbl.classList.toggle('open');
  const key = tbl.classList.contains('open') ? 'ref-hide' : 'ref-show';
  btn.innerHTML = t(key);
  btn.dataset.i18n = key;
}

// ═══════════════════════════════════════════════════════════
// SCALES
// ═══════════════════════════════════════════════════════════
const SCALE_PATTERNS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
};
const STEP_PATTERNS = {
  major: [2,2,1,2,2,2,1],
  minor: [2,1,2,2,1,2,2],
};

// Proper note names for all 24 keys (index = chromatic root 0–11)
const SCALE_NOTE_NAMES = {
  major: [
    ['C','D','E','F','G','A','B'],
    ['Db','Eb','F','Gb','Ab','Bb','C'],
    ['D','E','F#','G','A','B','C#'],
    ['Eb','F','G','Ab','Bb','C','D'],
    ['E','F#','G#','A','B','C#','D#'],
    ['F','G','A','Bb','C','D','E'],
    ['F#','G#','A#','B','C#','D#','E#'],
    ['G','A','B','C','D','E','F#'],
    ['Ab','Bb','C','Db','Eb','F','G'],
    ['A','B','C#','D','E','F#','G#'],
    ['Bb','C','D','Eb','F','G','A'],
    ['B','C#','D#','E','F#','G#','A#'],
  ],
  minor: [
    ['C','D','Eb','F','G','Ab','Bb'],
    ['C#','D#','E','F#','G#','A','B'],
    ['D','E','F','G','A','Bb','C'],
    ['Eb','F','Gb','Ab','Bb','Cb','Db'],
    ['E','F#','G','A','B','C','D'],
    ['F','G','Ab','Bb','C','Db','Eb'],
    ['F#','G#','A','B','C#','D','E'],
    ['G','A','Bb','C','D','Eb','F'],
    ['G#','A#','B','C#','D#','E','F#'],
    ['A','B','C','D','E','F','G'],
    ['Bb','C','Db','Eb','F','Gb','Ab'],
    ['B','C#','D','E','F#','G','A'],
  ],
};

const ROOT_DISPLAY   = ['C','C#/Db','D','D#/Eb','E','F','F#/Gb','G','G#/Ab','A','A#/Bb','B'];
const CHORD_QUALITIES = {
  major: ['major','minor','minor','major','major','minor','dim'],
  minor: ['minor','dim','major','minor','minor','major','major'],
};
const ROMAN = ['I','II','III','IV','V','VI','VII'];
const CHORD_INTERVALS  = { major: [0,4,7], minor: [0,3,7], dim: [0,3,6], aug: [0,4,8] };
// Root note display names using standard chord spellings (sharps/flats)
const CB_ROOT_NAMES    = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

function chordWhy(type) { return t('why-' + type); }

let scaleRoot = 9; // A
let scaleType = 'major';
let selectedDeg = null;
const scKm = {};

// Root buttons
const rootBtnsEl = document.getElementById('root-btns');
NOTES.forEach((_, i) => {
  const btn = document.createElement('button');
  btn.className   = 'sel-btn' + (i === scaleRoot ? ' active-root' : '');
  btn.textContent = ROOT_DISPLAY[i];
  btn.id          = `root-btn-${i}`;
  btn.onclick     = () => selectRoot(i);
  rootBtnsEl.appendChild(btn);
});

buildPiano('piano-sc', scKm, onScKey);
renderScale();

function selectRoot(i) {
  document.querySelectorAll('#root-btns .sel-btn').forEach(b => b.classList.remove('active-root'));
  document.getElementById(`root-btn-${i}`).classList.add('active-root');
  scaleRoot = i; selectedDeg = null; renderScale();
}

function selectScaleType(type) {
  document.getElementById('scale-btn-major').classList.toggle('active-type', type === 'major');
  document.getElementById('scale-btn-minor').classList.toggle('active-type', type === 'minor');
  scaleType = type; selectedDeg = null; renderScale();
}

function onScKey(i) { playNote(i); }

function renderScale(silent = false) {
  const pattern    = SCALE_PATTERNS[scaleType];
  const steps      = STEP_PATTERNS[scaleType];
  const noteNames  = SCALE_NOTE_NAMES[scaleType][scaleRoot];
  const scaleNIs   = pattern.map(off => (scaleRoot + off) % 12); // note indices in scale

  // ── Piano highlighting + labels ──────────────────────────
  for (let k = 0; k < SPAN; k++) {
    const km = scKm[k]; if (!km) continue;
    const ni    = k % 12;
    const degIdx = scaleNIs.indexOf(ni);  // 0–6 or -1

    // Class
    if (degIdx === 0)       setKeyClass(scKm, k, 'is-scale-root');
    else if (degIdx !== -1) setKeyClass(scKm, k, 'is-scale');
    else                    setKeyClass(scKm, k, null);

    // Label
    if (km.isWhite) {
      const lbl = km.el.querySelector('.k-label');
      if (degIdx !== -1) {
        lbl.innerHTML = `<span style="font-size:0.7rem">${noteNames[degIdx]}</span><br><span style="font-size:0.58rem;opacity:0.85">${degIdx + 1}</span>`;
      } else {
        lbl.innerHTML = `${NOTES[ni]}<br><span style="font-size:0.55rem;color:#aaa">${START_OCT + Math.floor(k/12)}</span>`;
      }
    } else {
      const lbl = km.el.querySelector('.k-label-b');
      lbl.textContent = degIdx !== -1 ? noteNames[degIdx] : '';
    }
  }

  // ── Scale info box ────────────────────────────────────────
  const rootName    = noteNames[0];
  const scaleNameSv = scaleType === 'major' ? 'durskala'           : 'naturlig mollskala';
  const scaleNameEn = scaleType === 'major' ? 'Major Scale'        : 'Natural Minor Scale';
  const explainText = t('scale-explain-' + scaleType);

  // Relative key
  const relRoot = scaleType === 'major'
    ? (scaleRoot + 9) % 12
    : (scaleRoot + 3) % 12;
  const relName    = scaleType === 'major'
    ? SCALE_NOTE_NAMES.minor[relRoot][0]
    : SCALE_NOTE_NAMES.major[relRoot][0];
  const relTypeName = t('scale-rel-' + scaleType);

  // Tone bubbles with step labels
  let tonesHtml = '';
  noteNames.forEach((name, i) => {
    tonesHtml += `<span class="tone-bubble ${i === 0 ? 'is-root-bubble' : ''}">${name}</span>`;
    const s = steps[i];
    if (s !== undefined) tonesHtml += `<span class="tone-step ${s === 1 ? 'half' : ''}">${s === 2 ? 'H' : 'h'}</span>`;
  });
  tonesHtml += `<span class="tone-bubble is-root-bubble">${rootName}</span>`;

  const scaleTitle = lang === 'sv'
    ? `${rootName}-${scaleNameSv} <span>${rootName} ${scaleNameEn}</span>`
    : `${rootName} ${scaleNameEn}`;
  const relLine = lang === 'sv'
    ? `<strong>${relName}-${relTypeName.replace(' ', '-')}</strong> ${t('scale-rel-shares').replace('{relType}', relTypeName)}`
    : `<strong>${relName} ${relTypeName}</strong> ${t('scale-rel-shares').replace('{relType}', relTypeName)}`;

  document.getElementById('scale-info').innerHTML = `
    <div class="scale-title">${scaleTitle}</div>
    <div class="scale-tones">${tonesHtml}</div>
    <div class="scale-explain">${explainText}</div>
    <div class="scale-relative">${relLine}</div>
  `;

  // ── Diatonic chords ───────────────────────────────────────
  renderChords(noteNames, pattern);

  // If a chord was selected before, re-apply its highlight
  if (selectedDeg !== null) applyChordHighlight(pattern, silent);
}

function renderChords(noteNames, pattern) {
  const qualities = CHORD_QUALITIES[scaleType];
  const grid = document.getElementById('chord-grid');
  grid.innerHTML = '';

  qualities.forEach((type, deg) => {
    const root   = noteNames[deg];
    const third  = noteNames[(deg + 2) % 7];
    const fifth  = noteNames[(deg + 4) % 7];
    const suffix = type === 'minor' ? 'm' : type === 'dim' ? 'dim' : '';
    // Convention: minor and diminished chords in lowercase, dim marked with °
    const numeral = type === 'minor' ? ROMAN[deg].toLowerCase()
                  : type === 'dim'   ? ROMAN[deg].toLowerCase() + '°'
                  : ROMAN[deg];
    const badgeClass = `badge-${type}`;
    const badgeLabel = t('badge-' + type);

    const card = document.createElement('div');
    card.className = 'chord-card' + (selectedDeg === deg ? ' selected' : '');
    card.innerHTML = `
      <div class="chord-top">
        <span class="chord-numeral">${numeral}</span>
        <span class="chord-name">${root}${suffix}</span>
      </div>
      <span class="chord-badge ${badgeClass}">${badgeLabel}</span>
      <div class="chord-tones">${root} – ${third} – ${fifth}</div>
      <div class="chord-why">${chordWhy(type)}</div>
    `;
    card.addEventListener('click', () => selectChord(deg, noteNames, pattern));
    grid.appendChild(card);
  });
}

function selectChord(deg, noteNames, pattern) {
  selectedDeg = selectedDeg === deg ? null : deg;
  renderChords(noteNames, pattern);

  // Reset scale colours first
  const scaleNIs = pattern.map(off => (scaleRoot + off) % 12);
  for (let k = 0; k < SPAN; k++) {
    const ni = scKm[k]?.noteIndex;
    const d  = scaleNIs.indexOf(ni);
    if (d === 0)       setKeyClass(scKm, k, 'is-scale-root');
    else if (d !== -1) setKeyClass(scKm, k, 'is-scale');
    else               setKeyClass(scKm, k, null);
  }

  if (selectedDeg === null) return;
  applyChordHighlight(pattern);
}

// ═══════════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════════

const QUIZ_TYPES = [
  { id: 'major', sv: 'Dur',        en: 'Major' },
  { id: 'minor', sv: 'Moll',       en: 'Minor' },
  { id: 'dim',   sv: 'Förminskad', en: 'Dim'   },
  { id: 'aug',   sv: 'Förstärkt',  en: 'Aug'   },
];

let qScore     = { correct: 0, total: 0 };
let qExercise  = 'type'; // 'type' | 'tones'

// ── Shared helpers ──────────────────────────────────────────
function quizChordKeys(root, type, preferOct4 = true) {
  const ivals = CHORD_INTERVALS[type];
  let rootKey = null;
  const start = preferOct4 ? 12 : 0;
  for (let k = start; k < start + 12; k++) {
    if (k % 12 === root) { rootKey = k; break; }
  }
  // If highest note exceeds span, shift entire chord down an octave
  if (rootKey + ivals[ivals.length - 1] >= SPAN) rootKey -= 12;
  return ivals.map(iv => {
    const k = rootKey + iv;
    return (k >= 0 && k < SPAN) ? k : null;
  });
}

function randomChord() {
  return {
    root: Math.floor(Math.random() * 12),
    type: QUIZ_TYPES[Math.floor(Math.random() * 4)].id,
  };
}

function updateQuizScore() {
  document.getElementById('quiz-score-display').innerHTML =
    `${t('quiz-score-lbl')}: <strong>${qScore.correct} / ${qScore.total}</strong>`;
}

function resetQuizScore() {
  qScore = { correct: 0, total: 0 };
  updateQuizScore();
}

function showQuizEx(type) {
  qExercise = type;
  document.getElementById('qsub-btn-type').classList.toggle('active',  type === 'type');
  document.getElementById('qsub-btn-tones').classList.toggle('active', type === 'tones');
  document.getElementById('qpanel-type').classList.toggle('hidden',  type !== 'type');
  document.getElementById('qpanel-tones').classList.toggle('hidden', type !== 'tones');
}

// ── Exercise 1: Guess chord type ────────────────────────────
const q1Km = {};
buildPiano('piano-q1', q1Km, () => {}); // clicks do nothing on q1 piano

let q1State = { root: null, type: null, answered: false };

// Build answer buttons once
const q1BtnsEl = document.getElementById('q1-btns');
QUIZ_TYPES.forEach(qt => {
  const btn = document.createElement('button');
  btn.className   = 'q-ans-btn';
  btn.id          = `q1-ans-${qt.id}`;
  btn.textContent = t('quiz-type-' + qt.id);
  btn.onclick     = () => answerQ1(qt.id);
  q1BtnsEl.appendChild(btn);
});

function newQ1() {
  const c = randomChord();
  q1State = { ...c, answered: false };

  // Reset UI
  document.getElementById('q1-result').classList.add('hidden');
  document.getElementById('q1-next').classList.add('hidden');
  document.querySelectorAll('.q-ans-btn').forEach(b => {
    b.disabled = false;
    b.classList.remove('is-correct', 'is-wrong');
  });

  // Highlight chord on piano (all tones same neutral color — no root hint)
  for (let k = 0; k < SPAN; k++) setKeyClass(q1Km, k, null);
  quizChordKeys(c.root, c.type).forEach(k => {
    if (k !== null) setKeyClass(q1Km, k, 'is-quiz');
  });

  // Play chord
  playQ1Chord();
}

function playQ1Chord() {
  quizChordKeys(q1State.root, q1State.type).forEach(k => {
    if (k !== null) playNote(k);
  });
}

function replayQ1() { playQ1Chord(); }

function answerQ1(type) {
  if (q1State.answered) return;
  q1State.answered = true;

  const correct   = type === q1State.type;
  const rootName  = CB_ROOT_NAMES[q1State.root];
  const typeSv    = QUIZ_TYPES.find(t => t.id === q1State.type).sv;
  const chordName = rootName + (q1State.type === 'minor' ? 'm' : q1State.type === 'dim' ? 'dim' : q1State.type === 'aug' ? 'aug' : '');

  qScore.total++;
  if (correct) qScore.correct++;
  updateQuizScore();

  // Style buttons
  document.querySelectorAll('.q-ans-btn').forEach(b => b.disabled = true);
  document.getElementById(`q1-ans-${q1State.type}`).classList.add('is-correct');
  if (!correct) document.getElementById(`q1-ans-${type}`).classList.add('is-wrong');

  // Reveal root on piano (orange)
  setKeyClass(q1Km, quizChordKeys(q1State.root, q1State.type)[0], 'is-scale-root');

  // Result panel
  const resultEl = document.getElementById('q1-result');
  resultEl.className = `quiz-result ${correct ? 'is-correct' : 'is-wrong'}`;
  const typeName = t('quiz-type-' + q1State.type);
  resultEl.innerHTML = correct
    ? `<strong>${t('q1-correct')}</strong> ${t('q1-it-was')} <strong>${chordName}</strong> — ${typeName}<div class="why">${chordWhy(q1State.type)}</div>`
    : `<strong>${t('q1-wrong')}</strong> ${t('q1-it-was')} <strong>${chordName}</strong> — ${typeName}<div class="why">${chordWhy(q1State.type)}</div>`;
  resultEl.classList.remove('hidden');
  document.getElementById('q1-next').classList.remove('hidden');
}

// ── Exercise 2: Find chord tones ────────────────────────────
const q2Km = {};
buildPiano('piano-q2', q2Km, onQ2Key);

let q2State = {
  root: null, type: null,
  correctNIs: [],   // correct pitch classes (0-11)
  found: new Set(), // found pitch classes
  answered: false,
  revealed: false,
  wrongClicks: 0,
};

function newQ2() {
  const c = randomChord();
  q2State = {
    ...c,
    correctNIs: CHORD_INTERVALS[c.type].map(iv => (c.root + iv) % 12),
    found: new Set(),
    answered: false, revealed: false, wrongClicks: 0,
  };

  // UI reset
  for (let k = 0; k < SPAN; k++) setKeyClass(q2Km, k, null);
  document.getElementById('q2-result').classList.add('hidden');
  document.getElementById('q2-next').classList.add('hidden');
  document.getElementById('q2-reveal').disabled = false;

  // Update chord display
  const rootName  = CB_ROOT_NAMES[c.root];
  const suffix    = c.type === 'minor' ? 'm' : c.type === 'dim' ? 'dim' : c.type === 'aug' ? 'aug' : '';
  const typeName  = t('quiz-type-' + c.type);
  document.getElementById('q2-name').textContent = rootName + suffix;
  document.getElementById('q2-type-label').textContent = `${rootName} ${typeName}`;
  updateQ2Progress();
}

function onQ2Key(keyIndex) {
  if (q2State.answered || q2State.revealed) return;
  const ni = keyIndex % 12;
  if (q2State.found.has(ni)) return; // already found this pitch class

  playNote(keyIndex);

  if (q2State.correctNIs.includes(ni)) {
    // Correct — highlight ALL keys with this pitch class
    q2State.found.add(ni);
    for (let k = 0; k < SPAN; k++) {
      if (q2Km[k] && k % 12 === ni) setKeyClass(q2Km, k, 'is-chord');
    }
    updateQ2Progress();

    if (q2State.found.size === 3) {
      q2State.answered = true;
      const correct = q2State.wrongClicks === 0 && !q2State.revealed;
      qScore.total++;
      if (correct) qScore.correct++;
      updateQuizScore();

      const resultEl = document.getElementById('q2-result');
      resultEl.className = `quiz-result ${correct ? 'is-correct' : 'is-wrong'}`;
      resultEl.innerHTML = correct
        ? `<strong>${t('q2-result-ok')}</strong>`
        : `<strong>${t('q2-result-found')}${q2State.wrongClicks > 0 ? ` (${q2State.wrongClicks} ${t('q2-result-wrongs')})` : ''}.</strong>`;
      resultEl.classList.remove('hidden');
      document.getElementById('q2-next').classList.remove('hidden');
      document.getElementById('q2-reveal').disabled = true;
    }
  } else {
    // Wrong — flash red briefly
    q2State.wrongClicks++;
    setKeyClass(q2Km, keyIndex, 'is-wrong-flash');
    setTimeout(() => setKeyClass(q2Km, keyIndex, null), 500);
  }
}

function updateQ2Progress() {
  if (q2State.root === null) return;
  document.getElementById('q2-progress').innerHTML =
    `<strong>${q2State.found.size}</strong> / 3 ${t('q2-progress-of')}`;
}

function revealQ2() {
  if (q2State.answered) return;
  q2State.revealed = true;
  q2State.answered = true;
  document.getElementById('q2-reveal').disabled = true;

  // Highlight all correct keys
  q2State.correctNIs.forEach(ni => {
    for (let k = 0; k < SPAN; k++) {
      if (q2Km[k] && k % 12 === ni) setKeyClass(q2Km, k, 'is-chord');
    }
  });
  // Play chord
  quizChordKeys(q2State.root, q2State.type).forEach(k => { if (k !== null) playNote(k); });

  const ivals = CHORD_INTERVALS[q2State.type];
  const t1 = CB_ROOT_NAMES[q2State.root];
  const t3 = chordToneName(q2State.root, 2, ivals[1]);
  const t5 = chordToneName(q2State.root, 4, ivals[2]);

  qScore.total++;
  updateQuizScore();

  const resultEl = document.getElementById('q2-result');
  resultEl.className = 'quiz-result is-wrong';
  resultEl.innerHTML = `${t('q2-answer-prefix')} <strong>${t1} – ${t3} – ${t5}</strong><div class="why">${chordWhy(q2State.type)}</div>`;
  resultEl.classList.remove('hidden');
  document.getElementById('q2-next').classList.remove('hidden');
  document.getElementById('q2-progress').innerHTML = `<strong>3</strong> / 3 ${t('q2-progress-of')}`;
}

// Init quiz when tab is first shown
const origShowTab = showTab;
window.showTab = function(name) {
  origShowTab(name);
  if (name === 'quiz') {
    if (q1State.root === null) newQ1();
    if (q2State.root === null) newQ2();
  }
};

// ═══════════════════════════════════════════════════════════
// PROGRESSIONS
// ═══════════════════════════════════════════════════════════

const PRESETS = [
  { name: 'I–IV–V',    degrees: [0,3,4],   desc: 'Blues & rock-klassiker' },
  { name: 'I–V–VI–IV', degrees: [0,4,5,3], desc: 'Popens vanligaste progression' },
  { name: 'I–VI–IV–V', degrees: [0,5,3,4], desc: '50-tals & doowop' },
  { name: 'II–V–I',    degrees: [1,4,0],   desc: 'Jazzens grundrörelse' },
  { name: 'I–IV–I–V',  degrees: [0,3,0,4], desc: 'Klassisk blues-loop' },
  { name: 'VI–IV–I–V', degrees: [5,3,0,4], desc: 'Mörk pop (börjar på VI)' },
];

const progTypeLabel = (type) => t('prog-type-' + type) || type;
const PROG_SUFFIX     = { major: '', minor: 'm', dim: 'dim', aug: 'aug' };

let progRoot      = 0;
let progScaleType = 'major';
let progression   = [];   // array of degree indices (0–6)
let progPlaying   = false;
let progLoop      = false;
let progTimer     = null;
let progCurIdx    = -1;
const progKm      = {};

// Root selector — labels use the actual key spelling for the current scale
// type (SCALE_NOTE_NAMES picks e.g. Db major but C# minor), so the button
// always matches the chord names shown in the palette.
NOTES.forEach((_, i) => {
  const btn = document.createElement('button');
  btn.className   = 'sel-btn' + (i === progRoot ? ' active-root' : '');
  btn.textContent = SCALE_NOTE_NAMES[progScaleType][i][0];
  btn.id          = `prog-root-btn-${i}`;
  btn.onclick     = () => {
    progRoot = i;
    document.querySelectorAll('#prog-root-btns .sel-btn').forEach(b => b.classList.remove('active-root'));
    btn.classList.add('active-root');
    stopProg();
    renderProgPalette();
    renderProgSeq();
  };
  document.getElementById('prog-root-btns').appendChild(btn);
});

function updateProgRootLabels() {
  NOTES.forEach((_, i) => {
    document.getElementById(`prog-root-btn-${i}`).textContent =
      SCALE_NOTE_NAMES[progScaleType][i][0];
  });
}

function selectProgScale(type) {
  progScaleType = type;
  document.getElementById('prog-scale-btn-major').classList.toggle('active-type', type === 'major');
  document.getElementById('prog-scale-btn-minor').classList.toggle('active-type', type === 'minor');
  updateProgRootLabels();
  stopProg();
  renderPresets();
  renderProgPalette();
  renderProgSeq();
}

// Presets — numerals rendered with the correct case for the current scale
// type (I–V–vi–IV in major becomes i–v–VI–iv in minor).
function renderPresets() {
  const presetsEl = document.getElementById('prog-presets');
  presetsEl.innerHTML = '';
  PRESETS.forEach((p, i) => {
    const label = p.degrees.map(getProgChordNumeral).join('–');
    const btn = document.createElement('button');
    btn.className   = 'preset-btn';
    btn.title       = t('preset-desc-' + i);
    btn.innerHTML   = `<strong>${label}</strong> <span style="color:#6b7280">— ${t('preset-desc-' + i)}</span>`;
    btn.onclick     = () => { progression = [...p.degrees]; stopProg(); renderProgSeq(); };
    presetsEl.appendChild(btn);
  });
}
renderPresets();

buildPiano('piano-prog', progKm, k => playNote(k));
renderProgPalette();

function getProgChordName(deg) {
  const names = SCALE_NOTE_NAMES[progScaleType][progRoot];
  const type  = CHORD_QUALITIES[progScaleType][deg];
  return names[deg] + PROG_SUFFIX[type];
}

function getProgChordNumeral(deg) {
  const type = CHORD_QUALITIES[progScaleType][deg];
  return type === 'minor' ? ROMAN[deg].toLowerCase()
       : type === 'dim'   ? ROMAN[deg].toLowerCase() + '°'
       : ROMAN[deg];
}

function getProgChordKeys(deg) {
  const pattern = SCALE_PATTERNS[progScaleType];
  const type    = CHORD_QUALITIES[progScaleType][deg];
  const ivals   = CHORD_INTERVALS[type];
  let rootKey   = null;
  for (let k = 0; k < 12; k++) { if (k % 12 === progRoot) { rootKey = k; break; } }
  let chordRoot = rootKey + pattern[deg];
  const maxIv = Math.max(...ivals);
  if (chordRoot + maxIv >= SPAN) chordRoot -= 12;
  return ivals.map(iv => {
    const k = chordRoot + iv;
    return (k >= 0 && k < SPAN) ? k : null;
  });
}

function renderProgPalette() {
  const pal = document.getElementById('prog-palette');
  pal.innerHTML = '';
  CHORD_QUALITIES[progScaleType].forEach((type, deg) => {
    const btn = document.createElement('button');
    btn.className   = 'palette-btn';
    btn.innerHTML   = `
      <span class="pal-numeral">${getProgChordNumeral(deg)}</span>
      <span class="pal-name">${getProgChordName(deg)}</span>
      <span class="pal-type">${progTypeLabel(type)}</span>`;
    btn.onclick = () => { if (progression.length < 8) { progression.push(deg); renderProgSeq(); } };
    pal.appendChild(btn);
  });
}

function renderProgSeq() {
  const seq = document.getElementById('prog-seq');
  if (progression.length === 0) {
    seq.innerHTML = `<span class="prog-empty">${t('prog-empty')}</span>`;
    return;
  }
  seq.innerHTML = '';
  progression.forEach((deg, i) => {
    const card = document.createElement('div');
    card.className = 'prog-card' + (i === progCurIdx ? ' is-playing' : '');
    card.id = `prog-card-${i}`;
    card.innerHTML = `
      <span class="prog-card-num">${getProgChordNumeral(deg)}</span>
      <span class="prog-card-name">${getProgChordName(deg)}</span>`;
    card.title  = t('prog-remove');
    card.style.cursor = 'pointer';
    card.onclick = () => {
      progression.splice(i, 1);
      stopProg();
      renderProgSeq();
    };
    seq.appendChild(card);
  });
}

function updateTempo() {
  const v = document.getElementById('prog-tempo').value;
  document.getElementById('prog-tempo-label').textContent = `${v} BPM`;
}

function toggleLoop() {
  progLoop = !progLoop;
  const btn = document.getElementById('loop-btn');
  btn.textContent = progLoop ? t('btn-loop-on') : t('btn-loop-off');
  btn.classList.toggle('is-active', progLoop);
}

function togglePlayProg() {
  if (progPlaying) stopProg();
  else startProg();
}

function startProg() {
  if (progression.length === 0) return;
  progPlaying = true;
  progCurIdx  = 0;
  document.getElementById('play-btn').textContent = t('btn-stop');
  document.getElementById('play-btn').classList.add('is-playing');
  playProgStep();
}

function stopProg() {
  progPlaying = false;
  progCurIdx  = -1;
  clearTimeout(progTimer);
  document.getElementById('play-btn').textContent = t('btn-play');
  document.getElementById('play-btn').classList.remove('is-playing');
  document.getElementById('now-playing').textContent = '';
  // Reset piano
  for (let k = 0; k < SPAN; k++) setKeyClass(progKm, k, null);
  renderProgSeq();
}

function clearProg() {
  stopProg();
  progression = [];
  renderProgSeq();
}

function playProgStep() {
  if (!progPlaying) return;

  if (progCurIdx >= progression.length) {
    if (progLoop) { progCurIdx = 0; }
    else          { stopProg(); return; }
  }

  const deg  = progression[progCurIdx];
  const keys = getProgChordKeys(deg);
  const name = getProgChordName(deg);
  const num  = getProgChordNumeral(deg);
  const type = CHORD_QUALITIES[progScaleType][deg];

  // Highlight on piano
  for (let k = 0; k < SPAN; k++) setKeyClass(progKm, k, null);
  keys.forEach((k, i) => { if (k !== null) setKeyClass(progKm, k, i === 0 ? 'is-scale-root' : 'is-chord'); });

  // Show name
  document.getElementById('now-playing').textContent = `${num}  ${name}  —  ${progTypeLabel(type)}`;

  // Highlight card
  renderProgSeq();
  const card = document.getElementById(`prog-card-${progCurIdx}`);
  if (card) card.classList.add('is-playing');

  // Play block chord
  keys.forEach(k => { if (k !== null) playNote(k); });

  const bpm      = parseInt(document.getElementById('prog-tempo').value);
  const duration = (60000 / bpm) * 2; // 2 beats per chord

  progCurIdx++;
  progTimer = setTimeout(playProgStep, duration);
}

// ═══════════════════════════════════════════════════════════
// CHORD BUILDER
// ═══════════════════════════════════════════════════════════

// Preferred letter index for each chromatic note (0–11)
// Gives clean, single-accidental spellings for all chord types
const PREF_LETTER = [0,0,1,2,2,3,3,4,5,5,6,6];
// 0=C, 1=D, 2=E, 3=F, 4=G, 5=A, 6=B
// C, C#→C, D, Eb→E, E, F, F#→F, G, Ab→A, A, Bb→B, B

const LTR       = ['C','D','E','F','G','A','B'];
const LTR_SEMI  = [0, 2, 4, 5, 7, 9, 11]; // natural semitone of each letter

const CB_CHORD_TYPES = [
  { id: 'major', sv: 'Dur',        en: 'Major',      intervals: [0,4,7],  degrees: ['1','3','5'] },
  { id: 'minor', sv: 'Moll',       en: 'Minor',      intervals: [0,3,7],  degrees: ['1','b3','5'] },
  { id: 'dim',   sv: 'Förminskad', en: 'Diminished', intervals: [0,3,6],  degrees: ['1','b3','b5'] },
  { id: 'aug',   sv: 'Förstärkt',  en: 'Augmented',  intervals: [0,4,8],  degrees: ['1','3','#5'] },
];

const CB_SUFFIX = { major: '', minor: 'm', dim: 'dim', aug: 'aug' };

// Returns the note name for a chord tone, ensuring unique letter names
function chordToneName(rootSemi, letterOffset, totalSemitones) {
  const rootLetter  = PREF_LETTER[rootSemi];
  const targetLetter = (rootLetter + letterOffset) % 7;
  const natSemi     = LTR_SEMI[targetLetter];
  const actualSemi  = (rootSemi + totalSemitones) % 12;
  let acc = actualSemi - natSemi;
  if (acc >  6) acc -= 12;
  if (acc < -6) acc += 12;
  const accStr = acc ===  1 ? '#' : acc === -1 ? 'b' :
                 acc ===  2 ? '##': acc === -2 ? 'bb' : '';
  return LTR[targetLetter] + accStr;
}

let cbRoot = 0;
let cbType = 'major';
const cbKm = {};

// Root buttons
CB_ROOT_NAMES.forEach((name, i) => {
  const btn = document.createElement('button');
  btn.className   = 'sel-btn' + (i === cbRoot ? ' active-root' : '');
  btn.textContent = name;
  btn.id          = `cb-root-btn-${i}`;
  btn.onclick     = () => { cbRoot = i; renderChordBuilder(); updateCbRootBtns(); };
  document.getElementById('cb-root-btns').appendChild(btn);
});

// Type buttons
CB_CHORD_TYPES.forEach(ct => {
  const btn = document.createElement('button');
  btn.className   = 'sel-btn' + (ct.id === cbType ? ' active-type' : '');
  btn.textContent = t('cb-type-' + ct.id);
  btn.id          = `cb-type-btn-${ct.id}`;
  btn.onclick     = () => { cbType = ct.id; renderChordBuilder(); updateCbTypeBtns(); };
  document.getElementById('cb-type-btns').appendChild(btn);
});

function updateCbRootBtns() {
  CB_ROOT_NAMES.forEach((_, i) => {
    document.getElementById(`cb-root-btn-${i}`)
      .classList.toggle('active-root', i === cbRoot);
  });
}
function updateCbTypeBtns() {
  CB_CHORD_TYPES.forEach(ct => {
    document.getElementById(`cb-type-btn-${ct.id}`)
      .classList.toggle('active-type', ct.id === cbType);
  });
}

buildPiano('piano-cb', cbKm, k => playNote(k));
renderChordBuilder(true); // silent on initial load — user triggers playback by interacting

function renderChordBuilder(silent = false) {
  const ct        = CB_CHORD_TYPES.find(t => t.id === cbType);
  const rootName  = CB_ROOT_NAMES[cbRoot];
  const chordName = rootName + CB_SUFFIX[cbType];

  // Compute tone names (letter offsets: 0=root, 2=third, 4=fifth)
  const letterOffsets = [0, 2, 4];
  const toneNames = ct.intervals.map((semi, i) =>
    i === 0 ? rootName : chordToneName(cbRoot, letterOffsets[i], semi)
  );

  // Piano: highlight chord tones starting from lowest root in octave 4
  for (let k = 0; k < SPAN; k++) setKeyClass(cbKm, k, null);

  // Find root in octave 4 (indices 12–23) or fall back to octave 3
  let rootKey = null;
  for (let k = 12; k < 24; k++) { if (k % 12 === cbRoot) { rootKey = k; break; } }
  if (rootKey === null) for (let k = 0; k < 12; k++) { if (k % 12 === cbRoot) { rootKey = k; break; } }
  const maxIvCb = Math.max(...ct.intervals);
  if (rootKey + maxIvCb >= SPAN) rootKey -= 12;

  const chordKeys = ct.intervals.map(semi => {
    const k = rootKey + semi;
    return (k >= 0 && k < SPAN) ? k : null;
  });

  chordKeys.forEach((k, i) => {
    if (k === null) return;
    setKeyClass(cbKm, k, i === 0 ? 'is-scale-root' : 'is-chord');
  });

  // Build interval structure explanation
  const iv1semi = ct.intervals[1];  // root→third
  const iv2semi = ct.intervals[2] - ct.intervals[1]; // third→fifth
  const iv1name = iv1semi === 4 ? t('int-major-third') : t('int-minor-third');
  const iv2name = iv2semi === 4 ? t('int-major-third') : iv2semi === 3 ? t('int-minor-third') : iv2semi === 5 ? t('int-perf-fourth') : `${iv2semi} st`;
  const totalName = ct.intervals[2] === 7 ? t('int-perf-fifth') :
                    ct.intervals[2] === 6 ? t('int-dim-fifth') :
                    ct.intervals[2] === 8 ? t('int-aug-fifth') : `${ct.intervals[2]} st`;

  const whyText = t('cb-why-' + cbType);

  // Tone table rows
  const tableRows = toneNames.map((name, i) => `
    <tr>
      <td class="ctt-note ${i === 0 ? 'ctt-root' : ''}">${name}</td>
      <td class="ctt-semi">${ct.intervals[i]}</td>
      <td class="ctt-degree">${ct.degrees[i]}</td>
    </tr>`).join('');

  document.getElementById('cb-info').innerHTML = `
    <div class="chord-builder-name">${chordName}</div>
    <div class="chord-builder-name-en">${ct.en} chord in ${rootName}</div>
    <table class="chord-tone-table">
      <thead><tr><th>${t('ctt-note')}</th><th>${t('ctt-semi')}</th><th>${t('ctt-degree')}</th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    <div class="chord-structure">
      <div class="struct-line">
        <span class="struct-pill">${iv1name} (${iv1semi} ht)</span>
        <span class="struct-plus">+</span>
        <span class="struct-pill">${iv2name} (${iv2semi} ht)</span>
        <span class="struct-arrow">→</span>
        <span class="struct-pill">${totalName}</span>
      </div>
      <div style="margin-top:0.4rem;font-size:0.78rem;color:#6b7280">${whyText}</div>
    </div>
  `;

  // Play arpeggiated then together (skip on silent re-renders e.g. lang switch)
  if (!silent) {
    chordKeys.forEach((k, i) => { if (k !== null) setTimeout(() => playNote(k), i * 200); });
    setTimeout(() => chordKeys.forEach(k => { if (k !== null) playNote(k); }), 900);
  }
}

// ═══════════════════════════════════════════════════════════
// GUITAR FRETBOARD
// ═══════════════════════════════════════════════════════════

// Standard tuning, top-to-bottom as on a chord diagram (high e first).
const GT_TUNING = [
  { label: 'e', midi: 64 },
  { label: 'B', midi: 59 },
  { label: 'G', midi: 55 },
  { label: 'D', midi: 50 },
  { label: 'A', midi: 45 },
  { label: 'E', midi: 40 },
];
const GT_FRETS   = 12;
const GT_MARKERS = [3, 5, 7, 9, 12];

let gtRoot = 4;        // E — home turf for a guitarist
let gtMode = 'scale';  // 'scale' | 'chord'
let gtType = 'major';  // scale: major|minor · chord: major|minor|dim|aug

// Root buttons (dual labels like the scales tab — always spelling-safe)
NOTES.forEach((_, i) => {
  const btn = document.createElement('button');
  btn.className   = 'sel-btn' + (i === gtRoot ? ' active-root' : '');
  btn.textContent = ROOT_DISPLAY[i];
  btn.id          = `gt-root-btn-${i}`;
  btn.onclick     = () => {
    gtRoot = i;
    document.querySelectorAll('#gt-root-btns .sel-btn').forEach(b => b.classList.remove('active-root'));
    btn.classList.add('active-root');
    renderGuitar();
  };
  document.getElementById('gt-root-btns').appendChild(btn);
});

function selectGtMode(mode) {
  gtMode = mode;
  // Keep the type valid across modes (dim/aug only exist for chords)
  if (mode === 'scale' && gtType !== 'major' && gtType !== 'minor') gtType = 'major';
  document.getElementById('gt-mode-btn-scale').classList.toggle('active-type', mode === 'scale');
  document.getElementById('gt-mode-btn-chord').classList.toggle('active-type', mode === 'chord');
  renderGtTypeBtns();
  renderGuitar();
}

function selectGtType(type) {
  gtType = type;
  renderGtTypeBtns();
  renderGuitar();
}

function renderGtTypeBtns() {
  const el = document.getElementById('gt-type-btns');
  el.innerHTML = '';
  const types = gtMode === 'scale'
    ? [{ id: 'major', key: 'sc-btn-major' }, { id: 'minor', key: 'sc-btn-minor' }]
    : CB_CHORD_TYPES.map(ct => ({ id: ct.id, key: 'cb-type-' + ct.id }));
  types.forEach(({ id, key }) => {
    const btn = document.createElement('button');
    btn.className   = 'sel-btn' + (id === gtType ? ' active-type' : '');
    btn.textContent = t(key);
    btn.onclick     = () => selectGtType(id);
    el.appendChild(btn);
  });
}

// pitch class (0–11) → { name, degree } for the current selection
function gtToneMap() {
  const map = new Map();
  if (gtMode === 'scale') {
    const names = SCALE_NOTE_NAMES[gtType][gtRoot];
    SCALE_PATTERNS[gtType].forEach((off, d) => {
      map.set((gtRoot + off) % 12, { name: names[d], degree: String(d + 1) });
    });
  } else {
    const ct = CB_CHORD_TYPES.find(c => c.id === gtType);
    const letterOffsets = [0, 2, 4];
    ct.intervals.forEach((semi, i) => {
      const name = i === 0 ? CB_ROOT_NAMES[gtRoot] : chordToneName(gtRoot, letterOffsets[i], semi);
      map.set((gtRoot + semi) % 12, { name, degree: ct.degrees[i] });
    });
  }
  return map;
}

function renderGuitar() {
  const board = document.getElementById('fretboard');
  if (!board) return;
  const tones = gtToneMap();
  board.innerHTML = '';

  GT_TUNING.forEach((str, si) => {
    const row = document.createElement('div');
    row.className = 'gt-row';
    // Thicker strings toward the low E
    row.style.setProperty('--strw', `${1 + si * 0.4}px`);
    const lbl = document.createElement('span');
    lbl.className = 'gt-str-label';
    lbl.textContent = str.label;
    row.appendChild(lbl);

    for (let f = 0; f <= GT_FRETS; f++) {
      const midi = str.midi + f;
      const cell = document.createElement('div');
      cell.className = 'gt-cell' + (f === 0 ? ' gt-open' : '');
      const tone = tones.get(midi % 12);
      if (tone) {
        const dot = document.createElement('span');
        const isRoot = midi % 12 === gtRoot;
        dot.className = 'gt-dot ' + (isRoot ? 'is-root' : gtMode === 'chord' ? 'is-chordtone' : 'is-tone');
        dot.textContent = tone.name;
        dot.title = tone.degree;
        cell.appendChild(dot);
      }
      cell.addEventListener('click', () => playMidi(midi));
      row.appendChild(cell);
    }
    board.appendChild(row);
  });

  // Fret number row (with inlay-marker frets highlighted)
  const nums = document.createElement('div');
  nums.className = 'gt-fretnums';
  nums.appendChild(Object.assign(document.createElement('span'), { className: 'gt-str-label' }));
  for (let f = 0; f <= GT_FRETS; f++) {
    const n = document.createElement('span');
    n.className = 'gt-num' + (f === 0 ? ' gt-open-num' : '') + (GT_MARKERS.includes(f) ? ' gt-marker' : '');
    n.textContent = f === 0 ? '0' : GT_MARKERS.includes(f) ? (f === 12 ? '12 ••' : `${f} •`) : String(f);
    nums.appendChild(n);
  }
  board.appendChild(nums);

  // Info box: name + tone bubbles (same look as the scales tab)
  const rootName = gtMode === 'scale' ? SCALE_NOTE_NAMES[gtType][gtRoot][0] : CB_ROOT_NAMES[gtRoot];
  let title;
  if (gtMode === 'scale') {
    title = lang === 'sv'
      ? `${rootName}-${t('scale-name-' + gtType)}`
      : `${rootName} ${t('scale-name-' + gtType)}`;
  } else {
    title = `${rootName}${CB_SUFFIX[gtType]} — ${t('cb-type-' + gtType)}`;
  }
  const ordered = [...tones.entries()]
    .sort((a, b) => ((a[0] - gtRoot + 12) % 12) - ((b[0] - gtRoot + 12) % 12));
  const bubbles = ordered.map(([pc, tone]) =>
    `<span class="tone-bubble ${pc === gtRoot ? 'is-root-bubble' : ''}">${tone.name}</span>`
  ).join('');
  document.getElementById('gt-info').innerHTML = `
    <div class="scale-title">${title}</div>
    <div class="scale-tones">${bubbles}</div>
  `;
}

renderGtTypeBtns();
renderGuitar();

// Apply default language on load
applyLang();

function applyChordHighlight(pattern, silent = false) {
  if (selectedDeg === null) return;
  const type = CHORD_QUALITIES[scaleType][selectedDeg];
  const civals = CHORD_INTERVALS[type];

  // Find lowest root key for this scale
  let rootKeyIdx = 0;
  for (let k = 0; k < SPAN; k++) { if (k % 12 === scaleRoot) { rootKeyIdx = k; break; } }

  const chordRootOffset = pattern[selectedDeg];
  let chordRoot = rootKeyIdx + chordRootOffset;
  const maxIvSc = Math.max(...civals);
  if (chordRoot + maxIvSc >= SPAN) chordRoot -= 12;
  const chordKeys = civals.map(interval => {
    const k = chordRoot + interval;
    return (k >= 0 && k < SPAN) ? k : null;
  });

  chordKeys.forEach(k => { if (k !== null) setKeyClass(scKm, k, 'is-chord'); });

  // Play arpeggiated, then together (skip on silent re-renders e.g. lang switch)
  if (!silent) {
    chordKeys.forEach((k, i) => { if (k !== null) setTimeout(() => playNote(k), i * 200); });
    setTimeout(() => chordKeys.forEach(k => { if (k !== null) playNote(k); }), 900);
  }
}
