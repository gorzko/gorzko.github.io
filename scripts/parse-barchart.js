#!/usr/bin/env node
/**
 * parse-barchart.js — Parser danych Bar Chart z eBird
 *
 * Wyznacza ptaki charakterystyczne dla Podkarpacia przez:
 *   A) iconic_score = peak_PK / peak_PL  (wyróżniające się na tle Polski)
 *   B) peak_PK                            (po prostu liczne w PK i PL)
 *
 * Algorytm A wzorowany na eBird "Iconic Birds":
 *   iconic_score > 1.0 = gatunek częstszy w Podkarpaciu niż w Polsce ogółem
 *   sezonowość = peak / mean  (wysoka = wąski pik sezonowy)
 *
 * Jak pobrać pliki TSV:
 *   1. Zaloguj się na ebird.org
 *   2. https://ebird.org/barchart?r=PL-PK  → "Download Histogram Data"
 *      → zapisz jako scripts/barchart-PL-PK.txt
 *   3. https://ebird.org/barchart?r=PL     → "Download Histogram Data"
 *      → zapisz jako scripts/barchart-PL.txt
 *
 * Uruchomienie (z głównego folderu repo):
 *   node scripts/parse-barchart.js
 *
 * Lub z folderu scripts/:
 *   node parse-barchart.js
 *
 * Wynik: dwa rankingi w konsoli + zapis do scripts/wyniki-podkarpacie.json
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Skrypt działa niezależnie od tego, z jakiego folderu jest wywołany
const SCRIPTS_DIR = path.dirname(fs.realpathSync(__filename));

// ── Polskie nazwy gatunków ────────────────────────────────────────────────────
const POLISH_NAMES = {
  'White Stork':               'Bocian Biały',
  'Black Stork':               'Bocian Czarny',
  'Barn Swallow':              'Jaskółka Dymówka',
  'House Martin':              'Jaskółka Oknówka',
  'Sand Martin':               'Jaskółka Brzegówka',
  'Common Cuckoo':             'Kukułka',
  'Common Swift':              'Jerzyk',
  'Skylark':                   'Skowronek',
  'Yellow Wagtail':            'Pliszka Żółta',
  'White Wagtail':             'Pliszka Siwa',
  'Grey Wagtail':              'Pliszka Górska',
  'Ortolan Bunting':           'Ortolan',
  'Common Starling':           'Szpak',
  'House Sparrow':             'Wróbel',
  'Eurasian Tree Sparrow':     'Mazurek',
  'Common Blackbird':          'Kos',
  'Song Thrush':               'Śpiewak',
  'Mistle Thrush':             'Paszkot',
  'Fieldfare':                 'Kwiczoł',
  'Redwing':                   'Droździk',
  'Common Chiffchaff':         'Pierwiosnek',
  'Willow Warbler':            'Piecuszek',
  'Wood Warbler':              'Świstunka',
  'Blackcap':                  'Kapturka',
  'Garden Warbler':            'Gajówka',
  'Common Whitethroat':        'Piegża',
  'Lesser Whitethroat':        'Zarośla',
  'Sedge Warbler':             'Rokitniczka',
  'Marsh Warbler':             'Łozówka',
  'Reed Warbler':              'Trzciniak',
  'Great Reed Warbler':        'Trzcinniczek',
  'Icterine Warbler':          'Zaganiacz',
  'Barred Warbler':            'Jarzębatka',
  'Common Chaffinch':          'Zięba',
  'Brambling':                 'Jer',
  'Great Tit':                 'Bogatka',
  'Blue Tit':                  'Modraszka',
  'Coal Tit':                  'Czubatka (Sikora Sosnówka)',
  'Long-tailed Tit':           'Raniuszek',
  'Eurasian Robin':            'Rudzik',
  'Common Bullfinch':          'Gil',
  'Yellowhammer':              'Trznadel',
  'Common Wood Pigeon':        'Grzywacz',
  'Eurasian Collared Dove':    'Sierpówka',
  'Stock Dove':                'Siniak',
  'Turtle Dove':               'Turkawka',
  'Eurasian Jay':              'Sójka',
  'Eurasian Magpie':           'Sroka',
  'Western Jackdaw':           'Kawka',
  'Rook':                      'Gawron',
  'Carrion Crow':              'Wrona Siwa',
  'Common Raven':              'Kruk',
  'Common Pheasant':           'Bażant',
  'Common Kingfisher':         'Zimorodek',
  'Hoopoe':                    'Dudek',
  'European Bee-eater':        'Żołna',
  'European Roller':           'Kraska',
  'Common Nightingale':        'Słowik Rdzawy',
  'Thrush Nightingale':        'Słowik Szary',
  'Common Redstart':           'Pleszka',
  'Black Redstart':            'Kopciuszek',
  'European Pied Flycatcher':  'Muchołówka Żałobna',
  'Spotted Flycatcher':        'Muchołówka Szara',
  'Collared Flycatcher':       'Muchołówka Białoszyja',
  'Eurasian Nuthatch':         'Kowalik',
  'Eurasian Treecreeper':      'Pełzacz Leśny',
  'Winter Wren':               'Strzyżyk',
  'Dunnock':                   'Pokrzywnica',
  'Corn Crake':                'Derkacz',
  'Common Quail':              'Przepiórka',
  'Northern Lapwing':          'Czajka',
  'Little Ringed Plover':      'Sieweczka Rzeczna',
  'Common Crane':              'Żuraw',
  'White-tailed Eagle':        'Bielik',
  'Lesser Spotted Eagle':      'Orlik Krzykliwy',
  'Common Buzzard':            'Myszołów',
  'Eurasian Sparrowhawk':      'Krogulec',
  'Northern Goshawk':          'Jastrząb',
  'Common Kestrel':            'Pustułka',
  'Black Woodpecker':          'Dzięcioł Czarny',
  'Great Spotted Woodpecker':  'Dzięcioł Duży',
  'Green Woodpecker':          'Dzięcioł Zielony',
  'Grey-headed Woodpecker':    'Dzięcioł Szary',
  'Middle Spotted Woodpecker': 'Dzięcioł Średni',
  'Greenfinch':                'Zieleniec',
  'European Goldfinch':        'Szczygieł',
  'Eurasian Siskin':           'Czyż',
  'Common Linnet':             'Makolągwa',
  'Tree Pipit':                'Świergotek Drzewny',
  'Meadow Pipit':              'Świergotek Łąkowy',
  'Water Pipit':               'Świergotek Nadwodny',
  'European Greenfinch':       'Zieleniec',
};

// ── Parser pliku Bar Chart eBird ─────────────────────────────────────────────
// Format rzeczywisty (sprawdzony):
//   ...nagłówki...
//   "Sample Size:\t0.0\t0.0\t..."  ← 48 floatów po "Sample Size:"
//   "" (pusta linia)
//   "Graylag Goose\t0.1018519\t..." ← nazwa [tab] 48 floatów
function parseBarchart(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const species = [];
  let inData = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Linia "Sample Size:" sygnalizuje koniec nagłówka
    if (!inData && /^Sample Size:/i.test(trimmed)) {
      inData = true;
      continue;
    }

    if (!inData || !trimmed) continue;

    const parts = trimmed.split('\t');
    if (parts.length < 49) continue;

    const name = parts[0].trim();
    // Pomijamy wiersze niebędące gatunkami (puste, nagłówki miesięcy itp.)
    if (!name || /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(name)) continue;

    const freqs = parts.slice(1, 49).map(v => {
      const n = parseFloat(v);
      return isNaN(n) ? 0 : n;
    });
    if (freqs.length === 48) {
      species.push({ name, freqs });
    }
  }
  return species;
}

function calcStats(freqs) {
  const peak = Math.max(...freqs);
  const mean = freqs.reduce((a, b) => a + b, 0) / 48;
  const seasonality = peak / (mean + 0.001);
  const peakWeek = freqs.indexOf(peak) + 1;
  const peakMonth = Math.ceil(peakWeek / 4);
  const months = ['', 'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
  const presentWeeks = freqs.filter(v => v > 0).length;
  // Miesiące "aktywne": te, w których średnia z 4 tygodni > 30% peak (dla filtrowania wg miesiąca)
  const activeMonths = [];
  for (let m = 0; m < 12; m++) {
    const weekSlice = freqs.slice(m * 4, m * 4 + 4);
    const monthMean = weekSlice.reduce((a, b) => a + b, 0) / 4;
    if (monthMean >= peak * 0.30) activeMonths.push(m + 1);
  }
  return { peak, mean, seasonality, peakMonth: months[Math.min(peakMonth, 12)] || '?', presentWeeks, activeMonths };
}

function printTable(rows, title) {
  const W = 92;
  console.log('\n' + '═'.repeat(W));
  console.log(title);
  console.log('═'.repeat(W));
  console.log(
    'Nr'.padEnd(4) +
    'Polska nazwa'.padEnd(24) +
    'Angielska nazwa'.padEnd(30) +
    'Peak_PK'.padEnd(9) +
    'Iconic×'.padEnd(9) +
    'Sezon.'.padEnd(9) +
    'Pik mies.'
  );
  console.log('─'.repeat(W));
  rows.forEach((r, i) => {
    const pl  = (r.polishName || '(brak tłum.)').slice(0, 23).padEnd(24);
    const en  = r.name.slice(0, 29).padEnd(30);
    const pk  = (r.peak * 100).toFixed(1).padStart(5) + '%   ';
    const ic  = r.iconic_score === 99
      ? '  n/a    '
      : r.iconic_score.toFixed(2).padStart(6) + '×  ';
    const sz  = r.seasonality.toFixed(1).padStart(6) + '   ';
    console.log(`${String(i + 1).padEnd(4)}${pl}${en}${pk}${ic}${sz}${r.peakMonth}`);
  });
  console.log('─'.repeat(W));
}

// ── Wczytanie danych ──────────────────────────────────────────────────────────
const FILE_PK = path.join(SCRIPTS_DIR, 'barchart-PL-PK.txt');
const FILE_PL = path.join(SCRIPTS_DIR, 'barchart-PL.txt');

if (!fs.existsSync(FILE_PK) || !fs.existsSync(FILE_PL)) {
  console.error('\n❌ Brakuje plików TSV. Pobierz je najpierw:\n');
  console.error('  1. Zaloguj się na ebird.org');
  console.error('  2. https://ebird.org/barchart?r=PL-PK → "Download Histogram Data"');
  console.error('     → zapisz jako scripts/barchart-PL-PK.txt');
  console.error('  3. https://ebird.org/barchart?r=PL   → "Download Histogram Data"');
  console.error('     → zapisz jako scripts/barchart-PL.txt\n');
  console.error('Uruchomienie: node scripts/parse-barchart.js  (z głównego folderu repo)\n');
  process.exit(1);
}

console.log('\n📊 Wczytuję dane eBird Bar Chart...');
const dataPK = parseBarchart(FILE_PK);
const dataPL = parseBarchart(FILE_PL);
console.log(`  Podkarpacie (PL-PK): ${dataPK.length} gatunków`);
console.log(`  Polska     (PL):     ${dataPL.length} gatunków`);

const mapPL = new Map(dataPL.map(s => [s.name, calcStats(s.freqs)]));

const allResults = dataPK.map(s => {
  const pk = calcStats(s.freqs);
  const pl = mapPL.get(s.name);
  const iconic_score = pl && pl.peak > 0
    ? pk.peak / pl.peak
    : (pk.peak > 0 ? 99 : 0);
  const combined = iconic_score * Math.log1p(pk.seasonality);
  return {
    name: s.name,
    polishName: POLISH_NAMES[s.name] || null,
    ...pk,
    iconic_score,
    combined,
  };
});

// ── RANKING A: Gatunki wyróżniające się w Podkarpaciu na tle Polski ──────────
// Filtry:
//   peak_PK ≥ 8%      — gatunek realnie widoczny (wyklucza jednorazowe rarytasy)
//   presentWeeks ≥ 8  — obecny przez co najmniej 8 tygodni (nie tylko incydentalny)
//   iconic_score ≥ 1.5 — co najmniej 50% częstszy niż w Polsce ogółem
const THRESHOLD_PEAK_A      = 0.08;  // min 8% list w PK w szczycie
const THRESHOLD_ICONIC_LO   = 1.50;
const THRESHOLD_PRESENT_WKS = 8;     // min 8 tygodni z nonzero frequency

const rankingA = allResults
  .filter(r =>
    r.peak >= THRESHOLD_PEAK_A &&
    r.presentWeeks >= THRESHOLD_PRESENT_WKS &&
    r.iconic_score >= THRESHOLD_ICONIC_LO
  )
  .sort((a, b) => b.iconic_score - a.iconic_score)
  .slice(0, 40);

// ── RANKING B: Gatunki po prostu liczne w Podkarpaciu ────────────────────────
// Top 10 wg absolutnej częstości — niezależnie od porównania z PL ogółem
const THRESHOLD_PEAK_B = 0.15; // min 15% list w PK w szczycie

const rankingB = allResults
  .filter(r => r.peak >= THRESHOLD_PEAK_B)
  .sort((a, b) => b.peak - a.peak)
  .slice(0, 10);

// ── Drukujemy wyniki ──────────────────────────────────────────────────────────
printTable(rankingA,
  'RANKING A — Gatunki wyróżniające się w Podkarpaciu (iconic_score × sezonowość)\n' +
  '            (częstsze w PK niż w Polsce LUB wyraźnie sezonowe)'
);

printTable(rankingB,
  'RANKING B — Gatunki najliczniejsze w Podkarpaciu (absolutna częstość, peak ≥ 15%)\n' +
  '            (niezależnie od porównania z Polską ogółem)'
);

console.log('\nLegenda:');
console.log('  Peak_PK  = % list kompletnych z gatunkiem w PK (w tygodniu szczytu)');
console.log('  Iconic×  = Peak_PK / Peak_PL  (>1.0 = częstszy w PK niż w Polsce; n/a = brak w PL)');
console.log('  Sezon.   = peak / mean  (>4 = wąski pik sezonowy, wyraźnie związany z porą roku)');
console.log('  Pik mies.= przybliżony miesiąc szczytu obserwacji\n');

// ── Zapis JSON ────────────────────────────────────────────────────────────────
const jsonOut = {
  generated: new Date().toISOString().slice(0, 10),
  rankingA_iconic: rankingA.map(r => ({
    name_en: r.name, name_pl: r.polishName,
    peak_pk_pct: +(r.peak * 100).toFixed(1),
    iconic_score: r.iconic_score === 99 ? null : +r.iconic_score.toFixed(2),
    seasonality: +r.seasonality.toFixed(1),
    peak_month: r.peakMonth,
    present_weeks: r.presentWeeks,
    active_months: r.activeMonths,
  })),
  rankingB_common: rankingB.map(r => ({
    name_en: r.name, name_pl: r.polishName,
    peak_pk_pct: +(r.peak * 100).toFixed(1),
    iconic_score: r.iconic_score === 99 ? null : +r.iconic_score.toFixed(2),
    seasonality: +r.seasonality.toFixed(1),
    peak_month: r.peakMonth,
    present_weeks: r.presentWeeks,
    active_months: r.activeMonths,
  })),
};

const outPath = path.join(SCRIPTS_DIR, 'wyniki-podkarpacie.json');
fs.writeFileSync(outPath, JSON.stringify(jsonOut, null, 2), 'utf-8');
console.log(`✅ Wyniki zapisane: ${outPath}`);
console.log('   Prześlij zawartość pliku lub skopiuj rankingi z konsoli,\n   a doberę ptaki do kategorii "Podkarpacie" w katalogu.\n');
