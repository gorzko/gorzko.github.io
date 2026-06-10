/**
 * Downloads missing bird photos from Wikimedia Commons.
 *
 * Run locally (sandbox blocks Wikimedia network):
 *   node scripts/download-bird-photos.js
 *
 * Images are saved to ptaki-przewodnik/img/<NazwaLacinska>.jpg
 * Attribution (author, license) is printed for each downloaded file.
 */
const fs   = require('fs');
const path = require('path');
const https = require('https');

const DATA_PATH = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
const IMG_DIR   = path.join(__dirname, '..', 'ptaki-przewodnik', 'img');

const DELAY_MS = 600; // polite delay between requests

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'PtakiPrzewodnik/1.0 (educational bird guide)' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: Buffer.concat(chunks), headers: res.headers }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function fetchJson(url) {
  const r = await httpsGet(url);
  return JSON.parse(r.body.toString('utf8'));
}

async function downloadFile(url, dest) {
  const r = await httpsGet(url);
  if (r.statusCode !== 200) throw new Error(`HTTP ${r.statusCode} for ${url}`);
  fs.writeFileSync(dest, r.body);
}

/**
 * Query Wikimedia Commons API for the best image of a species.
 * Tries direct file title first, falls back to a text search.
 */
async function findImageUrl(latinName) {
  const fileTitle = `File:${latinName.replace(/ /g, '_')}.jpg`;
  const apiBase = 'https://commons.wikimedia.org/w/api.php';

  // 1. Try direct file title
  const directUrl = `${apiBase}?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=800&format=json`;
  const direct = await fetchJson(directUrl);
  const pages = Object.values(direct.query.pages);
  if (pages[0] && pages[0].imageinfo && pages[0].imageinfo[0]) {
    const ii = pages[0].imageinfo[0];
    const author = ii.extmetadata?.Artist?.value?.replace(/<[^>]+>/g, '') || 'unknown';
    const license = ii.extmetadata?.LicenseShortName?.value || 'unknown';
    return { url: ii.thumburl || ii.url, author, license };
  }

  // 2. Fall back: search Commons for "latinName bird"
  const searchUrl = `${apiBase}?action=query&list=search&srsearch=${encodeURIComponent(latinName + ' bird')}&srnamespace=6&srlimit=1&format=json`;
  const search = await fetchJson(searchUrl);
  if (!search.query.search.length) return null;

  const title = search.query.search[0].title;
  const infoUrl = `${apiBase}?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=800&format=json`;
  const info = await fetchJson(infoUrl);
  const p = Object.values(info.query.pages)[0];
  if (!p || !p.imageinfo) return null;
  const ii = p.imageinfo[0];
  const author = ii.extmetadata?.Artist?.value?.replace(/<[^>]+>/g, '') || 'unknown';
  const license = ii.extmetadata?.LicenseShortName?.value || 'unknown';
  return { url: ii.thumburl || ii.url, author, license };
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  const missing = data.ptaki.filter(bird => {
    const imgFile = path.join(IMG_DIR, `${bird.nazwaLacinska.replace(/ /g, '_')}.jpg`);
    return !fs.existsSync(imgFile);
  });

  console.log(`Found ${missing.length} birds without local images.\n`);

  let ok = 0;
  let failed = 0;

  for (const bird of missing) {
    const fileName = `${bird.nazwaLacinska.replace(/ /g, '_')}.jpg`;
    const dest = path.join(IMG_DIR, fileName);
    process.stdout.write(`[${bird.nazwaLacinska}] ... `);
    try {
      const result = await findImageUrl(bird.nazwaLacinska);
      if (!result) {
        console.log('NOT FOUND');
        failed++;
      } else {
        await downloadFile(result.url, dest);
        console.log(`OK  |  ${result.license}  |  ${result.author}`);
        ok++;
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      failed++;
    }
    await sleep(DELAY_MS);
  }

  console.log(`\nDownloaded: ${ok}  |  Failed: ${failed}`);
}

main().catch(err => { console.error(err); process.exit(1); });
