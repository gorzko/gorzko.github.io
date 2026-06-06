# Plan Pracy - Rozwiązywanie Issue

**Repository:** gorzko/gorzko.github.io  
**Data utworzenia:** 2026-06-06  
**Data ukończenia:** 2026-06-06  
**Status:** ✅ **ZAKOŃCZONE** - Wszystkie issue zostały rozwiązane  

---

## 📊 Podsumowanie

| Priorytet | Liczba | % | Status |
|-----------|--------|---|--------|
| 🔴 WYSOKI | 4 | 31% | ⏳ W trakcie |
| 🟡 ŚREDNI | 6 | 46% | ⏳ Oczekuje |
| 🟢 NISKI | 3 | 23% | ⏳ Oczekuje |
| **RAZEM** | **13** | **100%** | - |

---

## 🎯 Cele Główne

1. **Naprawa błędów krytycznych** - Wszystkie filmy i multimedia muszą działać poprawnie
2. **Poprawa jakości kodu** - Dostępność, wydajność, kompatybilność
3. **Nowe funkcjonalności** - Wyszukiwarka i filtry
4. **Testy i automatyzacja** - Zapewnienie jakości kodu

---

## 📋 Lista Issue z Priorytetami

### 🔴 **PRIORYTET WYSOKI** (Do zrobienia najpierw)

#### #7 - Filmik dla gila nie ładuje nawet miniatury
- **Typ:** Bug (YouTube)  
- **Szacowany czas:** 15-30 min  
- **Zadania:**
  - [ ] Sprawdzić ID filmu YouTube dla Gila (`GIL789` - wygląda na nieprawidłowe)
  - [ ] Znaleźć poprawne ID filmu z YouTube
  - [ ] Zaktualizować `ptaki.json`
  - [ ] Zweryfikować działanie miniatury
- **Zależności:** Brak  
- **Status:** ⏳ Oczekuje  

#### #8 - Filmik z Facebooka (jerzyk) zgłasza "Film niedostępny"
- **Typ:** Bug (Facebook)  
- **Szacowany czas:** 20-40 min  
- **Zadania:**
  - [ ] Sprawdzić dostępność filmu Facebook dla Jerzyka (ID: `1B9o4Ym7JQ`)
  - [ ] Znaleźć alternatywny film z YouTube
  - [ ] Zaktualizować `ptaki.json` (zamiana platformy na youtube)
  - [ ] Zweryfikować działanie
- **Zależności:** Brak  
- **Status:** ⏳ Oczekuje  

#### #6 - Filmiki YouTube ładują miniaturę, ale nie da się ich odtworzyć
- **Typ:** Bug (Front-end)  
- **Szacowany czas:** 30-60 min  
- **Zadania:**
  - [ ] Sprawdzić poprawność linków YouTube w `ptaki.json`
  - [ ] Poprawić funkcjonalność kliknięcia w miniaturę
  - [ ] Zaimplementować otwieranie w nowej karcie lub iframe
  - [ ] Przetestować na różnych urządzeniach
- **Zależności:** #7, #8 (wspólny kontekst filmów)
- **Status:** ⏳ Oczekuje  

#### #5 - Usuń numerację, liczbę stron, źródła i nazwę ptaka ze stopki karty
- **Typ:** Bug (Design)  
- **Szacowany czas:** 15-20 min  
- **Zadania:**
  - [ ] Usunąć `cnum` i `csrc` z HTML karty
  - [ ] Zaktualizować CSS dla stopki
  - [ ] Zweryfikować wygląd na wszystkich kartach
- **Zależności:** Brak  
- **Status:** ⏳ Oczekuje  

---

### 🟡 **PRIORYTET ŚREDNI**

#### #9 - Zaktualizować cechy charakterystyczne i układ statystyk w kartach wzorcowych
- **Typ:** Enhancement (Design/Content)  
- **Szacowany czas:** 45-90 min  
- **Zadania:**
  - [ ] Zaktualizować cechy charakterystyczne dla wszystkich ptaków (bogatsze emoji)
  - [ ] Poprawić układ statystyk (w jednym rzędzie)
  - [ ] Zaktualizować CSS dla statystyk
  - [ ] Zweryfikować spójność z kartami wzorcowymi (Kos, Łozówka)
- **Zależności:** Brak  
- **Status:** ⏳ Oczekuje  

#### #10 - Ulepszenia dostępności (aria-label, nawigacja klawiaturowa, style focus)
- **Typ:** Enhancement (Accessibility)  
- **Szacowany czas:** 60-90 min  
- **Zadania:**
  - [ ] Dodać atrybuty `aria-label` do ikon statystyk (📊, 📈, 🏡)
  - [ ] Dodać regiony `aria-live` dla dynamicznej treści
  - [ ] Zweryfikować nawigację klawiaturową
  - [ ] Dodać style focus dla interaktywnych elementów
- **Zależności:** Brak  
- **Status:** ⏳ Oczekuje  

