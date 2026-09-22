# Amareine

Site Next.js en français (`/fr/`), arabe (`/ar/`, lecture de droite à gauche), allemand (`/de/`) et anglais (`/en/`). Catalogue, fiches produits, histoire, espace professionnels et contact. L’export contient les pages HTML de chaque langue et peut être hébergé sans serveur Node.js.

## Développement et vérification

Utiliser Node.js 22 ou une version LTS compatible avec la version de Next.js installée.

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
npm run build
npm start
```

Le site exporté est disponible sur `http://localhost:3000`. `npm start -- --port 3100` permet de choisir un autre port. Le serveur local retourne de vrais statuts 404 et sert uniquement le dossier `out/`.

```sh
npm test
npm run package:hosting
```

Sous Windows PowerShell, utiliser `npm.cmd` si l’exécution de `npm.ps1` est bloquée. Les archives et fichiers de compilation sont exclus de Git.

## Hébergement actuel : Sites et domaine Namecheap

Le déploiement a réussi sur [amareine.abdel595et.chatgpt.site](https://amareine.abdel595et.chatgpt.site). Son accès est actuellement privé. Les domaines `amareine.com` et `www.amareine.com` sont ajoutés à Sites et attendent les réglages DNS ainsi que la validation HTTPS.

Suivre le [guide Namecheap avec les sept enregistrements exacts](docs/NAMECHEAP-DNS.md) pour raccorder le domaine. Namecheap reste le fournisseur du domaine ; Sites héberge le site. Aucun hébergement cPanel n’est nécessaire pour cette configuration. Le raccordement DNS ne rend pas le site public : le choix de visibilité se règle séparément dans Sites.

L’identité de l’hébergement est conservée dans `.openai/hosting.json`. Pour une mise à jour, reconstruire et vérifier le site, pousser la version source correspondante, puis enregistrer et déployer cette version dans Sites en conservant le même projet.

## Autre possibilité : hébergement Namecheap avec cPanel

`npm run build` génère `out/`, un accueil qui mène vers `/fr/`, et un `.htaccess` avec les redirections des anciennes adresses HTML et les en-têtes de sécurité. `npm run package:hosting` prépare `dist/amareine-namecheap.zip` ; l’archive contient uniquement le site exporté, y compris `.htaccess`.

1. Dans cPanel → **Domains**, identifier le document root de `amareine.com` ; pour le domaine principal, il s’agit généralement de `public_html`.
2. Sauvegarder les fichiers du site déjà hébergé, puis téléverser et extraire l’archive dans ce document root. `index.html`, `fr/`, `ar/`, `de/`, `en/` et `_next/` doivent se trouver directement à sa racine.
3. Conserver le `.htaccess` fourni ; s’il en existe déjà un, intégrer les règles après vérification de ses réglages existants. Afficher les fichiers cachés dans File Manager pour le voir.
4. Rattacher le domaine à l’hébergement choisi, activer son certificat HTTPS, puis activer la redirection HTTPS proposée par l’hébergeur.
5. Vérifier les quatre langues, les fiches produits, la navigation mobile et une adresse inexistante. Les anciennes URL sont redirigées par Apache ; un autre hébergeur doit appliquer des règles équivalentes.

L’enregistrement du domaine chez Namecheap permet aussi d’utiliser un autre hébergeur. Dans **Domain List → Manage → Advanced DNS**, saisir les enregistrements exacts fournis par cet hébergeur : `@` pour le domaine racine et `www` pour le sous-domaine. Remplacer les enregistrements de stationnement qui occupent ces hôtes, en conservant les enregistrements de messagerie. Aucune adresse IP d’hébergement n’est codée dans le projet.

Références : [export statique Next.js](https://nextjs.org/docs/app/guides/static-exports), [File Manager Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/9700/29/how-to-use-file-manager-in-cpanel/), [réglages DNS Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/434/2237/how-do-i-set-up-host-records-for-a-domain/).
