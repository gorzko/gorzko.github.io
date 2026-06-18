# Przewodnik Ptaków Polski — instrukcje dla agentów AI

Interaktywny przewodnik ptaków lęgowych Polski (65 gatunków). Statyczna strona na GitHub Pages, vanilla JS, brak frameworków. Właściciel: Marek (Podkarpacie).

## Komendy

```bash
npm test              # uruchom testy (walidacja danych + renderowanie)
npm run test:watch    # tryb watch z nodemon
```

CI uruchamia testy automatycznie przy push/PR na main (tylko jeśli zmieniono ptaki.json, tests/ lub package.json).

## Struktura projektu

```
ptaki-przewodnik/
  index.html          # główna strona
  script.js           # cała logika JS (556 linii)
  styles.css          # style + tokeny CSS (1428 linii)
  data/ptaki.json     # dane 65 gatunków
  img/                # zdjęcia ptaków (3 rozmiary każde)
scripts/              # jednorazowe skrypty do przetwarzania danych
tests/ptaki.test.js   # testy
mockups/              # NIE MODYFIKOWAĆ (pliki referencyjne)
```

## Schemat ptaki.json

Każdy ptak musi mieć:

| Pole | Typ | Dozwolone wartości |
|------|-----|-------------------|
| `id` | number | unikalne |
| `nazwa` | string | polska nazwa |
| `nazwaLacinska` | string | |
| `kategorie` | array | `"Ogród"`, `"Najliczniejsze"`, `"Najpowszechniejsze"`, `"Top Podkarpacia"`, `"Podkarpackie Atrakcje"` |
| `zdjecie` | string | `img/NazwaGatunku.jpg` |
| `liczebnosc` | string | np. `"100–200 tys."` |
| `trend` | string | `↑` / `→` / `↓` |
| `migracja` | string | `"Osiadły"` / `"Wędrowny"` |
| `statusCzerwonejKsiazki` | string | `LC` / `NT` / `VU` / `EN` |
| `cechy` | array | 5–7 cech z emoji, np. `"🔊 Melodyjny śpiew"` |
| `film.id` | string | 11-znakowe ID YouTube |
| `film.platforma` | string | `"youtube"` / `"facebook"` |
| `zrodla` | array | `"MPPL 2025"`, `"Czerwona Księga Ptaków Polski"` |
| `peakMonths` | array | 1–12, tylko dla ptaków Podkarpackich |

## Zasady treści (obrazy)

- **TYLKO** Wikimedia Commons — nigdy inne źródła bez zgody użytkownika
- Wyłącznie fotografie (nie ilustracje, rysunki, grafiki cyfrowe)
- Dorosłe osobniki w naturalnej pozie, wyraźne, prawidłowo naświetlone
- Licencje: CC0, CC-BY-SA 4.0, CC-BY-SA 3.0, CC-BY 4.0 — unikać NC
- Wymagane 3 rozmiary: `NazwaGatunku.jpg` + `800px_NazwaGatunku.jpg` + `1920px_NazwaGatunku.jpg`
- Minimum: desktop 1200×900px / 100KB, mobile 800×600px / 50KB
- Pełna specyfikacja: `ptaki-przewodnik/img/image-quality.md`

### Priorytet wyboru zdjęć z Wikimedia
1. Featured Pictures → 2. Quality Images → 3. Valued Images → 4. inne wysokiej jakości

## Pliki NIE modyfikować

- `mockups/lozowka.html`
- `mockups/ptaki-przewodnik.html`

## MCP Servers

| Serwer | Kiedy używać |
|--------|-------------|
| `wikimedia-image-search` | szukanie zdjęć ptaków do ptaki.json |
| `youtube` (`@kirbah/mcp-youtube`) | sprawdzanie ID filmów, metadane, wyszukiwanie nagrań gatunków |
| `tavily` | wyszukiwanie danych o gatunkach (IUCN, MPPL, eBird), weryfikacja faktów |

## Claude Code — ograniczenia i konfiguracja

### Zmienne środowiskowe

| Zmienna | Do czego | Gdzie ustawić |
|---------|----------|---------------|
| `YOUTUBE_API_KEY` | youtube MCP (search, channel stats) | lokalnie: `.claude/settings.local.json`; chmura: claude.ai/code → Environments |
| `TAVILY_API_KEY` | tavily MCP | j.w. |

`settings.local.json` jest w `.gitignore` — nie commitować.

### Znane ograniczenia w sesji chmurowej

- `getTranscripts` (youtube MCP) **nie działa** — YouTube blokuje zapytania z IP centrów danych. Działa normalnie lokalnie. Nie jest to błąd konfiguracji, nie ma obejścia bez proxy z rezydencjalnym IP.
- Pozostałe 7/8 narzędzi youtube MCP działają poprawnie.

### Weryfikacja przed committem

```bash
npm test              # musi przejść bez błędów
git status            # sprawdź co idzie do commita
```
