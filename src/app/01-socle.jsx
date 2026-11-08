
const { useState, useEffect, useRef, useMemo } = React;

/* Stockage local durable (IndexedDB) — même API que window.storage */
window.storage = (function () {
  var DB = "carnet-battue", ST = "kv", dbp = null;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      var r = indexedDB.open(DB, 1);
      r.onupgradeneeded = function () { var db = r.result; if (!db.objectStoreNames.contains(ST)) db.createObjectStore(ST); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
    return dbp;
  }
  function tx(mode) { return open().then(function (db) { return db.transaction(ST, mode).objectStore(ST); }); }
  return {
    get: function (key) { return tx("readonly").then(function (s) { return new Promise(function (res, rej) { var r = s.get(key); r.onsuccess = function () { res(r.result === undefined ? null : { key: key, value: r.result }); }; r.onerror = function () { rej(r.error); }; }); }); },
    set: function (key, value) { return tx("readwrite").then(function (s) { return new Promise(function (res, rej) { var r = s.put(value, key); r.onsuccess = function () { res({ key: key, value: value }); }; r.onerror = function () { rej(r.error); }; }); }); },
    delete: function (key) { return tx("readwrite").then(function (s) { return new Promise(function (res, rej) { var r = s.delete(key); r.onsuccess = function () { res({ key: key, deleted: true }); }; r.onerror = function () { rej(r.error); }; }); }); }
  };
})();

/* Icônes (SVG inline, style lucide) */
var __ICONS = {
  Users: "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/>",
  MapPin: "<path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'/><circle cx='12' cy='10' r='3'/>",
  CalendarDays: "<path d='M8 2v4'/><path d='M16 2v4'/><rect width='18' height='18' x='3' y='4' rx='2'/><path d='M3 10h18'/><path d='M8 14h.01'/><path d='M12 14h.01'/><path d='M16 14h.01'/><path d='M8 18h.01'/><path d='M12 18h.01'/><path d='M16 18h.01'/>",
  ChevronDown: "<path d='m6 9 6 6 6-6'/>",
  ChevronRight: "<path d='m9 18 6-6-6-6'/>",
  Plus: "<path d='M5 12h14'/><path d='M12 5v14'/>",
  Check: "<path d='M20 6 9 17l-5-5'/>",
  X: "<path d='M18 6 6 18'/><path d='m6 6 12 12'/>",
  Crosshair: "<circle cx='12' cy='12' r='10'/><line x1='22' x2='18' y1='12' y2='12'/><line x1='6' x2='2' y1='12' y2='12'/><line x1='12' x2='12' y1='6' y2='2'/><line x1='12' x2='12' y1='22' y2='18'/>",
  ArrowLeft: "<path d='m12 19-7-7 7-7'/><path d='M19 12H5'/>",
  Target: "<circle cx='12' cy='12' r='10'/><circle cx='12' cy='12' r='6'/><circle cx='12' cy='12' r='2'/>",
  Trash2: "<path d='M3 6h18'/><path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'/><path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'/><line x1='10' x2='10' y1='11' y2='17'/><line x1='14' x2='14' y1='11' y2='17'/>",
  Upload: "<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='17 8 12 3 7 8'/><line x1='12' x2='12' y1='3' y2='15'/>",
  Download: "<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='7 10 12 15 17 10'/><line x1='12' x2='12' y1='15' y2='3'/>",
  FolderOpen: "<path d='m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2'/>",
  AlertTriangle: "<path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z'/><path d='M12 9v4'/><path d='M12 17h.01'/>",
  Crop: "<path d='M6 2v14a2 2 0 0 0 2 2h14'/><path d='M18 22V8a2 2 0 0 0-2-2H2'/>",
  FileText: "<path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z'/><path d='M14 2v4a2 2 0 0 0 2 2h4'/><path d='M16 13H8'/><path d='M16 17H8'/><path d='M10 9H8'/>",
  Shield: "<path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z'/>",
  Bell: "<path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'/><path d='M10.3 21a1.94 1.94 0 0 0 3.4 0'/>",
  Phone: "<path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z'/>",
  Send: "<path d='m22 2-7 20-4-9-9-4Z'/><path d='M22 2 11 13'/>",
  Share2: "<circle cx='18' cy='5' r='3'/><circle cx='6' cy='12' r='3'/><circle cx='18' cy='19' r='3'/><line x1='8.59' x2='15.42' y1='13.51' y2='17.49'/><line x1='15.41' x2='8.59' y1='6.51' y2='10.49'/>",
  ImageIcon: "<rect width='18' height='18' x='3' y='3' rx='2' ry='2'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/>",
  BookOpen: "<path d='M12 7v14'/><path d='M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3Z'/>",
  Merge: "<path d='m8 6 4-4 4 4'/><path d='M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22'/><path d='m20 22-5-5'/>",
  Settings: "<path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'/><circle cx='12' cy='12' r='3'/>",
  Cloud: "<path d='M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z'/>"
};
function __mkIcon(name) {
  return function (props) {
    props = props || {};
    return React.createElement("svg", { width: props.size || 18, height: props.size || 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: props.strokeWidth || 2, strokeLinecap: "round", strokeLinejoin: "round", className: props.className, style: props.style, dangerouslySetInnerHTML: { __html: __ICONS[name] } });
  };
}
const Users = __mkIcon("Users"), MapPin = __mkIcon("MapPin"), CalendarDays = __mkIcon("CalendarDays"), ChevronDown = __mkIcon("ChevronDown"), ChevronRight = __mkIcon("ChevronRight"), Plus = __mkIcon("Plus"), Check = __mkIcon("Check"), X = __mkIcon("X"), Crosshair = __mkIcon("Crosshair"), ArrowLeft = __mkIcon("ArrowLeft"), Target = __mkIcon("Target"), Trash2 = __mkIcon("Trash2"), Upload = __mkIcon("Upload"), Download = __mkIcon("Download"), FolderOpen = __mkIcon("FolderOpen"), AlertTriangle = __mkIcon("AlertTriangle"), Crop = __mkIcon("Crop"), FileText = __mkIcon("FileText"), Shield = __mkIcon("Shield"), Bell = __mkIcon("Bell"), Phone = __mkIcon("Phone"), Send = __mkIcon("Send"), Share2 = __mkIcon("Share2"), ImageIcon = __mkIcon("ImageIcon"), BookOpen = __mkIcon("BookOpen"), Merge = __mkIcon("Merge"), Settings = __mkIcon("Settings"), Cloud = __mkIcon("Cloud");

