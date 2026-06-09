#!/usr/bin/env node
/**
 * parse-barchart.js — Parser danych Bar Chart z eBird
 *
 * Wyznacza ptaki "ikoniczne dla Podkarpacia" przez porównanie częstości
 * obserwacji w Podkarpaciu (PL-PK) z całą Polską (PL).
 *
 * Algorytm wzorowany na eBird "Iconic Birds":
 *   iconic_score = peak_PK / peak_PL  (wyższy = bardziej charakterystyczny dla regionu)
 *   sezonowość   = peak_PK / (mean_PK + 0.001)  (wyższy = wąski pik sezonowy)
 *
 * Jak pobrać pliki TSV:
 *   1. Zaloguj się na ebird.org
 *   2. Otwórz https://ebird.org/barchart?r=PL-PK  → "Download Histogram Data"
 *      → zapisz jako scripts/barchart-PL-PK.txt
 *   3. Otwórz https://ebird.org/barchart?r=PL     → "Download Histogram Data"
 *      → zapisz jako scripts/barchart-PL.txt
 *   4. Uruchom: node scripts/parse-barchart.js
 *
 * Wynik: top 30 gatunków w konsoli + zapis do scripts/wyniki-podkarpacie.json
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ── Polskie nazwy gatunków (wybrane; uzupełnij jeśli brakuje) ────────────────
// Klucz: angielska nazwa zwyczajowa z eBird, wartość: polska nazwa
const POLISH_NAMES = {
  'White Stork':           'Bocian Biały',
  'Barn Swallow':          'Jaskółka Dymówka',
  'Common Cuckoo':         'Kukułka',
  'Common Swift':          'Jerzyk',
  'Skylark':               'Skowronek',
  'Yellow Wagtail':        'Pliszka Żółta',
  'Ortolan Bunting':       'Ortolan',
  'Common Starling':       'Szpak',
  'House Sparrow':         'Wróbel',
  'Eurasian Tree Sparrow': 'Mazurek',
  'Common Blackbird':      'Kos',
  'Song Thrush':           'Śpiewak',
  'Common Chiffchaff':     'Pierwiosnek',
  'Blackcap':              'Kapturka',
  'Common Chaffinch':      'Zięba',
  'Great Tit':             'Bogatka',
  'Blue Tit':              'Modraszka',
  'Eurasian Robin':        'Rudzik',
  'Common Bullfinch':      'Gil',
  'Yellowhammer':          'Trznadel',
  'Common Wood Pigeon':    'Grzywacz',
  'Eurasian Collared Dove':'Sierpówka',
  'Eurasian Jay':          'Sójka',
  'Eurasian Magpie':       'Sroka',
  'Western Jackdaw':       'Kawka',
  'Common Pheasant':       'Bażant',
  'Fieldfare':             'Kwiczoł',
  'Redwing':               'Droździk',
  'White Wagtail':         'Pliszka Siwa',
  'Grey Wagtail':          'Pliszka Górska',
  'Common Kingfisher':     'Zimorodek',
  'European Nightjar':     'Lelek',
  'Common Nightingale':    'Słowik Rdzawy',
  'Thrush Nightingale':    'Słowik Szary',
  'Sedge Warbler':         'Rokitniczka',
  'Marsh Warbler':         'Łozówka',
  'Reed Warbler':          'Trzciniak',
  'Great Reed Warbler':    'Trzcinniczek',
  'Corn Crake':            'Derkacz',
  'Common Quail':          'Przepiórka',
  'Little Ringed Plover':  'Sieweczka Rzeczna',
  'Northern Lapwing':      'Czajka',
  'White-tailed Eagle':    'Bielik',
  'Lesser Spotted Eagle':  'Orlik Krzykliwy',
  'Black Stork':           'Bocian Czarny',
  'Common Crane':          'Żuraw',
  'Corncrake':             'Derkacz',
  'Common Redstart':       'Pleszka',
  'Black Redstart':        'Kopciuszek',
  'Spotted Flycatcher':    'Muchołówka Szara',
  'European Pied Flycatcher': 'Muchołówka Żałobna',
  'Eurasian Nuthatch':     'Kowalik',
  'Eurasian Treecreeper':  'Pełzacz Leśny',
  'Wren':                  'Strzyżyk',
  'Dunnock':               'Pokrzywnica',
  'Garden Warbler':        'Gajówka',
  'Common Whitethroat':    'Piegża',
  'Lesser Whitethroat':    'Zarośla',
  'Wood Warbler':          'Świstunka',
  'Willow Warbler':        'Pierwiosnek (Piecuszek)',
  'Chiffchaff':            'Pierwiosnek',
  'Icterine Warbler':      'Zaganiacz',
  'Barred Warbler':        'Jarzębatka',
  'Greenfinch':            'Zieleniec',
  'Goldfinch':             'Szczygieł',
  'Siskin':                'Czyż',
  'Linnet':                'Makolągwa',
  'Tree Pipit':            'Świergotek Drzewny',
  'Meadow Pipit':          'Świergotek Łąkowy',
  'Common Buzzard':        'Myszołów',
  'Sparrowhawk':           'Krogulec',
  'Goshawk':               'Jastrząb',
  'Kestrel':               'Pustułka',
  'Black Woodpecker':      'Dzięcioł Czarny',
  'Great Spotted Woodpecker': 'Dzięcioł Duży',
  'Green Woodpecker':      'Dzięcioł Zielony',
  'Grey-headed Woodpecker': 'Dzięcioł Szary',
  'Stock Dove':            'Siniak',
  'Turtle Dove':           'Turkawka',
  'Hoopoe':                'Dudek',
  'Bee-eater':             'Żołna',
  'Roller':                'Kraska',
  'Kingfisher':            'Zimorodek',
};

// ── Parser pliku Bar Chart eBird ─────────────────────────────────────────────
function parseBarchart(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const species = [];
  let inData = false;
  let sampleSizes = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Szukamy wiersza z liczebnościami próby (liczby całkowite w 48 kolumnach)
    if (!inData && /^\d+(\t\d+){10,}/.test(trimmed)) {
      sampleSizes = trimmed.split('\t').map(Number);
      inData = true;
      continue;
    }

    if (inData) {
      const parts = trimmed.split('\t');
      // Wiersz gatunku: nazwa_ang [tab] kod_takson [tab] 48_wartości
      // lub: nazwa_ang [tab] 48_wartości (starszy format)
      if (parts.length >= 48) {
        const name = parts[0];
        const freqStart = parts.length === 50 ? 2 : 1; // z kodem taksonu lub bez
        const freqs = parts.slice(freqStart, freqStart + 48).map(v => {
          const n = parseFloat(v);
          return isNaN(n) ? 0 : n;
        });
        if (freqs.length === 48) {
          species.push({ name, freqs });
        }
      }
    }
  }

  return species;
}

function stats(freqs) {
  const nonZero = freqs.filter(v => v > 0);
  const peak = Math.max(...freqs);
  const mean = freqs.reduce((a, b) => a + b, 0) / 48;
  const seasonality = peak / (mean + 0.001);
  // Tydzień szczytu (1-48)
  const peakWeek = freqs.indexOf(peak) + 1;
  // Przybliżony miesiąc szczytu
  const peakMonth = Math.ceil(peakWeek / 4);
  const months = ['', 'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
  return { peak, mean, seasonality, peakWeek, peakMonth: months[peakMonth] || '?', presentWeeks: nonZero.length };
}

// ── Główna analiza ────────────────────────────────────────────────────────────
const SCRIPTS_DIR = path.dirname(__filename);
const FILE_PK = path.join(SCRIPTS_DIR, 'barchart-PL-PK.txt');
const FILE_PL = path.join(SCRIPTS_DIR, 'barchart-PL.txt');

if (!fs.existsSync(FILE_PK) || !fs.existsSync(FILE_PL)) {
  console.error('\n❌ Brakuje plików TSV. Pobierz je najpierw:\n');
  console.error('  1. Zaloguj się na ebird.org');
  console.error('  2. https://ebird.org/barchart?r=PL-PK → "Download Histogram Data" → scripts/barchart-PL-PK.txt');
  console.error('  3. https://ebird.org/barchart?r=PL   → "Download Histogram Data" → scripts/barchart-PL.txt\n');
  process.exit(1);
}

console.log('📊 Wczytuję dane eBird Bar Chart...');
const dataPK = parseBarchart(FILE_PK);
const dataPL = parseBarchart(FILE_PL);
console.log(`  Podkarpacie (PL-PK): ${dataPK.length} gatunków`);
console.log(`  Polska     (PL):     ${dataPL.length} gatunków\n`);

// Budujemy mapę PL: nazwa → statystyki
const mapPL = new Map(dataPL.map(s => [s.name, stats(s.freqs)]));

// Obliczamy iconic_score dla każdego gatunku w PK
const results = dataPK.map(s => {
  const pk = stats(s.freqs);
  const pl = mapPL.get(s.name);
  const iconic_score = pl && pl.peak > 0 ? pk.peak / pl.peak : (pk.peak > 0 ? 99 : 0);
  const combined = iconic_score * Math.log1p(pk.seasonality);
  const polishName = POLISH_NAMES[s.name] || null;
  return { name: s.name, polishName, ...pk, iconic_score, combined };
});

// Filtrowanie i sortowanie
const THRESHOLD_PEAK = 0.06;   // min 6% list w PK w szczycie
const THRESHOLD_ICONIC = 1.20; // 20% częstszy niż w Polsce

const filtered = results
  .filter(r => r.peak >= THRESHOLD_PEAK && (r.iconic_score >= THRESHOLD_ICONIC || r.seasonality >= 4))
  .sort((a, b) => b.combined - a.combined)
  .slice(0, 40);

// ── Wyniki ────────────────────────────────────────────────────────────────────
console.log('═'.repeat(90));
console.log('TOP GATUNKI IKONICZNE DLA PODKARPACIA (wg iconic_score × sezonowość)');
console.log('═'.repeat(90));
console.log(
  'Nr'.padEnd(4) +
  'Polska nazwa'.padEnd(22) +
  'Ang. nazwa'.padEnd(28) +
  'Peak_PK'.padEnd(9) +
  'Iconic'.padEnd(9) +
  'Sezon.'.padEnd(9) +
  'Pik'
);
console.log('─'.repeat(90));

filtered.forEach((r, i) => {
  const polska = (r.polishName || '?').padEnd(22);
  const ang = r.name.slice(0, 27).padEnd(28);
  const peak = (r.peak * 100).toFixed(1).padStart(5) + '%  ';
  const iconic = r.iconic_score.toFixed(2).padStart(6) + '×  ';
  const sezon = r.seasonality.toFixed(1).padStart(6) + '   ';
  const pik = r.peakMonth;
  console.log(`${String(i+1).padEnd(4)}${polska}${ang}${peak}${iconic}${sezon}${pik}`);
});

console.log('─'.repeat(90));
console.log('\nLegenda:');
console.log('  Peak_PK  = % list z gatunkiem w Podkarpaciu (w tygodniu szczytu)');
console.log('  Iconic   = Peak_PK / Peak_PL (wartość > 1 = częstszy w Podkarpaciu)');
console.log('  Sezon.   = peak / mean (wartość > 4 = wyraźnie sezonowy)');
console.log('  Pik      = miesiąc szczytu obserwacji\n');

// Zapis JSON do dalszego użycia
const output = filtered.map(r => ({
  name_en: r.name,
  name_pl: r.polishName,
  peak_pk_pct: Math.round(r.peak * 1000) / 10,
  iconic_score: Math.round(r.iconic_score * 100) / 100,
  seasonality: Math.round(r.seasonality * 10) / 10,
  peak_month: r.peakMonth,
}));

const outPath = path.join(SCRIPTS_DIR, 'wyniki-podkarpacie.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');
console.log(`✅ Wyniki zapisane do: ${outPath}`);
console.log('   Użyj tego pliku, by zdecydować, które ptaki dodać do kategorii "Podkarpacie".\n');
