/* Minimal static file server for tests / local preview. Serves the repo root. */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize, extname } from 'node:path';

const ROOT = normalize(join(dirname(fileURLToPath(import.meta.url)), '..'));
const PORT = process.env.PORT || 8137;

const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(req.url.split('?')[0]);
    if (path === '/') path = '/index.html';
    const full = normalize(join(ROOT, path));
    if (!full.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const body = await readFile(full);
    res.writeHead(200, { 'Content-Type': TYPES[extname(full)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the other server or run with a different port, ` +
        `e.g. PORT=8138 npm run serve`
    );
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => console.log(`serving ${ROOT} at http://127.0.0.1:${PORT}`));
