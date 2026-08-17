# 🦌 Carnet de Chasse

Application web d'organisation de journées de chasse en battue.
**En ligne : [carnetdechasse.fr](https://carnetdechasse.fr)**

> Ce fichier est l'aide-mémoire du projet. Si tu reprends après plusieurs mois, ou si tu demandes de l'aide à quelqu'un, commence par le lire.

---

## ⚠️ Les cinq règles à ne jamais enfreindre

1. **Ne jamais supprimer le fichier `CNAME`** du dépôt — il fait vivre le nom de domaine.
2. **Ne jamais retirer le garde-fou anti-écrasement.** Si le carnet ne se charge pas, un bandeau rouge s'affiche et toute sauvegarde est bloquée. Une perte de données a eu lieu avant sa mise en place.
3. **La clé de service Supabase ne doit jamais se trouver dans l'application.** Uniquement dans les variables du Worker, et en type *Secret*.
4. **Aucun stockage partagé entre comptes.** Chaque organisateur a son carnet, cloisonné à trois niveaux. Une ancienne sauvegarde commune a dû être supprimée.
5. **Incrémenter `APP_VERSION` à chaque livraison**, sinon impossible de savoir quelle version est en ligne.

---

## Ce que fait l'application

Deux faces :

- **L'organisateur** prépare ses membres, ses territoires, puis chaque journée : invitations, présences, attributions, placement des fusils, chefs de ligne, documents, envoi.
- **Le chasseur** ouvre un lien, sans compte : son poste, sa carte, les consignes, et un formulaire de retour. Plus un petit jeu pour patienter.

Les retours des chasseurs remontent automatiquement dans le carnet de l'organisateur.

---

## Architecture

```
carnetdechasse.fr           → GitHub Pages, dépôt Hiplou/carnet, fichier index.html
poste.carnetdechasse.fr/b/… → pages des chasseurs, servies par le Worker Cloudflare
```

| Brique | Rôle |
|---|---|
| **GitHub Pages** | Héberge l'application (`index.html` + `icon.png`) |
| **Supabase** | Base de données (tables `carnets`, `feedbacks`) et comptes. RLS activé. Région Paris |
| **Cloudflare Worker** `battue-facteur` | Publie les pages, reçoit les retours, gère le classement du jeu, le partage de territoire et la suppression de compte |
| **Cloudflare KV** `PAGES` | Stocke les pages publiées, le classement, les partages |
| **Resend** | Envoie les emails depuis `contact@carnetdechasse.fr` |
| **Cloudflare Email Routing** | Reçoit les emails de cette adresse et les redirige |
| **Google Cloud** | Connexion « avec Google » (OAuth), application en production |
| **OVH** | Registrar du domaine, DNS délégués à Cloudflare |

### Variables du Worker

`SUPABASE_URL` · `SUPABASE_SERVICE_KEY` *(Secret)* · `ADMIN_EMAIL` · `GITHUB_TOKEN` · `GITHUB_OWNER` · `GITHUB_REPO`

### Routes du Worker

| Route | Rôle |
|---|---|
| `POST /` | Retour d'un chasseur |
| `POST /publish` | Publie une page *(connecté)* |
| `GET /b/<slug>` | Sert la page au chasseur |
| `POST /score` · `GET /scores` | Jeu : enregistrer un score, lire le top 5 |
| `POST /scores/list` · `/scores/delete` · `/scores/reset` | Modération du classement *(admin)* |
| `POST /account/delete` | Supprime le compte et toutes ses données |
| `POST /share/create` · `/share/get` | Partage de territoire par code *(connecté)* |
| `GET /keepalive` | Maintient Supabase éveillé |

**Tâche planifiée** : un Cron Trigger appelle le Worker chaque jour pour interroger Supabase. Sans ça, un projet gratuit se met en pause après 7 jours d'inactivité.

---

## Pipeline de build

Le fichier source est `carnet-de-battue-3.jsx`. Il est assemblé en un `index.html` autonome :

```bash
BND=$(grep -n 'from "lucide-react";' carnet-de-battue-3.jsx | cut -d: -f1)
tail -n +$((BND+1)) carnet-de-battue-3.jsx \
  | sed 's/export default function CarnetDeBattue()/function CarnetDeBattue()/' > /tmp/body.jsx
cat /tmp/head2.html /tmp/prelude.jsx /tmp/body.jsx /tmp/render.jsx /tmp/tail2.html > carnet-de-battue-app.html
```

Les pièces `/tmp/*.html` contiennent l'en-tête, les icônes, le point d'entrée React et le pied de page. **Elles se reconstruisent à partir d'un `index.html` existant** si elles sont perdues.

### Déploiement

1. Renommer `carnet-de-battue-app.html` en `index.html`
2. Remplacer le fichier sur GitHub
3. Recharger `carnetdechasse.fr` et vérifier la version dans ⚙️ → À propos
4. **Republier les journées** si le changement touche la page des chasseurs

---

## 🪤 Pièges connus

**Le gabarit mange les antislashs.** Le code JavaScript de la page des chasseurs vit dans un gabarit JS. Un `\/` y devient `/`, ce qui casse les expressions régulières. **Toujours doubler les antislashs** dans ce code, et vérifier le résultat produit, pas seulement la source.

**Les écrans pleins ont besoin de leur propre bouton.** Aide et Confidentialité ne doivent pas passer par le mécanisme partagé des vignettes de Réglages — ça ne fonctionne pas.

**Les composants définis dans un autre composant perdent le focus clavier.** Toute vignette contenant un champ de saisie doit être déclarée au niveau du fichier.

**Un groupe de membres vide disparaît.** La liste des groupes est déduite des membres, elle n'est pas stockée à part.

**Safari annule le clic si le doigt bouge.** Sur les cartes, les touchers sont détectés à la main avec une tolérance de 12 pixels.

---

## Ce qui reste à faire

- Bulles d'aide contextuelles au premier lancement *(à faire quand on saura où les gens bloquent)*
- Second jeu type Snake *(non tranché)*
- Envoi de territoire en plusieurs fois *(seulement si l'allègement ne suffit pas)*

**À surveiller** : la taille des données Supabase. Les photos sont stockées en base64 dans `carnets.data`. Un indicateur de poids est visible dans ⚙️ → Sauvegarde.

**Écarté** : le domaine personnalisé Supabase, qui ferait disparaître l'adresse technique de l'écran Google, coûte environ 32 €/mois.

---

## Sauvegardes

- **Ton carnet** : ⚙️ → Sauvegarde → Exporter. À faire régulièrement, la formule gratuite de Supabase ne conserve aucun instantané.
- **Le code** : garder une copie du `.jsx` à chaque évolution importante.
