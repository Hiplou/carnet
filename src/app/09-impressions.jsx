const PRINT_CSS = "@page{margin:14mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}body{font-family:Georgia,'Times New Roman',serif;color:#1c1917;margin:0}header{display:flex;align-items:center;gap:14px;border-bottom:3px solid #166534;padding-bottom:10px;margin-bottom:16px}header .emo{font-size:34px}header h1{margin:0;font-size:24px}header p{margin:2px 0 0;color:#57534e;font-size:13px}.traque{border:1px solid #d6d3d1;border-radius:8px;padding:12px 14px;margin-bottom:14px}.traque+.traque{break-before:page}.carte{display:block;width:100%;height:auto;margin-top:12px;border:1px solid #d6d3d1;border-radius:8px;break-inside:avoid}.traque h2{margin:0 0 10px;font-size:20px;border-left:5px solid #166534;padding-left:8px}table{width:100%;border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;font-size:16px}th{text-align:left;color:#57534e;font-size:12px;text-transform:uppercase;letter-spacing:.04em;border-bottom:2px solid #d6d3d1;padding:6px}td{padding:8px 6px;border-bottom:1px solid #e7e5e4}td.num{color:#1c1917;width:40px;font-weight:bold;text-align:center;font-size:17px}td.pl{color:#57534e;width:42%}td.ch{font-weight:bold}td.chef{color:#57534e;font-style:italic}.free{color:#a8a29e;font-weight:normal;font-style:italic}.mapwrap{position:relative;width:100%;margin-top:10px;break-inside:avoid}.mapwrap img{width:100%;display:block;border-radius:8px;border:1px solid #d6d3d1}.mk{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;font-family:Helvetica,Arial,sans-serif}.mkdot{width:11px;height:11px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.35)}.mklbl{margin-top:2px;background:rgba(255,255,255,.92);border:1px solid #d6d3d1;border-radius:5px;padding:1px 4px;font-size:9px;white-space:nowrap;font-weight:bold;color:#1c1917}footer{margin-top:16px;text-align:center;color:#a8a29e;font-size:11px;font-family:Helvetica,Arial,sans-serif}";
// Feuille des postes : une page par traque, tableau lisible en haut, carte dessous.
// Toutes les tailles sont proportionnelles a la largeur de la feuille (unites cqw) :
// l'iPhone agrandit la page a l'impression, l'ordinateur non, mais la mise en page reste la meme.
// Une page fait 1,30 fois sa largeur : cela tient en A4 comme en format americain, marges comprises.
const POSTES_CSS = "@page{margin:12mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}"
  + "html,body{margin:0;padding:0;background:#fff;color:#1c1917;font-family:Helvetica,Arial,sans-serif}"
  + ".page{position:relative;width:100%;aspect-ratio:1/1.3;container-type:inline-size;overflow:hidden;break-inside:avoid;page-break-inside:avoid;break-after:page;page-break-after:always}"
  + ".page:last-of-type{break-after:auto;page-break-after:auto}"
  + ".cdc{position:absolute;left:0;right:0;bottom:0;text-align:center;font-size:1.3cqw;color:#a8a29e;letter-spacing:.05em}"
  + "@media print{.cdc{display:none !important}.cdc-fixe{display:block !important}}.cdc-fixe{display:none;position:fixed;left:0;right:0;bottom:0;text-align:center;font:8pt Helvetica,Arial,sans-serif;color:#a8a29e;letter-spacing:.05em}"
  + ".tete{height:10.5cqw;border-bottom:0.6cqw solid #166534;display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:1cqw}"
  + ".tete .l1{display:flex;align-items:baseline;justify-content:space-between;gap:2cqw}"
  + ".tete h1{margin:0;font-family:Georgia,serif;font-size:4.4cqw;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-left:1.3cqw solid #166534;padding-left:1.6cqw}"
  + ".tete .date{color:#57534e;font-size:2cqw;white-space:nowrap}"
  + ".tete .terr{color:#57534e;font-size:2.2cqw;margin-top:0.6cqw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
  + ".tabs{display:flex;gap:3cqw;margin-top:2cqw;align-items:flex-start}.tabs table{flex:1 1 0;min-width:0}"
  + "table{width:100%;border-collapse:collapse;table-layout:fixed}"
  + "th{text-align:left;color:#57534e;font-size:1.5cqw;text-transform:uppercase;letter-spacing:.05em;border-bottom:0.35cqw solid #a8a29e;padding:0 0.8cqw;height:3.2cqw}"
  + "td{border-bottom:0.15cqw solid #d6d3d1;padding:0 0.8cqw;height:var(--rh);font-size:var(--fs);line-height:1.1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}"
  + "td.num{font-weight:bold;text-align:center}td.pl{color:#44403c;font-size:calc(var(--fs) * .9)}td.ch{font-weight:bold}"
  + "td .bx{max-height:var(--rh);overflow:hidden;display:flex;flex-direction:column;justify-content:center;line-height:1.05}"
  + "td .bx span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
  + "td .chef{font-weight:normal;font-style:italic;color:#57534e;font-size:.72em}"
  + ".free{color:#a8a29e;font-weight:normal;font-style:italic}"
  + ".zone{margin-top:2cqw;display:flex;align-items:flex-start;justify-content:center}"
  + ".zone img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;border:0.2cqw solid #d6d3d1;border-radius:1cqw}"
  + ".vide{color:#a8a29e;font-style:italic;font-size:2cqw}";
