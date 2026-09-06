# Carnet de Chasse — état du projet

> À donner à Claude en début de session, **avec `index.html`**.
> Ce dépôt est public : ne jamais écrire ici de clé, de jeton, ni le détail d'une faille non corrigée.
> Sans le fichier `index.html`, Claude ne connaît pas le code : il garde un résumé du projet entre les sessions, jamais le code lui-même.

**Version en cours : v2.2** — incrémenter à chaque livraison, sans exception.

---

## Ce que c'est

Application web de gestion de battues. Deux faces : l'interface de l'organisateur, et une page publiée que chaque chasseur ouvre par un lien.

- App : `carnetdechasse.fr` — dépôt GitHub `Hiplou/carnet`, fichier unique `index.html`
- Pages chasseurs : `poste.carnetdechasse.fr/b/{slug}/` — Cloudflare Worker `battue-facteur`, stockage KV `PAGES`
- Base : Supabase `zbneklsactpgttkpzwiv` — tables `carnets` et `feedbacks`, RLS active
- Domaine OVH, DNS Cloudflare, mail via Resend (`contact@carnetdechasse.fr`)
- Cron quotidien sur le Worker (`GET /keepalive`) pour tenir Supabase éveillé

---

## Règles à ne jamais enfreindre

1. Ne jamais supprimer le fichier `CNAME` du dépôt.
2. Ne jamais retirer le garde-fou anti-écrasement (bandeau rouge si le carnet ne se charge pas). Une perte de données a eu lieu avant sa mise en place.
3. La clé de service Supabase ne doit jamais apparaître dans l'app — uniquement en variable secrète du Worker.
4. Aucun stockage partagé entre comptes. Un carnet par compte, cloisonnement absolu.
5. Incrémenter `APP_VERSION` à chaque livraison.
6. Les liens déjà envoyés aux chasseurs doivent rester valables.

## Façon de travailler

- Toujours en français, une étape à la fois.
- Ne jamais trancher seul un choix de conception : poser la question, en proposant des options.
- Ne jamais annoncer une tâche terminée si un de ses volets ne l'est pas.
- Valider les refontes d'interface sur une maquette HTML avant de coder.
- Patcher par script Python avec `assert s.count(motif) == 1` avant chaque remplacement, puis vérifier l'équilibre des accolades et parenthèses.
- Les patches contenant des emoji ou des `\u{...}` s'écrivent dans un fichier `.py`, jamais en heredoc.
- Dans le gabarit de la page chasseur, les séquences `\u{...}` s'écrivent avec **un seul** antislash.

---

## Livré récemment

**v2.2** — lien personnalisé : `bois-du-chene-a3f9c2-411934`. Nom du territoire, un bout du compte, un bout de la journée. L'adresse est figée à la première publication et ne bouge plus. Les journées créées avant gardent l'ancienne forme.

**v2.1** — le zoom de la carte chasseur survit aux rendus (il mourait dès qu'on cochait une case), s'applique après le tracé des flèches, gagne la double frappe et la carte du chef de ligne.

**v2.0** — publication remise au centre : barre collée en bas de la journée ouverte, carte « Lien à envoyer aux chasseurs » avec le lien en gros, WhatsApp, et le mode d'emploi en trois étapes.

**v1.75 à v1.78** — le chantier « Proposer » :
- dépose habituelle sur chaque mirador, véhicule et places sur chaque fiche membre
- suggestions tirées de l'historique, à partir de 2 journées, avec bouton « Adopter »
- bouton « Proposer » des voitures, un par traque plus un « Toutes » : chauffeurs déduits des journées passées, passagers regroupés par point de dépose, complète sans jamais écraser
- bouton « Proposer d'après l'historique » pour les chefs de ligne
- points de dépose et de départ déplaçables au doigt sur la carte

---

## À faire

### Avant de diffuser largement
- [ ] **Durcir la route de retour du Worker.** Décidé : jeton signé posé dans la page à la publication, un retour par nom et par traque (une correction remplace l'ancien envoi), limites calibrées pour trente chasseurs simultanés. En attente du code du Worker. *(Détails à ne pas écrire ici : le dépôt est public.)*
- [ ] Contrainte d'unicité à confirmer sur `feedbacks` (journée + nom + traque), pour que la correction remplace au lieu d'ajouter.
- [ ] Suppression de compte par une route dédiée du Worker.
- [ ] Personnaliser l'email « Confirm signup » dans Supabase. **Ne jamais retirer `{{ .ConfirmationURL }}`.**
- [ ] Page Confidentialité : manquent le nom de l'éditeur, l'adresse postale, le SIREN éventuel, la région Supabase à confirmer. Relecture juridique conseillée.

### Évolutions
- [ ] Partage de territoire entre comptes, en copie indépendante, par code court type `CHENE-4271`. Identifiants régénérés à la copie, code expirant, cloisonnement préservé. Le partage synchronisé permanent est écarté.

### Dettes techniques
- [ ] Retirer `remplirVoiture`, code mort depuis la suppression de la vignette « Ma voiture ».
- [ ] Purger les références de dépose orphelines quand un point est supprimé (aujourd'hui elles sont ignorées à la lecture, ce qui suffit à l'affichage).
- [ ] Unifier le tracé des cônes de sécurité, écrit deux fois : React côté organisateur, JS simple dans le gabarit chasseur.
- [ ] Surveiller le poids des données Supabase — les photos sont en base64 dans `carnets.data`.

### En attente de décision
- [ ] Ajouter un Snake à côté de « La Course du Sanglier » ? Vignette discrète ou mise en avant ?

---

## Repères dans le code

Fichier unique, React et JSX transformés dans le navigateur. Tout le code vit dans un bloc `<script type="text/plain" id="appsrc">`.

- `APP_VERSION` — tout en haut
- `normTrack`, `normJournee`, `normMirador` — formes des données, tolérantes aux anciens carnets
- `histoConducteurs`, `histoDeposes`, `histoChefs` — lectures de l'historique, seuil `SUGG_MIN = 2`
- `VoituresSection` — voitures, déposes, bouton « Proposer »
- `ChefsSection` — chefs de ligne et leur bouton « Proposer »
- `PointsView` — points de dépose et de départ sur la carte
- `TerritoryEditor` puis `TrackEditor` puis `MiradorRow` — le territoire, ses traques, ses postes
- `slugJournee`, `publish`, `generateSharedHtml` — la publication
- `SHARED_HEAD` et `SHARED_TAIL` — le gabarit de la page chasseur, en JS simple

Le pipeline de fabrication assemble `head2.html`, `prelude.jsx`, `body.jsx`, `render.jsx`, `tail2.html`. En pratique, on modifie directement `index.html` et le `.jsx` en parallèle, avec les mêmes patches : plus sûr que de réassembler l'en-tête de mémoire.
