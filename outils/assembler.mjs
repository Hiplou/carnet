// Assemblage de Carnet de Chasse.
// Lit les morceaux du code (src/app/*.jsx, dans l'ordre des numeros) et le gabarit de page (src/page.html),
// puis fabrique :
//   - index.html   : l'app deja compilee (le telephone n'a plus besoin de Babel : demarrage rapide) ;
//   - secours.html : la meme app a l'ancienne (compilee par Babel dans le telephone), au cas ou.
// Lance automatiquement par GitHub (.github/workflows/assembler.yml). A la main : npm install puis npm run assembler.
// Ne jamais modifier index.html ou secours.html a la main : ils sont refabriques a chaque assemblage.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { transformSync } from "esbuild";

const racine = fileURLToPath(new URL("..", import.meta.url));
const dossier = racine + "src/app/";
const REPERE_APP = "<!--@APP@-->";
const REPERE_BABEL = "<!--@BABEL@-->\n";
const BABEL = '<script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>\n';
const DEMARRAGE_BABEL = `<script>
(function () {
  try {
    if (!window.Babel) { window.__err("Babel n'a pas pu se charger (connexion internet ?)."); return; }
    var src = document.getElementById("appsrc").textContent;
    var out = Babel.transform(src, { presets: [["react", { runtime: "classic" }]] }).code;
    (0, eval)(out);
    window.__appReady = true;
  } catch (e) { window.__err((e && e.message) ? e.message : String(e)); }
})();
</script>`;

function stop(msg) { console.error("✘ " + msg); process.exit(1); }

const morceaux = readdirSync(dossier).filter((f) => /^\d+-.*\.jsx$/.test(f)).sort();
if (!morceaux.length) stop("aucun fichier dans src/app/");
const code = morceaux.map((f) => readFileSync(dossier + f, "utf8")).join("");
const page = readFileSync(racine + "src/page.html", "utf8");
if (page.split(REPERE_APP).length !== 2) stop("src/page.html doit contenir une seule fois " + REPERE_APP);
if (page.split(REPERE_BABEL).length !== 2) stop("src/page.html doit contenir une seule fois " + REPERE_BABEL.trim());
const version = (code.match(/const APP_VERSION = "([^"]+)"/) || [])[1];
if (!version) stop("APP_VERSION introuvable dans le code");
if (/<\/script/i.test(code)) stop("le code contient une balise de fin de script : la couper en deux (\"</scr\" + \"ipt>\")");

// ---- index.html : code compile une fois pour toutes (meme transformation que Babel « react classic ») ----
let js;
try {
  js = transformSync(code, {
    loader: "jsx", jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment",
    minifyWhitespace: true, minifySyntax: true, legalComments: "none", charset: "utf8",
  }).code;
} catch (e) {
  stop("erreur dans le code :\n" + ((e.errors || []).map((x) => (x.location ? x.location.line + ":" + x.location.column + " " : "") + x.text).join("\n") || e.message));
}
// Dans une page, « </script » ou « <!-- » au milieu du code couperaient la balise : on les neutralise
// (« <\/ » et « <\! » se lisent exactement pareil en JavaScript).
js = js.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
const indexHtml = page
  .replace(REPERE_BABEL, "")
  .replace(REPERE_APP, () => "<script>\n" + js + "</script>\n<script>window.__appReady = true;</script>");

// ---- secours.html : l'ancienne methode (Babel dans le telephone), non referencee par les moteurs ----
const secoursHtml = page
  .replace(REPERE_BABEL, BABEL)
  .replace('<meta name="viewport"', '<meta name="robots" content="noindex" />\n<meta name="viewport"')
  .replace(REPERE_APP, () => '<script type="text/plain" id="appsrc">' + code + "</script>\n" + DEMARRAGE_BABEL);

writeFileSync(racine + "index.html", indexHtml);
writeFileSync(racine + "secours.html", secoursHtml);
console.log("✓ Carnet de Chasse " + version + " assemblé : " + morceaux.length + " fichiers, index.html " + Math.round(indexHtml.length / 1024) + " Ko, secours.html " + Math.round(secoursHtml.length / 1024) + " Ko");
