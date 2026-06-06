// ============================================
// Przewodnik Ptaków Polski - Skrypt
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('birds-container');
  const loadingIndicator = document.getElementById('loading-indicator');
  let allBirds = [];
  let visibleBirds = [];
  let observer;

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
      loadingIndicator.style.display = 'none';
    })
    .catch(error => {
      console.error('Błąd ładowania danych:', error);
      loadingIndicator.innerHTML = '<p style="color: red;">Nie udało się załadować danych. Spróbuj odświeżyć stronę.</p>';
    });

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

  // --- Generowanie HTML dla tagów kategorii ---
  function generateCategoryTags(kategorie) {
    return kategorie.map((k, index) => {
      const categoryClass = getCategoryClass(k);
      const rank = index + 1;
      return `
        <div class="cat-tag ${categoryClass}">
          <div class="cat-dot"></div>
          ${k}${k.includes('Naj') ? ` <span class="cat-rank">#${rank}</span>` : ''}
        </div>
      `;
    }).join('');
  }

  // --- Generowanie HTML dla statystyk ---
  function generateStats(ptak) {
    return `
      <div class="stats">
        <div class="stat">
          <div class="stat-l">Liczebność</div>
          <div class="stat-v">${ptak.liczebnosc}<small>par lęg.</small></div>
        </div>
        <div class="stat">
          <div class="stat-l">Trend</div>
          <div class="stat-v">${ptak.trend} <small>${ptak.trend === '↑' ? 'wzrostowy' : ptak.trend === '↓' ? 'spadkowy' : 'stabilny'}</small></div>
        </div>
        <div class="stat">
          <div class="stat-l">Migracje</div>
          <div class="stat-v">${ptak.migracja} <small>/ ${ptak.migracja === 'Osiadły' ? 'całorocznie' : 'sezonowo'}</small></div>
        </div>
      </div>
    `;
  }

  // --- Generowanie HTML dla cech ---
  function generateFeatures(cechy) {
    return cechy.map(c => `<div class="pill">${c}</div>`).join('');
  }

  // --- Generowanie HTML dla bloku wideo ---
  function generateVideoBlock(ptak) {
    if (!ptak.film) return '';
    
    const platform = ptak.film.platforma || 'youtube';
    const videoId = ptak.film.id;
    
    if (platform === 'facebook') {
      // Facebook Embedded Video Player
      const fbEmbedUrl = `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fv%2F${videoId}%2F&show_text=0&width=560&height=315`;
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

      // Generowanie HTML karty
      card.innerHTML = `
        <div class="photo-wrap">
          <img 
            src="${ptak.zdjecie}" 
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

          <div class="cfoot">
            <div class="csrc">Źródło: <em>${ptak.zrodla.join(' · ')}</em></div>
            <div class="cnum">${ptak.nazwa} · ${ptak.id} / ${allBirds.length}</div>
          </div>
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
  function setupIntersectionObserver() {
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
          const lastVisibleIndex = allBirds.findIndex(b => b.id === lastVisibleId);

          // Ładuj kolejne 6 kart, jeśli nie wszystkie są już załadowane
          if (lastVisibleIndex + 1 < allBirds.length) {
            const nextBirds = allBirds.slice(
              visibleBirds.length,
              visibleBirds.length + 6
            );
            visibleBirds = [...visibleBirds, ...nextBirds];
            renderBirds(nextBirds);
          }

          // Odłącz obserwator, jeśli wszystkie karty są załadowane
          if (visibleBirds.length >= allBirds.length) {
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

  // --- Funkcja do obsługi kliknięcia na kartę wideo ---
  document.addEventListener('click', (e) => {
    const ytPlayer = e.target.closest('.yt-player');
    if (ytPlayer && !ytPlayer.querySelector('iframe')) {
      // Kliknięto na player, który nie ma jeszcze iframe - nie rób nic, bo onclick w HTMLu to obsłuży
    }
  });
});
