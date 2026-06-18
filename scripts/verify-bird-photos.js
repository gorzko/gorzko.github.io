/**
 * Verifies bird photos against quality standards in image-quality.md.
 * Checks: file existence, size >= 100KB, dimensions >= 1200x900, valid JPEG.
 *
 * Run: node scripts/verify-bird-photos.js
 */
const fs   = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
const IMG_DIR   = path.join(__dirname, '..', 'ptaki-przewodnik', 'img');

const MIN_SIZE_KB = 100;
const MIN_WIDTH   = 1200;
const MIN_HEIGHT  = 900;

function getJpegDimensions(buf) {
  if (buf[0] !== 0xFF || buf[1] !== 0xD8) return null;
  let i = 2;
  while (i < buf.length - 8) {
    if (buf[i] !== 0xFF) break;
    const marker = buf[i + 1];
    const segLen = buf.readUInt16BE(i + 2);
    if (marker >= 0xC0 && marker <= 0xC3) {
      return {
        height: buf.readUInt16BE(i + 5),
        width:  buf.readUInt16BE(i + 7),
      };
    }
    i += 2 + segLen;
  }
  return null;
}

function checkImage(filePath) {
  const issues = [];

  if (!fs.existsSync(filePath)) {
    return { exists: false, issues: ['brak pliku'] };
  }

  const stat = fs.statSync(filePath);
  const sizeKB = Math.round(stat.size / 1024);

  const buf = fs.readFileSync(filePath);

  if (buf[0] !== 0xFF || buf[1] !== 0xD8) {
    issues.push('niepoprawny nagłówek JPEG');
  }

  if (sizeKB < MIN_SIZE_KB) {
    issues.push(`rozmiar ${sizeKB} KB < ${MIN_SIZE_KB} KB`);
  }

  const dims = getJpegDimensions(buf);
  const dimsStr = dims ? `${dims.width}×${dims.height}` : '?×?';

  if (!dims) {
    issues.push('nie można odczytać wymiarów');
  } else if (dims.width < MIN_WIDTH || dims.height < MIN_HEIGHT) {
    issues.push(`wymiary ${dims.width}×${dims.height} < ${MIN_WIDTH}×${MIN_HEIGHT}`);
  }

  return { exists: true, sizeKB, dimsStr, issues };
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  const COL = { name: 30, file: 35, size: 8, dims: 14, status: 6 };
  const header = [
    'Gatunek (łac.)'.padEnd(COL.name),
    'Plik'.padEnd(COL.file),
    'KB'.padStart(COL.size),
    'Wymiary'.padEnd(COL.dims),
    'Status',
  ].join('  ');
  const sep = '-'.repeat(header.length);

  console.log('\nWeryfikacja zdjęć — wymagania: ≥100 KB, ≥1200×900 px, poprawny JPEG\n');
  console.log(header);
  console.log(sep);

  const pass = [], fail = [], missing = [];

  for (const bird of data.ptaki) {
    const fileName = `${bird.nazwaLacinska.replace(/ /g, '_')}.jpg`;
    const filePath = path.join(IMG_DIR, fileName);
    const r = checkImage(filePath);

    const nameCol  = bird.nazwaLacinska.padEnd(COL.name);
    const fileCol  = fileName.padEnd(COL.file);
    const sizeCol  = (r.exists ? String(r.sizeKB) : '-').padStart(COL.size);
    const dimsCol  = (r.exists ? (r.dimsStr || '?×?') : '-').padEnd(COL.dims);

    if (!r.exists) {
      missing.push(bird.nazwaLacinska);
      console.log(`${nameCol}  ${fileCol}  ${sizeCol}  ${dimsCol}  BRAK`);
    } else if (r.issues.length === 0) {
      pass.push(bird.nazwaLacinska);
      console.log(`${nameCol}  ${fileCol}  ${sizeCol}  ${dimsCol}  OK`);
    } else {
      fail.push({ name: bird.nazwaLacinska, issues: r.issues });
      console.log(`${nameCol}  ${fileCol}  ${sizeCol}  ${dimsCol}  FAIL  ← ${r.issues.join(', ')}`);
    }
  }

  console.log(sep);
  console.log(`\nPASS: ${pass.length}  |  FAIL: ${fail.length}  |  BRAK: ${missing.length}\n`);

  if (fail.length > 0) {
    console.log('Zdjęcia do wymiany:');
    for (const f of fail) console.log(`  - ${f.name}: ${f.issues.join(', ')}`);
    console.log();
  }

  if (missing.length > 0) {
    console.log('Brakujące pliki:');
    for (const m of missing) console.log(`  - ${m}`);
    console.log();
  }
}

main();
