/**
 * Adds video entries for the 18 Podkarpackie Atrakcje birds
 * that were missing films in ptaki.json.
 * Run: node scripts/add-missing-videos.js
 */
const fs = require('fs'), path = require('path');
const jsonPath = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const videos = {
  'Aythya nyroca':         { id: 'tIGE37BLGqQ', tytul: '1568. Polák malý / Ferruginous Duck / Podgorzałka zwyczajna',                platforma: 'youtube' },
  'Anthus cervinus':       { id: 'e_dAzayCGuo', tytul: '4K Świergotek rdzawogardły / Red-throated pipit / Anthus cervinus',          platforma: 'youtube' },
  'Clanga pomarina':       { id: '6zXJ5n6MJ_0', tytul: '769. Orel křiklavý / Lesser Spotted Eagle / Orlik krzykliwy',               platforma: 'youtube' },
  'Picus canus':           { id: 'O2eYVOZ-YTs', tytul: 'Žluna šedá / Grey-headed woodpecker / Dzięcioł zielonosiwy / Pic cendré',    platforma: 'youtube' },
  'Podiceps nigricollis':  { id: 'jUq4JdZcAzk', tytul: '852. Potápka černokrká / Black-necked grebe / Perkoz zausznik',              platforma: 'youtube' },
  'Gavia arctica':         { id: 'zLImq0U1hyU', tytul: '4K Nur czarnoszyi i perkoz rogaty / Arctic loon & Horned grebe',            platforma: 'youtube' },
  'Nycticorax nycticorax': { id: 'TeYdmL7gsR8', tytul: 'Bird sounds – Black-crowned night heron (Nycticorax nycticorax)',            platforma: 'youtube' },
  'Pernis apivorus':       { id: '8PEMhQztiF8', tytul: 'Honey Buzzard (Pernis apivorus) male feeds fledgling and makes lure calls',  platforma: 'youtube' },
  'Aythya marila':         { id: 'E6vOA56cCrI', tytul: '1283. Polák kaholka / Greater Scaup / Ogorzałka zwyczajna',                 platforma: 'youtube' },
  'Mergus serrator':       { id: 'R-MTwBWSZD4', tytul: 'Merganser duck call sound, diving, bathing, flying, running',                platforma: 'youtube' },
  'Pluvialis apricaria':   { id: 'ove0UrDSKjM', tytul: '914. Kulík zlatý / European Golden Plover / Siewka złota',                  platforma: 'youtube' },
  'Ciconia nigra':         { id: 'zvfgBXD4yE0', tytul: 'Black stork (Ciconia nigra) sound – call and song',                          platforma: 'youtube' },
  'Saxicola rubicola':     { id: 'rMwYBw7zMmY', tytul: 'Kląskawka (Saxicola rubicola)',                                              platforma: 'youtube' },
  'Anthus trivialis':      { id: '8vsWVzZ2PuY', tytul: 'Leśny Budzik – Świergotek Drzewny',                                         platforma: 'youtube' },
  'Lanius excubitor':      { id: 'lEVP-wHYkWo', tytul: '4K Srokosz – na czatach i w zawisie / Great grey shrike',                   platforma: 'youtube' },
  'Periparus ater':        { id: 'IKxcC_bUHuI', tytul: 'Sýkora uhelníček / Coal tit / Tannenmeise / Sosnówka',                      platforma: 'youtube' },
  'Falco vespertinus':     { id: 'fMYf1j9XnCc', tytul: 'Kobczyk / Der Rotfußfalke / Falco vespertinus',                              platforma: 'youtube' },
  'Larus cachinnans':      { id: 'pnvwJ9Fp_g8', tytul: 'Caspian Gull (Larus cachinnans) – long call',                               platforma: 'youtube' },
};

let count = 0;
data.ptaki.forEach(p => {
  if (!p.film && videos[p.nazwaLacinska]) {
    p.film = videos[p.nazwaLacinska];
    count++;
  }
});
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Updated ${count} birds.`);
