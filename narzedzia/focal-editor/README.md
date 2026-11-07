# Edytor focal pointów

Lokalne narzędzie do przeglądania zdjęć gatunków z przewodnika oraz ustawiania
punktów kluczowych (`focalPoint`, przeciąganie na zdjęciu) i kierunku patrzenia
ptaka (`beakSide`). Zmiany zapisują się automatycznie do
`ptaki-przewodnik/data/ptaki.json`.

Katalog `narzedzia/` jest wykluczony z deploymentu do Cloudflare (`.assetsignore`).

## Uruchomienie

```bash
node narzedzia/focal-editor/server.js
# lub
npm run focal-editor
```

Następnie otwórz http://127.0.0.1:8787/ (port można zmienić zmienną `PORT`).

Serwer działa wyłącznie lokalnie (127.0.0.1) i nie wymaga instalacji
zależności — używa tylko wbudowanych modułów Node.js.

## Użycie

- Lista gatunków po lewej (szukajka, strzałki ←/→ lub przyciski).
- Kliknij na zdjęciu lub przeciągnij okrągły znacznik, aby ustawić `focalPoint`.
- Przyciski `left` / `center` / `right` i wybór pozycji pionowej ustawiają wartość bez przeciągania.
- `👈 w lewo` / `w prawo 👉` ustawia kierunek patrzenia (`beakSide`).
- Podgląd 16:9 pokazuje efekt kadrowania (`object-fit: cover`) tak jak na karcie gatunku.
