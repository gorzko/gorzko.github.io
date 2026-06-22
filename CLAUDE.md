# Polish Bird Guide — AI agent instructions

Interactive guide to breeding birds of Poland (65 species). Static site on GitHub Pages, vanilla JS, no frameworks. Owner: Marek (Podkarpacie region). The webpage content is in Polish.

## Commands

```bash
npm test              # run tests (data validation + rendering)
npm run test:watch    # watch mode with nodemon
node scripts/verify-bird-photos.js   # verify sizes and existence of photos for all 65 species
```

CI runs tests automatically on push/PR to main (only when ptaki.json, tests/, or package.json changed).

## Project structure

```
ptaki-przewodnik/
  index.html          # main page
  script.js           # all JS logic
  styles.css          # styles + CSS tokens
  data/ptaki.json     # data for 65 species
  img/                # bird photos (3 sizes each)
polish-birds-data/    # Komisja Faunistyczna data (391 species)
scripts/
  download-bird-photos.js   # download photos from Wikimedia (handles rate limiting)
  verify-bird-photos.js     # verify photo sizes/existence
tests/
  ptaki.test.js       # data validation + rendering tests
  e2e.spec.js         # e2e tests (Playwright)
mockups/              # DO NOT MODIFY (reference files)
```

## ptaki.json schema

Each bird must have:

| Field | Type | Allowed values |
|-------|------|----------------|
| `id` | number | unique |
| `nazwa` | string | Polish name |
| `nazwaLacinska` | string | |
| `kategorie` | array | `"Ogród"`, `"Najliczniejsze"`, `"Najpowszechniejsze"`, `"Top Podkarpacia"`, `"Podkarpackie Atrakcje"` |
| `zdjecie` | string | `img/SpeciesName.jpg` |
| `liczebnosc` | string | e.g. `"100–200 tys."` |
| `trend` | string | `↑` / `→` / `↓` |
| `migracja` | string | `"Osiadły"` / `"Wędrowny"` |
| `statusCzerwonejKsiazki` | string | `LC` / `NT` / `VU` / `EN` |
| `cechy` | array | 5–7 traits with emoji, e.g. `"🔊 Melodyjny śpiew"` |
| `film.id` | string | 11-character YouTube ID |
| `film.platforma` | string | `"youtube"` / `"facebook"` |
| `zrodla` | array | `"MPPL 2025"`, `"Czerwona Księga Ptaków Polski"` |
| `peakMonths` | array | 1–12, only for Podkarpacie birds |

## Image content rules

- **ONLY** Wikimedia Commons — never other sources without user consent
- Photographs only (not illustrations, drawings, digital art)
- Adult specimens in natural pose, sharp, properly exposed
- Licenses: CC0, CC-BY-SA (any version), CC-BY (any version) — avoid NC
- Required 3 sizes with prefix: `SpeciesName.jpg` (original) + `800px_SpeciesName.jpg` (mobile) + `1920px_SpeciesName.jpg` (desktop)
- Generate variants: Python PIL with `Image.LANCZOS`, JPEG quality 85–90
- Minimum: desktop 1200x900px / 100KB, mobile 800x600px / 50KB
- Full spec: `ptaki-przewodnik/img/image-quality.md`

### Wikimedia image selection priority
1. Featured Pictures → 2. Quality Images → 3. Valued Images → 4. other high-quality

### Visual inspection (mandatory)

After every download or replacement, **always** use the `Read` tool to visually inspect the image. Check criteria from `image-quality.md`:

- **Content**: is it a photograph (not eggs, illustration, book cover)? Adult specimen? Wild bird?
- **Visual quality**: sharpness, no grain/noise, no motion blur, no soft focus
- **Composition**: bird large in frame (>10% of area), diagnostic features visible, natural pose
- **Aesthetics**: not unsettling appearance, natural colors, good lighting

Technical tests (resolution, file size) are **not sufficient** — a 4252x3307px photo of eggs will pass all tests but it's not a bird photo.

### Downloading from Wikimedia

- For searching: MCP `wikimedia-image-search`
- For downloading: `scripts/download-bird-photos.js` (handles 429 rate limiting, exponential backoff, response validation)
- When using manual `curl`: add `-A "BirdGuide/1.0"`, `sleep 3` between requests, check file size (< 5KB = HTML error page)

## Do NOT modify

- `mockups/lozowka.html`
- `mockups/ptaki-przewodnik.html`

## MCP Servers

| Server | When to use |
|--------|-------------|
| `wikimedia-image-search` | searching for bird photos for ptaki.json |
| `youtube` (`@kirbah/mcp-youtube`) | checking video IDs, metadata, searching for species recordings |
| `tavily` | searching for species data (IUCN, MPPL, eBird), fact verification |

## Claude Code — limitations and configuration

### Environment variables

| Variable | Purpose | Where to set |
|----------|---------|--------------|
| `YOUTUBE_API_KEY` | youtube MCP (search, channel stats) | locally: `.claude/settings.local.json`; cloud: claude.ai/code → Environments |
| `TAVILY_API_KEY` | tavily MCP | same as above |

`settings.local.json` is in `.gitignore` — do not commit.

### Known limitations in cloud sessions

- `getTranscripts` (youtube MCP) **does not work** — YouTube blocks requests from data center IPs. Works normally locally. Not a configuration issue, no workaround without a residential IP proxy.
- The remaining 7/8 youtube MCP tools work correctly.

### Pre-commit verification

```bash
npm test                              # must pass with no errors
node scripts/verify-bird-photos.js    # 65 PASS, 0 FAIL (when photos changed)
git status                            # check what's going into the commit
```
