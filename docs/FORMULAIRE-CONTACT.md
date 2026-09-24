# Réception des messages du formulaire

Adresse demandée : **amareine.europe@gmail.com**.

Objet des notifications : **Amareine.com**, transmis à Formspree par le champ masqué `subject`. Le type de demande choisi par le visiteur est envoyé séparément (`request_type` et `subject_label`) pour ne pas remplacer l’objet du mail.

Le formulaire Next.js publié utilise `https://formspree.io/f/xqkrbyba`. Son destinataire réel est enregistré dans Formspree et n’est pas déductible de cet identifiant public. Les coordonnées affichées et les liens e-mail du site utilisent déjà l’adresse demandée.

## Réglage à effectuer dans Formspree

1. Se connecter au [tableau de bord Formspree](https://formspree.io/forms).
2. Sélectionner le formulaire dont l’URL d’envoi se termine par `/f/xqkrbyba`.
3. Ouvrir **Workflow → Email → Settings** et sélectionner **amareine.europe@gmail.com** comme destinataire.
4. Si cette adresse n’apparaît pas, l’ajouter aux adresses liées dans **Account**, puis suivre la vérification envoyée par Formspree avant de la sélectionner.
5. Enregistrer. Le site garde le même endpoint : aucun redéploiement Next.js n’est nécessaire pour ce réglage.

Le destinataire actuel dans Formspree n’a pas pu être consulté ou modifié faute d’accès au compte. Aucun envoi de test n’a été effectué.

Le fichier historique `acceuil/send_email.php` a également été corrigé pour utiliser l’adresse demandée. Il n’est pas inclus dans le site statique publié et ne commande pas la réception du formulaire Next.js.

[Documentation officielle Formspree : changer le destinataire](https://help.formspree.io/articles/form-and-project-settings/changing-a-form-email-address).