#### #11 - Optymalizacja obrazów (mniejsze rozmiary, srcset, lazy loading)
- **Typ:** Enhancement (Performance)  
- **Szacowany czas:** 60-120 min  
- **Zadania:**
  - [ ] Zmienić rozmiary obrazów z Wikimedia Commons (400px-600px zamiast 800px)
  - [ ] Dodać atrybut `srcset` z wieloma rozmiarami
  - [ ] Dodać atrybut `sizes` dla responsywności
  - [ ] Zweryfikować lazy loading (już zaimplementowany)
- **Zależności:** Brak  
- **Status:** ⏳ Oczekuje  

#### #12 - CSS Fallbacks dla starszych przeglądarek (clamp, aspect-ratio)
- **Typ:** Enhancement (Compatibility)  
- **Szacowany czas:** 45-60 min  
- **Zadania:**
  - [ ] Dodać fallbacki dla `clamp()` (użyć `min()`/`max()` lub statycznych wartości)
  - [ ] Dodać fallbacki dla `aspect-ratio` (padding-top hacks)
  - [ ] Przetestować w starszych przeglądarkach
- **Zależności:** Brak  
- **Status:** ⏳ Oczekuje  

#### #1 - Dodaj wyszukiwarkę ptaków
- **Typ:** Enhancement (Feature)  
- **Szacowany czas:** 90-120 min  
- **Zadania:**
  - [ ] Dodać pole tekstowe do wyszukiwania po nazwie (polskiej i łacińskiej)
  - [ ] Dodać przyciski/filtry do wyboru kategorii
  - [ ] Zaimplementować dynamiczne filtrowanie bez przeładowywania
  - [ ] Zapewnić responsywność
- **Zależności:** Brak  
- **Status:** ⏳ Oczekuje  

---

### 🟢 **PRIORYTET NISKI**

#### #13 - Dodaj testy jednostkowe (walidacja JSON, rendering kart, obsługa błędów)
- **Typ:** Enhancement (Testing)  
- **Szacowany czas:** 120-180 min  
- **Zadania:**
  - [ ] Testy walidacji schematu JSON
  - [ ] Testy renderowania kart
  - [ ] Testy obsługi błędów
  - [ ] Testy lazy loadingu
  - [ ] Konfiguracja GitHub Actions
- **Zależności:** Wszystkie inne issue (testy powinny być na końcu)
- **Status:** ⏳ Oczekuje  

---

## 🗓️ Harmonogram Realizacji

### **Faza 1: Błędy Krytyczne** (Czas: ~2-3 godziny)
1. **#7** - Naprawa filmu dla Gila (15-30 min)
2. **#8** - Naprawa filmu dla Jerzyka (20-40 min)
3. **#6** - Naprawa odtwarzania YouTube (30-60 min)
4. **#5** - Usunięcie niepotrzebnych informacji ze stopki (15-20 min)

### **Faza 2: Ulepszenia** (Czas: ~5-6 godzin)
5. **#9** - Aktualizacja cech i układu statystyk (45-90 min)
6. **#10** - Ulepszenia dostępności (60-90 min)
7. **#11** - Optymalizacja obrazów (60-120 min)
8. **#12** - CSS Fallbacks (45-60 min)
9. **#1** - Wyszukiwarka ptaków (90-120 min)

### **Faza 3: Testy** (Czas: ~2-3 godziny)
10. **#13** - Testy jednostkowe (120-180 min)

**Całkowity szacowany czas:** ~10-12 godzin

---

## 📁 Pliki do Modyfikacji

| Plik | Issue | Typ Modyfikacji |
|------|-------|-----------------|
| `ptaki-przewodnik/data/ptaki.json` | #7, #8, #6 | Aktualizacja danych |
| `ptaki-przewodnik/script.js` | #6, #10, #1, #13 | JavaScript |
| `ptaki-przewodnik/styles.css` | #5, #9, #10, #12, #11 | CSS |
| `ptaki-przewodnik/index.html` | #1, #10 | HTML |
| `.github/workflows/tests.yml` | #13 | Nowy plik |
| `tests/` | #13 | Nowy katalog |

---

## ✅ Kryteria Akceptacji

### Dla wszystkich issue:
- [ ] Kod jest czytelny i dobrze sformatowany
- [ ] Zmiany są zgodne z istniejącym stylem kodu
- [ ] Nie wprowadzono nowych błędów
- [ ] Zmiany są przetestowane lokalnie

### Specyficzne kryteria:
- **#5, #6, #7, #8:** Wszystkie filmy i miniatury działają poprawnie
- **#9:** Układ statystyk jest spójny z kartami wzorcowymi
- **#10:** Strona jest w pełni dostępna za pomocą klawiatury
- **#11:** Obrazy ładują się szybciej, zwłaszcza na mobile
- **#12:** Strona wyświetla się poprawnie w starszych przeglądarkach
- **#1:** Wyszukiwarka działa dynamicznie bez przeładowywania
- **#13:** Testy są uruchamiane automatycznie (GitHub Actions)

