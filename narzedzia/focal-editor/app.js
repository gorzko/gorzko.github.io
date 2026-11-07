const state = {
  birds: [],
  index: 0,
  saveTimer: null
};

const el = {
  list: document.getElementById('species-list'),
  search: document.getElementById('search'),
  prev: document.getElementById('prev'),
  next: document.getElementById('next'),
  counter: document.getElementById('counter'),
  name: document.getElementById('bird-name'),
  latin: document.getElementById('bird-latin'),
  status: document.getElementById('save-status'),
  stage: document.getElementById('stage'),
  photo: document.getElementById('photo'),
  marker: document.getElementById('focal-marker'),
  arrow: document.getElementById('beak-arrow'),
  focalValue: document.getElementById('focal-value'),
  beakValue: document.getElementById('beak-value'),
  cropValue: document.getElementById('crop-value'),
  vertical: document.getElementById('vertical'),
  preview: document.getElementById('preview-img')
};

function bird() {
  return state.birds[state.index];
}

function parseFocal(fp) {
  if (!fp) return { x: 50, y: 'center' };
  const parts = fp.trim().split(/\s+/);
  let x = 50;
  const first = parts[0];
  if (first === 'left') x = 0;
  else if (first === 'right') x = 100;
  else if (first === 'center') x = 50;
  else if (first.endsWith('%')) x = parseFloat(first);
  let y = 'center';
  if (parts[1] === 'top' || parts[1] === 'bottom' || parts[1] === 'center') y = parts[1];
  return { x: Math.max(0, Math.min(100, x)), y };
}

function setStatus(text, ok) {
  el.status.textContent = text;
  el.status.className = 'save-status' + (ok === true ? ' ok' : ok === false ? ' err' : '');
}

function scheduleSave() {
  setStatus('Zapisywanie…');
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(save, 400);
}

async function save() {
  const b = bird();
  try {
    const res = await fetch(`/api/birds/${b.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ focalPoint: b.focalPoint ?? null, beakSide: b.beakSide ?? null })
    });
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    const data = await res.json();
    Object.assign(b, data.bird);
    setStatus('Zapisano ✓', true);
    renderList();
  } catch (err) {
    setStatus('Błąd zapisu: ' + err.message, false);
  }
}

function renderList() {
  const q = el.search.value.trim().toLowerCase();
  el.list.innerHTML = '';
  state.birds.forEach((b, i) => {
    const hay = (b.nazwa + ' ' + b.nazwaLacinska).toLowerCase();
    if (q && !hay.includes(q)) return;
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'species-item' + (i === state.index ? ' active' : '');
    btn.innerHTML = `<span class="dot ${b.focalPoint ? 'set' : ''}"></span>
      <span class="sp-name">${escapeHtml(b.nazwa)}</span>
      <span class="sp-latin">${escapeHtml(b.nazwaLacinska)}</span>`;
    btn.addEventListener('click', () => selectSpecies(i));
    li.appendChild(btn);
    el.list.appendChild(li);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function render() {
  const b = bird();
  if (!b) return;
  el.name.textContent = b.nazwa;
  el.latin.textContent = b.nazwaLacinska;
  el.counter.textContent = `${state.index + 1} / ${state.birds.length}`;
  const src = '/' + b.zdjecie;
  el.photo.src = src;
  el.preview.src = src;
  const { x, y } = parseFocal(b.focalPoint);
  el.marker.hidden = !b.focalPoint;
  el.marker.style.left = x + '%';
  el.marker.style.top = y === 'top' ? '12%' : y === 'bottom' ? '88%' : '50%';
  el.vertical.value = y;
  el.focalValue.textContent = b.focalPoint ?? '(brak)';
  el.beakValue.textContent = b.beakSide ?? '(brak)';
  el.cropValue.textContent = b.cropRange ? JSON.stringify(b.cropRange) : '(brak)';
  document.getElementById('beak-left').classList.toggle('active', b.beakSide === 'left');
  document.getElementById('beak-right').classList.toggle('active', b.beakSide === 'right');
  if (b.beakSide) {
    el.arrow.hidden = false;
    el.arrow.textContent = b.beakSide === 'left' ? '👈' : '👉';
    el.arrow.style.left = x + '%';
    el.arrow.style.top = y === 'top' ? '4%' : y === 'bottom' ? '80%' : '42%';
  } else {
    el.arrow.hidden = true;
  }
  el.preview.style.objectPosition = b.focalPoint || 'center';
  renderList();
}

function selectSpecies(i) {
  if (i < 0 || i >= state.birds.length) return;
  state.index = i;
  render();
}

function setFocalX(percent) {
  const b = bird();
  const { y } = parseFocal(b.focalPoint);
  const x = Math.round(Math.max(0, Math.min(100, percent)));
  b.focalPoint = `${x}% ${y}`;
  render();
  scheduleSave();
}

function setFocalPreset(preset) {
  const b = bird();
  const { y } = parseFocal(b.focalPoint);
  b.focalPoint = preset === 'center' ? `center ${y === 'center' ? 'center' : y}` : preset;
  if (preset === 'center') b.focalPoint = y === 'center' ? 'center' : `50% ${y}`;
  render();
  scheduleSave();
}

function initDrag() {
  let dragging = false;
  el.marker.addEventListener('pointerdown', e => {
    dragging = true;
    el.marker.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  el.marker.addEventListener('pointermove', e => {
    if (!dragging) return;
    const rect = el.stage.getBoundingClientRect();
    setFocalX(((e.clientX - rect.left) / rect.width) * 100);
  });
  el.marker.addEventListener('pointerup', () => { dragging = false; });
  el.stage.addEventListener('click', e => {
    if (e.target === el.marker || el.marker.contains(e.target)) return;
    const rect = el.stage.getBoundingClientRect();
    setFocalX(((e.clientX - rect.left) / rect.width) * 100);
  });
}

async function load() {
  const res = await fetch('/api/birds');
  const data = await res.json();
  state.birds = data.ptaki;
  render();
}

document.querySelectorAll('[data-preset]').forEach(btn =>
  btn.addEventListener('click', () => setFocalPreset(btn.dataset.preset)));

el.vertical.addEventListener('change', () => {
  const b = bird();
  const { x } = parseFocal(b.focalPoint);
  b.focalPoint = `${Math.round(x)}% ${el.vertical.value}`;
  render();
  scheduleSave();
});

document.getElementById('remove-focal').addEventListener('click', () => {
  const b = bird();
  delete b.focalPoint;
  render();
  scheduleSave();
});

document.querySelectorAll('#beak-left, #beak-right').forEach(btn =>
  btn.addEventListener('click', () => {
    const b = bird();
    b.beakSide = btn.dataset.side;
    render();
    scheduleSave();
  }));

document.getElementById('beak-remove').addEventListener('click', () => {
  const b = bird();
  delete b.beakSide;
  render();
  scheduleSave();
});

el.search.addEventListener('input', renderList);
el.prev.addEventListener('click', () => selectSpecies(state.index - 1));
el.next.addEventListener('click', () => selectSpecies(state.index + 1));
document.addEventListener('keydown', e => {
  if (e.target === el.search) return;
  if (e.key === 'ArrowLeft') selectSpecies(state.index - 1);
  if (e.key === 'ArrowRight') selectSpecies(state.index + 1);
});

initDrag();
load();
