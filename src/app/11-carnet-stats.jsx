function computeStats(inSeason, terrains, participants) {
  const terrById = (id) => terrains.find((t) => t.id === id);
  const pName = (id) => participants.find((p) => p.id === id)?.name || "?";
  const postOfHunter = (j, terrain, hid) => { for (const trk of terrain.tracks) { const pl = j.placements[trk.id] || {}; if (pl[hid]) return { trackId: trk.id, trackName: trk.name, mid: pl[hid] }; } return null; };
  let totalAnimals = 0, totalBullets = 0; const bySpecies = {}; const shooterA = {}; const shooterB = {}; const postAgg = {}; const perJournee = [];
  inSeason.forEach((j) => {
    const terrain = terrById(j.terrainId); const shots = j.shots || {}; let dayA = 0, dayB = 0; const dayPosts = {};
    if (terrain) terrain.tracks.forEach((trk) => { const pl = j.placements[trk.id] || {}; const ts = shots[trk.id] || {}; Object.entries(pl).forEach(([hid, mid]) => { const m = trk.miradors.find((x) => x.id === mid); const b = Number(ts[mid]) || 0; const pkey = j.terrainId + "|" + trk.id + "|" + mid; dayPosts[trk.id + "|" + mid] = { track: trk.name, post: m ? m.label : "?", hunter: pName(hid), bullets: b, animals: {} }; dayB += b; shooterB[hid] = (shooterB[hid] || 0) + b; if (!postAgg[pkey]) postAgg[pkey] = { terrain: terrain.name, track: trk.name, post: m ? m.label : "?", animals: 0, bullets: 0 }; postAgg[pkey].bullets += b; }); });
    (j.tableau || []).forEach((k) => { const q = Number(k.quantite) || 0; const label = especeLabel(k); totalAnimals += q; dayA += q; bySpecies[label] = (bySpecies[label] || 0) + q; if (k.tireurId) { shooterA[k.tireurId] = (shooterA[k.tireurId] || 0) + q; if (terrain) { let pos = null; if (k.trackId) { const trk = terrain.tracks.find((t) => t.id === k.trackId); const mid = trk && (j.placements[k.trackId] || {})[k.tireurId]; if (trk && mid) pos = { trackId: k.trackId, trackName: trk.name, mid }; } if (!pos) pos = postOfHunter(j, terrain, k.tireurId); if (pos) { const dp = dayPosts[pos.trackId + "|" + pos.mid]; if (dp) dp.animals[label] = (dp.animals[label] || 0) + q; const pkey = j.terrainId + "|" + pos.trackId + "|" + pos.mid; if (!postAgg[pkey]) { const mm = terrain.tracks.find((t) => t.id === pos.trackId)?.miradors.find((x) => x.id === pos.mid); postAgg[pkey] = { terrain: terrain.name, track: pos.trackName, post: mm ? mm.label : "?", animals: 0, bullets: 0 }; } postAgg[pkey].animals += q; } } } });
    totalBullets += dayB; perJournee.push({ id: j.id, date: j.date, terrain: terrain ? terrain.name : "—", animals: dayA, bullets: dayB, posts: Object.values(dayPosts) });
  });
  const byShooter = participants.map((p) => ({ name: p.name || "Sans nom", animals: shooterA[p.id] || 0, bullets: shooterB[p.id] || 0 })).filter((x) => x.animals > 0 || x.bullets > 0).sort((a, b) => b.animals - a.animals || b.bullets - a.bullets);
  const byPost = Object.values(postAgg).filter((p) => p.animals > 0 || p.bullets > 0).sort((a, b) => b.animals - a.animals || b.bullets - a.bullets);
  return { totalAnimals, totalBullets, ratio: totalAnimals ? totalBullets / totalAnimals : 0, bySpecies, byShooter, byPost, perJournee };
}
const STATS_CSS = "@page{margin:14mm}body{font-family:Georgia,serif;color:#1c1917;margin:0}header{border-bottom:3px solid #166534;padding-bottom:10px;margin-bottom:16px}header h1{margin:0;font-size:24px}header p{margin:2px 0 0;color:#57534e;font-size:13px}h2{font-size:16px;margin:18px 0 6px}table{width:100%;border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;font-size:12px;margin-bottom:8px}th{text-align:left;color:#78716c;font-size:10px;text-transform:uppercase;border-bottom:1px solid #e7e5e4;padding:4px}td{padding:4px;border-bottom:1px solid #f0efee}.c{text-align:center}.tot{display:flex;gap:20px;margin-bottom:6px}.tot b{font-size:22px;color:#166534}";
// Deux repas, un seul gabarit. Chacun a sa case et son propre compteur d'invites.
const REPAS = {
  dejeuner: { cle: "dej", inv: "dejInvites", titre: "Liste du déjeuner", court: "déjeuner", emo: "🥪", onglet: "Déjeuner", fichier: "dejeuner" },
  diner: { cle: "diner", inv: "invitesSup", titre: "Liste du dîner", court: "dîner", emo: "🍽️", onglet: "Dîner", fichier: "diner" }
};
function buildDinerHtml(journee, terrain, participants) { return buildRepasHtml(journee, terrain, participants, "diner"); }
function buildDejeunerHtml(journee, terrain, participants) { return buildRepasHtml(journee, terrain, participants, "dejeuner"); }
function buildRepasHtml(journee, terrain, participants, repas) {
  const RP = REPAS[repas] || REPAS.diner;
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const df = (d) => { try { return new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); } catch (e) { return d; } };
  const pres = journee.presence || {};
  const list = participants.filter((p) => { const pr = pres[p.id] || {}; return pr.statut === "present" && pr[RP.cle]; }).sort((a, b) => byNom(a.name || "", b.name || ""));
  let total = 0;
  let rows = list.map((p, i) => { const sup = Number((pres[p.id] || {})[RP.inv]) || 0; const conv = 1 + sup; total += conv; return "<tr><td class='num'>" + (i + 1) + "</td><td class='nom'>" + esc(p.name || "—") + "</td><td class='c'>" + sup + "</td><td class='c'>" + conv + "</td></tr>"; }).join("");
  if (!rows) rows = "<tr><td colspan='4' style='text-align:center;color:#999;padding:14px'>Personne n'est encore inscrit au " + RP.court + ".</td></tr>";
  const css = "*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1c1917;margin:0;padding:28px 26px;background:#fff}"
    + ".head{border:2px solid #b45309;border-radius:12px;padding:16px 20px;margin-bottom:16px;background:#fffbeb}"
    + ".head h1{margin:0 0 4px;font-size:22px;color:#7c2d12}.head .sub{font-size:14px;color:#b45309;font-weight:600;text-transform:capitalize}"
    + ".meta{margin-top:8px;font-size:13px;color:#44403c}.meta b{color:#1c1917}"
    + "table{border-collapse:collapse;width:100%;font-size:13px;margin-top:4px}"
    + "th,td{border:1px solid #e7e5e4;padding:9px 10px;text-align:left}th{background:#b45309;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.03em}"
    + "tbody tr:nth-child(even){background:#fafaf9}.num{width:26px;text-align:center;color:#78716c}.nom{font-weight:600}.c{text-align:center;width:120px}"
    + ".tot{margin-top:14px;font-size:16px;font-weight:700;color:#7c2d12;text-align:right}";
  return "<!doctype html><html lang='fr'><head><meta charset='utf-8'><title>" + RP.onglet + "</title><style>" + css + "</style></head><body>"
    + "<div class='head'><h1>" + RP.emo + " " + RP.titre + "</h1><div class='sub'>" + esc(df(journee.date)) + "</div>"
    + "<div class='meta'><b>Territoire :</b> " + esc(terrain ? terrain.name : "—") + "</div></div>"
    + "<table><thead><tr><th class='num'>#</th><th>Prénom &amp; nom</th><th class='c'>Invités suppl.</th><th class='c'>Convives</th></tr></thead><tbody>" + rows + "</tbody></table>"
    + "<p class='tot'>Total : " + total + " convive" + (total > 1 ? "s" : "") + "</p>"
    + PIED_IMPRESSION + "</body></html>";
}
function buildEmargementHtml(journee, terrain, participants) {
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const df = (d) => { try { return new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); } catch (e) { return d; } };
  const pres = journee.presence || {};
  const list = participants.filter((p) => (pres[p.id] || {}).statut === "present").sort((a, b) => byNom(a.name || "", b.name || ""));
  let rows = list.map((p, i) => "<tr><td class='num'>" + (i + 1) + "</td><td class='nom'>" + esc(p.name || "—") + "</td><td>" + esc(p.permis || "") + "</td><td>" + esc(p.validation || "") + "</td><td>" + esc(p.assurance || "") + "</td><td class='sig'></td></tr>").join("");
  const emptyRows = Math.max(0, 12 - list.length);
  for (let i = 0; i < emptyRows; i++) rows += "<tr><td class='num'>" + (list.length + i + 1) + "</td><td></td><td></td><td></td><td></td><td class='sig'></td></tr>";
  const css = "*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1c1917;margin:0;padding:28px 26px;background:#fff}"
    + ".head{border:2px solid #166534;border-radius:12px;padding:16px 20px;margin-bottom:18px;background:#f0fdf4}"
    + ".head h1{margin:0 0 4px;font-size:22px;color:#14532d}.head .sub{font-size:14px;color:#166534;font-weight:600;text-transform:capitalize}"
    + ".meta{display:flex;gap:24px;flex-wrap:wrap;margin-top:10px;font-size:13px;color:#44403c}.meta b{color:#1c1917}"
    + ".note{font-size:11px;color:#78716c;margin:10px 2px 14px;line-height:1.4}"
    + "table{border-collapse:collapse;width:100%;font-size:12.5px}"
    + "th,td{border:1px solid #d6d3d1;padding:9px 8px;text-align:left;vertical-align:middle}"
    + "th{background:#166534;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.03em}"
    + "tbody tr:nth-child(even){background:#fafaf9}"
    + ".num{width:26px;text-align:center;color:#78716c}.nom{font-weight:600}.sig{width:150px}"
    + "tbody td{height:34px}"
    + ".foot{margin-top:16px;font-size:11px;color:#78716c;display:flex;justify-content:space-between}"
    + "@media print{body{padding:0}.head{border-color:#166534}}";
  return "<!doctype html><html lang='fr'><head><meta charset='utf-8'><title>Feuille d'émargement</title><style>" + css + "</style></head><body>"
    + "<div class='head'><h1>🦌 Feuille d'émargement</h1><div class='sub'>" + esc(df(journee.date)) + "</div>"
    + "<div class='meta'><span><b>Territoire :</b> " + esc(terrain ? terrain.name : "—") + "</span><span><b>Présents :</b> " + list.length + "</span></div></div>"
    + "<p class='note'>Chaque participant doit être titulaire d'un permis de chasser validé pour la saison en cours et d'une assurance responsabilité civile. Signature obligatoire avant le début de la battue.</p>"
    + "<table><thead><tr><th class='num'>#</th><th>Prénom &amp; nom</th><th>N° de permis</th><th>Validation saison</th><th>Assurance</th><th>Signature</th></tr></thead><tbody>" + rows + "</tbody></table>"
    + "<div class='foot'><span>Organisateur : _______________________</span><span>Fait le " + esc(df(journee.date)) + "</span></div>"
    + PIED_IMPRESSION + "</body></html>";
}
function buildStatsPrintHtml(stats, season) {
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const df = (d) => { try { return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return d; } };
  let jr = ""; stats.perJournee.forEach((pj) => { jr += "<tr><td>" + esc(df(pj.date)) + "</td><td>" + esc(pj.terrain) + "</td><td class='c'>" + pj.animals + "</td><td class='c'>" + pj.bullets + "</td></tr>"; });
  let pr = ""; stats.byShooter.forEach((s) => { pr += "<tr><td>" + esc(s.name) + "</td><td class='c'>" + s.animals + "</td><td class='c'>" + s.bullets + "</td></tr>"; });
  let po = ""; stats.byPost.forEach((p) => { po += "<tr><td>" + esc(p.terrain) + "</td><td>" + esc(p.track) + "</td><td>" + esc(p.post) + "</td><td class='c'>" + p.animals + "</td><td class='c'>" + p.bullets + "</td></tr>"; });
  return "<!doctype html><html lang='fr'><head><meta charset='utf-8'><title>Statistiques " + esc(season) + "</title><style>" + STATS_CSS + "</style></head><body>"
    + "<header><h1>🦌 Statistiques de chasse — Saison " + esc(season) + "</h1><p>Bilan de la saison</p></header>"
    + "<div class='tot'><div><b>" + stats.totalAnimals + "</b><br>animaux</div><div><b>" + stats.totalBullets + "</b><br>balles</div><div><b>" + (stats.ratio ? stats.ratio.toFixed(1) : "—") + "</b><br>balles / animal</div></div>"
    + "<h2>Résumé par journée</h2><table><thead><tr><th>Date</th><th>Territoire</th><th class='c'>Animaux</th><th class='c'>Balles</th></tr></thead><tbody>" + (jr || "<tr><td colspan='4'>—</td></tr>") + "</tbody></table>"
    + "<h2>Animaux &amp; balles par personne</h2><table><thead><tr><th>Chasseur</th><th class='c'>Animaux</th><th class='c'>Balles</th></tr></thead><tbody>" + (pr || "<tr><td colspan='3'>—</td></tr>") + "</tbody></table>"
    + "<h2>Animaux &amp; balles par poste</h2><table><thead><tr><th>Territoire</th><th>Traque</th><th>Poste</th><th class='c'>Animaux</th><th class='c'>Balles</th></tr></thead><tbody>" + (po || "<tr><td colspan='5'>—</td></tr>") + "</tbody></table>"
    + PIED_IMPRESSION + "</body></html>";
}
function CarnetView({ journees, terrains, participants, setJournees }) {
  const seasons = [...new Set(journees.map((j) => seasonOf(j.date)))].sort().reverse();
  const [season, setSeason] = useState(seasons[0] || seasonOf(new Date().toISOString()));
  const [openId, setOpenId] = useState(null);
  const [terrFilter, setTerrFilter] = useState("all");
  const [statsPrint, setStatsPrint] = useState(null);
  const [expSpecies, setExpSpecies] = useState(null);
  const seasonJournees = journees.filter((j) => seasonOf(j.date) === season);
  const territoriesInSeason = [...new Map(seasonJournees.filter((j) => j.terrainId).map((j) => { const t = terrains.find((x) => x.id === j.terrainId); return [j.terrainId, t ? t.name : "—"]; })).entries()];
  const inSeason = seasonJournees.filter((j) => terrFilter === "all" || j.terrainId === terrFilter).sort((a, b) => (a.date < b.date ? 1 : -1));
  const stats = computeStats(inSeason, terrains, participants);
  const nameOf = (hid) => participants.find((p) => p.id === hid)?.name || "?";
  const updateKill = (jid, kid, patch) => setJournees && setJournees((prev) => prev.map((j) => (j.id !== jid ? j : { ...j, tableau: (j.tableau || []).map((k) => (k.id === kid ? { ...k, ...patch } : k)) })));
  const animalRows = () => { const rows = []; inSeason.forEach((j) => { const terr = terrains.find((t) => t.id === j.terrainId); (j.tableau || []).forEach((k) => { rows.push({ jid: j.id, kid: k.id, date: j.date, terrain: terr ? terr.name : "", espece: especeLabel(k), sexe: k.sexe || "", poids: k.poids || "", bracelet: k.bracelet || "", tireur: k.tireurId ? nameOf(k.tireurId) : "" }); }); }); return rows; };
  const dfr = (d) => { try { return new Date(d).toLocaleDateString("fr-FR"); } catch (e) { return d; } };
  const sexLabel = (s) => (s === "M" ? "Mâle" : s === "F" ? "Femelle" : "");
  const exportFedExcel = () => {
    try {
      const rows = animalRows().map((r) => ({ Date: dfr(r.date), Territoire: r.terrain, Espèce: r.espece, Sexe: sexLabel(r.sexe), "Poids (kg)": r.poids, "N° bracelet": r.bracelet, Tireur: r.tireur }));
      const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.length ? rows : [{ Date: "" }]), "Fédération");
      const out = XLSX.write(wb, { bookType: "xlsx", type: "array" }); const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const fn = "federation-" + season + ".xlsx"; const file = new File([blob], fn, { type: blob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: fn }).catch(() => {}); } else { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = fn; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    } catch (e) { window.alert("Export impossible : " + (e.message || e)); }
  };
  const printFed = () => {
    const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const rows = animalRows();
    const trs = rows.map((r) => "<tr><td>" + esc(dfr(r.date)) + "</td><td>" + esc(r.terrain) + "</td><td>" + esc(r.espece) + "</td><td>" + esc(sexLabel(r.sexe)) + "</td><td>" + esc(r.poids) + "</td><td>" + esc(r.bracelet) + "</td><td>" + esc(r.tireur) + "</td></tr>").join("");
    const html = "<!doctype html><html><head><meta charset='utf-8'><title>Fédération " + esc(season) + "</title><style>body{font-family:-apple-system,sans-serif;padding:20px;color:#1c1917}h1{font-size:18px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid #d6d3d1;padding:5px 7px;text-align:left}th{background:#f5f5f4}</style></head><body><h1>Bilan fédération — Saison " + esc(season) + "</h1><table><thead><tr><th>Date</th><th>Territoire</th><th>Espèce</th><th>Sexe</th><th>Poids (kg)</th><th>N° bracelet</th><th>Tireur</th></tr></thead><tbody>" + trs + "</tbody></table></body></html>";
    setStatsPrint(html);
  };
  const printStats = () => { setStatsPrint(buildStatsPrintHtml(stats, season)); };
  const exportStatsExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      const df = (d) => { try { return new Date(d).toLocaleDateString("fr-FR"); } catch (e) { return d; } };
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(stats.perJournee.length ? stats.perJournee.map((p) => ({ Date: df(p.date), Territoire: p.terrain, Animaux: p.animals, Balles: p.bullets })) : [{ Date: "" }]), "Journées");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(stats.byShooter.length ? stats.byShooter.map((s) => ({ Chasseur: s.name, Animaux: s.animals, Balles: s.bullets })) : [{ Chasseur: "" }]), "Par personne");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(stats.byPost.length ? stats.byPost.map((p) => ({ Territoire: p.terrain, Traque: p.track, Poste: p.post, Animaux: p.animals, Balles: p.bullets })) : [{ Poste: "" }]), "Par poste");
      const out = XLSX.write(wb, { bookType: "xlsx", type: "array" }); const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const fn = "stats-chasse-" + season + ".xlsx"; const file = new File([blob], fn, { type: blob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: fn }).catch(() => {}); } else { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = fn; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    } catch (e) { window.alert("Export impossible : " + (e.message || e)); }
  };
  return (<div className="space-y-4">
    {statsPrint && <PrintOverlay html={statsPrint} onClose={() => setStatsPrint(null)} />}
    <div className="flex items-center justify-between gap-2 flex-wrap"><h2 className="font-serif text-xl text-stone-800 flex items-center gap-2"><BookOpen size={20} className="text-emerald-800" /> Carnet de chasse</h2>
      <div className="flex gap-2">{territoriesInSeason.length >= 1 && <select value={terrFilter} onChange={(e) => setTerrFilter(e.target.value)} className="border border-stone-300 rounded px-2 py-1 bg-white text-sm"><option value="all">Tous les territoires</option>{territoriesInSeason.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>}{seasons.length > 0 && <select value={season} onChange={(e) => { setSeason(e.target.value); setTerrFilter("all"); }} className="border border-stone-300 rounded px-2 py-1 bg-white text-sm">{seasons.map((s) => <option key={s} value={s}>Saison {s}</option>)}</select>}</div></div>
    {inSeason.length === 0 ? <SectionCard className="p-4"><p className="text-sm text-stone-500 italic">Aucune journée pour cette sélection.</p></SectionCard> : (<>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white border border-stone-200 rounded-md p-3 text-center"><p className="text-2xl font-bold text-emerald-800">{stats.totalAnimals}</p><p className="text-xs text-stone-600">animaux</p></div>
        <div className="bg-white border border-stone-200 rounded-md p-3 text-center"><p className="text-2xl font-bold text-amber-800">{stats.totalBullets}</p><p className="text-xs text-stone-600">balles</p></div>
        <div className="bg-white border border-stone-200 rounded-md p-3 text-center"><p className="text-2xl font-bold text-stone-700">{stats.ratio ? stats.ratio.toFixed(1) : "—"}</p><p className="text-xs text-stone-600">balles / animal</p></div>
      </div>
      <div className="flex gap-2"><button onClick={printStats} className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-3 py-2 rounded-md"><FileText size={15} /> Carnet de chasse PDF</button><button onClick={exportStatsExcel} className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-3 py-2 rounded-md"><Download size={15} /> Carnet de chasse Excel</button></div>
      <div className="flex gap-2"><button onClick={printFed} className="flex-1 flex items-center justify-center gap-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-sm font-medium px-3 py-2 rounded-md"><FileText size={15} /> Fédération PDF</button><button onClick={exportFedExcel} className="flex-1 flex items-center justify-center gap-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-sm font-medium px-3 py-2 rounded-md"><Download size={15} /> Fédération Excel</button></div>
      {Object.keys(stats.bySpecies).length > 0 && <SectionCard className="p-4"><p className="text-xs uppercase tracking-wide text-stone-400 mb-2">Par espèce (clique une espèce pour saisir sexe / poids / bracelet)</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{Object.entries(stats.bySpecies).sort((a, b) => b[1] - a[1]).map(([k, n]) => (<button key={k} onClick={() => setExpSpecies(expSpecies === k ? null : k)} className={`bg-white border rounded-md p-2 text-center ${expSpecies === k ? "border-emerald-500 ring-2 ring-emerald-200" : "border-stone-200"}`}><p className="text-xl font-bold text-emerald-800">{n}</p><p className="text-xs text-stone-600">{k}</p></button>))}</div>
        {expSpecies && (<div className="mt-3 space-y-2">
          <p className="text-xs font-medium text-stone-600">{expSpecies} — {animalRows().filter((r) => r.espece === expSpecies).length} animal(aux)</p>
          {animalRows().filter((r) => r.espece === expSpecies).map((r) => (<div key={r.kid} className="border border-stone-200 rounded-md p-2 bg-stone-50">
            <div className="flex justify-between items-center text-[11px] text-stone-500 mb-1.5"><span>{dfr(r.date)}{r.terrain ? " · " + r.terrain : ""}</span><span>{r.tireur}</span></div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-1">
                <button onClick={() => updateKill(r.jid, r.kid, { sexe: r.sexe === "M" ? "" : "M" })} className={`px-2 py-1 rounded text-xs font-medium border ${r.sexe === "M" ? "bg-sky-700 text-white border-sky-700" : "bg-white text-stone-600 border-stone-200"}`}>♂ M</button>
                <button onClick={() => updateKill(r.jid, r.kid, { sexe: r.sexe === "F" ? "" : "F" })} className={`px-2 py-1 rounded text-xs font-medium border ${r.sexe === "F" ? "bg-pink-700 text-white border-pink-700" : "bg-white text-stone-600 border-stone-200"}`}>♀ F</button>
              </div>
              <div className="flex items-center gap-1"><input type="number" inputMode="decimal" step="0.1" min="0" onFocus={(e) => e.target.select()} value={r.poids} onChange={(e) => updateKill(r.jid, r.kid, { poids: e.target.value })} placeholder="kg" className="w-16 border border-stone-300 rounded px-2 py-1 text-sm bg-white" /><span className="text-xs text-stone-400">kg</span></div>
              <input value={r.bracelet} onChange={(e) => updateKill(r.jid, r.kid, { bracelet: e.target.value })} placeholder="n° bracelet" className="w-28 border border-stone-300 rounded px-2 py-1 text-sm bg-white" />
            </div>
          </div>))}
        </div>)}
      </SectionCard>}
      {stats.byShooter.length > 0 && <SectionCard className="p-4"><p className="text-xs uppercase tracking-wide text-stone-400 mb-2">Par personne (animaux · balles)</p><div className="space-y-1">{stats.byShooter.map((t, i) => (<div key={i} className="flex items-center justify-between text-sm border-b border-stone-100 py-1 last:border-0"><span className="text-stone-800">{i + 1}. {t.name}</span><span className="text-stone-500"><b className="text-emerald-800">{t.animals}</b> animal(aux) · <b className="text-amber-800">{t.bullets}</b> balle(s)</span></div>))}</div></SectionCard>}
      {stats.byPost.length > 0 && <SectionCard className="p-4"><p className="text-xs uppercase tracking-wide text-stone-400 mb-2">Par poste (animaux · balles)</p><div className="space-y-1">{stats.byPost.map((p, i) => (<div key={i} className="flex items-center justify-between text-sm border-b border-stone-100 py-1 last:border-0"><span className="text-stone-700 truncate mr-2"><b>{p.track}</b> — {p.post}</span><span className="text-stone-500 shrink-0"><b className="text-emerald-800">{p.animals}</b> · <b className="text-amber-800">{p.bullets}</b></span></div>))}</div></SectionCard>}
      <div><p className="text-xs uppercase tracking-wide text-stone-400 mb-2">Historique des journées ({inSeason.length})</p><div className="space-y-2">
        {stats.perJournee.map((pj) => { const isOpen = openId === pj.id; const jrn = journees.find((x) => x.id === pj.id);
          return (<SectionCard key={pj.id}>
            <button onClick={() => setOpenId(isOpen ? null : pj.id)} className="w-full flex items-center justify-between px-4 py-3 gap-2 text-left"><span className="flex items-center gap-2 font-medium text-stone-800 text-sm">{isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}{new Date(pj.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span><span className="text-xs text-stone-500 truncate">{pj.terrain} · {pj.animals} pris · {pj.bullets} balles</span></button>
            {isOpen && (<div className="border-t border-stone-200 px-4 py-3 space-y-3 text-sm">
              {pj.posts.length > 0 && <div><p className="font-medium text-stone-700">Postes</p><ul className="text-stone-600 text-xs mt-0.5 space-y-0.5">{pj.posts.map((po, i) => { const an = Object.entries(po.animals).map(([l, n]) => n + " " + l).join(", "); return <li key={i}><b>{po.track}</b> — {po.post} · {po.hunter} · {po.bullets} balle(s){an ? " · 🦌 " + an : ""}</li>; })}</ul></div>}
              <div><p className="font-medium text-stone-700">🦌 Tableau du jour</p>{!jrn || (jrn.tableau || []).length === 0 ? <p className="text-xs text-stone-400 italic">Rien noté.</p> : <ul className="text-stone-600 text-xs mt-0.5 space-y-0.5">{(jrn.tableau || []).map((k) => <li key={k.id}>{especeEmoji(k.espece)} {especeLabel(k)} × {k.quantite || 0}{k.tireurId ? " — " + nameOf(k.tireurId) : ""}</li>)}</ul>}</div>
            </div>)}
          </SectionCard>); })}
      </div></div>
    </>)}
  </div>);
}

// ---------- Récap dîner ----------
const DINER_CSS = "@page{margin:16mm}body{font-family:Georgia,serif;color:#1c1917;margin:0}header{display:flex;align-items:center;gap:14px;border-bottom:3px solid #92400e;padding-bottom:10px;margin-bottom:16px}header .emo{font-size:32px}header h1{margin:0;font-size:24px}header p{margin:2px 0 0;color:#57534e;font-size:13px}h2{font-size:16px;margin:18px 0 6px}table{width:100%;border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;font-size:13px}th{text-align:left;color:#78716c;font-size:11px;text-transform:uppercase;border-bottom:1px solid #e7e5e4;padding:4px}td{padding:5px 4px;border-bottom:1px solid #f0efee}tfoot td{font-weight:bold;border-top:2px solid #d6d3d1}ul.abs{font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#57534e;columns:2}";
function buildDinnerPrintHtml(participants) {
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const vient = participants.filter((p) => p.diner && p.diner.vient);
  const absent = participants.filter((p) => !(p.diner && p.diner.vient));
  const total = vient.reduce((s, p) => s + 1 + (Number(p.diner.invitesSupplementaires) || 0), 0);
  let rowsV = ""; vient.forEach((p) => { const sup = Number(p.diner.invitesSupplementaires) || 0; rowsV += "<tr><td>" + esc(p.name || "Sans nom") + "</td><td style='text-align:center'>" + (sup ? ("+" + sup) : "") + "</td><td style='text-align:center'>" + (1 + sup) + "</td></tr>"; });
  let rowsA = ""; absent.forEach((p) => { rowsA += "<li>" + esc(p.name || "Sans nom") + "</li>"; });
  return "<!doctype html><html lang='fr'><head><meta charset='utf-8'><title>Récap dîner</title><style>" + DINER_CSS + "</style></head><body>"
    + "<header><div class='emo'>🐗</div><div><h1>Récap du dîner</h1><p>" + vient.length + " présent(s) · " + total + " convive(s)</p></div></header>"
    + "<h2>Présents</h2><table><thead><tr><th>Nom</th><th style='text-align:center'>+ invités</th><th style='text-align:center'>Total</th></tr></thead><tbody>" + (rowsV || "<tr><td colspan='3'>—</td></tr>") + "</tbody><tfoot><tr><td>TOTAL CONVIVES</td><td></td><td style='text-align:center'>" + total + "</td></tr></tfoot></table>"
    + (rowsA ? ("<h2>Absents</h2><ul class='abs'>" + rowsA + "</ul>") : "")
    + PIED_IMPRESSION + "</body></html>";
}

// ---------- Application ----------