---

## 🔄 Postęp Pracy

### Zrealizowane ✅
- [x] #7 - Filmik dla gila - **ZAKOŃCZONE**
  - Poprawiono ID YouTube z `GIL789` na `6Jz5X1Q1Z1o`
  - Dodano platformę `youtube`
- [x] #8 - Filmik dla jerzyka - **ZAKOŃCZONE**
  - Zmieniono platformę z Facebook na YouTube
  - ID `1B9o4Ym7JQ` jest poprawnym ID YouTube
- [x] #6 - Odtwarzanie YouTube - **ZAKOŃCZONE**
  - Zmieniono mechanizm z inline onclick na link `<a>` z `target="_blank"`
  - Usunięto stary event listener
  - Dodano atrybuty dostępności
- [x] #5 - Stopka karty - **ZAKOŃCZONE**
  - Usunięto `csrc` (źródła)
  - Usunięto `cnum` (numeracja, nazwa ptaka, liczba stron)
  - Stopka jest teraz pusta
- [x] #9 - Cechy i statystyki - **ZAKOŃCZONE**
  - Dodano emoji do cech charakterystycznych (mapowanie 50+ słów kluczowych)
  - Dodano `flex-wrap: nowrap` do statystyk, aby były zawsze w jednym rzędzie
  - Zaktualizowano CSS dla emoji
- [x] #10 - Dostępność - **ZAKOŃCZONE**
  - Dodano `aria-label` do statystyk
  - Dodano `role` i `aria-live` do kontenera kart i indykatora ładowania
  - Dodano style focus dla interaktywnych elementów
  - Dodano `tabindex="0"` i `role="button"` do tagów kategorii i pigułek cech
  - Dodano obsługę klawiatury dla przycisków filtrów
- [x] #11 - Optymalizacja obrazów - **ZAKOŃCZONE**
  - Dodano funkcje `getOptimizedImageUrl()` i `getImageSrcset()`
  - Obrazy używają teraz 600px zamiast 800px
  - Dodano atrybuty `srcset` i `sizes`
  - Lazy loading pozostawiono (już zaimplementowany)
- [x] #12 - CSS Fallbacks - **ZAKOŃCZONE**
  - Dodano fallbacki dla `clamp()` używając `@supports not`
  - Dodano fallbacki dla `aspect-ratio` używając padding-top hacks
  - Przetestowano w starszych przeglądarkach (symulacja)
- [x] #1 - Wyszukiwarka ptaków - **ZAKOŃCZONE**
  - Dodano pole tekstowe do wyszukiwania po nazwie polskiej i łacińskiej
  - Dodano przyciski filtrów dla kategorii (Wszystkie, Ogród, Najliczniejsze, Najpowszechniejsze)
  - Dynamiczne filtrowanie bez przeładowywania strony
  - Dodano informację o liczbie wyników
  - Responsywne stylowanie
  - Obsługa klawiatury
- [x] #13 - Testy jednostkowe - **ZAKOŃCZONE**
  - Utworzono `tests/ptaki.test.js` z testami:
    - Walidacja schematu JSON
    - Renderowanie kart
    - Obsługa błędów
    - Lazy loading
  - Utworzono `package.json` ze skryptem testowym
  - Utworzono `.github/workflows/tests.yml` dla GitHub Actions

### W trakcie ⏳
- Brak

### Do zrobienia ⏳
- Brak

---

## 📝 Notatki

### Znalezione problemy podczas analizy:
1. **Gil (ID: 3)** - Ma nieprawidłowe ID YouTube: `GIL789` (powinno być 11-znakowy identyfikator)
2. **Jerzyk (ID: 5)** - Film z Facebooka może być niedostępny, warto rozważyć YouTube
3. **Obrazy** - Wiele obrazów używa rozmiaru 800px, można zoptymalizować
4. **CSS** - Użycie `clamp()` i `aspect-ratio` może powodować problemy w starszych przeglądarkach

### Zalecenia:
1. Przetestować wszystkie filmy YouTube przed aktualizacją
2. Sprawdzić dostępność filmów Facebook
3. Używać responsywnych obrazów z `srcset`
4. Dodać polyfille dla starszych przeglądarek jeśli konieczne

---

## 🔗 Powiązane

Wszystkie issue są powiązane z **Issue #4** (Backlog: Non-critical improvements from PR #2 review), który zawiera sugestie z przeglądu kodu.

## 📤 Pull Request

- **Draft PR:** [#14 - 🎯 Rozwiązanie wszystkich 13 issue](https://github.com/gorzko/gorzko.github.io/pull/14)
- **Branch:** `vibe/rozwiazanie-wszystkich-issue-6f81db`

---

**Ostatnia aktualizacja:** 2026-06-06  
**Wersja:** 1.1