// Largeur d'un texte, en multiples de la taille de police (mesure reelle quand c'est possible).
let _ctxMesure = null;
function mesureTexte(txt, gras) {
  try {
    if (!_ctxMesure) _ctxMesure = document.createElement("canvas").getContext("2d");
    _ctxMesure.font = (gras ? "bold " : "") + "100px Helvetica, Arial, sans-serif";
    return _ctxMesure.measureText(String(txt)).width / 100 * 1.08;
  } catch (e) { return String(txt).length * (gras ? 0.66 : 0.6); }
}
// Petite signature en bas des impressions, pour faire connaitre l'application.
const PIED_IMPRESSION = "<div class='cdc' style='margin-top:18px;text-align:center;font:10px Helvetica,Arial,sans-serif;color:#a8a29e;letter-spacing:.05em'>carnetdechasse.fr</div>";
function buildPrintHtml(journee, terrain, participants, safety, cartes) {
  const dRaw = new Date(journee.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const d = dRaw.charAt(0).toUpperCase() + dRaw.slice(1);
  const nameOf = (hid) => { const p = participants.find((x) => x.id === hid); return p ? (p.name || "(sans nom)") : "(membre supprimé)"; };
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const chefs = journee.chefLignes || {};
  // En largeurs de feuille (100 = toute la largeur)
  const HAUT = 130, TETE = 10.5, ECARTS = 2 + 2, ENTETE = 3.2, MARGE = 4;
  let pages = "";
  (terrain.tracks || []).forEach((trk) => {
    const pl = journee.placements[trk.id] || {}; const byMir = {}; Object.entries(pl).forEach(([hid, mid]) => { byMir[mid] = hid; });
    const mirs = trk.miradors || [];
    const n = mirs.length;
    // Au-dela de 12 postes, deux tableaux cote a cote : le texte reste grand.
    const deux = n > 12;
    const lignes = Math.max(1, deux ? Math.ceil(n / 2) : n);
    const [rh, fs] = lignes <= 8 ? [4.6, 2.4] : lignes <= 12 ? [4.2, 2.2] : lignes <= 16 ? [3.7, 2.0] : lignes <= 20 ? [3.2, 1.75] : lignes <= 25 ? [2.7, 1.5] : [2.2, 1.25];
    // Largeurs des colonnes calculees d'apres les vrais textes (en largeurs de feuille),
    // puis chaque nom trop long est resserre ou passe sur deux lignes, au lieu d'etre coupe.
    const PADH = 1.8;
    const larg = deux ? (100 - 3) / 2 : 100;
    const numW = fs * 1.5 + PADH;
    const plMax = Math.max(1, ...mirs.map((m) => mesureTexte(m.label || "", false))) * fs * 0.9 + PADH + 0.6;
    const posteW = Math.min(larg * (deux ? 0.4 : 0.38), Math.max(fs * 4.5, plMax));
    const chW = larg - numW - posteW;
    const ajuste = (txt, gras, dispo, f, deuxLignesOk) => {
      const besoin = mesureTexte(txt, gras) * f;
      if (besoin <= dispo) return "";
      const s = dispo / besoin;
      if (s >= 0.8 || !deuxLignesOk) return "font-size:" + (f * Math.max(s, deuxLignesOk ? 0.72 : 0.58)).toFixed(2) + "cqw";
      // deux lignes : on coupe entre deux mots la ou les lignes sont les plus equilibrees
      const mots = String(txt).split(/\s+/); let pire = besoin / f;
      for (let k = 1; k < mots.length; k++) pire = Math.min(pire, Math.max(mesureTexte(mots.slice(0, k).join(" "), gras), mesureTexte(mots.slice(k).join(" "), gras)));
      const s2 = Math.max(0.6, Math.min(0.92, dispo / (pire * f), rh / (2.1 * f)));
      return "font-size:" + (f * s2).toFixed(2) + "cqw;white-space:normal;line-height:1;word-break:break-word";
    };
    // Une seule taille par colonne pour une page homogene : on reduit tout le monde un peu (jusqu'a 80 %)
    // plutot qu'un seul nom ; ceux qui restent trop longs passent sur deux lignes.
    const dispoCh = chW - PADH - 0.6, dispoPl = posteW - PADH - 0.6;
    const echelle = (txts, gras, dispo, f) => Math.max(0.8, Math.min(1, ...txts.map((t) => dispo / Math.max(0.01, mesureTexte(t, gras) * f))));
    const fsCh = fs * echelle(mirs.map((m) => byMir[m.id] && !chefs[m.id] ? nameOf(byMir[m.id]) : "").filter(Boolean), true, dispoCh, fs);
    const fsPl = fs * 0.9 * echelle(mirs.map((m) => m.label || ""), false, dispoPl, fs * 0.9);
    const base = (f, g) => (f < g - 0.001 ? "font-size:" + f.toFixed(2) + "cqw" : "");
    const ligne = (m, mi) => {
      const hid = byMir[m.id];
      const nom = hid ? nameOf(hid) : "";
      const stPl = ajuste(m.label || "", false, dispoPl, fsPl, true) || base(fsPl, fs * 0.9);
      let cell, stCh = "";
      if (chefs[m.id]) {
        const chef = "chef : " + nameOf(chefs[m.id]);
        const st1 = hid ? ajuste(nom, true, dispoCh, fs, false) : "";
        const st2 = ajuste(chef, false, dispoCh, fs * 0.72, false);
        cell = "<div class='bx'><span" + (st1 ? " style='" + st1 + "'" : "") + ">" + (hid ? esc(nom) : "<span class='free'>libre</span>") + "</span><span class='chef'" + (st2 ? " style='" + st2 + "'" : "") + ">" + esc(chef) + "</span></div>";
      } else {
        cell = hid ? esc(nom) : "<span class='free'>libre</span>";
        stCh = hid ? (ajuste(nom, true, dispoCh, fsCh, true) || base(fsCh, fs)) : base(fsCh, fs);
      }
      return "<tr><td class='num'>" + numeroPoste(m, mi) + "</td><td class='pl'" + (stPl ? " style='" + stPl + "'" : "") + ">" + esc(m.label) + "</td><td class='ch'" + (stCh ? " style='" + stCh + "'" : "") + ">" + cell + "</td></tr>";
    };
    const pc = (w) => (w / larg * 100).toFixed(2) + "%";
    const table = (liste, depart) => "<table><colgroup><col style='width:" + pc(numW) + "'><col style='width:" + pc(posteW) + "'><col style='width:" + pc(chW) + "'></colgroup>"
      + "<thead><tr><th>N°</th><th>Poste</th><th>Chasseur</th></tr></thead><tbody>"
      + (liste.length ? liste.map((m, k) => ligne(m, depart + k)).join("") : "<tr><td colspan='3' class='free'>Aucun poste sur cette traque</td></tr>")
      + "</tbody></table>";
    const tables = deux
      ? "<div class='tabs'>" + table(mirs.slice(0, lignes), 0) + table(mirs.slice(lignes), lignes) + "</div>"
      : "<div class='tabs'>" + table(mirs, 0) + "</div>";
    // La place restante revient a la carte, calculee ici plutot que laissee au navigateur.
    const rgP = normRabatRegle(journee.rabatRegle);
    const rabN = Object.keys(normRabat(journee.rabat)[trk.id] || {}).filter((hid) => !pl[hid] && participants.some((x) => x.id === hid)).map(nameOf);
    const rabLib = rabN.length ? "Au rabat" + (rgP.arme === "avec" ? " (avec leur arme)" : rgP.arme === "sans" ? " (sans arme)" : "") + " :" : "";
    const fsR = fs * 0.8;
    const lgR = rabN.length ? Math.max(1, Math.ceil(mesureTexte(rabLib + " " + rabN.join(", "), false) * fsR * 1.1 / 98)) : 0;
    const hRab = rabN.length ? lgR * fsR * 1.3 + 1.2 : 0;
    const rabHtml = rabN.length ? "<div style='font-size:" + fsR.toFixed(2) + "cqw;line-height:1.3;margin-top:1.2cqw;color:#9a3412'><b>" + esc(rabLib) + "</b> " + esc(rabN.join(", ")) + "</div>" : "";
    const hCarte = Math.max(25, HAUT - TETE - ECARTS - ENTETE - lignes * rh - MARGE - hRab);
    const carte = (cartes || {})[trk.id];
    const col = trk.color || "#166534";
    pages += "<section class='page' style='--fs:" + fs + "cqw;--rh:" + rh + "cqw'>"
      + "<div class='tete'><div class='l1'><h1 style='border-color:" + col + "'>" + esc(trk.name) + "</h1><span class='date'>" + esc(d) + "</span></div>"
      + "<div class='terr'>" + esc(terrain.name) + "</div></div>"
      + tables + rabHtml
      + "<div class='zone' style='height:" + hCarte.toFixed(1) + "cqw'>" + (carte ? "<img src='" + carte + "' alt='Carte de la traque' />" : "<span class='vide'>Pas de carte pour cette traque.</span>") + "</div>"
      + "<div class='cdc'>carnetdechasse.fr</div></section>";
  });
  return "<!doctype html><html lang='fr'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Postes — " + esc(terrain.name) + "</title><style>" + POSTES_CSS + "</style></head><body>" + pages + "<div class='cdc-fixe'>carnetdechasse.fr</div></body></html>";
}

// Carte d'une traque pour le resume de la journee : petite vignette, postes en pastilles numerotees
// (cercle blanc, bord et chiffre a la couleur de la traque), comme une fiche papier classique.
async function carteResumeImpression(planImage, track) {
  const img = await loadImg(planImage);
  const W = img.naturalWidth, H = img.naturalHeight, crop = track.crop || FULL_CROP;
  const sx = crop.x / 100 * W, sy = crop.y / 100 * H, sw = crop.w / 100 * W, sh = crop.h / 100 * H;
  const L = 1100, cw = sw >= sh ? L : Math.max(200, Math.round(L * sw / sh)), ch = sw >= sh ? Math.max(200, Math.round(L * sh / sw)) : L;
  const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  const P = (gx, gy) => ({ x: (gx - crop.x) / crop.w * cw, y: (gy - crop.y) / crop.h * ch });
  const col = track.color || "#dc2626";
  const z = Array.isArray(track.zone) ? track.zone : [];
  if (z.length >= 2) {
    const trace = () => { ctx.beginPath(); z.forEach((q, i) => { const p = P(q.gx, q.gy); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); if (track.zoneFermee && z.length >= 3) ctx.closePath(); };
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    trace(); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 9; ctx.stroke();
    trace(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke();
  }
  const r = 27;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  (track.miradors || []).forEach((m, i) => {
    const p = P(m.gx, m.gy);
    if (p.x < -r || p.x > cw + r || p.y < -r || p.y > ch + r) return;
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = col; ctx.stroke();
    const t = numeroPoste(m, i);
    ctx.fillStyle = col; ctx.font = "bold " + (t.length >= 2 ? 27 : 32) + "px Helvetica, Arial, sans-serif";
    ctx.fillText(t, p.x, p.y + 1);
  });
  return cv.toDataURL("image/jpeg", 0.85);
}

// Resume de la journee : page 1 un tableau (une ligne par personne, une colonne par traque,
// le numero de poste dans la case ; M pour les marcheurs), page 2 toutes les cartes.
const RESUME_CSS = "@page{margin:12mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}"
  + "html,body{margin:0;padding:0;background:#fff;color:#1c1917;font-family:Helvetica,Arial,sans-serif}"
  + ".page{position:relative;width:100%;aspect-ratio:1/1.3;container-type:inline-size;overflow:hidden;break-inside:avoid;page-break-inside:avoid;break-after:page;page-break-after:always}"
  + ".page:last-of-type{break-after:auto;page-break-after:auto}"
  + ".cdc{position:absolute;left:0;right:0;bottom:0;text-align:center;font-size:1.3cqw;color:#a8a29e;letter-spacing:.05em}"
  + "@media print{.cdc{display:none !important}.cdc-fixe{display:block !important}}.cdc-fixe{display:none;position:fixed;left:0;right:0;bottom:0;text-align:center;font:8pt Helvetica,Arial,sans-serif;color:#a8a29e;letter-spacing:.05em}"
  + ".tete{height:9cqw;border-bottom:0.6cqw solid #166534;display:flex;align-items:flex-end;justify-content:space-between;gap:2cqw;padding-bottom:1cqw}"
  + ".tete h1{margin:0;font-family:Georgia,serif;font-size:4cqw;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
  + ".tete .date{color:#57534e;font-size:2.1cqw;white-space:nowrap}"
  + "table{width:99.4%;margin-left:0.3cqw;border-collapse:collapse;table-layout:fixed;margin-top:2cqw}"
  + "th,td{border:0.2cqw solid #44403c;padding:0 0.9cqw;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}"
  + "th{font-size:1.8cqw;height:4.2cqw;background:#f5f5f4}th.grp{height:3.4cqw;font-size:2cqw;text-transform:uppercase;letter-spacing:.06em}"
  + "th.tq{text-align:center;border-top:1.1cqw solid var(--c);white-space:normal;text-overflow:clip;line-height:1.15;overflow-wrap:anywhere;padding:0 0.6cqw}"
  + "td{height:var(--rh);font-size:var(--fs)}td.nom{text-transform:uppercase;font-weight:bold}td.num{text-align:center;font-weight:bold;font-size:calc(var(--fs) * 1.12)}"
  + "td.m{text-align:center;color:#57534e;font-weight:bold}tr.sep td{border-top:0.7cqw solid #1c1917}"
  + ".grille{display:grid;gap:1.6cqw;margin-top:2cqw}"
  + ".case{border:0.4cqw solid var(--c);overflow:hidden}"
  + ".case .t{background:var(--c);color:#fff;font-weight:bold;font-size:2cqw;height:3.6cqw;line-height:3.6cqw;padding:0 1.2cqw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:.03em}"
  + ".case .im{display:flex;align-items:center;justify-content:center;padding:0.8cqw}"
  + ".case img{display:block;max-width:100%;max-height:100%;width:auto;height:auto}"
  + ".vide{color:#a8a29e;font-style:italic;font-size:1.8cqw}";
function buildResumeHtml(journee, terrain, participants, cartes) {
  const dRaw = new Date(journee.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const d = dRaw.charAt(0).toUpperCase() + dRaw.slice(1);
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const tracks = terrain.tracks || [];
  const pres = journee.presence || {};
  const present = (p) => (pres[p.id] || {}).statut === "present";
  // numero de poste de chacun sur chaque traque
  const poste = {};
  tracks.forEach((trk) => {
    const pl = journee.placements[trk.id] || {};
    Object.entries(pl).forEach(([hid, mid]) => {
      const i = (trk.miradors || []).findIndex((m) => m.id === mid);
      if (i >= 0) (poste[hid] = poste[hid] || {})[trk.id] = numeroPoste(trk.miradors[i], i);
    });
  });
  const rabR = normRabat(journee.rabat); let aRabat = false;
  tracks.forEach((trk) => Object.keys(rabR[trk.id] || {}).forEach((hid) => { if ((poste[hid] || {})[trk.id] || !participants.some((x) => x.id === hid)) return; (poste[hid] = poste[hid] || {})[trk.id] = "R"; aRabat = true; }));
  const rgR = normRabatRegle(journee.rabatRegle);
  const tri = (a, b) => triAvecNumeros(a, b, (x, y) => (x.nom || nomKey(x.name)).localeCompare(y.nom || nomKey(y.name), "fr", { sensitivity: "base" })
    || (x.prenom || "").localeCompare(y.prenom || "", "fr", { sensitivity: "base" }));
  const enTirage = tirageActif(journee) && normTirage(journee.tirage).nb > 0;
  const chasseurs = participants.filter((p) => p.role !== "rabatteur" && (poste[p.id] || (present(p) && !enTirage))).sort(tri);
  const marcheurs = participants.filter((p) => p.role === "rabatteur" && present(p)).sort(tri);
  const nomDe = (p) => p.nom || (p.prenom ? "" : nomKey(p.name)) || p.name || "";
  const prenomDe = (p) => p.prenom || (p.nom ? "" : (p.name || "").split(/\s+/)[0]) || "";
  // ---- page 1 : le tableau ----
  const nT = Math.max(1, tracks.length);
  const lignes = chasseurs.length + marcheurs.length;
  const tous = chasseurs.concat(marcheurs);
  // 1) taille provisoire du texte, pour dimensionner les colonnes NOM et Prenom au plus juste
  const fs0 = Math.min(2.6, Math.max(2.2, Math.min(6.4, (130 - 9 - 2 - 4.2 - 9 - 1.5) / Math.max(1, lignes))) * 0.5);
  const largeMax = (txts, gras) => Math.max(0, ...txts.map((t) => mesureTexte(t, gras)));
  const nomW = Math.min(30, Math.max(13, largeMax(tous.map((p) => nomDe(p).toUpperCase()), true) * fs0 + 2.4));
  const preW = Math.min(20, Math.max(10, largeMax(tous.map(prenomDe), false) * fs0 + 2.4));
  const tqW = (99.4 - nomW - preW) / nT;
  // 2) noms des traques en entier : retour a la ligne entre les mots, texte reduit si un mot ne tient pas
  const dispoT = tqW - 1.2;
  let fT = 1.9;
  tracks.forEach((trk) => String(trk.name || "").split(/\s+/).forEach((w) => { const l = mesureTexte(w, true); if (l * fT > dispoT) fT = Math.max(1.1, dispoT / l); }));
  const nbLignes = (txt) => {
    let n = 1, cur = 0; const esp = mesureTexte(" ", true);
    String(txt || "").split(/\s+/).filter(Boolean).forEach((w) => { const l = mesureTexte(w, true) * fT; if (cur && cur + esp * fT + l > dispoT) { n++; cur = l; } else cur += (cur ? esp * fT : 0) + l; });
    return n;
  };
  const lt = Math.max(1, ...tracks.map((t) => nbLignes(t.name)));
  const hTq = lt * fT * 1.15 + 1.6;
  // 3) la hauteur des lignes du tableau tient compte de cet en-tete
  const dispo = 130 - 9 - 2 - 3.4 - hTq - 1.1 - 4;
  const rh = Math.max(2.2, Math.min(6.4, dispo / Math.max(1, lignes)));
  const fs = Math.min(2.6, rh * 0.5);
  const echelle = (txts, gras, w) => Math.max(0.7, Math.min(1, ...txts.map((t) => (w - 2.2) / Math.max(0.01, mesureTexte(t, gras) * fs))));
  const fNom = fs * echelle(tous.map((p) => nomDe(p).toUpperCase()), true, nomW);
  const fPre = fs * echelle(tous.map(prenomDe), false, preW);
  const ligne = (p, marche, sep) => "<tr" + (sep ? " class='sep'" : "") + "><td class='nom' style='font-size:" + fNom.toFixed(2) + "cqw'>" + esc(nomDe(p)) + "</td><td style='font-size:" + fPre.toFixed(2) + "cqw'>" + esc(prenomDe(p)) + "</td>"
    + tracks.map((trk) => marche ? "<td class='m'>M</td>" : ((poste[p.id] || {})[trk.id] === "R" ? "<td class='num' style='color:#c2410c'>R</td>" : "<td class='num'>" + esc((poste[p.id] || {})[trk.id] || "") + "</td>")).join("") + "</tr>";
  const corps = chasseurs.map((p) => ligne(p, false, false)).join("") + marcheurs.map((p, k) => ligne(p, true, k === 0 && chasseurs.length > 0)).join("");
  const page1 = "<section class='page' style='--fs:" + fs.toFixed(2) + "cqw;--rh:" + rh.toFixed(2) + "cqw'>"
    + "<div class='tete'><h1>" + esc(terrain.name) + "</h1><span class='date'>" + esc(d) + (aRabat ? " · R = au rabat" + (rgR.arme === "avec" ? " (avec arme)" : rgR.arme === "sans" ? " (sans arme)" : "") : "") + "</span></div>"
    + "<table><colgroup><col style='width:" + (nomW / 99.4 * 100).toFixed(2) + "%'><col style='width:" + (preW / 99.4 * 100).toFixed(2) + "%'>" + tracks.map(() => "<col style='width:" + (tqW / 99.4 * 100).toFixed(2) + "%'>").join("") + "</colgroup>"
    + "<thead><tr><th rowspan='2'>NOM</th><th rowspan='2'>Prénom</th><th class='grp' colspan='" + nT + "' style='text-align:center'>Poste</th></tr>"
    + "<tr>" + tracks.map((trk) => "<th class='tq' style='--c:" + (trk.color || "#166534") + ";height:" + hTq.toFixed(2) + "cqw;font-size:" + fT.toFixed(2) + "cqw'>" + esc(trk.name) + "</th>").join("") + "</tr></thead>"
    + "<tbody>" + (corps || "<tr><td colspan='" + (2 + nT) + "' class='vide'>Personne n'est encore coché présent pour cette journée.</td></tr>") + "</tbody></table><div class='cdc'>carnetdechasse.fr</div></section>";
  // ---- page 2 : toutes les cartes ----
  const n = tracks.length;
  const cols = n <= 1 ? 1 : n <= 6 ? 2 : 3;
  const rangs = Math.max(1, Math.ceil(n / cols));
  const hauteur = 130 - 9 - 2 - 4;
  const hCase = (hauteur - (rangs - 1) * 1.6) / rangs;
  const cases = tracks.map((trk, k) => {
    const c = trk.color || "#166534"; const im = (cartes || {})[trk.id];
    return "<div class='case' style='--c:" + c + ";height:" + hCase.toFixed(2) + "cqw'><div class='t'>TRAQUE " + (k + 1) + " · " + esc(trk.name) + "</div>"
      + "<div class='im' style='height:" + (hCase - 0.8 - 3.6).toFixed(2) + "cqw'>" + (im ? "<img src='" + im + "' alt='' />" : "<span class='vide'>Pas de carte</span>") + "</div></div>";
  }).join("");
  const page2 = n ? "<section class='page'><div class='tete'><h1>Cartes des traques</h1><span class='date'>" + esc(terrain.name) + " · " + esc(d) + "</span></div>"
    + "<div class='grille' style='grid-template-columns:repeat(" + cols + ",minmax(0,1fr))'>" + cases + "</div><div class='cdc'>carnetdechasse.fr</div></section>" : "";
  return "<!doctype html><html lang='fr'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Résumé — " + esc(terrain.name) + "</title><style>" + RESUME_CSS + "</style></head><body>" + page1 + page2 + "<div class='cdc-fixe'>carnetdechasse.fr</div></body></html>";
}

// ======================= Livret du chasseur =======================
// Une feuille A4 paysage, recto-verso, pliee en deux : un livret A5 de 4 pages par chasseur.
// Recto : [page 4 | page 1 (accueil)]   Verso : [page 2 (postes, plan de chasse, sonneries) | page 3 (cartes)]
// Toutes les tailles sont en largeurs de feuille (cqw) : meme rendu sur iPhone et sur ordinateur.
const LIVRET_CSS = "@page{size:A4 landscape;margin:10mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}"
  + "html,body{margin:0;padding:0;background:#fff;color:#1c1917;font-family:Helvetica,Arial,sans-serif}"
  + ".feuille{width:100%;aspect-ratio:1/0.64;container-type:inline-size;overflow:hidden;display:flex;break-inside:avoid;page-break-inside:avoid;break-after:page;page-break-after:always}"
  + ".feuille:last-child{break-after:auto;page-break-after:auto}.feuille.inv{transform:rotate(180deg)}"
  + ".pg{width:50cqw;height:64cqw;overflow:hidden;position:relative;display:flex;flex-direction:column}"
  + ".pg.g{padding:2.2cqw 3.2cqw 2.2cqw 2cqw;border-right:0.12cqw dashed #d6d3d1}.pg.d{padding:2.2cqw 2cqw 2.2cqw 3.2cqw}"
  + ".cv{align-items:center;text-align:center}"
  + ".cv .dom{font-family:Georgia,serif;font-weight:bold;line-height:1.1;margin-top:2cqw}"
  + ".cv .date{color:#57534e;font-size:2cqw;margin-top:1cqw}"
  + ".cv .filet{width:12cqw;height:0.35cqw;background:#166534;margin:2.2cqw auto}"
  + ".cv .img{flex:1 1 auto;min-height:0;width:100%;display:flex;align-items:center;justify-content:center}"
  + ".cv .img img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;border-radius:1cqw}"
  + ".cv{padding-bottom:5cqw !important}.cv .qui{margin-top:2.4cqw;border-top:0.3cqw solid #1c1917;border-bottom:0.3cqw solid #1c1917;padding:1.4cqw 0;width:100%}"
  + ".cv .qui small{display:block;font-size:1.4cqw;letter-spacing:.2em;text-transform:uppercase;color:#57534e}"
  + ".cv .qui b{display:block;margin-top:0.6cqw;white-space:nowrap}"
  + ".cv .pied{margin-top:1.6cqw;font-size:1.2cqw;color:#a8a29e;letter-spacing:.08em}"
  + "h2{font-family:Georgia,serif;margin:0 0 .5em;border-bottom:0.25cqw solid #166534;padding-bottom:.2em;line-height:1.3}"
  + ".sec{margin-bottom:1.1em}"
  + ".tp{width:100%;border-collapse:collapse;table-layout:fixed}.tp td{border-bottom:0.12cqw solid #d6d3d1;padding:.35em .3em;vertical-align:middle}"
  + ".tp .tq{border-left:0.8cqw solid var(--c);font-weight:bold;padding-left:.6em}.tp .n{font-weight:bold;text-align:center;font-size:1.5em}.tp .lb{color:#44403c}.tp .chef{display:block;font-size:.8em;color:#57534e;font-style:italic}"
  + ".at{display:flex;justify-content:space-between;gap:1em;padding:.35em .6em;border-radius:.4em;margin-bottom:.3em}"
  + ".so{display:flex;gap:.8em;padding:.25em 0;border-bottom:0.12cqw solid #e7e5e4}.so .ev{font-weight:bold;width:40%;flex:none}"
  + ".carte{display:flex;flex-direction:column;min-height:0;min-width:0}"
  + ".carte .t{height:4cqw;margin-bottom:0.6cqw;font-size:1.6cqw;line-height:1.25;font-weight:bold;border-left:0.8cqw solid var(--c);padding-left:.6em;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}"
  + ".carte .t span{display:block;font-weight:normal;color:#57534e;font-size:.9em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
  + ".carte .z{flex:1 1 auto;min-height:0;display:flex;align-items:flex-start;justify-content:center}"
  + ".carte .w{position:relative;display:inline-block;line-height:0}"
  + ".carte .w img{display:block;max-width:100%;width:auto;height:auto;border:0.15cqw solid #a8a29e;border-radius:0.6cqw}"
  + ".moi{position:absolute;transform:translate(-50%,-50%);width:4cqw;height:4cqw;border-radius:50%;background:#facc15;border:0.45cqw solid #1c1917;box-shadow:0 0 0 0.7cqw rgba(250,204,21,.55);display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:1.8cqw;line-height:1;color:#1c1917}"
  + ".moi i{position:absolute;top:100%;margin-top:0.9cqw;left:50%;transform:translateX(-50%);background:#1c1917;color:#facc15;font-style:normal;font-size:1.2cqw;padding:0.35cqw 0.7cqw;border-radius:0.5cqw;white-space:nowrap;line-height:1}"
  + ".pg .pnum{position:absolute;bottom:1.2cqw;font-size:1.05cqw;color:#a8a29e;white-space:nowrap;max-width:17cqw;overflow:hidden;text-overflow:ellipsis}.pg.g .pnum{right:3.2cqw}.pg.d .pnum{right:2cqw}"
  + ".pg .cdc{position:absolute;left:0;right:0;bottom:1.2cqw;text-align:center;font-size:1.2cqw;color:#a8a29e;letter-spacing:.05em}"
  + ".fin{margin:auto;text-align:center;color:#a8a29e;font-family:Georgia,serif;font-size:2.4cqw}.fin img{display:block;width:9cqw;margin:0 auto 1.4cqw;opacity:.85}";
// Page de cartons a decouper pour le tirage au sort : juste les numeros, 20 par page.
function buildCartonsHtml(journee, terrain) {
  const nb = normTirage(journee.tirage).nb;
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const d = new Date(journee.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const css = RESUME_CSS + ".grille{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:25.4cqw;border-top:.25cqw dashed #a8a29e;border-left:.25cqw dashed #a8a29e}"
    + ".c{border-right:.25cqw dashed #a8a29e;border-bottom:.25cqw dashed #a8a29e;display:flex;flex-direction:column;align-items:center;justify-content:center}"
    + ".c b{font-family:Georgia,serif;font-size:13cqw;line-height:1;color:#1c1917}.c small{font-size:1.5cqw;color:#a8a29e;margin-top:1.2cqw;letter-spacing:.08em;text-transform:uppercase}"
    + ".tete{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1.5cqw;font-size:2cqw;color:#57534e}";
  const pages = [];
  for (let k = 0; k < nb; k += 20) {
    const cases = [];
    for (let n = k + 1; n <= Math.min(nb, k + 20); n++) cases.push("<div class='c'><b>" + n + "</b><small>" + esc(terrain.name) + "</small></div>");
    pages.push("<section class='page'><div class='tete'><b>Cartons du tirage au sort</b><span>" + esc(d) + " · à découper</span></div><div class='grille'>" + cases.join("") + "</div></section>");
  }
  return "<!doctype html><html lang='fr'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Cartons — " + esc(terrain.name) + "</title><style>" + css + "</style></head><body>" + pages.join("") + "<div class='cdc-fixe'>carnetdechasse.fr</div></body></html>";
}
function buildLivretsHtml(journee, terrain, participants, safety, ids, cartes, opts) {
  opts = opts || {};
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const dRaw = new Date(journee.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const d = dRaw.charAt(0).toUpperCase() + dRaw.slice(1);
  const tracks = terrain.tracks || [];
  const chefs = journee.chefLignes || {};
  const nameOf = (hid) => { const p = participants.find((x) => x.id === hid); return p ? (p.name || "") : ""; };
  const W = 50 - 2 - 3.2;                       // largeur utile d'une demi-page
  const H = 64 - 4.4;                           // hauteur utile
  const imgAccueil = opts.image || opts.logo || "";
  // plan de chasse (attributions du jour)
  const attribs = ESPECES.filter((e) => e.key !== "autre" && terrain.planChasse && terrain.planChasse[e.key] && terrain.planChasse[e.key].enabled).map((e) => {
    const a = (journee.attributions || {})[e.key] || { mode: "libre", count: 1, note: "" };
    const n = Number(a.count) || 0;
    const txt = a.mode === "bracelets" ? n + " bracelet" + (n > 1 ? "s" : "") : a.mode === "interdit" ? "Interdit" : "Libre";
    const st = a.mode === "bracelets" ? "background:#dcfce7;color:#166534" : a.mode === "interdit" ? "background:#fee2e2;color:#b91c1c" : "background:#f5f5f4;color:#44403c";
    return { label: (e.emoji ? e.emoji + " " : "") + e.label, txt: txt + ((a.note || "").trim() ? " — " + a.note.trim() : ""), st };
  });
  const sonneries = (safety && safety.sonneries || []).filter((s) => (s.evenement || "").trim() || (s.signal || "").trim());
  const feuilles = [];
  ids.forEach((hid) => {
    const p = participants.find((x) => x.id === hid); if (!p) return;
    const postes = [];
    tracks.forEach((trk) => {
      const mid = (journee.placements[trk.id] || {})[hid]; if (!mid) return;
      const i = (trk.miradors || []).findIndex((m) => m.id === mid); if (i < 0) return;
      postes.push({ trk, m: trk.miradors[i], num: numeroPoste(trk.miradors[i], i), chef: chefs[mid] ? nameOf(chefs[mid]) : "" });
    });
    const rabLv = normRabat(journee.rabat);
    tracks.forEach((trk, ti) => { if (!(rabLv[trk.id] || {})[hid] || (journee.placements[trk.id] || {})[hid]) return; postes.push({ trk, rabat: true, ordre: ti, m: { label: "Tu rabats" }, num: "", chef: "" }); });
    postes.sort((a, b) => tracks.indexOf(a.trk) - tracks.indexOf(b.trk));
    const nomComplet = ((p.prenom || "") + " " + (p.nom || "")).trim() || p.name || "(nom à compléter)";
    // ---- page 1 : accueil ----
    const fDom = Math.min(4.6, (W - 2) / Math.max(1, mesureTexte(terrain.name || "", true) * 1.05));
    const fNom = Math.min(4, (W - 2) / Math.max(1, mesureTexte(nomComplet, true)));
    // la couverture garde une ligne libre en bas pour la signature
    const p1 = "<div class='pg d cv'><div class='dom' style='font-size:" + Math.max(2.4, fDom).toFixed(2) + "cqw'>" + esc(terrain.name) + "</div>"
      + "<div class='date'>" + esc(d) + "</div><div class='filet'></div>"
      + "<div class='img'>" + (imgAccueil ? "<img src='" + imgAccueil + "' alt='' />" : "") + "</div>"
      + "<div class='qui'><small>" + (numDe(hid) ? "Carton" : "Chasseur") + "</small><b style='font-size:" + ((numDe(hid) ? 2.2 : 1) * Math.max(2, fNom)).toFixed(2) + "cqw'>" + esc(numDe(hid) ? "n°" + numDe(hid) : nomComplet) + "</b></div>"
      + "<div class='cdc'>carnetdechasse.fr</div></div>";
    // ---- page 2 : postes, plan de chasse, sonneries ----
    // Hauteur du contenu pour une taille de texte donnee (memes regles que la feuille de style),
    // puis on prend la plus grande taille qui tient dans la page.
    const lh = 1.3;
    const lignesDe = (txt, gras, larg, f) => Math.max(1, Math.ceil(mesureTexte(txt || "", gras) * f * 1.06 / Math.max(0.5, larg)));
    const hauteur = (f) => {
      const titre = f * 1.37 * 2.05 + 0.3 + f * 1.1;
      let h = titre + postes.reduce((s, x) => s + Math.max(1.95, lignesDe(x.trk.name, true, W * 0.4 - 0.8 - f * 0.95, f) * lh,
        lignesDe(x.m.label, false, W * 0.45 - f * 0.6, f) * lh + (x.chef ? lignesDe("Chef de ligne : " + x.chef, false, W * 0.45 - f * 0.6, f * 0.8) * 0.8 * lh : 0)) * f + 0.7 * f + 0.12, 0);
      if (!postes.length) h += f * 2.5;
      if (attribs.length) h += titre + attribs.reduce((s, a) => s + (Math.max(lignesDe(a.label, true, W * 0.5 - f * 1.2, f), lignesDe(a.txt, true, W * 0.5 - f * 1.2, f)) * lh + 1.0) * f, 0);
      if (sonneries.length) h += titre + sonneries.reduce((s, x) => s + (Math.max(lignesDe(x.evenement, true, W * 0.4, f), lignesDe(x.signal, false, W * 0.6 - f * 0.8, f)) * lh + 0.5) * f + 0.12, 0);
      return h;
    };
    let fsN = 2.0;
    while (fsN > 0.85 && hauteur(fsN) > H - 0.8) fsN -= 0.05;
    const k = fsN / 1.75;
    const fs = fsN.toFixed(2);
    const secPostes = "<div class='sec'><h2 style='font-size:" + (fsN * 1.37).toFixed(2) + "cqw'>Mes postes</h2>"
      + (postes.length ? "<table class='tp'><colgroup><col style='width:40%'><col style='width:15%'><col></colgroup>"
        + postes.map((x) => x.rabat ? "<tr><td class='tq' style='--c:" + (x.trk.color || "#166534") + "'>" + esc(x.trk.name) + "</td><td class='n'></td><td class='lb' style='color:#c2410c;font-weight:700'>🟠 Tu rabats</td></tr>" : "<tr><td class='tq' style='--c:" + (x.trk.color || "#166534") + "'>" + esc(x.trk.name) + "</td><td class='n'>" + esc(x.num) + "</td><td class='lb'>" + esc(x.m.label) + (x.chef ? "<span class='chef'>Chef de ligne : " + esc(x.chef) + "</span>" : "") + "</td></tr>").join("")
        + "</table>" : "<p style='color:#a8a29e;font-style:italic'>Pas de poste attribué.</p>") + "</div>";
    const secPlan = attribs.length ? "<div class='sec'><h2 style='font-size:" + (fsN * 1.37).toFixed(2) + "cqw'>Plan de chasse</h2>"
      + attribs.map((a) => "<div class='at' style='" + a.st + "'><b style='color:#1c1917'>" + esc(a.label) + "</b><b style='text-align:right'>" + esc(a.txt) + "</b></div>").join("") + "</div>" : "";
    const secSon = sonneries.length ? "<div class='sec'><h2 style='font-size:" + (fsN * 1.37).toFixed(2) + "cqw'>Annonces</h2>"
      + sonneries.map((x) => "<div class='so'><span class='ev'>" + esc(x.evenement) + "</span><span>" + esc(x.signal) + "</span></div>").join("") + "</div>" : "";
    const p2 = "<div class='pg g' style='font-size:" + fs + "cqw;line-height:" + lh + "'>" + secPostes + secPlan + secSon + "</div>";
    // ---- pages 3 et 4 : les cartes, poste du chasseur en jaune ----
    const avecCarte = postes.filter((x) => !x.rabat && cartes[x.trk.id]);
    const moitie = Math.ceil(avecCarte.length / 2);
    const lot3 = avecCarte.length <= 1 ? avecCarte : avecCarte.slice(0, moitie);
    const lot4 = avecCarte.length <= 1 ? [] : avecCarte.slice(moitie);
    const pageCartes = (lot, cote) => {
      // Au dos du livret (page 4), on garde une ligne en bas pour la signature.
      const dos = cote === "g", H2 = dos ? H - 3.2 : H, sig = dos ? "<div class='cdc'>carnetdechasse.fr</div>" : "";
      if (!lot.length) return "<div class='pg " + cote + "'><div class='fin'>" + (opts.logo ? "<img src='" + opts.logo + "' alt='' />" : "") + "Bonne chasse !</div>" + sig + "</div>";
      // On essaie une colonne puis deux, et on garde la disposition ou les cartes sont les plus grandes.
      const GAP = 1.4, TITRE = 4.6;
      const essai = (c) => {
        const r = Math.ceil(lot.length / c), wC = (W - (c - 1) * GAP) / c, hC = (H2 - (r - 1) * GAP) / r - TITRE;
        return { c, r, wC, hC, aire: lot.reduce((s, x) => { const a = cartes[x.trk.id].a || 1; const l = Math.min(wC, hC / a); return s + l * l * a; }, 0) };
      };
      const choix = lot.length > 1 && essai(2).aire > essai(1).aire * 1.1 ? essai(2) : essai(1);
      const hBloc = choix.hC + TITRE;
      return "<div class='pg " + cote + "'><div style='display:grid;grid-template-columns:repeat(" + choix.c + ",minmax(0,1fr));gap:" + GAP + "cqw'>" + lot.map((x) => {
        const c = cartes[x.trk.id]; const crop = x.trk.crop || FULL_CROP;
        const px = (x.m.gx - crop.x) / crop.w * 100, py = (x.m.gy - crop.y) / crop.h * 100;
        const dedans = px >= 0 && px <= 100 && py >= 0 && py <= 100;
        const hImg = Math.max(8, choix.hC);
        return "<div class='carte' style='height:" + hBloc.toFixed(2) + "cqw'><div class='t' style='--c:" + (x.trk.color || "#166534") + "'>" + esc(x.trk.name) + "<span>Mon poste : " + esc(x.m.label) + "</span></div>"
          + "<div class='z'><div class='w'><img src='" + c.src + "' alt='' style='max-height:" + hImg.toFixed(2) + "cqw' />"
          + (dedans ? "<div class='moi' style='left:" + px.toFixed(2) + "%;top:" + py.toFixed(2) + "%'>" + esc(x.num) + "<i>Mon poste</i></div>" : "")
          + "</div></div></div>";
      }).join("") + "</div>" + sig + "</div>";
    };
    const p3 = pageCartes(lot3, "d"), p4 = pageCartes(lot4, "g");
    // Numero de la page dans le livret plie + nom du chasseur : on repere tout de suite une feuille mal assemblee.
    const libPied = (k) => nomComplet + " · p. " + k + "/4";
    const avecPied = (h, k) => h.slice(0, -6) + "<div class='pnum'>" + esc(libPied(k)) + "</div></div>";
    const attr = (a, b) => " data-pieds='" + esc(JSON.stringify([libPied(a), libPied(b)])).replace(/'/g, "&#39;") + "'";
    feuilles.push({ recto: " data-sig='moities'" + attr(4, 1) + ">" + avecPied(p4, 4) + avecPied(p1, 1), verso: " data-sig='aucune'" + attr(2, 3) + ">" + avecPied(p2, 2) + avecPied(p3, 3) });
  });
  // Trois formats : A4 plie (livret A5), A5 plie (petit livret A6), A4 a couper (deux livrets A5 par feuille).
  const format = opts.format === "a5" || opts.format === "coupe" ? opts.format : "a4";
  const inv = opts.retourner ? " inv" : "";
  let corps = "";
  if (format === "coupe") {
    for (let k = 0; k < feuilles.length; k += 2) {
      const a = feuilles[k], b = feuilles[k + 1];
      const coupe = "<div class='coupe'></div>";
      corps += "<section class='duo'><div class='feuille'" + a.recto + "</div>" + coupe + (b ? "<div class='feuille'" + b.recto + "</div>" : "") + "</section>";
      corps += "<section class='duo" + inv + "'><div class='feuille'" + a.verso + "</div>" + coupe + (b ? "<div class='feuille'" + b.verso + "</div>" : "") + "</section>";
    }
  } else corps = feuilles.map((f) => "<section class='feuille'" + f.recto + "</section><section class='feuille" + inv + "'" + f.verso + "</section>").join("");
  const css = LIVRET_CSS.replace("@page{size:A4 landscape;margin:10mm}", format === "a5" ? "@page{size:A5 landscape;margin:7mm}" : format === "coupe" ? "@page{size:A4 portrait;margin:8mm}" : "@page{size:A4 landscape;margin:10mm}")
    + ".duo{width:100%;container-type:inline-size;display:flex;flex-direction:column;break-inside:avoid;page-break-inside:avoid;break-after:page;page-break-after:always}.duo:last-of-type{break-after:auto;page-break-after:auto}.duo.inv{transform:rotate(180deg)}"
    + ".duo .feuille{break-after:auto;page-break-after:auto}.coupe{height:4cqw;position:relative}.coupe:before{content:'';position:absolute;left:0;right:0;top:50%;border-top:0.25cqw dashed #a8a29e}"
    + ".coupe span{position:absolute;left:3cqw;top:50%;transform:translateY(-50%);background:#fff;padding:0 1cqw;font-size:1.3cqw;color:#a8a29e}";
  return "<!doctype html><html lang='fr'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Livrets — " + esc(terrain.name) + "</title><style>" + css + "</style></head><body data-format='" + format + "'>" + corps + "</body></html>";
}
async function logoDataUrl() {
  try {
    const r = await fetch("icon.png"); if (!r.ok) return "";
    const b = await r.blob();
    return await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result || "")); fr.onerror = () => res(""); fr.readAsDataURL(b); });
  } catch (e) { return ""; }
}
