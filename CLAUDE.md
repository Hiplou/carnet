# Carnet de Chasse — consignes pour Claude

- Le code de l'app est dans `src/app/*.jsx` (morceaux concaténés dans l'ordre des numéros, sans import/export : une seule portée globale, comme un seul fichier). Le gabarit est `src/page.html`.
- `index.html` et `secours.html` sont fabriqués par `node outils/assembler.mjs` (esbuild, version figée dans `package.json`). Toujours relancer l'assemblage et committer les deux fichiers fabriqués avec la modification des sources, pour que la page publiée corresponde tout de suite.
- Incrémenter `APP_VERSION` (dans `src/app/01-socle.jsx`) à chaque livraison.
- Ne jamais supprimer `CNAME`. Pas de clé, jeton ou détail de faille dans ce dépôt public.
- Travailler sur une branche et ouvrir une pull request ; le propriétaire valide avec « Merge ».
- Le code de la page envoyée aux chasseurs (`07-page-chasseurs.jsx`, gabarits `SHARED_HEAD`/`SHARED_TAIL`) : pas de backtick, pas de `${`, pas d'antislash dans les gabarits ; textes des données échappés avec `aesc()`.
- Ne jamais écrire une balise de fin de script en clair dans le code : la couper en deux (`"</scr" + "ipt>"`).
