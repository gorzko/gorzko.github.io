// ============================================
// Ptasiarski Przewodnik Marka – Tryb Książki
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Elementy DOM ──────────────────────────
  const bookEl          = document.getElementById('book');
  const bookCardsEl     = document.getElementById('book-cards');
  const loadingText     = document.createElement('p');
  const navSearch       = document.getElementById('nav-search');
  const searchOverlay   = document.getElementById('search-overlay');
  const searchClose     = document.getElementById('search-overlay-close');
  const searchInput     = document.getElementById('search-input');
  const searchClear     = document.getElementById('search-clear');
  const filterButtons   = document.querySelectorAll('.filter-btn');
  const monthFilter     = document.getElementById('month-filter');
  const monthButtons    = document.querySelectorAll('.month-btn');
  const resultsInfo     = document.getElementById('results-info');
  const heroCta         = document.getElementById('hero-cta-btn');
  const heroScroll      = document.getElementById('hero-scroll-btn');

  let allBirds = [];
  let currentSearchTerm = '';
  let currentCategoryFilter = 'all';
  let currentMonthFilter = 0;

  // ── Inicjalizacja reveal-animacji ────────
  initRevealAnimations();

  // ── Przesuń do następnej strony z okładki ─
  if (heroCta) {
    heroCta.addEventListener('click', () => navigator.goTo(1));
  }
  if (heroScroll) {
    heroScroll.addEventListener('click', () => navigator.goTo(1));
  }

  // ── Wyszukiwarka – overlay (niezależne od danych) ─
  navSearch.addEventListener('click', openSearchOverlay);
  searchClose.addEventListener('click', closeSearchOverlay);
  searchOverlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearchOverlay();
  });
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearchOverlay();
  });

  // ── Ładowanie danych ──────────────────────
  fetch('data/ptaki.json')
    .then(res => {
      if (!res.ok) throw new Error('Błąd ładowania danych');
      return res.json();
    })
    .then(data => {
      allBirds = data.ptaki.sort((a, b) => a.nazwa.localeCompare(b.nazwa, 'pl'));
      renderBookPages(allBirds);
      navigator.refresh();
      setupSearchAndFilters();
    })
    .catch(err => {
      console.error(err);
      bookCardsEl.innerHTML = '<section class="page page--guide" style="display:flex;align-items:center;justify-content:center;"><p style="color:var(--muted-lt);">Nie udało się załadować danych. Spróbuj odświeżyć stronę.</p></section>';
      navigator.refresh();
    });

  // ═══════════════════════════════════════════
  // NAWIGATOR KSIĄŻKI
  // ═══════════════════════════════════════════

  const navigator = {
    pages: [],
    currentIdx: 0,
    io: null,
    touchStartY: 0,
    touchStartX: 0,

    init() {
      this.io = new IntersectionObserver(
        (entries) => {
          let maxRatio = 0;
          let bestIdx = this.currentIdx;
          entries.forEach(entry => {
            if (entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              bestIdx = this.pages.indexOf(entry.target);
            }
          });
          if (maxRatio > 0.5 && bestIdx !== -1) {
            this.currentIdx = bestIdx;
            this.updateUI();
          }
        },
        { root: bookEl, threshold: [0, 0.5, 1.0] }
      );

      // Klawiatura
      document.addEventListener('keydown', (e) => {
        if (searchOverlay && !searchOverlay.hidden) return;
        if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); this.next(); }
        if (e.key === 'ArrowUp'   || e.key === 'PageUp'  ) { e.preventDefault(); this.prev(); }
      });

      // Dotyk / swipe
      bookEl.addEventListener('touchstart', (e) => {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartX = e.touches[0].clientX;
      }, { passive: true });
      bookEl.addEventListener('touchend', (e) => {
        const dy = this.touchStartY - e.changedTouches[0].clientY;
        const dx = Math.abs(this.touchStartX - e.changedTouches[0].clientX);
        if (Math.abs(dy) > 60 && Math.abs(dy) > dx) {
          dy > 0 ? this.next() : this.prev();
        }
      }, { passive: true });

    },

    refresh() {
      if (this.io) {
        this.pages.forEach(p => this.io.unobserve(p));
      }
      this.pages = Array.from(document.querySelectorAll('.page:not([style*="display: none"])'));
      this.pages.forEach(p => {
        if (this.io) this.io.observe(p);
      });
      // Zresetuj idx jeśli wychodzi poza zakres
      if (this.currentIdx >= this.pages.length) {
        this.currentIdx = Math.max(0, this.pages.length - 1);
      }
      this.updateUI();
    },

    goTo(idx) {
      if (idx < 0 || idx >= this.pages.length) return;
      this.pages[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.currentIdx = idx;
      this.updateUI();
    },

    next() {
      const page = this.pages[this.currentIdx];
      if (page && page.scrollTop + page.clientHeight < page.scrollHeight - 8) {
        page.scrollBy({ top: page.clientHeight * 0.85, behavior: 'smooth' });
      } else {
        this.goTo(this.currentIdx + 1);
      }
    },

    prev() {
      const page = this.pages[this.currentIdx];
      if (page && page.scrollTop > 8) {
        page.scrollBy({ top: -page.clientHeight * 0.85, behavior: 'smooth' });
      } else {
        this.goTo(this.currentIdx - 1);
      }
    },

    updateUI() {}
  };

  navigator.init();

  // ═══════════════════════════════════════════
  // RENDEROWANIE KART JAKO STRON
  // ═══════════════════════════════════════════

  function renderBookPages(birds) {
    bookCardsEl.innerHTML = '';
    birds.forEach((ptak, idx) => {
      const section = document.createElement('section');
      section.className = 'page page--card';
      section.dataset.birdId = ptak.id;
      section.setAttribute('aria-label', `Karta ${idx + 1}: ${ptak.nazwa}`);

      const card = document.createElement('article');
      card.className = 'bird-card';
      card.setAttribute('aria-label', `${ptak.nazwa} (${ptak.nazwaLacinska})`);

      card.innerHTML = `
        <div class="photo-wrap">
          <img
            src="${getOptimizedImageUrl(ptak.zdjecie, '600px')}"
            srcset="${getImageSrcset(ptak.zdjecie)}"
            sizes="(max-width: 600px) 100vw, 45vw"
            alt="${ptak.nazwa} (${ptak.nazwaLacinska})"
            loading="lazy"
            onerror="this.removeAttribute('onerror');this.src='https://placehold.co/600x400/2a3226/b8d4a0?text=${encodeURIComponent(ptak.nazwa)}';"
          >
          <div class="photo-fade"></div>
          <div class="photo-credit">© Wikimedia Commons</div>
          <div class="cat-strip">${generateCategoryTags(ptak.kategorie)}</div>
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
          <div class="pills">${generateFeatures(ptak.cechy)}</div>

          <div class="rule"></div>

          ${generateVideoBlock(ptak)}

          <div class="cfoot"></div>
        </div>
      `;

      section.appendChild(card);
      bookCardsEl.appendChild(section);
    });
  }

  // ═══════════════════════════════════════════
  // WYSZUKIWANIE I FILTRY
  // ═══════════════════════════════════════════

  function setupSearchAndFilters() {
    searchInput.addEventListener('input', (e) => {
      currentSearchTerm = e.target.value;
      searchClear.style.display = currentSearchTerm ? 'block' : 'none';
      applyFilter();
    });

    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchTerm = '';
      searchClear.style.display = 'none';
      applyFilter();
      searchInput.focus();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        closeSearchOverlay();
      }
    });

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        currentCategoryFilter = btn.dataset.category;

        const isPk = ['Top Podkarpacia', 'Podkarpackie Atrakcje'].includes(currentCategoryFilter);
        if (isPk) {
          monthFilter.hidden = false;
          setMonthFilter(0);
        } else {
          monthFilter.hidden = true;
          currentMonthFilter = 0;
        }

        applyFilter();
        if (!isPk) closeSearchOverlay();
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
      });
    });

    monthButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setMonthFilter(parseInt(btn.dataset.month, 10));
        applyFilter();
        closeSearchOverlay();
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
      });
    });

  }

  function setMonthFilter(month) {
    currentMonthFilter = month;
    monthButtons.forEach(b => {
      const active = parseInt(b.dataset.month, 10) === month;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function openSearchOverlay() {
    searchInput.value = '';
    currentSearchTerm = '';
    currentCategoryFilter = 'all';
    currentMonthFilter = 0;
    filterButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    monthFilter.hidden = true;
    setMonthFilter(0);
    searchClear.style.display = 'none';
    resultsInfo.textContent = '';
    applyFilter();
    searchOverlay.hidden = false;
    navSearch.setAttribute('aria-expanded', 'true');
    searchInput.focus();
  }

  function closeSearchOverlay() {
    searchOverlay.hidden = true;
    navSearch.setAttribute('aria-expanded', 'false');
    navSearch.focus();
  }

  function filterBirds() {
    const term  = currentSearchTerm.toLowerCase();
    const cat   = currentCategoryFilter;
    const month = currentMonthFilter;
    return allBirds.filter(p => {
      const matchSearch = !term ||
        p.nazwa.toLowerCase().includes(term) ||
        p.nazwaLacinska.toLowerCase().includes(term);
      const matchCat = cat === 'all' || p.kategorie.includes(cat);
      const isPkCat = ['Top Podkarpacia', 'Podkarpackie Atrakcje'].includes(cat);
      const matchMonth = !isPkCat || month === 0 ||
        (Array.isArray(p.peakMonths) && p.peakMonths.includes(month));
      return matchSearch && matchCat && matchMonth;
    });
  }

  function applyFilter() {
    const matched = filterBirds();
    const matchedIds = new Set(matched.map(b => b.id));

    // Pokaż/ukryj strony kart
    document.querySelectorAll('.page--card').forEach(section => {
      const id = parseInt(section.dataset.birdId);
      const visible = matchedIds.has(id);
      section.style.display = visible ? '' : 'none';
    });

    // Aktualizuj wyniki
    const total = matched.length;
    if (currentSearchTerm || currentCategoryFilter !== 'all') {
      resultsInfo.textContent = total === 0
        ? 'Nie znaleziono żadnych ptaków.'
        : `Znaleziono ${total} ${total === 1 ? 'ptaka' : total < 5 ? 'ptaki' : 'ptaków'}.`;
    } else {
      resultsInfo.textContent = '';
    }

    navigator.refresh();

    // Skocz do pierwszej pasującej karty
    const firstCard = document.querySelector('.page--card:not([style*="display: none"])');
    if (firstCard) {
      setTimeout(() => firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }

  // ═══════════════════════════════════════════
  // POMOCNICZE FUNKCJE RENDEROWANIA KART
  // ═══════════════════════════════════════════

  function getCategoryClass(category) {
    return { 'Ogród': 'g', 'Najliczniejsze': 'b', 'Najpowszechniejsze': 'o', 'inne': 'i', 'Top Podkarpacia': 'p', 'Podkarpackie Atrakcje': 'pa' }[category] || 'g';
  }

  function getStatusText(status) {
    return {
      'LC': 'gatunek najmniejszej troski',
      'NT': 'bliski zagrożenia',
      'VU': 'narażony',
      'EN': 'zagrożony'
    }[status] || 'nieznany';
  }

  function getOptimizedImageUrl(url, size = '600px') {
    if (!url.includes('upload.wikimedia.org')) return url;
    return url.replace(/\/\d+px-/g, `/${size}-`);
  }

  function getImageSrcset(url) {
    if (!url.includes('upload.wikimedia.org')) return '';
    const sizes = ['400px', '600px', '800px'];
    const baseUrl = url.replace(/\/\d+px-/g, '/');
    return sizes.map(size => {
      const sized = baseUrl.replace('.jpg', `/${size}-${url.split('/').pop()}`);
      return `${sized} ${size}`;
    }).join(', ');
  }

  function generateCategoryTags(kategorie) {
    return kategorie.map((k, i) => {
      const cls = getCategoryClass(k);
      return `<div class="cat-tag ${cls}" role="button" tabindex="0" aria-label="Kategoria: ${k}">
        <div class="cat-dot"></div>
        ${k}${k.includes('Naj') ? ` <span class="cat-rank">#${i + 1}</span>` : ''}
      </div>`;
    }).join('');
  }

  function generateStats(ptak) {
    const trendText = ptak.trend === '↑' ? 'wzrostowy' : ptak.trend === '↓' ? 'spadkowy' : 'stabilny';
    const migText   = ptak.migracja === 'Osiadły' ? 'całorocznie' : 'sezonowo';
    return `
      <div class="stats" role="list" aria-label="Statystyki">
        <div class="stat" role="listitem">
          <div class="stat-l">Liczebność</div>
          <div class="stat-v">${ptak.liczebnosc}<small>par lęg.</small></div>
        </div>
        <div class="stat" role="listitem">
          <div class="stat-l">Trend</div>
          <div class="stat-v">${ptak.trend} <small>${trendText}</small></div>
        </div>
        <div class="stat" role="listitem">
          <div class="stat-l">Migracje</div>
          <div class="stat-v">${ptak.migracja} <small>/ ${migText}</small></div>
        </div>
      </div>`;
  }

  function getEmojiForFeature(feature) {
    const map = {
      'czarny':'⚫','czarna':'⚫','brunatna':'🟤','brunatny':'🟤','brązowa':'🟤','brązowe':'🟤','brązowy':'🟤',
      'szary':'⚪','szara':'⚪','szare':'⚪','biały':'⚪','biała':'⚪','białe':'⚪',
      'żółty':'🟡','żółta':'🟡','żółte':'🟡','żółtym':'🟡',
      'czerwony':'🔴','czerwona':'🔴','czerwone':'🔴',
      'niebieski':'🔵','niebieska':'🔵','niebieskie':'🔵',
      'zielony':'🟢','zielona':'🟢','zielone':'🟢',
      'różowy':'💗','różowa':'💗',
      'pomarańczowy':'🟠','pomarańczowa':'🟠','pomarańczowe':'🟠',
      'długi':'➡️','długa':'➡️','długie':'➡️',
      'mały':'🔽','mała':'🔽','duży':'🔼','duża':'🔼',
      'jaskrawo':'✨','jaskrawy':'✨','jaskrawa':'✨',
      'głośne':'🔊','głośny':'🔊','cichy':'🔇',
      'maskująca':'🎨','maskujące':'🎨','kontrastowa':'🎨','kontrastowy':'🎨',
      'pręgi':'📏','pręgami':'📏','plamy':'⚫','plamami':'⚫','pasem':'📏',
      'czapeczka':'🎩','dziób':'🦜','skrzydła':'🪶','ogon':'🐍',
      'głowa':'👤','pierś':'👕','plecy':'👔','szyja':'👔','oczy':'👀','upierzenie':'🪶'
    };
    const f = feature.toLowerCase();
    for (const [kw, em] of Object.entries(map)) {
      if (f.includes(kw)) return em;
    }
    return '✔';
  }

  function generateFeatures(cechy) {
    return cechy.map(c => {
      // Jeśli cecha zaczyna się od emoji (nie litera/cyfra), wydziel je jako pill-emoji
      const parts = c.match(/^(\S+)\s+([\s\S]*)$/);
      const firstToken = parts ? parts[1] : '';
      const startsWithEmoji = firstToken && !/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9]/.test(firstToken);
      const pillEmoji = startsWithEmoji ? firstToken : getEmojiForFeature(c);
      const text = startsWithEmoji ? parts[2] : c;
      return `<div class="pill" role="button" tabindex="0" aria-label="${c}">
         <span class="pill-emoji">${pillEmoji}</span> ${text}
       </div>`;
    }).join('');
  }

  function generateVideoBlock(ptak) {
    if (!ptak.film) return '';
    const { platforma = 'youtube', id: videoId, tytul } = ptak.film;

    if (platforma === 'facebook') {
      const fbVideoUrl = `https://www.facebook.com/watch?v=${videoId}`;
      const fbUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(fbVideoUrl)}&show_text=false&width=560`;
      return `
        <div class="slbl">🎬 ${tytul}</div>
        <div class="fb-player">
          <iframe src="${fbUrl}"
            style="border:none;overflow:hidden"
            scrolling="no" frameborder="0"
            allowfullscreen="true"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
          </iframe>
        </div>`;
    }

    // YouTube (domyślny)
    const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const embed = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    return `
      <div class="slbl">🎬 ${tytul}</div>
      <div class="yt-player"
           onclick="this.innerHTML='<iframe src=\\'${embed}\\' frameborder=\\'0\\' allow=\\'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\' allowfullscreen></iframe>'">
        <img src="${thumb}" alt="${tytul}" loading="lazy">
        <div class="yt-overlay">
          <div class="yt-btn">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M7 4.5L18 11L7 17.5V4.5Z" fill="#1c2319"/>
            </svg>
          </div>
          <div class="yt-label">Leśny Budzik · Echa Leśne</div>
        </div>
      </div>`;
  }

  // ═══════════════════════════════════════════
  // REVEAL ANIMATIONS (przeniesione z hero.html)
  // ═══════════════════════════════════════════

  function initRevealAnimations() {
    const revealEls = document.querySelectorAll('.reveal');
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), 60);
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );
    revealEls.forEach(el => revealIO.observe(el));
  }

  // ── Obsługa błędów obrazów ─────────────────
  window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' && !e.target.dataset.errHandled) {
      e.target.dataset.errHandled = '1';
      e.target.src = `https://placehold.co/600x400/2a3226/b8d4a0?text=${encodeURIComponent(e.target.alt || 'Brak zdjęcia')}`;
    }
  }, true);

});