// ============================================================
//  CARNET DE BATTUE — v4
//  Nouveautés : téléphone des invités · photos + consignes par poste ·
//  onglet Sécurité éditable + pop-up d'accueil · partage WhatsApp des
//  postes aux chasseurs (texte + image, poste mis en évidence) ·
//  bouton Partager (feuille iOS) pour la sauvegarde Excel.
// ============================================================

const FULL_CROP = { x: 0, y: 0, w: 100, h: 100 };
const DEFAULT_CROP = { x: 12, y: 12, w: 76, h: 76 };
const PALETTE = ["#dc2626", "#ea580c", "#ca8a04", "#16a34a", "#0891b2", "#2563eb", "#7c3aed", "#db2777", "#57534e", "#000000"];

const DEFAULT_SAFETY = {
  consignes: [
    "Angle de sécurité 30° : repérer ses voisins de poste dès l'arrivée et se signaler.",
    "Identifier formellement le gibier avant de tirer ; jamais sur un bruit ou un mouvement.",
    "Tir fichant (vers le sol), jamais à hauteur d'homme.",
    "Interdiction de tirer vers routes, habitations, chemins publics, traqueurs et postes voisins.",
    "Interdiction de tirer un animal qui entre dans la traque (sauf consigne du chef de battue).",
    "Effet fluo orange obligatoire.",
    "Arme déchargée et ouverte pour tout déplacement, sous étui en voiture.",
    "Rester à son poste tant que la fin de traque n'est pas sonnée.",
    "Alcool zéro pendant l'action de chasse.",
  ],
  sonneries: [
    { evenement: "Début de traque", signal: "1 coup long" },
    { evenement: "Fin de traque", signal: "1 coup long + rigodon" },
    { evenement: "Renard", signal: "3 coups" },
    { evenement: "Chevreuil", signal: "4 coups" },
    { evenement: "Sanglier", signal: "5 coups" },
    { evenement: "Animal mort", signal: "sonnerie de la vue + rigodon" },
    { evenement: "Arrêt de sécurité", signal: "on cesse le tir, on NE BOUGE PAS de son poste, reprise annoncée par 1 coup long" },
  ],
};

const initialParticipants = [];
const initialTerrains = [];
const initialJournees = [];

