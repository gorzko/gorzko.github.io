const http = require('http');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DATA_FILE = path.join(REPO_ROOT, 'ptaki-przewodnik', 'data', 'ptaki.json');
const PORT = Number(process.env.PORT || 8787);
const HOST = '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

const FOCAL_RE = /^(left|right|center|top|bottom|\d+(\.\d+)?% (center|top|bottom))$/;

function readBirds() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function patchBlock(block, name, value, anchors) {
  const lineRe = new RegExp(`^      "${name}":[^\\n]*\\n`, 'm');
  const newLine = `      ${JSON.stringify(name)}: ${JSON.stringify(value)},\n`;
  if (lineRe.test(block)) {
    if (value === null) return block.replace(lineRe, '');
    return block.replace(lineRe, newLine);
  }
  if (value === null) return block;
  for (const anchor of anchors) {
    const anchorRe = new RegExp(`(^      "${anchor}":[^\\n]*\\n)`, 'm');
    if (anchorRe.test(block)) return block.replace(anchorRe, `$1${newLine}`);
  }
  return block;
}

function applyPatch(id, patch) {
  const text = fs.readFileSync(DATA_FILE, 'utf8');
  const idRe = new RegExp(`^      "id": ${id},$`, 'm');
  const m = idRe.exec(text);
  if (!m) return false;
  const closeIdx = text.indexOf('\n    }', m.index);
  if (closeIdx === -1) return false;
  const end = closeIdx + '\n    }'.length;
  let block = text.slice(m.index, end);
  if ('focalPoint' in patch) block = patchBlock(block, 'focalPoint', patch.focalPoint, ['zdjecie']);
  if ('beakSide' in patch) block = patchBlock(block, 'beakSide', patch.beakSide, ['cropRange', 'focalPoint', 'zdjecie']);
  fs.writeFileSync(DATA_FILE, text.slice(0, m.index) + block + text.slice(end), 'utf8');
  return true;
}

function sendJson(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function serveStatic(res, urlPath) {
  let rel = decodeURIComponent(urlPath);
  if (rel === '/') rel = '/narzedzia/focal-editor/index.html';
  const filePath = path.normalize(path.join(REPO_ROOT, rel));
  if (filePath !== REPO_ROOT && !filePath.startsWith(REPO_ROOT + path.sep)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${HOST}:${PORT}`);

  if (req.method === 'GET' && pathname === '/api/birds') {
    sendJson(res, 200, readBirds());
    return;
  }

  const apiMatch = pathname.match(/^\/api\/birds\/(\d+)$/);
  if (req.method === 'POST' && apiMatch) {
    const id = Number(apiMatch[1]);
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 16 * 1024) req.destroy();
    });
    req.on('end', () => {
      let patch;
      try {
        patch = JSON.parse(raw);
      } catch {
        sendJson(res, 400, { error: 'Nieprawidłowy JSON' });
        return;
      }
      const valid = { focalPoint: null, beakSide: null };
      if ('focalPoint' in patch) {
        if (patch.focalPoint === null || patch.focalPoint === '') valid.focalPoint = null;
        else if (typeof patch.focalPoint === 'string' && FOCAL_RE.test(patch.focalPoint)) valid.focalPoint = patch.focalPoint;
        else {
          sendJson(res, 400, { error: 'Nieprawidłowa wartość focalPoint' });
          return;
        }
      } else {
        delete valid.focalPoint;
      }
      if ('beakSide' in patch) {
        if (patch.beakSide === null || patch.beakSide === '') valid.beakSide = null;
        else if (patch.beakSide === 'left' || patch.beakSide === 'right') valid.beakSide = patch.beakSide;
        else {
          sendJson(res, 400, { error: 'Nieprawidłowa wartość beakSide' });
          return;
        }
      } else {
        delete valid.beakSide;
      }
      if (!applyPatch(id, valid)) {
        sendJson(res, 404, { error: 'Nie znaleziono gatunku' });
        return;
      }
      const bird = readBirds().ptaki.find(p => p.id === id);
      sendJson(res, 200, { ok: true, bird });
    });
    return;
  }

  if (req.method === 'GET') {
    serveStatic(res, pathname);
    return;
  }

  res.writeHead(405);
  res.end('Method not allowed');
});

server.listen(PORT, HOST, () => {
  console.log(`Edytor focal pointów działa: http://${HOST}:${PORT}/`);
});
