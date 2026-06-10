/**
 * Splits the single "Podkarpacie" category into two:
 *   "Top Podkarpacia"       — rankingB_common (most abundant in region)
 *   "Podkarpackie Atrakcje" — rankingA_iconic (characteristic of region)
 *
 * Also tags pre-existing birds that appear in the rankings.
 * Run: node scripts/update-podkarpacie-categories.js
 */
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Latin names of newly-added birds -> "Podkarpackie Atrakcje" (rankingA_iconic)
const atrakcjeLatinNames = new Set([
  'Aythya nyroca','Podiceps grisegena','Anthus cervinus','Motacilla cinerea',
  'Clanga pomarina','Bombycilla garrulus','Picus canus','Merops apiaster',
  'Podiceps nigricollis','Gavia arctica','Nycticorax nycticorax','Turdus viscivorus',
  'Poecile montanus','Pernis apivorus','Aythya marila','Mergus serrator',
  'Pluvialis apricaria','Columba oenas','Ciconia nigra','Saxicola rubicola',
  'Anthus trivialis','Lanius excubitor','Periparus ater','Ficedula parva',
  'Remiz pendulinus','Aythya ferina','Buteo lagopus','Coturnix coturnix',
  'Linaria cannabina','Alcedo atthis','Ciconia ciconia','Crex crex',
  'Falco vespertinus','Prunella modularis','Tachybaptus ruficollis',
  'Ficedula albicollis','Larus cachinnans','Mareca penelope','Saxicola rubetra',
]);

// Latin names of newly-added birds -> "Top Podkarpacia" (rankingB_common, not pre-existing)
const topLatinNames = new Set([
  'Hirundo rustica','Motacilla alba','Anas platyrhynchos',
]);

// Pre-existing birds that get "Podkarpackie Atrakcje" added
const addAtrakcjeLatinNames = new Set(['Pyrrhula pyrrhula']);

// Pre-existing birds that get "Top Podkarpacia" added
const addTopLatinNames = new Set([
  'Parus major','Turdus merula','Columba palumbus','Sylvia atricapilla',
  'Cyanistes caeruleus','Phylloscopus collybita','Fringilla coelebs',
]);

let countAtrakcje = 0, countTop = 0, countAddAtrakcje = 0, countAddTop = 0;

data.ptaki.forEach(bird => {
  const lat = bird.nazwaLacinska;
  if (atrakcjeLatinNames.has(lat)) {
    bird.kategorie = bird.kategorie.map(k => k === 'Podkarpacie' ? 'Podkarpackie Atrakcje' : k);
    countAtrakcje++;
  } else if (topLatinNames.has(lat)) {
    bird.kategorie = bird.kategorie.map(k => k === 'Podkarpacie' ? 'Top Podkarpacia' : k);
    countTop++;
  } else if (addAtrakcjeLatinNames.has(lat)) {
    if (!bird.kategorie.includes('Podkarpackie Atrakcje')) { bird.kategorie.push('Podkarpackie Atrakcje'); countAddAtrakcje++; }
  } else if (addTopLatinNames.has(lat)) {
    if (!bird.kategorie.includes('Top Podkarpacia')) { bird.kategorie.push('Top Podkarpacia'); countAddTop++; }
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
console.log(`"Podkarpacie" -> "Podkarpackie Atrakcje": ${countAtrakcje}`);
console.log(`"Podkarpacie" -> "Top Podkarpacia": ${countTop}`);
console.log(`Added "Podkarpackie Atrakcje" to: ${countAddAtrakcje} existing birds`);
console.log(`Added "Top Podkarpacia" to: ${countAddTop} existing birds`);
