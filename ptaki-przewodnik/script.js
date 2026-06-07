// ============================================
// Przewodnik Ptaków Polski - Skrypt
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('birds-container');
  const loadingIndicator = document.getElementById('loading-indicator');
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const resultsInfo = document.getElementById('results-info');
  
  let allBirds = [];
  let visibleBirds = [];
  let observer;
  let currentSearchTerm = '';
  let currentCategoryFilter = 'all';

  // --- Ładowanie danych z JSON ---
  fetch('data/ptaki.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Nie udało się załadować danych o ptakach.');
      }
      return response.json();
    })
    .then(data => {
      allBirds = data.ptaki.sort((a, b) => a.nazwa.localeCompare(b.nazwa, 'pl'));
      initLazyLoading();
      setupIntersectionObserver();
      setupSearchAndFilters();
      loadingIndicator.style.display = 'none';
    })
    .catch(error => {
      console.error('Błąd ładowania danych:', error);
      loadingIndicator.innerHTML = '<p style="color: red;">Nie udało się załadować danych. Spróbuj odświeżyć stronę.</p>';
    });

  // --- Funkcja do filtrowania ptaków ---
  function filterBirds() {
    const searchTerm = currentSearchTerm.toLowerCase();
    const category = currentCategoryFilter;
    
    return allBirds.filter(ptak => {
      // Filtrowanie po wyszukiwarce
      const matchesSearch = !searchTerm || 
        ptak.nazwa.toLowerCase().includes(searchTerm) ||
        ptak.nazwaLacinska.toLowerCase().includes(searchTerm);
      
      // Filtrowanie po kategorii
      const matchesCategory = category === 'all' || 
        ptak.kategorie.includes(category);
      
      return matchesSearch && matchesCategory;
    });
  }

  // --- Funkcja do aktualizacji wyników wyszukiwania ---
  function updateSearchResults() {
    const filteredBirds = filterBirds();
    const resultsCount = filteredBirds.length;
    
    // Aktualizuj informację o wynikach
    if (resultsCount === 0) {
      resultsInfo.textContent = 'Nie znaleziono żadnych ptaków.';
    } else if (currentSearchTerm || currentCategoryFilter !== 'all') {
      resultsInfo.textContent = `Znaleziono ${resultsCount} ${resultsCount === 1 ? 'ptaka' : resultsCount < 5 ? 'ptaki' : 'ptaków'}.`;
    } else {
      resultsInfo.textContent = '';
    }
    
    // Wyczyść kontener i zresetuj lazy loading
    container.innerHTML = '';
    visibleBirds = [];
    
    // Jeśli są wyniki, załadowanie pierwszych 6
    if (filteredBirds.length > 0) {
      const initialLoadCount = Math.min(6, filteredBirds.length);
      visibleBirds = filteredBirds.slice(0, initialLoadCount);
      renderBirds(visibleBirds);
      
      // Zaktualizuj obserwator
      if (observer) {
        observer.disconnect();
      }
      setupIntersectionObserver(filteredBirds);
    }
    
    return filteredBirds;
  }

  // --- Funkcja do ustawienia wyszukiwarki i filtrów ---
  function setupSearchAndFilters() {
    // Wyszukiwanie
    searchInput.addEventListener('input', (e) => {
      currentSearchTerm = e.target.value;
      updateSearchResults();
      
      // Pokaż/ukryj przycisk wyczyszczenia
      searchClear.style.display = currentSearchTerm ? 'block' : 'none';
    });
    
    // Wyczyszczenie wyszukiwania
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchTerm = '';
      searchClear.style.display = 'none';
      updateSearchResults();
      searchInput.focus();
    });
    
    // Filtry kategorii
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Usunąć aktywną klasę z wszystkich przycisków
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        
        // Ustaw aktywną klasę na kliknięty przycisk
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        
        currentCategoryFilter = btn.dataset.category;
        updateSearchResults();
      });
    });
    
    // Obsługa klawiatury dla przycisków filtrów
    filterButtons.forEach(btn => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  // --- Inicjalizacja lazy loading ---
  function initLazyLoading() {
    // Pierwotne wyświetlenie pierwszych 6 kart
    const initialLoadCount = 6;
    visibleBirds = allBirds.slice(0, initialLoadCount);
    renderBirds(visibleBirds);
  }

  // --- Mapowanie kategorii na klasy kolorów ---
  function getCategoryClass(category) {
    const categoryMap = {
      'Ogród': 'g',
      'Najliczniejsze': 'b',
      'Najpowszechniejsze': 'o'
    };
    return categoryMap[category] || 'g';
  }

  // --- Mapowanie statusu Czerwonej Księgi na tekst ---
  function getStatusText(status) {
    const statusTexts = {
      'LC': 'gatunek najmniejszej troski',
      'NT': 'bliski zagrożenia',
      'VU': 'narażony',
      'EN': 'zagrożony'
    };
    return statusTexts[status] || 'nieznany';
  }

  // --- Funkcja do optymalizacji URL obrazu ---
  function getOptimizedImageUrl(url, size = '600px') {
    // Jeśli to lokalny obraz, zwróć bez zmian
    if (!url.includes('upload.wikimedia.org')) {
      return url;
    }
    
    // Zamień 800px na żądany rozmiar
    return url.replace(/\/\d+px-/g, `/${size}-`);
  }

  // --- Funkcja do generowania srcset ---
  function getImageSrcset(url) {
    if (!url.includes('upload.wikimedia.org')) {
      return '';
    }
    
    const baseUrl = url.replace(/\/\d+px-/g, '/');
    const sizes = ['400px', '600px', '800px'];
    
    return sizes.map(size => {
      const optimizedUrl = baseUrl.replace('.jpg', `/${size}-${url.split('/').pop()}`);
      return `${optimizedUrl} ${size}`;
    }).join(', ');
  }

  // --- Generowanie HTML dla tagów kategorii ---
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

  // --- Generowanie HTML dla statystyk ---
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

  // --- Mapowanie słów kluczowych na emoji ---
  function getEmojiForFeature(feature) {
    const emojiMap = {
      'czarny': '⚫',
      'czarna': '⚫',
      'brunatna': '🟤',
      'brunatny': '🟤',
      'brązowa': '🟤',
      'brązowe': '🟤',
      'brązowy': '🟤',
      'szary': '⚪',
      'szara': '⚪',
      'szare': '⚪',
      'biały': '⚪',
      'biała': '⚪',
      'białe': '⚪',
      'żółty': '🟡',
      'żółta': '🟡',
      'żółte': '🟡',
      'żółtym': '🟡',
      'czerwony': '🔴',
      'czerwona': '🔴',
      'czerwone': '🔴',
      'niebieski': '🔵',
      'niebieska': '🔵',
      'niebieskie': '🔵',
      'zielony': '🟢',
      'zielona': '🟢',
      'zielone': '🟢',
      'różowy': '💗',
      'różowa': '💗',
      'pomarańczowy': '🟠',
      'pomarańczowa': '🟠',
      'pomarańczowe': '🟠',
      'długi': '➡️',
      'długa': '➡️',
      'długie': '➡️',
      'długiogon': '➡️',
      'krótki': '⬅️',
      'mały': '🔽',
      'mała': '🔽',
      'duży': '🔼',
      'duża': '🔼',
      'jaskrawo': '✨',
      'jaskrawy': '✨',
      'jaskrawa': '✨',
      'charakterystyczne': '🎭',
      'charakterystyczny': '🎭',
      'głośne': '🔊',
      'głośny': '🔊',
      'cichy': '🔇',
      'maskująca': '🎨',
      'maskujące': '🎨',
      'kontrastowa': '🎨',
      'kontrastowy': '🎨',
      'pręgi': '📏',
      'pręgami': '📏',
      'plamy': '⚫',
      'plamami': '⚫',
      'pasem': '📏',
      'czapeczka': '🎩',
      'dziób': '🦜',
      'skrzydła': '🪶',
      'ogon': '🐍',
      'głowa': '👤',
      'pierś': '👕',
      'plecy': '👔',
      'szyja': '👔',
      'oczy': '👀',
      'upierzenie': '🪶'
    };

    // Szukaj dopasowania w tekście cechy
    for (const [keyword, emoji] of Object.entries(emojiMap)) {
      if (feature.toLowerCase().includes(keyword)) {
        return emoji;
      }
    }
    return '✔';
  }

  // --- Generowanie HTML dla cech ---
  function generateFeatures(cechy) {
    return cechy.map(c => {
      const emoji = getEmojiForFeature(c);
      return `<div class="pill" role="button" tabindex="0" aria-label="Cechy: ${c}"><span class="pill-emoji">${emoji}</span> ${c}</div>`;
    }).join('');
  }

  // --- Generowanie HTML dla bloku wideo ---
  function generateVideoBlock(ptak) {
    if (!ptak.film) return '';
    
    const platform = ptak.film.platforma || 'youtube';
    const videoId = ptak.film.id;
    
    if (platform === 'facebook') {
      // Facebook Embedded Video Player
      const fbEmbedUrl = `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F${videoId}%2F&show_text=0&width=560&height=315`;
      return `
        <div class="slbl">🎬 ${ptak.film.tytul}</div>
        <div class="fb-player">
          <iframe src="${fbEmbedUrl}" width="560" height="315" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>
        </div>
      `;
    } else {
      // YouTube (default)
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      
      return `
        <div class="slbl">🎬 ${ptak.film.tytul}</div>
        <div class="yt-player" onclick="this.innerHTML='<iframe src=\"${embedUrl}\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>'">
          <img src="${thumbnailUrl}" alt="${ptak.film.tytul}" loading="lazy">
          <div class="yt-overlay">
            <div class="yt-btn">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M7 4.5L18 11L7 17.5V4.5Z" fill="#1c2319"/>
              </svg>
            </div>
            <div class="yt-label">Leśny Budzik · Echa Leśne</div>
          </div>
        </div>
      `;
    }
  }

  // --- Renderowanie kart ---
  function renderBirds(birdsToRender) {
    birdsToRender.forEach((ptak, index) => {
      const card = document.createElement('article');
      card.className = 'bird-card';
      card.dataset.id = ptak.id;
      card.setAttribute('role', 'article');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Karta ptaka: ${ptak.nazwa}, ${ptak.nazwaLacinska}`);

      // Generowanie HTML karty
      card.innerHTML = `
        <div class="photo-wrap">
          <img 
            src="${getOptimizedImageUrl(ptak.zdjecie, '600px')}" 
            srcset="${getImageSrcset(ptak.zdjecie)}"
            sizes="(max-width: 480px) 400px, (max-width: 768px) 600px, 800px"
            alt="${ptak.nazwa} (${ptak.nazwaLacinska}) – ${ptak.migracja === 'Osiadły' ? 'samiec' : 'ptak'}"
            onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(ptak.nazwa)}'"
            loading="lazy"
          >
          <div class="photo-fade"></div>
          <div class="photo-credit">© Wikimedia Commons</div>
          
          <!-- Tagi kategorii wzdłuż dolnej krawędzi zdjęcia -->
          <div class="cat-strip">
            ${generateCategoryTags(ptak.kategorie)}
          </div>
        </div>
        
        <div class="body">
          <div class="name-pl">${ptak.nazwa}</div>
          <div class="name-lat">${ptak.nazwaLacinska}</div>

          ${generateStats(ptak)}

          <div class="rbadge ${ptak.statusCzerwonejKsiazki}">
            <div class="rbadge-dot"></div>
            Czerwona Księga: ${ptak.statusCzerwonejKsiazki} – ${getStatusText(ptak.statusCzerwonejKsiazki)}
          </div>

          <div class="rule"></div>

          <div class="slbl">🔍 Jak rozpoznać</div>
          <div class="pills">
            ${generateFeatures(ptak.cechy)}
          </div>

          <div class="rule"></div>

          ${generateVideoBlock(ptak)}

          <div class="cfoot"></div>
        </div>
      `;

      container.appendChild(card);

      // Animacja pojawiania się kart
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 100);
    });
  }

  // --- Intersection Observer do lazy loading ---
  function setupIntersectionObserver(filteredBirds = allBirds) {
    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lastVisibleCard = entry.target;
          const lastVisibleId = parseInt(lastVisibleCard.dataset.id);
          const lastVisibleIndex = filteredBirds.findIndex(b => b.id === lastVisibleId);

          // Ładuj kolejne 6 kart, jeśli nie wszystkie są już załadowane
          if (lastVisibleIndex + 1 < filteredBirds.length) {
            const nextBirds = filteredBirds.slice(
              visibleBirds.length,
              visibleBirds.length + 6
            );
            visibleBirds = [...visibleBirds, ...nextBirds];
            renderBirds(nextBirds);
          }

          // Odłącz obserwator, jeśli wszystkie karty są załadowane
          if (visibleBirds.length >= filteredBirds.length) {
            observer.disconnect();
          }
        }
      });
    }, options);

    // Obserwuj ostatnią kartę w kontenerze
    const observeLastCard = () => {
      const cards = container.querySelectorAll('.bird-card');
      if (cards.length > 0) {
        observer.observe(cards[cards.length - 1]);
      }
    };

    // Poczekaj chwilę, aby upewnić się, że karty są renderowane
    setTimeout(observeLastCard, 500);
  }

  // --- Funkcja do obsługi błędów ładowania zdjęć ---
  window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(e.target.alt)}`;
    }
  }, true);
});
