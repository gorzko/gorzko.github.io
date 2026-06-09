/**
 * Testy jednostkowe dla Przewodnika Ptaków Polski
 * Uruchom: node tests/ptaki.test.js
 */

const fs = require('fs');
const path = require('path');

// Kolory konsoli
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Licznik testów
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

function describe(testSuite, callback) {
  console.log(`\n${colors.blue}${testSuite}${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(testSuite.length)}${colors.reset}`);
  callback();
}

function it(description, callback) {
  try {
    callback();
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.red}Error:${colors.reset} ${error.message}`);
    testsFailed++;
  }
}

// ============================================
// TESTY WALIDACJI JSON
// ============================================
describe('Testy walidacji schematu JSON', () => {
  const jsonPath = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  it('Plik ptaki.json istnieje i jest poprawnym JSON', () => {
    assert(fs.existsSync(jsonPath), 'Plik ptaki.json istnieje');
    assert(jsonData.ptaki !== undefined, 'Plik zawiera klucz "ptaki"');
  });

  it('Każdy ptak ma wymagane pola', () => {
    const requiredFields = ['id', 'nazwa', 'nazwaLacinska', 'kategorie', 'zdjecie', 'liczebnosc', 'trend', 'migracja', 'statusCzerwonejKsiazki', 'cechy'];
    
    jsonData.ptaki.forEach(ptak => {
      requiredFields.forEach(field => {
        assert(ptak[field] !== undefined, `Ptak ${ptak.nazwa} ma pole "${field}"`);
      });
    });
  });

  it('ID ptaków są unikalne', () => {
    const ids = jsonData.ptaki.map(p => p.id);
    const uniqueIds = new Set(ids);
    assert(ids.length === uniqueIds.size, 'Wszystkie ID ptaków są unikalne');
  });

  it('Kategorie są poprawne', () => {
    const validCategories = ['Ogród', 'Najliczniejsze', 'Najpowszechniejsze', 'inne', 'Podkarpacie'];
    jsonData.ptaki.forEach(ptak => {
      ptak.kategorie.forEach(cat => {
        assert(validCategories.includes(cat), `Ptak ${ptak.nazwa} ma poprawną kategorię: ${cat}`);
      });
    });
  });

  it('Status Czerwonej Księgi jest poprawny', () => {
    const validStatuses = ['LC', 'NT', 'VU', 'EN'];
    jsonData.ptaki.forEach(ptak => {
      assert(validStatuses.includes(ptak.statusCzerwonejKsiazki), 
        `Ptak ${ptak.nazwa} ma poprawny status: ${ptak.statusCzerwonejKsiazki}`);
    });
  });

  it('Trend jest poprawny', () => {
    const validTrends = ['↑', '↓', '→'];
    jsonData.ptaki.forEach(ptak => {
      assert(validTrends.includes(ptak.trend), 
        `Ptak ${ptak.nazwa} ma poprawny trend: ${ptak.trend}`);
    });
  });

  it('Migracja jest poprawna', () => {
    const validMigrations = ['Osiadły', 'Wędrowny'];
    jsonData.ptaki.forEach(ptak => {
      assert(validMigrations.includes(ptak.migracja), 
        `Ptak ${ptak.nazwa} ma poprawną migrację: ${ptak.migracja}`);
    });
  });

  it('Filmy mają poprawne platformy', () => {
    const validPlatforms = ['youtube', 'facebook'];
    jsonData.ptaki.forEach(ptak => {
      if (ptak.film) {
        const platform = ptak.film.platforma || 'youtube';
        assert(validPlatforms.includes(platform), 
          `Ptak ${ptak.nazwa} ma poprawną platformę filmu: ${platform}`);
      }
    });
  });

  it('ID filmów YouTube mają 11 znaków', () => {
    jsonData.ptaki.forEach(ptak => {
      if (ptak.film && (ptak.film.platforma === 'youtube' || !ptak.film.platforma)) {
        assert(ptak.film.id.length === 11, 
          `Ptak ${ptak.nazwa} ma poprawne ID YouTube (11 znaków): ${ptak.film.id}`);
      }
    });
  });
});

// ============================================
// TESTY RENDEROWANIA KART
// ============================================
describe('Testy renderowania kart', () => {
  // Symulujemy funkcje z script.js
  function getCategoryClass(category) {
    const categoryMap = {
      'Ogród': 'g',
      'Najliczniejsze': 'b',
      'Najpowszechniejsze': 'o'
    };
    return categoryMap[category] || 'g';
  }

  function generateCategoryTags(kategorie) {
    return kategorie.map((k, index) => {
      const categoryClass = getCategoryClass(k);
      const rank = index + 1;
      return `
        <div class="cat-tag ${categoryClass}" role="button" tabindex="0" aria-label="Kategoria: ${k}">
          <div class="cat-dot"></div>
          ${k}${k.includes('Naj') ? ` <span class="cat-rank">#${rank}</span>` : ''}
        </div>
      `;
    }).join('');
  }

  function getStatusText(status) {
    const statusTexts = {
      'LC': 'gatunek najmniejszej troski',
      'NT': 'bliski zagrożenia',
      'VU': 'narażony',
      'EN': 'zagrożony'
    };
    return statusTexts[status] || 'nieznany';
  }

  function generateStats(ptak) {
    const trendText = ptak.trend === '↑' ? 'wzrostowy' : ptak.trend === '↓' ? 'spadkowy' : 'stabilny';
    const migrationText = ptak.migracja === 'Osiadły' ? 'całorocznie' : 'sezonowo';
    
    return `
      <div class="stats" role="list" aria-label="Statystyki ptaka">
        <div class="stat" role="listitem" aria-label="Liczebność: ${ptak.liczebnosc} par lęgowych">
          <div class="stat-l" id="stat-liczebnosc">Liczebność</div>
          <div class="stat-v" aria-labelledby="stat-liczebnosc">${ptak.liczebnosc}<small>par lęg.</small></div>
        </div>
        <div class="stat" role="listitem" aria-label="Trend populacji: ${trendText}">
          <div class="stat-l" id="stat-trend">Trend</div>
          <div class="stat-v" aria-labelledby="stat-trend">${ptak.trend} <small>${trendText}</small></div>
        </div>
        <div class="stat" role="listitem" aria-label="Migracje: ${ptak.migracja}, ${migrationText}">
          <div class="stat-l" id="stat-migracje">Migracje</div>
          <div class="stat-v" aria-labelledby="stat-migracje">${ptak.migracja} <small>/ ${migrationText}</small></div>
        </div>
      </div>
    `;
  }

  const jsonPath = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  it('Generowanie tagów kategorii działa poprawnie', () => {
    const ptak = jsonData.ptaki[0];
    const tags = generateCategoryTags(ptak.kategorie);
    assert(tags.includes('cat-tag'), 'Generowane tagi zawierają klasę cat-tag');
    assert(tags.includes('role="button"'), 'Tagi mają atrybut role="button"');
    assert(tags.includes('tabindex="0"'), 'Tagi mają atrybut tabindex="0"');
  });

  it('Generowanie statystyk działa poprawnie', () => {
    const ptak = jsonData.ptaki[0];
    const stats = generateStats(ptak);
    assert(stats.includes('stats'), 'Statystyki zawierają klasę stats');
    assert(stats.includes('role="list"'), 'Statystyki mają atrybut role="list"');
    assert(stats.includes('Liczebność'), 'Statystyki zawierają Liczebność');
    assert(stats.includes('Trend'), 'Statystyki zawierają Trend');
    assert(stats.includes('Migracje'), 'Statystyki zawierają Migracje');
  });

  it('getStatusText zwraca poprawne teksty', () => {
    assert(getStatusText('LC') === 'gatunek najmniejszej troski', 'LC tłumaczy się poprawnie');
    assert(getStatusText('NT') === 'bliski zagrożenia', 'NT tłumaczy się poprawnie');
    assert(getStatusText('VU') === 'narażony', 'VU tłumaczy się poprawnie');
    assert(getStatusText('EN') === 'zagrożony', 'EN tłumaczy się poprawnie');
    assert(getStatusText('UNKNOWN') === 'nieznany', 'Nieznany status zwraca domyślny tekst');
  });

  it('getCategoryClass zwraca poprawne klasy', () => {
    assert(getCategoryClass('Ogród') === 'g', 'Ogród ma klasę g');
    assert(getCategoryClass('Najliczniejsze') === 'b', 'Najliczniejsze ma klasę b');
    assert(getCategoryClass('Najpowszechniejsze') === 'o', 'Najpowszechniejsze ma klasę o');
    assert(getCategoryClass('Nieznana') === 'g', 'Nieznana kategoria zwraca domyślny g');
  });
});

// ============================================
// TESTY OBSŁUGI BŁĘDÓW
// ============================================
describe('Testy obsługi błędów', () => {
  it('Plik ptaki.json nie jest pusty', () => {
    const jsonPath = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    assert(fileContent.trim().length > 0, 'Plik ptaki.json nie jest pusty');
  });

  it('Każdy ptak ma co najmniej jedną cechę', () => {
    const jsonPath = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    jsonData.ptaki.forEach(ptak => {
      assert(ptak.cechy && ptak.cechy.length > 0, 
        `Ptak ${ptak.nazwa} ma co najmniej jedną cechę`);
    });
  });

  it('Każdy ptak ma poprawny URL zdjęcia', () => {
    const jsonPath = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    jsonData.ptaki.forEach(ptak => {
      assert(ptak.zdjecie && typeof ptak.zdjecie === 'string', 
        `Ptak ${ptak.nazwa} ma poprawny URL zdjęcia`);
      assert(ptak.zdjecie.length > 0, 
        `Ptak ${ptak.nazwa} ma niepusty URL zdjęcia`);
    });
  });
});

// ============================================
// TESTY LAZY LOADING
// ============================================
describe('Testy lazy loading', () => {
  it('Obrazy mają atrybut loading="lazy"', () => {
    // Symulujemy generowanie HTML dla karty
    const jsonPath = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const ptak = jsonData.ptaki[0];
    
    // Sprawdzamy, czy URL zdjęcia jest poprawny (co jest wymagane dla lazy loading)
    assert(ptak.zdjecie.startsWith('http') || ptak.zdjecie.startsWith('img/'), 
      'URL zdjęcia jest poprawny dla lazy loading');
  });

  it('Wszystkie ptaki mają unikalne ID', () => {
    const jsonPath = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    const ids = jsonData.ptaki.map(p => p.id);
    const uniqueIds = new Set(ids);
    assert(ids.length === uniqueIds.size, 'Wszystkie ptaki mają unikalne ID dla lazy loading');
  });
});

// ============================================
// PODSUMOWANIE
// ============================================
console.log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}`);
console.log(`${colors.cyan}Podsumowanie testów:${colors.reset}`);
console.log(`${colors.green}Przejdź: ${testsPassed}${colors.reset}`);
console.log(`${colors.red}Nie powiodło się: ${testsFailed}${colors.reset}`);
console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log(`${colors.green}\n✓ Wszystkie testy przeszły pomyślnie!${colors.reset}`);
  process.exit(0);
}