// ---------- Normalisation ----------
function IconRayee({ size = 15, color = "#166534" }) {
  return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round", style: { display: "inline-block", verticalAlign: "-2px" } },
    React.createElement("circle", { cx: 12, cy: 12, r: 9 }),
    React.createElement("circle", { cx: 12, cy: 12, r: 5.5, strokeWidth: 1.2 }),
    React.createElement("path", { d: "M12 6.5v11M17.5 12h-11M15.9 8.1 8.1 15.9M15.9 15.9 8.1 8.1", strokeWidth: 1.2 }));
}
function IconLisse({ size = 15, color = "#166534" }) {
  return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round", style: { display: "inline-block", verticalAlign: "-2px" } },
    React.createElement("circle", { cx: 12, cy: 12, r: 9 }),
    React.createElement("circle", { cx: 12, cy: 12, r: 5.5, strokeWidth: 1.2 }));
}
function IconArc({ size = 15, color = "#166534" }) {
  return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", style: { display: "inline-block", verticalAlign: "-2px" } },
    React.createElement("path", { d: "M17 3a13 13 0 0 1 0 18" }),
    React.createElement("path", { d: "M17 3 6.5 12 17 21" }),
    React.createElement("path", { d: "M3 12h12" }),
    React.createElement("path", { d: "m12 9 3 3-3 3" }));
}
function ArmeIcon({ k, size = 15, color = "#166534" }) {
  if (k === "rayee") return React.createElement(IconRayee, { size, color });
  if (k === "lisse") return React.createElement(IconLisse, { size, color });
  if (k === "arc") return React.createElement(IconArc, { size, color });
  return null;
}
function Fauteuil({ size = 15, color = "#166534" }) {
  return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", style: { display: "inline-block", verticalAlign: "-2px" } },
    React.createElement("circle", { cx: 16, cy: 4, r: 1 }),
    React.createElement("path", { d: "m18 19 1-7-6 1" }),
    React.createElement("path", { d: "m5 8 3-3 5.5 3-2.36 3.5" }),
    React.createElement("path", { d: "M4.24 14.5a5 5 0 0 0 6.88 6" }),
    React.createElement("path", { d: "M13.76 17.5a5 5 0 0 0-6.88-6" }));
}
function Pencil({ size = 14, className = "" }) {
  return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement("path", { d: "M12 20h9" }),
    React.createElement("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" }));
}
function Grip({ size = 16, className = "" }) {
  return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", stroke: "none", className: className },
    React.createElement("circle", { cx: 9, cy: 5, r: 1.4 }), React.createElement("circle", { cx: 9, cy: 12, r: 1.4 }), React.createElement("circle", { cx: 9, cy: 19, r: 1.4 }),
    React.createElement("circle", { cx: 15, cy: 5, r: 1.4 }), React.createElement("circle", { cx: 15, cy: 12, r: 1.4 }), React.createElement("circle", { cx: 15, cy: 19, r: 1.4 }));
}
function normJournee(j) { return { ...j, placements: j.placements || {}, presence: j.presence || {}, invites: Array.isArray(j.invites) ? j.invites : [], shots: j.shots || {}, miradorStates: j.miradorStates || {}, arrows: j.arrows || {}, tableau: Array.isArray(j.tableau) ? j.tableau : [], attributions: j.attributions || {}, chefs: Array.isArray(j.chefs) ? j.chefs : [], chefLignes: j.chefLignes || {}, armes: j.armes || {}, rdv: j.rdv || {}, canal: j.canal || "", deposesJourParTraque: (j.deposesJourParTraque && typeof j.deposesJourParTraque === "object") ? j.deposesJourParTraque : {}, voitures: (j.voitures && !Array.isArray(j.voitures) && typeof j.voitures === "object") ? j.voitures : {}, transport: (j.transport && typeof j.transport === "object") ? j.transport : {}, rabat: normRabat(j.rabat), rabatRegle: normRabatRegle(j.rabatRegle) }; }
function normTirZone(z) { z = z || {}; return { dir: ((Number(z.dir) || 0) % 360 + 360) % 360, width: Math.max(10, Math.min(360, Number(z.width) || 60)) }; }
function normMirador(m) { const tz = (m.tir && Array.isArray(m.tir.zones)) ? m.tir.zones.map(normTirZone) : ((m.tir && m.tir.no && m.tir.no.on) ? [normTirZone(m.tir.no)] : []); return { id: m.id, label: m.label || "Poste", gx: m.gx ?? m.x ?? 50, gy: m.gy ?? m.y ?? 50, photos: m.photos || [], photoNotes: normPhotoNotes(m.photoNotes), consignes: m.consignes || "", priority: Number(m.priority) || 1, accFauteuil: !!m.accFauteuil, accCanne: !!m.accCanne, useCommon: !!m.useCommon, deposeHab: m.deposeHab || "", armes: (Array.isArray(m.armes) ? m.armes : (m.arme && m.arme !== "indifferent" ? [m.arme] : [])).filter((k) => ARMES.some((x) => x.key === k)), tir: { zones: tz } }; }
const nettoiePts = (l) => Array.isArray(l) ? l.filter((d) => d && isFinite(d.gx) && isFinite(d.gy)).slice(0, 40).map((d) => ({ id: String(d.id || ""), nom: String(d.nom || "").slice(0, 40), gx: Number(d.gx), gy: Number(d.gy) })) : [];
// --- Suggestions tirees des journees passees (2 occurrences minimum) ---
const SUGG_MIN = 2;
// Nombre de journees ou chaque personne a conduit.
function histoConducteurs(journees) {
  const n = {};
  (journees || []).forEach((j) => {
    const vus = {};
    Object.keys(j.voitures || {}).forEach((tid) => ((j.voitures[tid]) || []).forEach((v) => { if (v && v.conducteurId) vus[v.conducteurId] = true; }));
    Object.keys(vus).forEach((id) => { n[id] = (n[id] || 0) + 1; });
  });
  return n;
}
// Pour chaque mirador, le point de depose le plus souvent utilise par celui qui y etait poste.
function histoDeposes(journees, terrainId) {
  const cpt = {};
  (journees || []).filter((j) => j.terrainId === terrainId).forEach((j) => {
    Object.keys(j.placements || {}).forEach((tid) => {
      const pl = j.placements[tid] || {};
      const tp = ((j.transport || {})[tid]) || {};
      const vv = ((j.voitures || {})[tid]) || [];
      Object.keys(pl).forEach((hid) => {
        const mid = pl[hid]; if (!mid) return;
        let d = (tp[hid] || {}).deposeId || "";
        if (!d) {
          const v = vv.find((x) => x.conducteurId === hid || (tp[hid] || {}).voitureId === x.id);
          d = v ? (v.deposeId || "") : "";
        }
        if (!d) return;
        cpt[mid] = cpt[mid] || {};
        cpt[mid][d] = (cpt[mid][d] || 0) + 1;
      });
    });
  });
  const out = {};
  Object.keys(cpt).forEach((mid) => {
    let best = "", n = 0;
    Object.keys(cpt[mid]).forEach((d) => { if (cpt[mid][d] > n) { n = cpt[mid][d]; best = d; } });
    if (n >= SUGG_MIN) out[mid] = { deposeId: best, n };
  });
  return out;
}
// Historique des chefs de ligne sur un territoire : qui a ete chef, et quel poste allait a qui.
function histoChefs(journees, terrainId, journeeId) {
  const nChef = {}, parMir = {}; const tailles = [];
  (journees || []).filter((j) => j.terrainId === terrainId && j.id !== journeeId).forEach((j) => {
    const ch = j.chefs || [];
    ch.forEach((id) => { nChef[id] = (nChef[id] || 0) + 1; });
    if (ch.length) tailles.push(ch.length);
    const cl = j.chefLignes || {};
    Object.keys(cl).forEach((mid) => {
      const c = cl[mid]; if (!c) return;
      parMir[mid] = parMir[mid] || {};
      parMir[mid][c] = (parMir[mid][c] || 0) + 1;
    });
  });
  const nbLignes = tailles.length ? Math.round(tailles.reduce((a, b) => a + b, 0) / tailles.length) : 0;
  return { nChef, parMir, nbLignes };
}
// Le chef qui revient le plus souvent sur un poste donne.
function chefHabituel(stats, filtre) {
  let best = "", n = 0;
  Object.keys(stats || {}).forEach((c) => { if (filtre && !filtre(c)) return; if (stats[c] > n) { n = stats[c]; best = c; } });
  return best;
}
// --- Secteurs d'un territoire ---
// Deux bois eloignes ne tiennent pas sur une seule capture lisible : chacun a la sienne.
// Pas de limite pratique : on borne seulement pour qu un carnet abime ne fasse pas boucler l app.
const MAX_SECTEURS = 50;
function secteurDe(terrain, track) {
  const l = (terrain && terrain.secteurs) || [];
  if (!l.length) return null;
  return l.find((s) => s.id === (track && track.secteurId)) || l[0];
}
function imageDe(terrain, track) { const s = secteurDe(terrain, track); return (s && s.image) || null; }
function aUneImage(terrain) { return ((terrain && terrain.secteurs) || []).some((s) => s && s.image); }
function normTrack(t, i) { return { id: t.id || `trk-${i}`, name: t.name || `Traque ${i + 1}`, secteurId: t.secteurId || "", color: t.color || "#dc2626", crop: t.crop || { ...FULL_CROP }, zone: Array.isArray(t.zone) ? t.zone.filter((p) => p && isFinite(p.gx) && isFinite(p.gy)).slice(0, 60) : [], zoneFermee: !!t.zoneFermee, deposes: nettoiePts(t.deposes), departs: nettoiePts(t.departs), miradors: (t.miradors || []).map(normMirador) }; }
function normTerrain(t) { const tracks = (t.tracks || []).map(normTrack); let cc = Array.isArray(t.consignesCommunes) ? t.consignesCommunes.map((c) => ({ id: c.id || ("cc-" + Math.random().toString(36).slice(2, 8)), text: c.text || "", miradorIds: Array.isArray(c.miradorIds) ? c.miradorIds : [] })) : []; if (!cc.length && (t.consigneCommune || "").trim()) { const ids = []; tracks.forEach((tr) => tr.miradors.forEach((m) => { if (m.useCommon) ids.push(m.id); })); cc = [{ id: "cc-legacy", text: t.consigneCommune, miradorIds: ids }]; }   // Un territoire peut porter plusieurs secteurs, chacun avec sa propre capture.
  // Les territoires d'avant la v2.8 n'ont qu'une image : elle devient le premier secteur.
  const bornerZone = (z) => {
    if (!z || !isFinite(z.x) || !isFinite(z.y) || !isFinite(z.w) || !isFinite(z.h)) return null;
    return { x: Math.max(0, Math.min(100, +z.x)), y: Math.max(0, Math.min(100, +z.y)), w: Math.max(4, Math.min(100, +z.w)), h: Math.max(4, Math.min(100, +z.h)) };
  };
  let secteurs = Array.isArray(t.secteurs) ? t.secteurs.filter((s) => s && s.id).slice(0, MAX_SECTEURS)
    .map((s, k) => ({ id: s.id, nom: String(s.nom || `Secteur ${k + 1}`).slice(0, 30), image: s.image || null, zone: bornerZone(s.zone), geo: (s.geo && isFinite(s.geo.x1)) ? s.geo : null })) : [];
  if (!secteurs.length) secteurs = [{ id: "sec-1", nom: "Secteur 1", image: t.planImage || null }];
  const idsSec = secteurs.map((s) => s.id);
  tracks.forEach((tr) => { if (idsSec.indexOf(tr.secteurId) < 0) tr.secteurId = secteurs[0].id; });
  return { id: t.id, name: t.name || "Territoire", vueEnsemble: t.vueEnsemble || null, vueGeo: (t.vueGeo && isFinite(t.vueGeo.x1)) ? t.vueGeo : null, secteurs, tracks, planChasse: normPlan(t.planChasse), consignesCommunes: cc, imageCouverture: (typeof t.imageCouverture === "string" && (t.imageCouverture.indexOf("data:image") === 0 || t.imageCouverture.indexOf("cdcimg:") === 0)) ? t.imageCouverture : null }; }
