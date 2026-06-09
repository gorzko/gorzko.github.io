/**
 * Dodaje nowe ptaki Podkarpacie do ptaki.json
 * Uruchom: node scripts/add-podkarpacie-birds.js
 */
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'ptaki-przewodnik', 'data', 'ptaki.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Sprawdź które gatunki już istnieją (po nazwaLacinska)
const existingLatinNames = new Set(data.ptaki.map(p => p.nazwaLacinska));
const lastId = Math.max(...data.ptaki.map(p => p.id));

const newBirds = [
  {
    nazwa: "Podgorzałka", nazwaLacinska: "Aythya nyroca",
    liczebnosc: "200–400", trend: "↓", migracja: "Wędrowny", statusCzerwonejKsiazki: "NT",
    peakMonths: [3,4,5,6,7,8,10],
    cechy: [
      "🟤 Kasztanowate upierzenie, białe oko u samca",
      "⚪ Biała plama na spodzie ogona",
      "📏 38–42 cm",
      "💧 Stawy z gęstą roślinnością szuwarową",
      "🌿 Wodne rośliny i bezkręgowce",
      "✈️ Wędrowna — rzadki gniazdownik w Polsce"
    ]
  },
  {
    nazwa: "Perkoz Rdzawoszyi", nazwaLacinska: "Podiceps grisegena",
    liczebnosc: "500–700", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [11],
    cechy: [
      "🟤 Rdzawa szyja, szare policzki w szacie godowej",
      "⚫ Czarna czapa, żółty dziób",
      "📏 40–50 cm",
      "💧 Jeziora i zbiorniki z bogatą roślinnością",
      "🐟 Rybożerny — nurkuje za rybami",
      "✈️ Wędrowny — pojawia się głównie w czasie migracji"
    ]
  },
  {
    nazwa: "Świergotek Rdzawogardły", nazwaLacinska: "Anthus cervinus",
    liczebnosc: "setki os.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [9,10],
    cechy: [
      "🟠 Rdzawoczerwone gardło w szacie lęgowej",
      "🟤 Brązowy wierzch z wyraźnymi pręgami",
      "📏 14–15 cm",
      "🌾 Łąki, torfowiska, obrzeża wód",
      "🐛 Owadożerny",
      "✈️ Wędrowny — przelatuje przez PK jesienią"
    ]
  },
  {
    nazwa: "Pliszka Górska", nazwaLacinska: "Motacilla cinerea",
    liczebnosc: "15–25 tys.", trend: "↑", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [6,7,8,9],
    cechy: [
      "🟡 Jaskrawo żółty brzuch przez cały rok",
      "⚫ Szary wierzch, czarne gardło samca latem",
      "📏 17–20 cm",
      "🏔️ Górskie i podgórskie potoki i rzeki",
      "🐛 Owady i bezkręgowce wodne",
      "✈️ Wędrowna — gnieździ się nad potokami PK"
    ]
  },
  {
    nazwa: "Orlik Krzykliwy", nazwaLacinska: "Clanga pomarina",
    liczebnosc: "2,5–3,5 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [5,6,7,8,9],
    cechy: [
      "🟤 Brązowy orzeł z jaśniejszymi plamami na nadgarstkach",
      "🦅 Szerokie skrzydła, leniwy lot szybujący",
      "📏 55–65 cm",
      "🌲 Lasy z sąsiadującymi łąkami i mokradłami",
      "🐸 Żaby, gryzonie, ślimaki, ptaki",
      "✈️ Wędrowny — przylatuje w kwietniu, odlatuje we wrześniu"
    ]
  },
  {
    nazwa: "Jemiołuszka", nazwaLacinska: "Bombycilla garrulus",
    liczebnosc: "kilka tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [1,12],
    cechy: [
      "🌸 Różowobrązowe upierzenie z czarną maską",
      "🔴 Czerwone końcówki lotek, żółty koniec ogona",
      "📏 17–21 cm",
      "🌳 Tajga; zimą zadrzewienia z owocami",
      "🍎 Jarzębina, owoce jemioły, jagody",
      "✈️ Wędrowna — zimuje nieregularnie w Polsce"
    ]
  },
  {
    nazwa: "Dzięcioł Zielonosiwy", nazwaLacinska: "Picus canus",
    liczebnosc: "5–8 tys.", trend: "→", migracja: "Osiadły", statusCzerwonejKsiazki: "LC",
    peakMonths: [2,3,4,5,7,8,9,10,12],
    cechy: [
      "🟢 Zielone upierzenie, szara głowa",
      "🔴 Czerwona plamka na czole tylko u samca",
      "📏 25–28 cm",
      "🌳 Lasy liściaste i mieszane, stare sady",
      "🐛 Mrówki i larwy owadów",
      "🎵 Powoli opadające 'kjü-kjü-kjü'"
    ]
  },
  {
    nazwa: "Żołna", nazwaLacinska: "Merops apiaster",
    liczebnosc: "1–2 tys.", trend: "↑", migracja: "Wędrowny", statusCzerwonejKsiazki: "NT",
    peakMonths: [5,6,7,8],
    cechy: [
      "🌈 Ruda głowa, niebieskozielony brzuch",
      "🟡 Żółte gardło z czarną obrączką",
      "📏 27–29 cm",
      "🌿 Otwarte tereny z gliniasto-piaszczystymi skarpami",
      "🐝 Pszczoły, szerszenie, ważki",
      "✈️ Wędrowna — przylatuje w maju, odlatuje w sierpniu"
    ]
  },
  {
    nazwa: "Zausznik", nazwaLacinska: "Podiceps nigricollis",
    liczebnosc: "1–2 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [8,9],
    cechy: [
      "⚫ Czarne upierzenie z rdzawymi bokami w szacie godowej",
      "🟡 Złote pióra uszne",
      "📏 28–34 cm",
      "💧 Stawy i jeziora z trzciną",
      "🐟 Ryby i bezkręgowce wodne",
      "✈️ Wędrowny — gniazduje kolonijnie"
    ]
  },
  {
    nazwa: "Nur Czarnoszyi", nazwaLacinska: "Gavia arctica",
    liczebnosc: "setki os.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [11,12],
    cechy: [
      "⚫ Czarna głowa z fioletowym połyskiem w szacie godowej",
      "⬛ Czarno-białe szachownicowe wzory na grzbiecie",
      "📏 58–73 cm",
      "💧 Jeziora i rzeki; morze zimą",
      "🐟 Rybożerny — nurkuje głęboko",
      "✈️ Wędrowny — przelatuje przez Polskę jesienią"
    ]
  },
  {
    nazwa: "Ślepowron", nazwaLacinska: "Nycticorax nycticorax",
    liczebnosc: "200–400", trend: "↓", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [7,8],
    cechy: [
      "⚫ Czarna czapa i grzbiet, białe czoło i pióra ozdobne",
      "⚪ Szaro-białe upierzenie spodu",
      "📏 58–65 cm",
      "💧 Mokradła, stawy, rzeki z drzewami nadwodnymi",
      "🐟 Ryby, żaby, owady — aktywny o zmierzchu",
      "✈️ Wędrowny — przylatuje w marcu, odlatuje jesienią"
    ]
  },
  {
    nazwa: "Paszkot", nazwaLacinska: "Turdus viscivorus",
    liczebnosc: "30–50 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [2,3,6,10,11],
    cechy: [
      "🟤 Brązowy wierzch, kremowy spód z dużymi ciemnymi plamkami",
      "⚪ Białe końcówki zewnętrznych sterówek",
      "📏 26–29 cm",
      "🌳 Lasy i ogrody z wysokimi drzewami",
      "🍒 Jemioła, jagody, dżdżownice, owady",
      "🎵 Śpiewa przy wietrznej pogodzie — 'burzowy śpiewak'"
    ]
  },
  {
    nazwa: "Sikora Uboga", nazwaLacinska: "Poecile montanus",
    liczebnosc: "300–500 tys.", trend: "↓", migracja: "Osiadły", statusCzerwonejKsiazki: "LC",
    peakMonths: [1,2,3,8,9,10,11,12],
    cechy: [
      "⚫ Czarna czapka matowa, bez połysku",
      "🟤 Brązowawe boki, biały policzek i szyja",
      "📏 12–13 cm",
      "🌲 Wilgotne lasy olszowe i wierzbowe",
      "🐛 Owady latem; nasiona i orzeszki zimą",
      "🎵 Charakterystyczne 'czej-czej' i gwizd 'pii'"
    ]
  },
  {
    nazwa: "Trzmielojad", nazwaLacinska: "Pernis apivorus",
    liczebnosc: "3–5 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [5,7,8,9],
    cechy: [
      "🟤 Brązowy z szerokim deseniem na szerokich skrzydłach",
      "🦅 Mała gołębia głowa i gęste łuski przy dziobie",
      "📏 52–60 cm",
      "🌳 Lasy liściaste i mieszane",
      "🐝 Gniazda os i trzmieli — wyspecjalizowana dieta",
      "✈️ Wędrowny — przylatuje w maju, odlatuje w sierpniu"
    ]
  },
  {
    nazwa: "Ogorzałka", nazwaLacinska: "Aythya marila",
    liczebnosc: "50–150", trend: "↓", migracja: "Wędrowny", statusCzerwonejKsiazki: "NT",
    peakMonths: [11,12],
    cechy: [
      "⚫ Samiec: czarny przód i tył, szary grzbiet",
      "🟤 Samica: brązowa z białą plamą przy dziobie",
      "📏 40–51 cm",
      "💧 Duże jeziora i zbiorniki; morze zimą",
      "🐚 Małże, ślimaki, bezkręgowce",
      "✈️ Wędrowna — zimuje w Polsce"
    ]
  },
  {
    nazwa: "Szlachar", nazwaLacinska: "Mergus serrator",
    liczebnosc: "800–1,2 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [11],
    cechy: [
      "🟢 Samiec: zielona głowa z czubem, ruda pierś z prążkami",
      "🟤 Samica: ruda głowa, szary grzbiet",
      "📏 52–58 cm",
      "💧 Górskie i podgórskie rzeki, wybrzeże",
      "🐟 Rybożerny — ząbkowany dziób do łapania ryb",
      "✈️ Wędrowny — pojawia się podczas migracji"
    ]
  },
  {
    nazwa: "Siewka Złota", nazwaLacinska: "Pluvialis apricaria",
    liczebnosc: "kilkadziesiąt tys.", trend: "↓", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [2,3],
    cechy: [
      "🟡 Złotobrązowy, nakrapiany wierzch",
      "⚫ Czarny spód w szacie godowej",
      "📏 26–29 cm",
      "🌾 Pola, łąki, torfowiska podczas przelotu",
      "🐛 Dżdżownice, owady, jagody",
      "✈️ Wędrowna — przelatuje przez PK w lutym–marcu"
    ]
  },
  {
    nazwa: "Siniak", nazwaLacinska: "Columba oenas",
    liczebnosc: "80–120 tys.", trend: "↑", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [3,4,5,6,7,8,9],
    cechy: [
      "🔵 Niebieskoszary, bez białych plam",
      "💚 Zielonkawy połysk na szyi, różowawa pierś",
      "📏 32–34 cm",
      "🌳 Stare lasy z dziuplami, otoczone polami",
      "🌾 Nasiona, żołędzie, owoce leśne",
      "🔊 Monotonne 'wu-wu' powtarzane w seriach"
    ]
  },
  {
    nazwa: "Bocian Czarny", nazwaLacinska: "Ciconia nigra",
    liczebnosc: "1–1,2 tys.", trend: "↑", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [4,5,6,7,8],
    cechy: [
      "⚫ Czarne upierzenie z zielonym i fioletowym metalicznym połyskiem",
      "🔴 Czerwony dziób i nogi",
      "📏 95–100 cm",
      "🌲 Stare lasy nizinne i górskie z rzekami",
      "🐟 Ryby, żaby, owady",
      "✈️ Wędrowny — przylatuje w kwietniu, odlatuje w sierpniu"
    ]
  },
  {
    nazwa: "Kląskawka", nazwaLacinska: "Saxicola rubicola",
    liczebnosc: "10–20 tys.", trend: "↑", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [3,4,5,6,7,8,9],
    cechy: [
      "⚫ Samiec: czarna głowa, biała łata na szyi",
      "🟠 Rdzawa pierś, biały kuper",
      "📏 12–13 cm",
      "🌾 Łąki, zarośla cierniowe, wrzosowiska",
      "🐛 Owadożerna — chwyta owady z wysokich roślin",
      "✈️ Wędrowna — przylatuje w marcu"
    ]
  },
  {
    nazwa: "Świergotek Drzewny", nazwaLacinska: "Anthus trivialis",
    liczebnosc: "200–400 tys.", trend: "↓", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [8,9],
    cechy: [
      "🟤 Brązowy wierzch z pręgami, kremowy spód",
      "🟡 Biała brew, plamkowana pierś",
      "📏 15 cm",
      "🌲 Skraje lasów, polany, młodniki",
      "🐛 Owadożerny",
      "✈️ Wędrowny — przylatuje w marcu, odlatuje we wrześniu"
    ]
  },
  {
    nazwa: "Srokosz", nazwaLacinska: "Lanius excubitor",
    liczebnosc: "20–40 tys.", trend: "↓", migracja: "Osiadły", statusCzerwonejKsiazki: "NT",
    peakMonths: [1,2,3,8,9,10,11,12],
    cechy: [
      "⚫ Czarna maska przez oczy, szary wierzch",
      "⚪ Biały brzuch, czarne skrzydła z białą plamą",
      "📏 22–26 cm",
      "🌾 Otwarte tereny z krzewami i drzewami",
      "🐭 Myszy, duże owady, małe ptaki",
      "🍢 Nadziewanie zdobyczy na ciernie — 'spiżarnia'"
    ]
  },
  {
    nazwa: "Sosnówka", nazwaLacinska: "Periparus ater",
    liczebnosc: "300–500 tys.", trend: "→", migracja: "Osiadły", statusCzerwonejKsiazki: "LC",
    peakMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    cechy: [
      "⚫ Czarna głowa z białą plamą na karku",
      "⚪ Białe policzki, jasny spód",
      "📏 11 cm",
      "🌲 Lasy iglaste — szczególnie sosnowe i świerkowe",
      "🐛 Owadożerna; nasiona szyszek zimą",
      "🎵 Powtarzane 'pitiu-pitiu'"
    ]
  },
  {
    nazwa: "Muchołówka Mała", nazwaLacinska: "Ficedula parva",
    liczebnosc: "40–70 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [8],
    cechy: [
      "🟠 Samiec: rdzawawe gardło, szary wierzch",
      "⚪ Samica: kremowe gardło, brązowy wierzch",
      "📏 11 cm",
      "🌳 Stare lasy liściaste i mieszane",
      "🐛 Owadożerna — chwyta muchy w powietrzu",
      "✈️ Wędrowna — przylatuje w maju, odlatuje jesienią"
    ]
  },
  {
    nazwa: "Remiz", nazwaLacinska: "Remiz pendulinus",
    liczebnosc: "20–40 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [9,10],
    cechy: [
      "🟤 Ruda pierś, szara głowa, czarna maska u samca",
      "⚪ Kremowoszary grzbiet",
      "📏 11 cm",
      "💧 Zarośla wierzbowe nad wodą, trzcinowiska",
      "🌱 Nasiona wierzby, trzciny i topoli",
      "🧶 Tka wiszące gniazdo w kształcie torebki"
    ]
  },
  {
    nazwa: "Głowienka", nazwaLacinska: "Aythya ferina",
    liczebnosc: "3–5 tys.", trend: "↓", migracja: "Wędrowny", statusCzerwonejKsiazki: "VU",
    peakMonths: [1,3,4,5,9,10,11,12],
    cechy: [
      "🟤 Samiec: rdzawa głowa, czarny przód, szary grzbiet",
      "🟤 Samica: brązowoszara, jasne brwi",
      "📏 42–49 cm",
      "💧 Zbiorniki z bogatą roślinnością",
      "🌿 Wodne rośliny, małże, owady",
      "✈️ Wędrowna — odlatuje na zimę, wraca wiosną"
    ]
  },
  {
    nazwa: "Myszołów Włochaty", nazwaLacinska: "Buteo lagopus",
    liczebnosc: "do 1 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [1,2,12],
    cechy: [
      "⚪ Jasne upierzenie z wyraźnym ciemnym brzuchem",
      "⚫ Czarny nadgarstek, ciemna plama na piersi",
      "📏 50–60 cm",
      "🌾 Tundra latem; pola i łąki zimą",
      "🐭 Gryzonie, lemingi",
      "✈️ Wędrowny — zimuje w Polsce nieregularnie"
    ]
  },
  {
    nazwa: "Przepiórka", nazwaLacinska: "Coturnix coturnix",
    liczebnosc: "100–200 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [5,6,7],
    cechy: [
      "🟤 Drobna, brązowo-kremowa, ukryta w trawie",
      "🎵 Głośne 'pójdź tu' (pwit-pwit-pwit) samca",
      "📏 17–19 cm",
      "🌾 Pola zbożowe, łąki, ugory",
      "🌰 Nasiona, owady, pączki roślin",
      "✈️ Wędrowna — przylatuje w maju, odlatuje we wrześniu"
    ]
  },
  {
    nazwa: "Makolągwa", nazwaLacinska: "Linaria cannabina",
    liczebnosc: "1–2 mln", trend: "↓", migracja: "Wędrowny", statusCzerwonejKsiazki: "VU",
    peakMonths: [3,4,5,6,7,8,9,10,11],
    cechy: [
      "🔴 Samiec: karminowe czoło i pierś wiosną",
      "🟤 Samica: brązowopręgowana, bez czerwieni",
      "📏 13–14 cm",
      "🌿 Zarośla, skraje pól i ogrodów",
      "🌱 Nasiona chwastów, konopie i trawy",
      "✈️ Wędrowna — odlatuje jesienią na południe"
    ]
  },
  {
    nazwa: "Zimorodek", nazwaLacinska: "Alcedo atthis",
    liczebnosc: "8–12 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [6,7,8,9,10,11,12],
    cechy: [
      "🔵 Metalicznie niebieskozielony wierzch",
      "🟠 Rdzawy spód, biała plama na szyi",
      "📏 17–19 cm",
      "💧 Czyste rzeki i potoki z nadbrzeżnymi skarpami",
      "🐟 Poluje nurkując na ryby do 9 cm",
      "🎵 Przenikliwy gwizd 'tsi-tsi' w locie"
    ]
  },
  {
    nazwa: "Bocian Biały", nazwaLacinska: "Ciconia ciconia",
    liczebnosc: "52–55 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [4,5,6,7,8],
    cechy: [
      "⚪ Białe z czarnymi lotkami i czerwonym dziobem",
      "🔴 Czerwone nogi",
      "📏 100–115 cm",
      "🌾 Łąki, mokradła, tereny wiejskie",
      "🐸 Żaby, myszy, krety, dżdżownice",
      "✈️ Wędrowny — zimuje w Afryce"
    ]
  },
  {
    nazwa: "Derkacz", nazwaLacinska: "Crex crex",
    liczebnosc: "10–20 tys.", trend: "↓", migracja: "Wędrowny", statusCzerwonejKsiazki: "NT",
    peakMonths: [5,6,7],
    cechy: [
      "🟤 Brązowy, skrycie żyjący w trawie",
      "🎵 Głośne chrapliwe 'krek-krek' nocą",
      "📏 27–30 cm",
      "🌾 Wilgotne łąki i turzycowiska",
      "🐛 Owady, ślimaki, nasiona",
      "✈️ Wędrowny — przylatuje w maju, odlatuje w sierpniu"
    ]
  },
  {
    nazwa: "Kobczyk", nazwaLacinska: "Falco vespertinus",
    liczebnosc: "10–30", trend: "↓", migracja: "Wędrowny", statusCzerwonejKsiazki: "NT",
    peakMonths: [9],
    cechy: [
      "⚫ Samiec: ciemnoszary z czerwonymi nogami i podogoniem",
      "🟤 Samica: ruda głowa i brzuch, paskowany grzbiet",
      "📏 28–31 cm",
      "🌾 Otwarte tereny, pola, stepy",
      "🐛 Owady — szarańcza, ważki, chrząszcze",
      "✈️ Wędrowny — przelotny w Polsce, rzadko gniazduje"
    ]
  },
  {
    nazwa: "Pokrzywnica", nazwaLacinska: "Prunella modularis",
    liczebnosc: "1,5–2,5 mln", trend: "↑", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [9,10],
    cechy: [
      "🔵 Szaroniebieskawa głowa i pierś",
      "🟤 Brązowy, paskowany wierzch",
      "📏 13–14 cm",
      "🌿 Lasy z gęstym podszyciem, ogrody, parki",
      "🐛 Owady latem; nasiona zimą",
      "🎵 Szybki, nieprzerwany melodyjny świergot"
    ]
  },
  {
    nazwa: "Perkozek", nazwaLacinska: "Tachybaptus ruficollis",
    liczebnosc: "20–30 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [4,5,6,7,8,9,10,11,12],
    cechy: [
      "🟤 Rdzawobrązowe boki głowy i szyja w szacie godowej",
      "🟡 Żółtawa plama u nasady dzioba",
      "📏 23–29 cm",
      "💧 Stawy z roślinnością, wolno płynące rzeki",
      "🐟 Ryby, owady i bezkręgowce",
      "🔊 Głośny, drżący tryl zwłaszcza wieczorami"
    ]
  },
  {
    nazwa: "Muchołówka Białoszyja", nazwaLacinska: "Ficedula albicollis",
    liczebnosc: "150–250 tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [5,6],
    cechy: [
      "⚫ Samiec: czarny wierzch, biała szyja i brzuch",
      "⚪ Duże białe plamy na skrzydłach",
      "📏 12–13 cm",
      "🌳 Stare lasy bukowe i dębowe",
      "🐛 Owadożerna — chwyta muchy w powietrzu",
      "✈️ Wędrowna — przylatuje w maju, odlatuje we wrześniu"
    ]
  },
  {
    nazwa: "Mewa Białogłowa", nazwaLacinska: "Larus cachinnans",
    liczebnosc: "20–30 tys.", trend: "↑", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    cechy: [
      "⚪ Biała głowa przez cały rok, żółte oczy",
      "⚫ Szary grzbiet, żółty dziób z czerwoną plamką",
      "📏 55–67 cm",
      "💧 Rzeki, zbiorniki, wysypiska śmieci",
      "🍽️ Wszystkożerna — ryby, odpadki, padlina",
      "🔊 Charakterystyczne 'kjaw-kjaw'"
    ]
  },
  {
    nazwa: "Świstun", nazwaLacinska: "Mareca penelope",
    liczebnosc: "kilka tys.", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [3,10,11,12],
    cechy: [
      "🟠 Samiec: rdzawa głowa z kremowym czołem",
      "⚫ Szary grzbiet, biały brzuch",
      "📏 45–51 cm",
      "💧 Zbiorniki, rzeki, estuaria",
      "🌿 Trawy wodne i roślinność błotna",
      "✈️ Wędrowny — przelatuje wiosną i jesienią"
    ]
  },
  {
    nazwa: "Pokląskwa", nazwaLacinska: "Saxicola rubetra",
    liczebnosc: "100–200 tys.", trend: "↓", migracja: "Wędrowny", statusCzerwonejKsiazki: "NT",
    peakMonths: [4,5,6,7,8],
    cechy: [
      "⚫ Samiec: ciemna maska, wyraźna biała brew",
      "🟠 Rdzawa pierś, białe plamy na szyi",
      "📏 12–13 cm",
      "🌾 Łąki, zarośla, skraje lasów",
      "🐛 Owadożerna — łapie owady z wysokich traw",
      "✈️ Wędrowna — przylatuje w kwietniu, odlatuje w sierpniu"
    ]
  },
  {
    nazwa: "Jaskółka Dymówka", nazwaLacinska: "Hirundo rustica",
    liczebnosc: "3–5 mln", trend: "↓", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [4,5,6,7,8,9],
    cechy: [
      "🔵 Stalowoniebieskie upierzenie wierzchu",
      "🟠 Rdzawe czoło i gardło",
      "📏 17–21 cm",
      "🏠 Stodoły, budynki gospodarcze, mosty",
      "🐛 Owady łapane wyłącznie w locie",
      "✈️ Wędrowna — zimuje w Afryce"
    ]
  },
  {
    nazwa: "Pliszka Siwa", nazwaLacinska: "Motacilla alba",
    liczebnosc: "2–3 mln", trend: "→", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [3,4,5,6,7,8,9,10],
    cechy: [
      "⚫ Czarno-biała z długim ogonem",
      "⚪ Biała twarz z czarnym gardłem (samiec)",
      "📏 18–19 cm",
      "🏙️ Brzegi wód, drogi, osiedla, łąki",
      "🐛 Owady, pająki, dżdżownice",
      "🎵 Głośne 'czi-czit' w locie"
    ]
  },
  {
    nazwa: "Krzyżówka", nazwaLacinska: "Anas platyrhynchos",
    liczebnosc: "300–500 tys.", trend: "↓", migracja: "Wędrowny", statusCzerwonejKsiazki: "LC",
    peakMonths: [1,2,3,4,5,6,7,8,9,10,11,12],
    cechy: [
      "🟢 Samiec: metalicznie zielona głowa, brązowa pierś",
      "🟤 Samica: brązowokremowa, maskująca",
      "📏 50–65 cm",
      "💧 Wszelkie zbiorniki wodne",
      "🌿 Wszystkożerna — roślinność, bezkręgowce, owady",
      "🔊 Kwakanie — głośne 'kwa-kwa' samicy"
    ]
  }
];

