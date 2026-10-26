/**
 * Testy walidacji schematu danych dla Przewodnika Ptaków Polski
 * Uruchom: node tests/ptaki.test.js
 */

const fs   = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m',
  blue: '\x1b[34m', cyan: '\x1b[36m', gray: '\x1b[90m'
};

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${message}`);
    testsPassed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${message}`);
    testsFailed++;
  }
}

function describe(suite, callback) {
  console.log(`\n${colors.blue}${suite}${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(suite.length)}${colors.reset}`);
  callback();
}

function it(description, callback) {
  try {
    callback();
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${description}: ${error.message}`);
    testsFailed++;
  }
}

// ── Dane ─────────────────────────────────────────────────────
const jsonPath = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const birds    = jsonData.ptaki;

// Zbiera nazwy ptaków niespełniających predykatu
function bad(list, pred) {
  return list.filter(p => !pred(p)).map(p => p.nazwa);
}

// Pojedyncza asercja z listą naruszeń w komunikacie błędu
function assertAll(label, violations) {
  const detail = violations.length ? ` (błąd u: ${violations.join(', ')})` : '';
  assert(violations.length === 0, `${label}${detail}`);
}

// ============================================
// TESTY WALIDACJI SCHEMATU JSON
// ============================================
describe('Testy walidacji schematu JSON', () => {

  it('Plik ptaki.json istnieje i zawiera listę ptaków', () => {
    assert(fs.existsSync(jsonPath), 'Plik ptaki.json istnieje');
    assert(Array.isArray(birds) && birds.length > 0, `Plik zawiera ${birds.length} ptaków`);
  });

  it('Każdy ptak ma wymagane pola', () => {
    const required = [
      'id', 'nazwa', 'nazwaLacinska', 'kategorie', 'zdjecie',
      'liczebnosc', 'trend', 'migracja', 'statusCzerwonejKsiazki', 'cechy'
    ];
    required.forEach(field =>
      assertAll(`Wszystkie ptaki mają pole "${field}"`, bad(birds, p => p[field] !== undefined))
    );
  });

  it('ID ptaków są unikalne', () => {
    const ids = birds.map(p => p.id);
    assert(ids.length === new Set(ids).size, 'Wszystkie ID ptaków są unikalne');
  });

  it('Wartości wyliczeniowe są poprawne', () => {
    const validCats = new Set(['Ogród', 'Najliczniejsze', 'Najpowszechniejsze', 'inne', 'Top Podkarpacia', 'Podkarpackie Atrakcje']);
    const badCats = birds.flatMap(p =>
      p.kategorie.filter(c => !validCats.has(c)).map(c => `${p.nazwa}[${c}]`)
    );
    assert(badCats.length === 0, `Wszystkie kategorie są z dozwolonej listy${badCats.length ? ` (błąd: ${badCats.join(', ')})` : ''}`);

    assertAll('Status Czerwonej Księgi jest poprawny', bad(birds, p => ['LC', 'NT', 'VU', 'EN', 'CR', 'RE'].includes(p.statusCzerwonejKsiazki)));
    assertAll('Trend jest poprawny',                   bad(birds, p => ['↑', '↓', '→'].includes(p.trend)));
    assertAll('Migracja jest poprawna',                bad(birds, p => ['Osiadły', 'Wędrowny'].includes(p.migracja)));
  });

  it('Polskie nazwy gatunków mają poprawną kapitalizację (tylko pierwszy wyraz wielką literą)', () => {
    // W polskich nazwach gatunków tylko pierwszy wyraz pisze się wielką literą,
    // np. "Sikora uboga", nie "Sikora Uboga".
    const violations = bad(birds, p => {
      const rest = p.nazwa.split(' ').slice(1);
      return rest.every(w => w === w.toLocaleLowerCase('pl'));
    });
    assertAll('Nazwy mają tylko pierwszy wyraz wielką literą', violations);
  });

  it('Atrybucja zdjęć (autor/licencja) ma poprawny format, jeśli jest obecna', () => {
    const validLicenses = [
      'CC0', 'CC BY-SA 4.0', 'CC BY-SA 3.0', 'CC BY-SA 2.5', 'CC BY-SA 2.0',
      'CC BY-SA 1.0', 'CC BY 4.0', 'CC BY 3.0', 'CC BY 2.5', 'CC BY 2.0',
      'Public domain'
    ];
    assertAll('Pole "autor" (jeśli jest) to niepusty ciąg',
      bad(birds, p => p.autor === undefined || (typeof p.autor === 'string' && p.autor.trim().length > 0)));
    assertAll('Pole "licencja" (jeśli jest) jest z dozwolonej listy (bez NC)',
      bad(birds, p => p.licencja === undefined || validLicenses.includes(p.licencja)));
  });

  it('Ptaki kategorii Podkarpacia mają poprawne peakMonths', () => {
    const pkCats   = new Set(['Top Podkarpacia', 'Podkarpackie Atrakcje']);
    const pkBirds  = birds.filter(p => p.kategorie.some(c => pkCats.has(c)));
    assertAll('Ptaki Podkarpacia mają niepustą tablicę peakMonths',
      bad(pkBirds, p => Array.isArray(p.peakMonths) && p.peakMonths.length > 0));
    assertAll('Wartości peakMonths mieszczą się w zakresie 1–12',
      bad(pkBirds, p => Array.isArray(p.peakMonths) && p.peakMonths.every(m => m >= 1 && m <= 12)));
  });

  it('Filmy mają poprawne dane', () => {
    const withFilm  = birds.filter(p => p.film);
    const ytBirds   = withFilm.filter(p => (p.film.platforma || 'youtube') === 'youtube');
    assertAll('Platforma jest "youtube" lub "facebook"',
      bad(withFilm, p => ['youtube', 'facebook'].includes(p.film.platforma || 'youtube')));
    assertAll('ID YouTube ma 11 znaków',
      bad(ytBirds, p => p.film.id.length === 11));
  });

});

// ============================================
// TESTY INTEGRALNOŚCI DANYCH
// ============================================
describe('Testy integralności danych', () => {

  it('Każdy ptak ma co najmniej jedną cechę', () => {
    assertAll('Każdy ptak ma niepustą tablicę cech', bad(birds, p => p.cechy && p.cechy.length > 0));
  });

  it('Każdy ptak ma niepusty URL zdjęcia', () => {
    assertAll('URL zdjęcia jest niepustym ciągiem', bad(birds, p => typeof p.zdjecie === 'string' && p.zdjecie.length > 0));
  });

});

// ── Podsumowanie ──────────────────────────────────────────────
console.log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}`);
console.log(`${colors.cyan}Podsumowanie: ${colors.green}${testsPassed} ✓${colors.reset}  ${colors.red}${testsFailed} ✗${colors.reset}`);
console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log(`${colors.green}\n✓ Wszystkie testy przeszły pomyślnie!${colors.reset}`);
  process.exit(0);
}