function nomKey(s) { const p = (s || "").trim().split(/\s+/); return p.length > 1 ? p.slice(1).join(" ") : (s || ""); }
function byNom(a, b) { return nomKey(a).localeCompare(nomKey(b), "fr", { sensitivity: "base" }) || (a || "").localeCompare(b || "", "fr", { sensitivity: "base" }); }
function splitFullName(full) { const parts = (full || "").trim().split(/\s+/).filter(Boolean); if (!parts.length) return { prenom: "", nom: "" }; if (parts.length === 1) return { prenom: parts[0], nom: "" }; return { prenom: parts[0], nom: parts.slice(1).join(" ") }; }
function formatPhone(raw) { let d = (raw || "").replace(/\D/g, ""); if (d.length > 10 && d.slice(0, 2) === "33") d = "0" + d.slice(2); if (d.length === 9 && (d[0] === "6" || d[0] === "7")) d = "0" + d; d = d.slice(0, 10); return d.replace(/(\d{2})(?=\d)/g, "$1 ").trim(); }
function fixPhone(raw) { const s = (raw || "").trim(); if (!s) return s; return formatPhone(s); }
function isValidFrPhone(raw) { const d = (raw || "").replace(/\D/g, ""); if (!d) return true; return d.length === 10 && (d.slice(0, 2) === "06" || d.slice(0, 2) === "07"); }
const ARMES = [{ key: "rayee", label: "Rayée", short: "R", emoji: "🎯" }, { key: "lisse", label: "Lisse", short: "L", emoji: "🔫" }, { key: "arc", label: "Arc", short: "A", emoji: "🏹" }];
function armeLabel(k) { const f = ARMES.find((a) => a.key === k); return f ? f.label : ""; }
function armeShort(k) { const f = ARMES.find((a) => a.key === k); return f ? f.short : ""; }
function armesList(m) { if (Array.isArray(m && m.armes)) return m.armes; const a = m && m.arme; if (!a || a === "indifferent") return []; return [a]; }
function armeOk(armes, hunterArme) { const list = Array.isArray(armes) ? armes : []; if (!list.length) return true; if (!hunterArme) return true; if (list.indexOf(hunterArme) >= 0) return true; if (hunterArme === "rayee" && list.indexOf("lisse") >= 0) return true; return false; }

// ---------- Tirage au sort des postes ----------
// En mode tirage, chaque chasseur tire un carton le matin. L'app prepare a l'avance un numero
// par chasseur present (hors chasseurs places a la main) : le n°7 a un poste dans CHAQUE traque.
// Les numeros sont des "chasseurs virtuels" (id "num-7") ranges dans journee.placements comme les autres :
// cartes, impressions et page des chasseurs fonctionnent sans changement.
const NUM_ID = (n) => "num-" + n;
const numDe = (id) => (typeof id === "string" && id.indexOf("num-") === 0) ? (parseInt(id.slice(4), 10) || 0) : 0;
function normTirage(t) {
  t = t || {};
  return { actif: !!t.actif, algo: t.algo === "complet" ? "complet" : "equi", reserves: Array.isArray(t.reserves) ? t.reserves : [], nb: Math.max(0, parseInt(t.nb, 10) || 0), noms: (t.noms && typeof t.noms === "object") ? t.noms : {}, note: String(t.note || ""), publie: !!t.publie, manques: Array.isArray(t.manques) ? t.manques : [] };
}
function tirageActif(j) { const t = j && j.tirage; return !!(t && t.actif); }

