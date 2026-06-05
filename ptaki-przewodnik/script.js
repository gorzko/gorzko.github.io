// --- Zmienne globalne ---
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('birds-container');
  const loadingIndicator = document.getElementById('loading-indicator');
  let allBirds = [];
  let visibleBirds = [];
  let observer;

  // --- Ładowanie danych z JSON ---
  fetch('ptaki-przewodnik/data/ptaki.json')
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

  // --- Renderowanie kart ---
  function renderBirds(birdsToRender) {
    birdsToRender.forEach((ptak, index) => {
      const card = document.createElement('article');
      card.className = 'bird-card';
      card.dataset.id = ptak.id;

      // --- Kolory statusu Czerwonej Księgi ---
      const statusColors = {
        "LC": "#4CAF50",
        "NT": "#FFC107",
        "VU": "#FF5722",
        "EN": "#F44336"
      };

      const statusTexts = {
        "LC": "Najmniejszej troski",
        "NT": "Bliski zagrożenia",
        "VU": "Narażony",
        "EN": "Zagrożony"
      };

      const statusColor = statusColors[ptak.statusCzerwonejKsiazki] || "#4CAF50";
      const statusText = statusTexts[ptak.statusCzerwonejKsiazki] || "Nieznany";

      // --- Generowanie HTML karty ---
      card.innerHTML = `
        <div class="photo-wrap">
          <img 
            src="${ptak.zdjecie}" 
            alt="${ptak.nazwa}" 
            onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(ptak.nazwa)}'"
            loading="lazy"
          >
          <div class="category-tags">
            ${ptak.kategorie.map(k => {
              const categoryClass = k.toLowerCase().replace(/\s+/g, '-');
              return `<span class="tag ${categoryClass}">${k}</span>`;
            }).join('')}
          </div>
        </div>
        <div class="bird-card-content">
          <h2>${ptak.nazwa} <em>${ptak.nazwaLacinska}</em></h2>
          <div class="stats">
            <div class="stat"><span>📊</span> ${ptak.liczebnosc}</div>
            <div class="stat"><span>📈</span> ${ptak.trend}</div>
            <div class="stat"><span>🏡</span> ${ptak.migracja}</div>
          </div>
          <div class="red-book-badge" style="background-color: ${statusColor};">
            ${ptak.statusCzerwonejKsiazki} – ${statusText}
          </div>
          <div class="features">
            ${ptak.cechy.map(c => `<span>${c}</span>`).join('')}
          </div>
          ${ptak.film ? `
            <div class="video-block">
              <a href="https://www.youtube.com/watch?v=${ptak.film.id}" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://img.youtube.com/vi/${ptak.film.id}/hqdefault.jpg" 
                  alt="${ptak.film.tytul}"
                  loading="lazy"
                >
                <div class="play-button">▶️</div>
              </a>
            </div>
          ` : ''}
          <footer>Karta ${ptak.id}/${allBirds.length} | Źródła: ${ptak.zrodla.join(', ')}</footer>
        </div>
      `;

      container.appendChild(card);

      // --- Animacja pojawiania się kart ---
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
});