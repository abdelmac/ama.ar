import { access, writeFile } from 'node:fs/promises';
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