// ---------- Fusils au rabat ----------
// Dans certaines chasses, des fusils rabattent dans certaines traques au lieu d'etre postes.
// journee.rabat = { trackId: { chasseurId: true } } ; un fusil au rabat n'a pas de poste dans cette traque.
// journee.rabatRegle = { regle: "nombre" | "alterne", nb: { trackId: n }, jamais: [ids], arme: "" | "avec" | "sans" }
function normRabat(r) {
  const o = {};
  if (r && typeof r === "object") Object.keys(r).forEach((tid) => { const t = r[tid]; if (!t || typeof t !== "object") return; const m = {}; Object.keys(t).forEach((hid) => { if (t[hid]) m[hid] = true; }); o[tid] = m; });
  return o;
}
function normRabatRegle(r) {
  r = r || {};
  const nb = {}; if (r.nb && typeof r.nb === "object") Object.keys(r.nb).forEach((tid) => { nb[tid] = Math.max(0, parseInt(r.nb[tid], 10) || 0); });
  return { regle: r.regle === "alterne" ? "alterne" : "nombre", nb, jamais: Array.isArray(r.jamais) ? r.jamais.filter((x) => typeof x === "string") : [], arme: r.arme === "avec" || r.arme === "sans" ? r.arme : "" };
}
// Repartition au rabat, a tour de role : personne ne rabat deux fois avant que tous aient rabattu une fois.
function calculerRabat(ids, trackIds, regle, nb) {
  const melange = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[k]; a[k] = t; } return a; };
  const res = {}; trackIds.forEach((tid) => { res[tid] = {}; });
  if (regle === "alterne") {
    melange(ids).forEach((id, i) => trackIds.forEach((tid, k) => { if (i % 2 === k % 2) res[tid][id] = true; }));
    return res;
  }
  const cpt = {}; ids.forEach((id) => { cpt[id] = 0; });
  trackIds.forEach((tid) => {
    const n = Math.min(Math.max(0, parseInt((nb || {})[tid], 10) || 0), ids.length);
    melange(ids).sort((a, b) => cpt[a] - cpt[b]).slice(0, n).forEach((id) => { res[tid][id] = true; cpt[id]++; });
  });
  return res;
}
// Liste des participants + les numeros du tirage. avecNoms : ajoute le nom note apres le tirage (impressions de l'organisateur).
function participantsDuJour(participants, j, avecNoms) {
  const t = normTirage(j && j.tirage);
  if (!t.actif || !t.nb) return participants;
  const extra = [];
  for (let n = 1; n <= t.nb; n++) {
    const hid = t.noms[n]; const p = (avecNoms && hid) ? participants.find((x) => x.id === hid) : null;
    extra.push({ id: NUM_ID(n), name: "N°" + n + (p ? " · " + (p.name || "") : ""), nom: "N°" + n, prenom: p ? (p.name || "") : "", role: "chasseur", numero: n });
  }
  return participants.concat(extra);
}
// Tri : les noms d'abord (ordre alphabetique), puis les numeros dans l'ordre 1, 2, 3…
function triAvecNumeros(a, b, triNoms) {
  const na = a.numero || 0, nb = b.numero || 0;
  if (na || nb) return (na ? 1 : 0) - (nb ? 1 : 0) || na - nb;
  return triNoms(a, b);
}
// Repartition au hasard des postes.
//   personnes : [{ id, arme, mobility }]
//   traques   : [{ id, postes: [miradors], pris: { mid: true }, deja: { pid: mid } }]
//   algo      : "equi" (les bons postes sont partages sur la journee) | "complet" (pur hasard)
//   armes     : true = respecter l'arme du jour ; histo : { pid: [priorites deja obtenues ailleurs] }
// Priorite 1 = meilleur poste. Les postes de priorite 1 sont utilises en premier.
function repartirAuHasard(personnes, traques, algo, armes, histo) {
  const melange = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[k]; a[k] = t; } return a; };
  const prio = (m) => Number(m.priority) || 1;
  const hist = {}; personnes.forEach((p) => { hist[p.id] = ((histo && histo[p.id]) || []).slice(); });
  const moyenne = (pid) => { const l = hist[pid]; return l.length ? l.reduce((s, x) => s + x, 0) / l.length : null; };
  const ok = (p, m) => {
    if (p.mobility === "fauteuil" && !m.accFauteuil) return false;
    if (p.mobility === "canne" && !(m.accCanne || m.accFauteuil)) return false;
    return !armes || armeOk(armesList(m), p.arme);
  };
  const placements = {}, manques = [];
  traques.forEach((t) => {
    const res = {}; const pris = { ...(t.pris || {}) };
    const aPlacer = personnes.filter((p) => !(t.deja || {})[p.id] && !(t.exclus || {})[p.id]);
    // Postes libres, du meilleur au moins bon (hasard entre postes de meme priorite).
    const libres = melange((t.postes || []).filter((m) => !pris[m.id])).sort((a, b) => prio(a) - prio(b));
    let reserve = libres.slice(0, aPlacer.length);   // on n'utilise que les N meilleurs postes
    // Ordre de passage : les personnes contraintes (fauteuil, canne) d'abord, puis
    // equilibre = ceux qui ont eu les moins bons postes jusqu'ici choisissent en premier.
    const contraintes = (p) => (p.mobility === "fauteuil" ? 0 : p.mobility === "canne" ? 1 : 2);
    const moyNeutre = (() => { const v = aPlacer.map((p) => moyenne(p.id)).filter((x) => x != null); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : 0; })();
    const ordre = melange(aPlacer).sort((a, b) => {
      const c = contraintes(a) - contraintes(b); if (c) return c;
      if (algo !== "equi") return 0;
      const ma = moyenne(a.id), mb = moyenne(b.id);
      return (mb == null ? moyNeutre : mb) - (ma == null ? moyNeutre : ma);
    });
    ordre.forEach((p) => {
      let cands = reserve.filter((m) => ok(p, m));
      if (!cands.length) cands = libres.filter((m) => !pris[m.id] && ok(p, m));   // aucun des meilleurs ne convient : un autre poste libre
      if (!cands.length) { manques.push({ pid: p.id, trackId: t.id }); return; }
      const choix = algo === "equi" ? cands[0] : cands[Math.floor(Math.random() * cands.length)];
      res[p.id] = choix.id; pris[choix.id] = true; reserve = reserve.filter((m) => m.id !== choix.id);
      hist[p.id].push(prio(choix));
    });
    placements[t.id] = res;
  });
  return { placements, manques };
}
// En mode equilibre, on fait plusieurs essais et on garde le plus juste
// (le moins d'ecart entre le meilleur et le moins bon total de la journee).
function meilleureRepartition(personnes, traques, algo, armes, histo) {
  if (algo !== "equi") return repartirAuHasard(personnes, traques, algo, armes, histo);
  const prioDe = {}; traques.forEach((t) => (t.postes || []).forEach((m) => { prioDe[m.id] = Number(m.priority) || 1; }));
  let best = null, bestNote = Infinity;
  for (let essai = 0; essai < 60; essai++) {
    const r = repartirAuHasard(personnes, traques, algo, armes, histo);
    const tot = personnes.map((p) => { const l = ((histo && histo[p.id]) || []).slice(); traques.forEach((t) => { const mid = (r.placements[t.id] || {})[p.id]; if (mid) l.push(prioDe[mid]); }); return l.length ? l.reduce((s, x) => s + x, 0) / l.length : 0; });
    const note = r.manques.length * 1000 + (tot.length ? Math.max(...tot) - Math.min(...tot) : 0);
    if (note < bestNote) { bestNote = note; best = r; }
  }
  // Finition : on echange deux personnes d'une meme traque si cela rend la journee plus juste.
  const posteDe = {}; traques.forEach((t) => (t.postes || []).forEach((m) => { posteDe[m.id] = m; }));
  const ok = (p, m) => !(p.mobility === "fauteuil" && !m.accFauteuil) && !(p.mobility === "canne" && !(m.accCanne || m.accFauteuil)) && (!armes || armeOk(armesList(m), p.arme));
  const somme = {}, nbre = {};
  personnes.forEach((p) => { const l = (histo && histo[p.id]) || []; somme[p.id] = l.reduce((s, x) => s + x, 0); nbre[p.id] = l.length; });
  traques.forEach((t) => Object.entries(best.placements[t.id] || {}).forEach(([pid, mid]) => { somme[pid] += prioDe[mid]; nbre[pid]++; }));
  const moy = (pid) => (nbre[pid] ? somme[pid] / nbre[pid] : 0);
  const parId = {}; personnes.forEach((p) => { parId[p.id] = p; });
  for (let it = 0; it < 400; it++) {
    const t = traques[Math.floor(Math.random() * traques.length)];
    const pl = best.placements[t.id] || {}; const ids = Object.keys(pl).filter((pid) => parId[pid] && !(t.deja || {})[pid]);
    if (ids.length < 2) continue;
    const a = ids[Math.floor(Math.random() * ids.length)], b = ids[Math.floor(Math.random() * ids.length)];
    if (a === b || prioDe[pl[a]] === prioDe[pl[b]]) continue;
    if (!ok(parId[a], posteDe[pl[b]]) || !ok(parId[b], posteDe[pl[a]])) continue;
    const d = prioDe[pl[b]] - prioDe[pl[a]];
    const avant = Math.pow(moy(a) - moy(b), 2);
    const apres = Math.pow((somme[a] + d) / nbre[a] - (somme[b] - d) / nbre[b], 2);
    if (apres < avant) { const x = pl[a]; pl[a] = pl[b]; pl[b] = x; somme[a] += d; somme[b] -= d; }
  }
  return best;
}
function armesLabel(armes) { const list = Array.isArray(armes) ? armes : []; if (!list.length) return "toutes armes"; return list.map(armeLabel).join(" / "); }
function foldName(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); }
function levDist(a, b) { a = a || ""; b = b || ""; const m = a.length, n = b.length; if (!m) return n; if (!n) return m; const d = []; for (let i = 0; i <= m; i++) d[i] = [i]; for (let j = 0; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) { const c = a[i - 1] === b[j - 1] ? 0 : 1; d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c); } return d[m][n]; }
function normParticipant(p) { let prenom = p.prenom, nom = p.nom; if (prenom == null && nom == null) { const sp = splitFullName(p.name); prenom = sp.prenom; nom = sp.nom; } prenom = prenom || ""; nom = nom || ""; const name = (prenom + " " + nom).trim() || p.name || ""; return { id: p.id, prenom, nom, name, phone: fixPhone(p.phone || ""), email: p.email || "", permis: p.permis || "", validation: p.validation || "", assurance: p.assurance || "", participe: !!p.participe, invitation: !!p.invitation, role: p.role || null, mobility: p.mobility || null, arme: p.arme || null, places: Math.max(1, Math.min(9, Number(p.places) || 4)), vehicule: String(p.vehicule || "").slice(0, 24), dupIgnore: Array.isArray(p.dupIgnore) ? p.dupIgnore : [], groupes: Array.isArray(p.groupes) ? p.groupes.filter((g) => typeof g === "string" && g.trim()).slice(0, 20) : [], diner: { vient: !!(p.diner && p.diner.vient), invitesSupplementaires: Number(p.diner && p.diner.invitesSupplementaires) || 0 } }; }
function normSafety(s) { if (!s) return DEFAULT_SAFETY; return { consignes: Array.isArray(s.consignes) && s.consignes.length ? s.consignes : DEFAULT_SAFETY.consignes, sonneries: Array.isArray(s.sonneries) && s.sonneries.length ? s.sonneries : DEFAULT_SAFETY.sonneries }; }

