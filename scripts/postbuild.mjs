import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');
await Promise.all(['fr', 'ar', 'de', 'en'].map((locale) => access(path.join(root, locale, 'index.html'))));

await writeFile(path.join(root, 'index.html'), `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Amareine — Pains et douceurs du Levant</title><meta name="description" content="Découvrez Amareine en français, العربية, Deutsch ou English.">
<link rel="canonical" href="https://amareine.com/fr/"><meta http-equiv="refresh" content="0;url=/fr/">
<style>body{font:18px system-ui,sans-serif;background:#fbf6ed;color:#244337;max-width:38rem;margin:15vh auto;padding:2rem}a{color:inherit;margin-inline-end:1rem;line-height:2.4}</style>
</head><body><h1>Amareine</h1><p>Le goût du partage, l’âme du Levant.</p><nav aria-label="Langues"><a href="/fr/" lang="fr">Français</a><a href="/ar/" lang="ar" dir="rtl">العربية</a><a href="/de/" lang="de">Deutsch</a><a href="/en/" lang="en">English</a></nav></body></html>
`, 'utf8');

const redirects = {
  'index.html': '/fr/',
  'acceuil/acceuil.html': '/fr/',
  'product/product.html': '/fr/products/',
  'network/network.html': '/fr/professionals/',
  'team/team.html': '/fr/story/',
  'media/media.html': '/fr/story/',
  'contact/contact.html': '/fr/contact/',
  'search/painalepin.html': '/fr/products/pain-alepin/',
  'search/paindorge.html': '/fr/products/pain-orge/',
  'search/kaak.html': '/fr/products/kaak/',
  'search/mamoul.html': '/fr/products/maamoul/',
  'search/croissant.html': '/fr/products/croissant/',
  'search/burger.html': '/fr/products/pain-sandwich/',
};
// Static-host equivalents of the Apache redirects keep historical links usable.
for (const [from, to] of Object.entries(redirects)) {
  if (from === 'index.html') continue;
  const target = path.join(root, from);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><link rel="canonical" href="https://amareine.com${to}"><meta http-equiv="refresh" content="0;url=${to}"><title>Amareine</title></head><body><p><a href="${to}">Continuer vers Amareine / Continue to Amareine</a></p></body></html>`, 'utf8');
}
await writeFile(path.join(root, '404.html'), `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page introuvable — Amareine</title><style>body{font:18px system-ui,sans-serif;background:#faf7ef;color:#171f35;max-width:42rem;margin:15vh auto;padding:2rem}a{color:inherit;margin-inline-end:1rem;line-height:2.4}h1{font-family:Georgia,serif;font-size:2.5rem}</style></head><body><img src="/images/logo.webp" width="80" height="80" alt="Amareine"><p>404</p><h1>Cette page a quitté la table.</h1><p>Retrouvez-nous à l’accueil. / Return to the homepage.</p><nav aria-label="Langues"><a href="/fr/" lang="fr">Français</a><a href="/ar/" lang="ar" dir="rtl">العربية</a><a href="/de/" lang="de">Deutsch</a><a href="/en/" lang="en">English</a></nav></body></html>`, 'utf8');
const rules = Object.entries(redirects)
  .map(([from, to]) => `  RewriteRule ^${from.replaceAll('.', '\\.')}/?$ ${to} [R=301,L]`).join('\n');
await writeFile(path.join(root, '.htaccess'), `# Amareine — export Next.js pour Apache / Namecheap cPanel
DirectoryIndex index.html
Options -Indexes -MultiViews
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^$ /fr/ [R=302,L]
${rules}
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>
`, 'utf8');
console.log('Export prêt : accueil français, quatre langues et redirections Apache.');
