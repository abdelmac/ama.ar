import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = await realpath(path.join(projectRoot, 'out')).catch(() => {
  throw new Error('Export introuvable. Exécutez npm run build avant npm start.');
});
const args = process.argv.slice(2);
const option = (name) => {
  const position = args.indexOf(name);
  return position < 0 ? undefined : args[position + 1];
};
const port = Number(option('--port') ?? option('-p') ?? process.env.PORT ?? 3000);
const hostname = option('--hostname') ?? process.env.HOST ?? '127.0.0.1';
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Port invalide.');

const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm',
};
const insideRoot = (filename) => {
  const relative = path.relative(root, filename);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
};
const safeFile = async (filename) => {
  const resolved = await realpath(filename);
  if (!insideRoot(resolved)) throw Object.assign(new Error('Forbidden'), { code: 'ENOENT' });
  return { filename: resolved, info: await stat(resolved) };
};
const sendFile = (request, response, filename, info, status = 200) => {
  response.writeHead(status, {
    'Content-Type': mime[path.extname(filename).toLowerCase()] ?? 'application/octet-stream',
    'Content-Length': info.size,
    'Cache-Control': filename.includes(`${path.sep}_next${path.sep}static${path.sep}`)
      ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  if (request.method === 'HEAD') return response.end();
  const stream = createReadStream(filename);
  stream.on('error', () => response.destroy());
  response.on('close', () => stream.destroy());
  stream.pipe(response);
};

createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Method not allowed');
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent((request.url ?? '/').split('?')[0]);
  } catch {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }
  const parts = pathname.split('/').filter(Boolean);
  if (!pathname.startsWith('/') || /[\\\0:]/.test(pathname)
    || parts.some((part) => part === '..' || (part.startsWith('.') && part !== '.well-known'))) {
    response.writeHead(400);
    response.end(request.method === 'HEAD' ? undefined : 'Bad request');
    return;
  }
  try {
    let file = await safeFile(path.join(root, ...parts));
    if (file.info.isDirectory()) {
      if (!pathname.endsWith('/')) {
        const query = new URL(request.url, 'http://localhost').search;
        response.writeHead(308, { Location: `/${parts.map(encodeURIComponent).join('/')}/${query}` });
        response.end();
        return;
      }
      file = await safeFile(path.join(file.filename, 'index.html'));
    }
    if (!file.info.isFile()) throw Object.assign(new Error('Not found'), { code: 'ENOENT' });
    sendFile(request, response, file.filename, file.info);
  } catch (error) {
    if (!['ENOENT', 'ENOTDIR', 'EACCES'].includes(error.code)) {
      console.error(error.message);
      response.writeHead(500);
      response.end(request.method === 'HEAD' ? undefined : 'Internal server error');
      return;
    }
    try {
      const fallback = await safeFile(path.join(root, '404.html'));
      sendFile(request, response, fallback.filename, fallback.info, 404);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(request.method === 'HEAD' ? undefined : 'Page introuvable');
    }
  }
}).listen(port, hostname, () => console.log(`Amareine : http://${hostname}:${port}`));