function seasonOf(dateStr) { const d = new Date(dateStr); if (isNaN(d)) return "—"; const y = d.getFullYear(); return (d.getMonth() >= 6) ? (y + "-" + (y + 1)) : ((y - 1) + "-" + y); }
const ESPECES = [
  { key: "chevreuil", label: "Chevreuil", emoji: "🦌" },
  { key: "sanglier", label: "Sanglier", emoji: "🐗" },
  { key: "cerf", label: "Cerf indifférencié", emoji: "🦌" },
  { key: "cerf_c1", label: "Cerf C1", emoji: "🦌" },
  { key: "cerf_c2", label: "Cerf C2", emoji: "🦌" },
  { key: "biche", label: "Biche", emoji: "🦌" },
  { key: "faon", label: "Faon", emoji: "🦌" },
  { key: "cerf_jcb", label: "JCB (jeune cerf biche)", emoji: "🦌" },
  { key: "daim", label: "Daim", emoji: "🦌" },
  { key: "lievre", label: "Lièvre d'Europe", emoji: "🐇" },
  { key: "renard", label: "Renard", emoji: "🦊" },
  { key: "faisan", label: "Faisan commun", emoji: "🐓" },
  { key: "faisan_venere", label: "Faisan vénéré", emoji: "🐓" },
  { key: "perdrix_grise", label: "Perdrix grise", emoji: "🐦" },
  { key: "perdrix_rouge", label: "Perdrix rouge", emoji: "🐦" },
  { key: "caille", label: "Caille des blés", emoji: "🐦" },
  { key: "becasse", label: "Bécasse des bois", emoji: "🐦" },
  { key: "merle", label: "Merle noir", emoji: "🐦" },
  { key: "grive", label: "Grive", emoji: "🐦" },
  { key: "pigeon", label: "Pigeon", emoji: "🕊️" },
  { key: "alouette", label: "Alouette des champs", emoji: "🐦" },
  { key: "canard_colvert", label: "Colvert", emoji: "🦆" },
  { key: "canard_souchet", label: "Souchet", emoji: "🦆" },
  { key: "canard_pilet", label: "Pilet", emoji: "🦆" },
  { key: "canard_siffleur", label: "Siffleur", emoji: "🦆" },
  { key: "canard_chipeau", label: "Chipeau", emoji: "🦆" },
  { key: "sarcelle_hiver", label: "Sarcelle d'hiver", emoji: "🦆" },
  { key: "sarcelle_ete", label: "Sarcelle d'été", emoji: "🦆" },
  { key: "fuligule_milouin", label: "Fuligule milouin", emoji: "🦆" },
  { key: "fuligule_morillon", label: "Fuligule morillon", emoji: "🦆" },
  { key: "foulque", label: "Foulque macroule", emoji: "🦆" },
  { key: "becassine", label: "Bécassine des marais", emoji: "🦆" },
  { key: "oie", label: "Oie cendrée", emoji: "🦆" },
  { key: "autre", label: "Autre", emoji: "🐾" }
];
const FAMILLES = [
  { groupe: "Grand gibier", key: "f_chevreuil", label: "Chevreuil", emoji: "🦌", sous: ["chevreuil"] },
  { groupe: "Grand gibier", key: "f_sanglier", label: "Sanglier", emoji: "🐗", sous: ["sanglier"] },
  { groupe: "Grand gibier", key: "f_cerf", label: "Cerf", emoji: "🦌", sous: ["cerf", "cerf_c1", "cerf_c2", "cerf_jcb", "biche", "faon"] },
  { groupe: "Grand gibier", key: "f_daim", label: "Daim", emoji: "🦌", sous: ["daim"] },
  { groupe: "Petit gibier", key: "f_lievre", label: "Lièvre d'Europe", emoji: "🐇", sous: ["lievre"] },
  { groupe: "Petit gibier", key: "f_renard", label: "Renard", emoji: "🦊", sous: ["renard"] },
  { groupe: "Petit gibier", key: "f_faisan", label: "Faisan", emoji: "🐓", sous: ["faisan", "faisan_venere"] },
  { groupe: "Petit gibier", key: "f_perdrix", label: "Perdrix", emoji: "🐦", sous: ["perdrix_grise", "perdrix_rouge"] },
  { groupe: "Petit gibier", key: "f_caille", label: "Caille des blés", emoji: "🐦", sous: ["caille"] },
  { groupe: "Petit gibier", key: "f_becasse", label: "Bécasse des bois", emoji: "🐦", sous: ["becasse"] },
  { groupe: "Petit gibier", key: "f_merle", label: "Merle noir", emoji: "🐦", sous: ["merle"] },
  { groupe: "Petit gibier", key: "f_grive", label: "Grive", emoji: "🐦", sous: ["grive"] },
  { groupe: "Petit gibier", key: "f_pigeon", label: "Pigeon", emoji: "🕊️", sous: ["pigeon"] },
  { groupe: "Petit gibier", key: "f_alouette", label: "Alouette des champs", emoji: "🐦", sous: ["alouette"] },
  { groupe: "Gibier d'eau", key: "f_canard", label: "Canard", emoji: "🦆", sous: ["canard_colvert", "canard_souchet", "canard_pilet", "canard_siffleur", "canard_chipeau"] },
  { groupe: "Gibier d'eau", key: "f_sarcelle", label: "Sarcelle", emoji: "🦆", sous: ["sarcelle_hiver", "sarcelle_ete"] },
  { groupe: "Gibier d'eau", key: "f_fuligule", label: "Fuligule", emoji: "🦆", sous: ["fuligule_milouin", "fuligule_morillon"] },
  { groupe: "Gibier d'eau", key: "f_foulque", label: "Foulque macroule", emoji: "🦆", sous: ["foulque"] },
  { groupe: "Gibier d'eau", key: "f_becassine", label: "Bécassine des marais", emoji: "🦆", sous: ["becassine"] },
  { groupe: "Gibier d'eau", key: "f_oie", label: "Oie cendrée", emoji: "🦆", sous: ["oie"] }
];
function especeOf(k) { return ESPECES.find((e) => e.key === k) || { key: k, label: k, emoji: "🐾" }; }
const APP_VERSION = "v4.39";
const PLAN_KEYS = ESPECES.filter((e) => e.key !== "autre").map((e) => e.key);
function normPlan(pc) { pc = pc || {}; const out = {}; PLAN_KEYS.forEach((k) => { const d = pc[k] || {}; const defEnabled = (k === "chevreuil" || k === "sanglier" || k === "renard"); out[k] = { enabled: pc[k] ? !!d.enabled : defEnabled, mode: d.mode || (k === "chevreuil" ? "bracelets" : "proportionnel"), target: Number(d.target) || 0 }; }); return out; }
function especeLabel(e) { if (e.espece === "autre") return e.especeLabel || "Autre"; const f = ESPECES.find((x) => x.key === e.espece); return f ? f.label : e.espece; }
function especeEmoji(esp) { const f = ESPECES.find((x) => x.key === esp); return f ? f.emoji : "🐾"; }

