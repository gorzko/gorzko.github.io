/**
 * Unit tests for pure attribution-helper functions in download-bird-photos.js.
 * No network access, no filesystem writes.
 */

const { decodeHtmlEntities, cleanAttribution, applyAttribution } =
  require('../scripts/download-bird-photos');

const colors = {
  reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m',
  blue: '\x1b[34m', cyan: '\x1b[36m', gray: '\x1b[90m',
};

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${message}`);
    passed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${message}`);
    failed++;
  }
}

function describe(suite, cb) {
  console.log(`\n${colors.blue}${suite}${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(suite.length)}${colors.reset}`);
  cb();
}

// ── decodeHtmlEntities ───────────────────────────────────────────────────────
describe('decodeHtmlEntities', () => {
  assert(decodeHtmlEntities('Jan &amp; Maria') === 'Jan & Maria', '&amp; → &');
  assert(decodeHtmlEntities('&#039;quoted&#039;') === "'quoted'", "&#039; → apostrophe");
  assert(decodeHtmlEntities('&#39;quoted&#39;') === "'quoted'", '&#39; → apostrophe');
  assert(decodeHtmlEntities('&quot;hello&quot;') === '"hello"', '&quot; → "');
  assert(decodeHtmlEntities('&lt;b&gt;') === '<b>', '&lt;&gt; → angle brackets');
  assert(decodeHtmlEntities('&#9786;') === '☺', 'decimal numeric entity');
  assert(decodeHtmlEntities('&#x263A;') === '☺', 'hex numeric entity');
  assert(decodeHtmlEntities('no entities') === 'no entities', 'plain string unchanged');
  assert(decodeHtmlEntities('A &amp; B &amp; C') === 'A & B & C', 'multiple &amp;');
});

// ── cleanAttribution ─────────────────────────────────────────────────────────
describe('cleanAttribution', () => {
  assert(
    cleanAttribution('<a href="...">Jan Kowalski</a>') === 'Jan Kowalski',
    'strips HTML tags',
  );
  assert(
    cleanAttribution('Jan &amp; Maria Nowak') === 'Jan & Maria Nowak',
    'decodes entities after tag strip',
  );
  assert(
    cleanAttribution('  extra   spaces  ') === 'extra spaces',
    'collapses whitespace',
  );
  assert(
    cleanAttribution('<span>A</span> &amp; <em>B</em>') === 'A & B',
    'strips tags then decodes entities',
  );
});

// ── applyAttribution ─────────────────────────────────────────────────────────
describe('applyAttribution — normal write', () => {
  const bird = {};
  applyAttribution(bird, 'Jan Kowalski', 'CC BY-SA 4.0', null);
  assert(bird.autor === 'Jan Kowalski', 'sets autor');
  assert(bird.licencja === 'CC BY-SA 4.0', 'sets licencja');
  assert(bird.zrodloZdjecia === undefined, 'no zrodloZdjecia when filePageUrl is null');
});

describe('applyAttribution — clears stale credit before writing', () => {
  const bird = { autor: 'Old Author', licencja: 'CC BY 3.0' };
  applyAttribution(bird, 'unknown', 'unknown', null);
  assert(bird.autor === undefined, 'clears autor when new value is unknown');
  assert(bird.licencja === undefined, 'clears licencja when new value is unknown');
});

describe('applyAttribution — stale credit not kept on re-download', () => {
  const bird = { autor: 'Previous Author', licencja: 'CC BY 4.0' };
  // Simulate re-download where Commons returns unknown metadata
  applyAttribution(bird, 'unknown', 'unknown', null);
  assert(bird.autor === undefined, 'previous autor not kept after re-download with unknown');
  assert(bird.licencja === undefined, 'previous licencja not kept after re-download with unknown');
});

describe('applyAttribution — decodes entities in raw API value', () => {
  const bird = {};
  applyAttribution(bird, 'Marek &amp; Jan', 'CC BY-SA 4.0', null);
  assert(bird.autor === 'Marek & Jan', 'decoded &amp; stored in autor');
});

describe('applyAttribution — stores zrodloZdjecia when provided', () => {
  const bird = {};
  applyAttribution(bird, 'Author', 'CC BY 4.0', 'https://commons.wikimedia.org/wiki/File:X.jpg');
  assert(bird.zrodloZdjecia === 'https://commons.wikimedia.org/wiki/File:X.jpg', 'stores file page URL');
});

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}`);
console.log(`${colors.cyan}Podsumowanie: ${colors.green}${passed} ✓${colors.reset}  ${colors.red}${failed} ✗${colors.reset}`);
console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);

if (failed > 0) process.exit(1);
else console.log(`${colors.green}\n✓ Wszystkie testy przeszły pomyślnie!${colors.reset}`);
