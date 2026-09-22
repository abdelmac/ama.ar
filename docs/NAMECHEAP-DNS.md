# Raccorder amareine.com à Sites

Le site est public et accessible sur [amareine.com](https://amareine.com) et [www.amareine.com](https://www.amareine.com). Les deux domaines et leurs certificats HTTPS sont actifs. La version d’hébergement reste disponible sur [amareine.abdel595et.chatgpt.site](https://amareine.abdel595et.chatgpt.site). Aucun abonnement d’hébergement cPanel n’est nécessaire.

Vérification du 22 septembre 2026 à 18:28 UTC : les deux domaines répondent en HTTP 200, sans connexion. Le blocage provenait du raccordement encore en attente et de l’accès privé ; la validation des domaines a été relancée et l’accès a été ouvert au public après confirmation.

Le CNAME `www` observé pointe encore vers `amareine.abdel595et.chatgpt.site`. Les deux adresses fonctionnent actuellement, mais la cible fournie par l’hébergeur pour ce CNAME est `custom-domains.chatgpt.site`, indiquée dans le tableau ci-dessous. Les deux A et les quatre TXT sont déjà conformes : inutile de les recréer.

## Réglages Namecheap

1. Ouvrir **Domain List → Manage** à côté de `amareine.com`, puis **Advanced DNS → Host Records**. Conserver les serveurs **Namecheap BasicDNS**.
2. Remplacer les enregistrements de stationnement : supprimer la ligne **URL Redirect Record** pour `@` si elle existe, l’ancien **A Record** `@` vers `162.255.119.155` s’il apparaît, et le **CNAME Record** `www` vers `parkingpage.namecheap.com`.
3. Ajouter les sept lignes suivantes. Choisir **Automatic** pour le TTL de chacune et enregistrer les modifications.

| Type | Host | Value | TTL |
|---|---|---|---|
| A Record | `@` | `162.159.143.30` | Automatic |
| A Record | `@` | `172.66.3.26` | Automatic |
| CNAME Record | `www` | `custom-domains.chatgpt.site` | Automatic |
| TXT Record | `_openai-site-verification` | `openai-site-verification=KrZWBKYv4fKg0_6v_GH4al6zaCxSIYICxMr_7fN8ihs` | Automatic |
| TXT Record | `_cf-custom-hostname` | `c32ab40d-4d71-4a0f-8d56-a200eb5fcae6` | Automatic |
| TXT Record | `_openai-site-verification.www` | `openai-site-verification=oJN3W1yOtIFTv2XLHkL-PWk2UL68B6A8OntsXZfhWdc` | Automatic |
| TXT Record | `_cf-custom-hostname.www` | `b898383f-b8ee-4c16-b960-d61d5362cb39` | Automatic |

Saisir les champs **Host** exactement comme dans le tableau, sans ajouter `.amareine.com`. Les deux enregistrements A pour `@` sont nécessaires. Conserver les enregistrements MX, les réglages de messagerie et les autres TXT sans rapport avec ce raccordement.

## Vérification

Après propagation DNS, ouvrir les paramètres du site dans Sites et actualiser le statut des deux domaines. Attendre que la validation et le certificat SSL soient actifs, puis vérifier `https://amareine.com/fr/` et `https://www.amareine.com/fr/`.

Le raccordement DNS et la visibilité sont deux réglages distincts. L’accès public a été autorisé et activé ; aucune connexion à ChatGPT n’est nécessaire pour visiter le site.

Valeurs fournies par Sites le 22 septembre 2026. [Documentation officielle Namecheap : gérer les enregistrements DNS](https://www.namecheap.com/support/knowledgebase/article.aspx/434/2237/how-do-i-set-up-host-records-for-a-domain/).