// ---------- Utils ----------
const PHOTO_CHUNK = 30000;
const yn = (b) => (b ? "oui" : "non");
const isYes = (v) => String(v).trim().toLowerCase() === "oui";
function excelDate(v) { if (v == null || v === "") return new Date().toISOString().slice(0, 10); if (typeof v === "number") { try { const d = XLSX.SSF.parse_date_code(v); if (d) return `${d.y}-${String(d.m).padStart(2, "0")}-${String(d.d).padStart(2, "0")}`; } catch {} } return String(v).slice(0, 10); }
function chunkStr(s) { const out = []; for (let i = 0; i < s.length; i += PHOTO_CHUNK) out.push(s.slice(i, i + PHOTO_CHUNK)); return out; }
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
function dataUrlToFile(dataUrl, name) { const parts = dataUrl.split(","); const mime = (parts[0].match(/:(.*?);/) || [])[1] || "image/jpeg"; const bin = atob(parts[1]); const arr = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i); return new File([arr], name, { type: mime }); }
function waPhone(phone) { let d = String(phone || "").replace(/[^\d]/g, ""); if (d.length === 10 && d.startsWith("0")) d = "33" + d.slice(1); return d; }

function downscaleImage(file, maxDim = 1500, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => { const img = new Image(); img.onload = () => { try { let { width, height } = img; if (width > maxDim || height > maxDim) { const r = Math.min(maxDim / width, maxDim / height); width = Math.round(width * r); height = Math.round(height * r); } const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height; canvas.getContext("2d").drawImage(img, 0, 0, width, height); resolve(canvas.toDataURL("image/jpeg", quality)); } catch { reject(new Error("Traitement de l'image impossible")); } }; img.onerror = () => reject(new Error("Image illisible (format non supporté ?)")); img.src = reader.result; };
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.readAsDataURL(file);
  });
}

