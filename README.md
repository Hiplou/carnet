# Carnet de Chasse

Application web d'organisation de journées de chasse en battue.

En ligne : [carnetdechasse.fr](https://carnetdechasse.fr) — [présentation](https://carnetdechasse.fr/presentation.html)

## Organisation du dépôt

- `src/app/` : le code de l'application, en morceaux numérotés par thème (ils sont mis bout à bout dans l'ordre des numéros).
- `src/page.html` : le gabarit de la page (en-tête, bibliothèques, repères `<!--@APP@-->` et `<!--@BABEL@-->`).
- `outils/assembler.mjs` : fabrique `index.html` (app déjà compilée) et `secours.html` (même app, compilée dans le navigateur).
- `.github/workflows/assembler.yml` : lance l'assemblage tout seul à chaque validation sur `main`.

**Ne pas modifier `index.html` ni `secours.html` à la main** : ils sont refabriqués à chaque assemblage.
Les autres pages (`presentation.html`, pages d'aide, `CNAME`, `icon.png`…) se modifient normalement.

Assembler à la main : `npm install` puis `npm run assembler`.