let nextId = lastId + 1;
let added = 0;
let skipped = 0;

newBirds.forEach(bird => {
  if (existingLatinNames.has(bird.nazwaLacinska)) {
    console.log(`SKIP (już istnieje): ${bird.nazwa} (${bird.nazwaLacinska})`);
    skipped++;
    return;
  }

  const entry = {
    id: nextId++,
    nazwa: bird.nazwa,
    nazwaLacinska: bird.nazwaLacinska,
    kategorie: ["Podkarpacie"],
    zdjecie: `img/${bird.nazwaLacinska.replace(/ /g,'_')}.jpg`,
    liczebnosc: bird.liczebnosc,
    trend: bird.trend,
    migracja: bird.migracja,
    statusCzerwonejKsiazki: bird.statusCzerwonejKsiazki,
    peakMonths: bird.peakMonths,
    cechy: bird.cechy,
    zrodla: ["eBird PL-PK 2025", "Czerwona Księga Ptaków Polski"]
  };

  data.ptaki.push(entry);
  existingLatinNames.add(bird.nazwaLacinska);
  added++;
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
console.log(`\nDodano: ${added} ptaków`);
console.log(`Pominięto: ${skipped} (już istnieją)`);
console.log(`Łącznie w pliku: ${data.ptaki.length} ptaków`);
console.log(`ID od ${lastId+1} do ${nextId-1}`);
