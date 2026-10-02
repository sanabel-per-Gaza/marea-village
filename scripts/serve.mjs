import { join, resolve, extname } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve('build');
const base = process.env.BASE_PATH ?? '/marea-village';
const port = Number(process.env.PORT ?? 4174);
const server = Bun.serve({
  port,
  hostname: '127.0.0.1',
  async fetch(request) {
    let path;
    try { path = decodeURIComponent(new URL(request.url).pathname); }
    catch { return new Response('Bad request', { status: 400 }); }
    if (path === base && base) return Response.redirect(new URL(`${base}/`, request.url));
    if (base && !path.startsWith(`${base}/`)) return new Response('Not found', { status: 404 });
    path = path.slice(base.length);
    const filename = resolve(join(root, path.endsWith('/') ? path + 'index.html' : path));
    if (!filename.startsWith(root + '/')) return new Response('Forbidden', { status: 403 });
    const file = Bun.file(filename);
    if (!await file.exists()) return new Response('Not found', { status: 404 });
    const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript' };
    const compress = /\.(html|css|js|json|svg)$/.test(filename) && request.headers.get('Accept-Encoding')?.includes('gzip');
    const body = compress ? gzipSync(await file.arrayBuffer()) : file;
    return new Response(body, { headers: {
      ...(compress ? { 'Content-Encoding': 'gzip', 'Vary': 'Accept-Encoding' } : {}),
      'Content-Type': mime[extname(filename)] || file.type,
      'Cache-Control': path.includes('/_app/immutable/') ? 'public, max-age=31536000, immutable' : 'no-cache'
    }});
  }
});
console.log(`Static build: http://127.0.0.1:${server.port}${base}/`);