// PDF / Word
let pdfPromise = null;
function loadPdfJs() { if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib); if (pdfPromise) return pdfPromise; pdfPromise = new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"; s.onload = () => { try { window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; res(window.pdfjsLib); } catch (e) { rej(e); } }; s.onerror = () => rej(new Error("Lecteur PDF indisponible (connexion ?)")); document.head.appendChild(s); }); return pdfPromise; }
async function extractPdfText(data) { const lib = await loadPdfJs(); const pdf = await lib.getDocument({ data }).promise; const lines = []; for (let p = 1; p <= pdf.numPages; p++) { const page = await pdf.getPage(p); const content = await page.getTextContent(); const rows = {}; content.items.forEach((it) => { const y = Math.round(it.transform[5]); (rows[y] = rows[y] || []).push(it); }); Object.keys(rows).map(Number).sort((a, b) => b - a).forEach((y) => { lines.push(rows[y].sort((a, b) => a.transform[4] - b.transform[4]).map((i) => i.str).join(" ")); }); } return lines.join("\n"); }
async function extractDocxText(arrayBuffer) { const r = await mammoth.extractRawText({ arrayBuffer }); return r.value || ""; }
function parseGuestList(text) {
  const out = [];
  text.split(/\r?\n/).map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean).forEach((l) => {
    const em = l.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    const email = em ? em[0] : "";
    let rest = em ? l.replace(em[0], " ") : l;
    const pm = rest.match(/(\+?\d[\d .\-]{7,}\d)/);
    const phone = pm ? pm[1].replace(/[ .\-]/g, "") : "";
    let name = (pm ? rest.replace(pm[1], " ") : rest).replace(/[:;,|\t]+/g, " ").replace(/\s+/g, " ").replace(/[:;,\-]+$/, "").trim();
    if (name && !/[a-zA-ZÀ-ÿ]/.test(name)) name = "";
    if (/^(liste|invit|nom\b|pr[ée]nom|adresse|t[ée]l|email|e-mail|date|convives?|d[îi]ner|membres?)/i.test(name)) return;
    if (name.length > 60) name = name.slice(0, 60);
    if (!name && !email && !phone) return;
    if (!name && (email || phone)) return; // ligne orpheline (email/tel sans nom) : ignorée
    out.push({ name, phone, email });
  });
  return out;
}
function extractRowsFromExcel(arrayBuffer) {
  const wb = XLSX.read(arrayBuffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, { defval: "" });
}
function parseVCards(text) {
  const out = [];
  const raw = String(text || "").replace(/\r\n[ \t]/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = raw.split(/BEGIN:VCARD/i).slice(1);
  const decode = (v, params) => {
    let s = String(v || "");
    const p = (params || "").toUpperCase();
    if (p.indexOf("ENCODING=QUOTED-PRINTABLE") >= 0) { s = s.replace(/=\n/g, "").replace(/=([0-9A-F]{2})/gi, (m, h) => String.fromCharCode(parseInt(h, 16))); try { s = decodeURIComponent(escape(s)); } catch (e) {} }
    return s.replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\n/gi, " ").trim();
  };
  blocks.forEach((blk) => {
    const body = blk.split(/END:VCARD/i)[0];
    let prenom = "", nom = "", fullName = "", phone = "", email = "";
    body.split("\n").forEach((line) => {
      if (!line.trim()) return;
      const idx = line.indexOf(":"); if (idx < 0) return;
      const left = line.slice(0, idx), value = line.slice(idx + 1);
      const parts = left.split(";"); const key = (parts[0] || "").toUpperCase().replace(/^ITEM\d+\./, "");
      const params = parts.slice(1).join(";");
      const val = decode(value, params);
      if (key === "N" && !nom && !prenom) { const seg = val.split(";"); nom = (seg[0] || "").trim(); prenom = (seg[1] || "").trim(); }
      else if (key === "FN" && !fullName) fullName = val;
      else if (key === "TEL" && !phone) phone = val;
      else if (key === "EMAIL" && !email) email = val;
    });
    if (!prenom && !nom && fullName) { const sp = splitFullName(fullName); prenom = sp.prenom; nom = sp.nom; }
    const name = (prenom + " " + nom).trim() || fullName;
    if (!name && !phone && !email) return;
    out.push({ name, prenom, nom, phone, email, permis: "", validation: "", assurance: "", role: "chasseur", mobility: null });
  });
  return out;
}
function rowsToGuests(rows) {
  if (!rows.length) return [];
  const headers = Object.keys(rows[0]);
  const findCol = (matchers, exclude) => headers.find((h) => { const hn = String(h).toLowerCase().trim(); if (exclude && exclude.some((e) => hn.includes(e))) return false; return matchers.some((m) => hn.includes(m)); });
  const cPrenom = findCol(["prénom", "prenom"]);
  const cNom = findCol(["nom"], ["prénom", "prenom"]);
  const cTel = findCol(["tél", "tel", "phone", "portable", "mobile", "gsm", "numéro", "numero"]);
  const cMail = findCol(["mail", "courriel"]);
  const cPermis = findCol(["permis"]);
  const cValid = findCol(["validation", "valid"]);
  const cAssur = findCol(["assurance", "assur"]);
  const cRole = findCol(["rôle", "role"]);
  const cMob = findCol(["mobilité", "mobilite", "mobil"]);
  const g = (r, c) => (c ? String(r[c] == null ? "" : r[c]).trim() : "");
  const out = [];
  rows.forEach((r) => {
    let name = "";
    if (cPrenom || cNom) name = [g(r, cPrenom), g(r, cNom)].filter(Boolean).join(" ").trim();
    if (!name) { const first = headers.length ? g(r, headers[0]) : ""; if (/[a-zA-ZÀ-ÿ]/.test(first)) name = first; }
    const prenom = cPrenom ? g(r, cPrenom) : "";
    const nom = cNom ? g(r, cNom) : "";
    const email = g(r, cMail);
    let phone = g(r, cTel); if (phone) phone = phone.replace(/[ .\-]/g, "");
    const mobRaw = g(r, cMob).toLowerCase();
    const mobility = mobRaw.indexOf("fauteuil") >= 0 ? "fauteuil" : (mobRaw.indexOf("canne") >= 0 ? "canne" : null);
    const roleRaw = g(r, cRole).toLowerCase();
    const role = roleRaw.indexOf("rabatteur") >= 0 ? "rabatteur" : "chasseur";
    if (!name && !email && !phone) return;
    out.push({ name, prenom, nom, phone, email, permis: g(r, cPermis), validation: g(r, cValid), assurance: g(r, cAssur), role, mobility });
  });
  return out;
}

// Image de partage (traque recadrée, poste en évidence)
// Carte d'une traque pour l'impression : meme cadrage que dans l'application,
// postes numerotes comme dans le tableau. Une simple image, rien a charger au moment d'imprimer.
// Numero d'un poste : celui ecrit dans son nom (« Poste 7 - Mirador » -> 7),
// sinon son rang dans la liste. Meme regle pour le tableau et pour la carte.
function numeroPoste(m, i) {
  const t = String((m && m.label) || "").match(/\d+/);
  return t ? String(parseInt(t[0], 10)) : String(i + 1);
}
