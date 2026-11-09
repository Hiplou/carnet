const K = { participants: "cdb2:participants", journees: "cdb2:journees", terrainIndex: "cdb2:terrain-index", terrainPrefix: "cdb2:terrain:", imgPrefix: "cdb2:img:", mimgPrefix: "cdb2:mimg:", safety: "cdb2:safety", github: "cdb2:github", localAt: "cdb2:localAt", cloudAt: "cdb2:cloudAt" };
const DEFAULT_FACTEUR = "https://battue-facteur.hippolyte-houdard.workers.dev/";
// Worker « battue-gps » (positions en direct), installe a part du facteur.
// Adresse workers.dev : le domaine carnetdechasse.fr n'est pas dans ce compte Cloudflare.
const GPS_URL = "https://battue-gps.hippolyte-houdard.workers.dev";
const DEFAULT_GITHUB = { token: "", owner: "Hiplou", repo: "battue", path: "index.html", fnUrl: DEFAULT_FACTEUR, orgName: "" };
const STORAGE_OK = typeof window !== "undefined" && window.storage && typeof window.storage.set === "function";

const SUPA_URL = "https://zbneklsactpgttkpzwiv.supabase.co";
const SUPA_KEY = "sb_publishable_2x46K_6vwJ4OjBODiCycGA_JXScarw9";
const SB = (typeof window !== "undefined" && window.supabase && window.supabase.createClient) ? window.supabase.createClient(SUPA_URL, SUPA_KEY) : null;

// ---------- Images rangees a part (Supabase Storage, dossier prive de chaque compte) ----------
// En memoire, l'app garde les images telles quelles (data:image/...) : rien ne change pour l'affichage,
// l'impression ou la publication. Seul l'enregistrement change : chaque image est envoyee UNE fois dans
// le stockage (nom = empreinte de son contenu), et le carnet n'envoie plus que "cdcimg:<empreinte>".
const IMG_BUCKET = "images", IMG_REF = "cdcimg:", IMG_MIN = 3000;
const IMGS = { hashDe: new Map(), ok: new Set(), enCours: new Map(), refuse: new Set(), ko: false, koMsg: "", essais: 0 };
const estImageData = (v) => typeof v === "string" && v.length > IMG_MIN && v.slice(0, 11) === "data:image/";
const estRefImage = (v) => typeof v === "string" && v.slice(0, IMG_REF.length) === IMG_REF;
// Parcourt tout le carnet et remplace certaines chaines ; ne recree que les branches modifiees.
function remplacerChaines(v, f) {
  if (typeof v === "string") { const r = f(v); return r === undefined ? v : r; }
  if (Array.isArray(v)) { let ch = false; const o = v.map((x) => { const y = remplacerChaines(x, f); if (y !== x) ch = true; return y; }); return ch ? o : v; }
  if (v && typeof v === "object") { let ch = false; const o = {}; Object.keys(v).forEach((k) => { const y = remplacerChaines(v[k], f); if (y !== v[k]) ch = true; o[k] = y; }); return ch ? o : v; }
  return v;
}
function listerChaines(v, test, acc) {
  if (typeof v === "string") { if (test(v)) acc.add(v); return acc; }
  if (Array.isArray(v)) { v.forEach((x) => listerChaines(x, test, acc)); return acc; }
  if (v && typeof v === "object") Object.keys(v).forEach((k) => listerChaines(v[k], test, acc));
  return acc;
}
async function empreinteImage(s) {
  if (IMGS.hashDe.has(s)) return IMGS.hashDe.get(s);
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  const h = Array.from(new Uint8Array(b)).slice(0, 16).map((x) => x.toString(16).padStart(2, "0")).join("");
  IMGS.hashDe.set(s, h); return h;
}
function dataUrlVersBlob(s) { const i = s.indexOf(","); const mime = (s.slice(5, i).split(";")[0]) || "image/jpeg"; const bin = atob(s.slice(i + 1)); const a = new Uint8Array(bin.length); for (let k = 0; k < bin.length; k++) a[k] = bin.charCodeAt(k); return new Blob([a], { type: mime }); }
function blobVersDataUrl(b) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error || new Error("lecture")); r.readAsDataURL(b); }); }
// Copie locale des images sur l'appareil (ouverture rapide, meme avec peu de reseau).
const IMG_CACHE = (() => {
  let p = null;
  const ouvrir = () => p || (p = new Promise((res, rej) => { try { const r = indexedDB.open("cdc-images", 1); r.onupgradeneeded = () => { try { r.result.createObjectStore("img"); } catch (e) {} }; r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }));
  return {
    async get(k) { try { const db = await ouvrir(); return await new Promise((res) => { const q = db.transaction("img").objectStore("img").get(k); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); }); } catch (e) { return null; } },
    async put(k, v) { try { const db = await ouvrir(); await new Promise((res) => { const t = db.transaction("img", "readwrite"); t.objectStore("img").put(v, k); t.oncomplete = () => res(); t.onerror = () => res(); t.onabort = () => res(); }); } catch (e) {} },
  };
})();
// Erreur "le stockage n'est pas installe" (seau absent, regles absentes) et non simple coupure reseau.
function erreurStockageInstallation(e) {
  const st = Number(e && (e.statusCode || e.status)) || 0;
  const m = String((e && (e.message || e.error)) || "");
  if (/load failed|failed to fetch|network|timeout|abort/i.test(m)) return false;
  return st === 400 || st === 401 || st === 403 || st === 404 || /bucket not found|row-level security|not found|unauthorized|policy/i.test(m);
}
async function envoyerImage(uid, h, s) {
  if (IMGS.ok.has(h)) return true;
  if (IMGS.enCours.has(h)) return IMGS.enCours.get(h);
  const pr = (async () => {
    // Deja dans la copie locale = deja envoyee lors d'une session precedente (reprise apres coupure).
    const loc = await IMG_CACHE.get(uid + "/" + h);
    if (loc) { IMGS.ok.add(h); return true; }
    const blob = dataUrlVersBlob(s);
    const { error } = await SB.storage.from(IMG_BUCKET).upload(uid + "/" + h, blob, { upsert: true, contentType: blob.type, cacheControl: "31536000" });
    if (error) { const st = Number(error.statusCode || error.status) || 0; if (st === 413 || /maximum allowed size|too large|mime type/i.test(String(error.message || ""))) { IMGS.refuse.add(h); throw error; } if (erreurStockageInstallation(error)) { IMGS.ko = true; IMGS.koMsg = String(error.message || error.error || "stockage indisponible"); } throw error; }
    IMGS.ok.add(h); IMG_CACHE.put(uid + "/" + h, s); return true;
  })();
  IMGS.enCours.set(h, pr);
  try { return await pr; } finally { IMGS.enCours.delete(h); }
}
async function chargerImage(uid, h) {
  const loc = await IMG_CACHE.get(uid + "/" + h);
  if (loc) { IMGS.hashDe.set(loc, h); IMGS.ok.add(h); return loc; }
  const { data, error } = await SB.storage.from(IMG_BUCKET).download(uid + "/" + h);
  if (error || !data) throw error || new Error("image absente");
  const s = await blobVersDataUrl(data);
  IMGS.hashDe.set(s, h); IMGS.ok.add(h); IMG_CACHE.put(uid + "/" + h, s);
  return s;
}
// A l'ouverture : chaque reference est remplacee par l'image (copie locale d'abord).
// Celles qu'on n'a pas pu obtenir restent en reference : elles ne sont jamais perdues.
async function resoudreImages(v, uid, enLigne) {
  const refs = Array.from(listerChaines(v, estRefImage, new Set()));
  if (!refs.length) return { v, manquantes: [] };
  const trouve = new Map();
  let i = 0;
  const travail = async () => { while (i < refs.length) { const r = refs[i++]; const h = r.slice(IMG_REF.length); IMGS.ok.add(h); try { const loc = await IMG_CACHE.get(uid + "/" + h); if (loc) { IMGS.hashDe.set(loc, h); trouve.set(r, loc); } else if (enLigne) trouve.set(r, await chargerImage(uid, h)); } catch (e) {} } };
  await Promise.all([travail(), travail(), travail(), travail()]);
  return { v: remplacerChaines(v, (s) => (estRefImage(s) && trouve.has(s)) ? trouve.get(s) : undefined), manquantes: refs.filter((r) => !trouve.has(r)) };
}
// A l'enregistrement : envoie les nouvelles images, puis remplace celles qui sont en ligne par leur reference.
async function preparerEnvoi(full, uid, onProgres) {
  const datas = Array.from(listerChaines(full, estImageData, new Set()));
  for (const s of datas) await empreinteImage(s);
  let echecs = 0, poidsEchecs = 0;
  if (!IMGS.ko) {
    const aEnvoyer = datas.filter((s) => { const h = IMGS.hashDe.get(s); return !IMGS.ok.has(h) && !IMGS.refuse.has(h); });
    let fait = 0, i = 0;
    if (aEnvoyer.length && onProgres) onProgres(0, aEnvoyer.length);
    const travail = async () => { while (i < aEnvoyer.length && !IMGS.ko) { const s = aEnvoyer[i++]; try { await envoyerImage(uid, IMGS.hashDe.get(s), s); } catch (e) { if (!IMGS.refuse.has(IMGS.hashDe.get(s))) { echecs++; poidsEchecs += s.length; } } fait++; if (onProgres) onProgres(fait, aEnvoyer.length); } };
    await Promise.all([travail(), travail(), travail()]);
    if (onProgres) onProgres(0, 0);
  }
  const payload = IMGS.ko ? full : remplacerChaines(full, (s) => { if (!estImageData(s)) return undefined; const h = IMGS.hashDe.get(s); return (h && IMGS.ok.has(h)) ? IMG_REF + h : undefined; });
  return { payload, echecs, poidsEchecs, total: datas.length };
}

// Retours des chasseurs (table feedbacks) fusionnes dans les journees. Fonction pure :
// rejouer les memes retours donne le meme resultat (balles, etat du poste, animaux remplaces).
// Version du carnet (colonne updated_at) en millisecondes, lue a la main : Safari (iPhone) ne sait pas
// toujours lire les dates de la base (6 chiffres apres la seconde, decalage horaire). Sans valeur : 0.
function versionMs(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:[.,](\d+))?\s*(Z|[+-]\d{2}(?::?\d{2})?)?$/i.exec(String(v || "").trim());
  if (!m) return 0;
  const ms = m[7] ? parseInt((m[7] + "00").slice(0, 3), 10) : 0;
  let t = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6], ms);
  const z = m[8] || "Z";
  if (z.toUpperCase() !== "Z") { const sg = z[0] === "-" ? -1 : 1; const hh = parseInt(z.slice(1, 3), 10) || 0; const mm = parseInt(z.replace(":", "").slice(3, 5), 10) || 0; t -= sg * (hh * 60 + mm) * 60000; }
  return t;
}
function memeVersion(a, b) { const x = versionMs(a), y = versionMs(b); return x === y || (!!a && a === b); }

function fusionnerRetours(journees, retours, participants) {
  const parts = participants || [];
  return journees.map((j0) => {
    const mes = retours.filter((f) => f.journee_id === j0.id);
    if (!mes.length) return j0;
    const j = { ...j0, shots: { ...(j0.shots || {}) }, miradorStates: { ...(j0.miradorStates || {}) }, tableau: (j0.tableau || []).slice() };
    const noms = normTirage(j0.tirage).noms;
    mes.forEach((f) => {
      j.shots[f.track_id] = { ...(j.shots[f.track_id] || {}), [f.mirador_id]: f.bullets };
      j.miradorStates[f.track_id] = { ...(j.miradorStates[f.track_id] || {}), [f.mirador_id]: { state: f.state || "", comment: f.comment || "", hunter: f.hunter || "", ts: f.ts } };
      let animals = f.animals; if (typeof animals === "string") { try { animals = JSON.parse(animals); } catch (e) { animals = null; } }
      if (animals && typeof animals === "object") {
        // Tirage au sort : le retour arrive au nom « N°7 » ; on le relie au chasseur note pour ce numero.
        const mN = /^N°(\d+)/.exec(String(f.hunter || ""));
        const hp = parts.find((p) => p.name === f.hunter);
        const tireurId = hp ? hp.id : (mN && noms[mN[1]] ? noms[mN[1]] : "");
        Object.keys(animals).forEach((esp) => {
          const qty = Math.max(0, Number(animals[esp]) || 0);
          for (let k = j.tableau.length - 1; k >= 0; k--) { const kk = j.tableau[k]; if (kk.source === "chasseur" && (kk.hunter ? kk.hunter === f.hunter : kk.tireurId === tireurId) && kk.trackId === f.track_id && kk.espece === esp) j.tableau.splice(k, 1); }
          for (let n = 0; n < qty; n++) j.tableau.push({ id: "k-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6) + "-" + n, espece: esp, especeLabel: "", quantite: 1, sexe: "", poids: "", bracelet: "", tireurId: tireurId, trackId: f.track_id, source: "chasseur", hunter: f.hunter || "" });
        });
      }
    });
    return j;
  });
}

function AuthScreen() {
  const [mode, setMode] = useState("in");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!SB) { setMsg("⚠ Connexion à la base impossible (internet ?)."); return; }
    setBusy(true); setMsg("");
    try {
      if (mode === "forgot") {
        if (!email.trim()) { setMsg("⚠ Entre ton email d'abord."); setBusy(false); return; }
        const { error } = await SB.auth.resetPasswordForEmail(email.trim(), { redirectTo: (typeof window !== "undefined" && window.location ? window.location.origin + window.location.pathname : "https://hiplou.github.io/carnet/") });
        if (error) throw error;
        setMsg("✓ Si un compte existe pour cet email, un lien de réinitialisation vient d'être envoyé. Regarde ta boîte mail (et les spams).");
      } else if (mode === "up") {
        const { error } = await SB.auth.signUp({ email: email.trim(), password: pass, options: { emailRedirectTo: (typeof window !== "undefined" && window.location ? window.location.origin + window.location.pathname : "https://hiplou.github.io/carnet/") } });
        if (error) throw error;
        setMsg("✓ Compte créé ! Va confirmer ton adresse dans l'email reçu, puis connecte-toi.");
        setMode("in");
      } else {
        const { error } = await SB.auth.signInWithPassword({ email: email.trim(), password: pass });
        if (error) throw error;
      }
    } catch (e) { setMsg("⚠ " + ((e && e.message) || e)); }
    setBusy(false);
  };
  const title = mode === "up" ? "Crée ton compte" : mode === "forgot" ? "Réinitialiser le mot de passe" : "Connecte-toi à ton carnet";
  const cta = busy ? "…" : mode === "up" ? "Créer mon compte" : mode === "forgot" ? "Envoyer le lien" : "Se connecter";

  // Connexion Google. Supabase rattache automatiquement le compte à celui qui
  // existe déjà si l'adresse email est la même : pas de carnet en double.
  const googleSignIn = async () => {
    setBusy(true); setMsg("");
    try {
      const { error } = await SB.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + window.location.pathname }
      });
      if (error) throw error;
    } catch (e) {
      setMsg("Connexion Google impossible : " + ((e && e.message) || e));
      setBusy(false);
    }
  };
  return (<div className="min-h-screen bg-stone-100 flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center gap-2 mb-1"><span className="text-3xl">🦌</span><h1 className="font-serif text-2xl text-stone-800">Carnet de Chasse</h1></div>
      <p className="text-sm text-stone-500 mb-5">{title}</p>
      <label className="text-xs uppercase tracking-wide text-stone-400">Email</label>
      <input type="email" inputMode="email" autoCapitalize="none" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 mb-3 mt-1 bg-white" placeholder="ton@email.fr" />
      {mode !== "forgot" && (<><label className="text-xs uppercase tracking-wide text-stone-400">Mot de passe</label>
      <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 mb-1 mt-1 bg-white" placeholder="••••••••" /></>)}
      {mode === "in" && <button onClick={() => { setMode("forgot"); setMsg(""); }} className="text-xs text-stone-500 hover:text-stone-700 underline mb-3 block">Mot de passe oublié ?</button>}
      <button onClick={submit} disabled={busy || !email || (mode !== "forgot" && !pass)} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg py-2.5 font-medium disabled:bg-stone-300 mt-2">{cta}</button>
      {mode !== "forgot" && (<>
        <div className="flex items-center gap-3 my-4">
          <span className="flex-1 h-px bg-stone-200" />
          <span className="text-[11px] uppercase tracking-wide text-stone-400">ou</span>
          <span className="flex-1 h-px bg-stone-200" />
        </div>
        <button onClick={googleSignIn} disabled={busy} className="w-full flex items-center justify-center gap-2.5 border border-stone-300 hover:bg-stone-50 disabled:opacity-50 rounded-lg py-2.5 font-medium text-stone-700 bg-white">
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.1z" />
            <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.750H4.3v5.7C7.9 40.9 15.4 46 24 46z" />
            <path fill="#FBBC05" d="M11.6 27.4c-.5-1.3-.7-2.7-.7-4.4s.3-3.1.7-4.4v-5.7H4.3C2.8 16 2 19.4 2 23s.8 7 2.3 10.1l7.3-5.7z" />
            <path fill="#EA4335" d="M24 9.5c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 2.9 30 1 24 1 15.4 1 7.9 6.1 4.3 13.5l7.3 5.7C13.3 13.4 18.2 9.5 24 9.5z" />
          </svg>
          Continuer avec Google
        </button>
      </>)}
      {msg && <p className="text-sm mt-3 text-stone-700 whitespace-pre-wrap">{msg}</p>}
      {mode === "forgot" ? <button onClick={() => { setMode("in"); setMsg(""); }} className="w-full text-sm text-emerald-800 mt-4 underline">← Retour à la connexion</button>
        : <button onClick={() => { setMode(mode === "up" ? "in" : "up"); setMsg(""); }} className="w-full text-sm text-emerald-800 mt-4 underline">{mode === "up" ? "J'ai déjà un compte" : "Pas encore de compte ? En créer un"}</button>}
    </div>
  </div>);
}

// Bandeau discret : prend le relais de la fenêtre à partir de la deuxième connexion.
// Toujours visible, jamais bloquant.
function InstallBandeau({ onOuvrir, onFermer }) {
  return (<div className="fixed left-0 right-0 z-40 px-3" style={{ bottom: "calc(10px + env(safe-area-inset-bottom))" }}>
    <div className="max-w-md mx-auto bg-stone-900 text-stone-50 rounded-xl shadow-lg flex items-center gap-3 pl-3 pr-2 py-2.5">
      <span className="w-9 h-9 rounded-lg bg-[#c4d6a8] flex items-center justify-center text-lg shrink-0">🦌</span>
      <button onClick={onOuvrir} className="flex-1 text-left min-w-0">
        <span className="block text-[13px] font-medium leading-tight">Mets l'app sur ton écran</span>
        <span className="block text-[11px] text-stone-400 leading-tight mt-0.5">Un toucher pour l'ouvrir, en plein écran</span>
      </button>
      <button onClick={onOuvrir} className="text-[12px] font-medium text-emerald-400 px-2 shrink-0">Voir</button>
      <button onClick={onFermer} className="text-stone-500 hover:text-stone-300 px-1.5 shrink-0" title="Masquer">✕</button>
    </div>
  </div>);
}

// ---------- Invitation à installer l'app ----------
// Proposée 3 minutes après la connexion, jamais si l'app est déjà installée.
function dejaInstallee() {
  try {
    if (window.navigator && window.navigator.standalone) return true;
    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
  } catch (e) {}
  return false;
}
function estApple() {
  try {
    const ua = navigator.userAgent || "";
    if (/iPad|iPhone|iPod/.test(ua)) return true;
    // iPadOS récent se déclare comme un Mac : on le reconnaît au tactile
    if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return true;
  } catch (e) {}
  return false;
}

function InstallModal({ onClose, onNePlusAfficher }) {
  const apple = estApple();
  return (<div className="fixed inset-0 z-[75] bg-stone-900/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div className="bg-stone-50 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[92vh] flex flex-col">
      <div className="bg-stone-900 text-stone-50 px-5 py-4 shrink-0 flex items-center gap-3">
        <span className="w-11 h-11 rounded-xl bg-[#c4d6a8] flex items-center justify-center text-xl shrink-0">🦌</span>
        <span>
          <h2 className="font-serif text-lg leading-tight">Mets Carnet de Chasse sur ton écran</h2>
          <p className="text-stone-400 text-[12px] mt-0.5">Un raccourci, comme une vraie application.</p>
        </span>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        <p className="text-sm text-stone-600">Tu l'ouvriras d'un toucher, en plein écran, sans passer par le navigateur.</p>

        {apple ? (<div className="space-y-2">
          <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex gap-3 items-center">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-sm text-stone-700 flex-1">Touche le bouton <b>Partager</b> en bas de Safari</span>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0a84ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M12 15V3" /><path d="m8 7 4-4 4 4" /><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
            </svg>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex gap-3 items-center">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-sm text-stone-700 flex-1">Fais défiler et choisis <b>Sur l'écran d'accueil</b></span>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#44403c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect x="3" y="3" width="18" height="18" rx="4" /><path d="M12 8v8" /><path d="M8 12h8" />
            </svg>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex gap-3 items-center">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">3</span>
            <span className="text-sm text-stone-700 flex-1">Touche <b>Ajouter</b> en haut à droite</span>
            <span className="text-[13px] font-medium text-[#0a84ff] shrink-0">Ajouter</span>
          </div>
          <p className="text-[11px] text-stone-400 text-center pt-1">Ces boutons se trouvent dans Safari, pas dans l'application.</p>
        </div>) : (<div className="space-y-2">
          <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex gap-3 items-center">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-sm text-stone-700 flex-1">Ouvre le menu <b>⋮</b> de ton navigateur</span>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex gap-3 items-center">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-sm text-stone-700 flex-1">Choisis <b>Installer l'application</b> ou <b>Ajouter à l'écran d'accueil</b></span>
          </div>
        </div>)}
      </div>

      <div className="border-t border-stone-200 p-4 shrink-0 bg-white space-y-2">
        <button onClick={onClose} className="w-full bg-emerald-800 hover:bg-emerald-900 text-stone-50 text-sm font-medium py-3 rounded-lg">J'ai compris</button>
        <button onClick={() => { onNePlusAfficher(); onClose(); }} className="w-full text-sm text-stone-500 py-2">Ne plus afficher</button>
      </div>
    </div>
  </div>);
}

// ---------- Fenêtre d'accueil ----------
// S'ouvre à chaque connexion tant que la case « ne plus afficher » n'est pas cochée.
// Le choix est rangé dans les réglages locaux : il vaut pour cet appareil.
// Sur un nouveau téléphone, l'accueil réapparaît une fois — ce qui est plutôt souhaitable.
function AccueilModal({ onClose, onNePlusAfficher }) {
  const [cache, setCache] = useState(false);
  const etapes = [
    { n: 1, emoji: "👥", t: "Tes membres", d: "Commence par saisir les chasseurs et rabatteurs de ta société. Tu peux importer un fichier Excel ou tes contacts." },
    { n: 2, emoji: "🗺️", t: "Ton territoire", d: "Crée un territoire, ajoute sa carte, dessine tes traques et pose tes miradors." },
    { n: 3, emoji: "📅", t: "Ta journée", d: "Choisis une date, invite tes membres, place les fusils, et envoie leurs postes aux chasseurs." }
  ];
  return (<div className="fixed inset-0 z-[70] bg-stone-900/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div className="bg-stone-50 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[92vh] flex flex-col">
      <div className="bg-stone-900 text-stone-50 px-5 py-4 shrink-0">
        <p className="text-2xl">🦌</p>
        <h2 className="font-serif text-xl mt-1">Bienvenue dans Carnet de Chasse</h2>
        <p className="text-stone-400 text-[13px] mt-1">Trois étapes pour organiser ta première battue.</p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2.5">
        {etapes.map((e) => (<div key={e.n} className="bg-white border border-stone-200 rounded-xl p-3.5 flex gap-3">
          <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">{e.n}</span>
          <span className="text-2xl shrink-0">{e.emoji}</span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-stone-800">{e.t}</span>
            <span className="block text-[12px] text-stone-500 mt-0.5 leading-snug">{e.d}</span>
          </span>
        </div>))}
        <p className="text-[12px] text-stone-500 text-center pt-1">Tu retrouveras le détail à tout moment dans ⚙️ Réglages puis Aide.</p>
      </div>

      <div className="border-t border-stone-200 p-4 shrink-0 bg-white">
        <label className="flex items-center gap-2.5 mb-3 cursor-pointer">
          <input type="checkbox" checked={cache} onChange={(e) => setCache(e.target.checked)} className="w-4 h-4 accent-emerald-700" />
          <span className="text-sm text-stone-600">Ne plus afficher ce message</span>
        </label>
        <button onClick={() => { if (cache) onNePlusAfficher(); onClose(); }} className="w-full bg-emerald-800 hover:bg-emerald-900 text-stone-50 text-sm font-medium py-3 rounded-lg">C'est parti</button>
      </div>
    </div>
  </div>);
}

function CarnetApp({ session, onSignOut }) {
  const [tab, setTab] = useState("journees");
  const [participants, setParticipants] = useState(initialParticipants);
  const [terrains, setTerrains] = useState(initialTerrains);
  const [journees, setJournees] = useState(initialJournees);
  const [safety, setSafety] = useState(DEFAULT_SAFETY);
  const [github, setGithub] = useState(DEFAULT_GITHUB);
  const [loaded, setLoaded] = useState(false);
  const [cloudOk, setCloudOk] = useState(true);
  const [showAccueil, setShowAccueil] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [showBandeau, setShowBandeau] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showPub, setShowPub] = useState(false);
  const [ghStatus, setGhStatus] = useState("idle");
  // Diagnostic de sauvegarde : raison exacte de l'echec et poids du carnet (les photos pesent lourd).
  const [saveErr, setSaveErr] = useState(null);
  const saveTaille = useRef(0);
  const [ghMsg, setGhMsg] = useState("");
  const [saveStatus, setSaveStatus] = useState(STORAGE_OK ? "idle" : "nostorage");
  const [dismissBanner, setDismissBanner] = useState(false);
  const saveTimeout = useRef(null); const skipDirty = useRef(true); const importFileRef = useRef(null);
  const ghTimer = useRef(null); const skipAuto = useRef(true); const localAtRef = useRef(0);
  const stateRef = useRef({});
  stateRef.current = { participants, terrains, journees, safety, github };
  // Deux appareils (iPhone + iPad) : on retient la version du carnet chargee ou enregistree par CET appareil.
  // Avant d'enregistrer, on verifie que personne ne l'a changee entre-temps ; sinon, conflit (rien n'est ecrase).
  const versionCloud = useRef(null);
  const modifSeq = useRef(0); const seqEnregistre = useRef(0);   // modifications faites / enregistrees
  const fbAEffacer = useRef([]);                                    // retours fusionnes, effaces apres enregistrement
  const sauterSave = useRef(false);
  const [conflit, setConflit] = useState(null);
  const conflitRef = useRef(null); conflitRef.current = conflit;
  const [infoMaj, setInfoMaj] = useState(false);
  // Un seul indicateur pour le témoin de la barre et le bandeau rouge
  const saveBad = !cloudOk || ghStatus === "error" || !!conflit;

  // Poids des données, pour la vignette Sauvegarde. Recalculé seulement quand
  // les Réglages sont ouverts : inutile de peser le carnet à chaque frappe.
  const poids = useMemo(() => {
    if (!showPub) return null;
    let photos = 0, nbPhotos = 0;
    const compter = (v) => {
      if (typeof v === "string") { if (v.slice(0, 11) === "data:image/") { photos += v.length; nbPhotos++; } return; }
      if (Array.isArray(v)) { v.forEach(compter); return; }
      if (v && typeof v === "object") { Object.keys(v).forEach((k) => compter(v[k])); }
    };
    const tout = { participants, terrains, journees, safety };
    compter(tout);
    let total = 0;
    try { total = JSON.stringify(tout).length; } catch (e) { total = 0; }
    return { total: total, photos: photos, nbPhotos: nbPhotos, texte: Math.max(0, total - photos), stockage: IMGS.ko ? "ko" : (IMGS.ok.size ? "ok" : "?"), koMsg: IMGS.koMsg };
  }, [showPub, participants, terrains, journees, safety, ghStatus]);

  // Met en place un carnet venu du serveur (au chargement, ou quand il a change sur un autre appareil).
  const appliquerCarnet = async (d) => {
    const uid = session.user.id;
      // Images rangees a part : on les remet dans le carnet (copie locale d'abord, sinon telechargement).
      let manquantes = [];
      try { const rs = await resoudreImages(d, uid, false); d = rs.v; manquantes = rs.manquantes; } catch (e) {}
      if (manquantes.length) {
        // Les images pas encore sur cet appareil arrivent en arriere-plan.
        (async () => {
          const rs = await resoudreImages({ refs: manquantes }, uid, true).catch(() => null);
          if (!rs) return;
          const m = new Map(); manquantes.forEach((r, k) => { const v = rs.v.refs[k]; if (v && v !== r) m.set(r, v); });
          if (!m.size) return;
          const f = (s) => (estRefImage(s) && m.has(s)) ? m.get(s) : undefined;
          setParticipants((p) => remplacerChaines(p, f)); setTerrains((p) => remplacerChaines(p, f)); setJournees((p) => remplacerChaines(p, f)); setSafety((p) => remplacerChaines(p, f));
        })();
      }
      setParticipants((d.participants || []).map(normParticipant));
      setTerrains((d.terrains || []).map(normTerrain));
      setJournees((d.journees || []).map(normJournee));
      setSafety(normSafety(d.safety || DEFAULT_SAFETY));
  };

  useEffect(() => {
    (async () => {
      try {
        const getLS = async (key, fb) => { try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : fb; } catch { return fb; } };
        const ghKey = K.github + ":" + session.user.id;
        const gh = await getLS(ghKey, null);
        setGithub({ ...DEFAULT_GITHUB, ...(gh || {}) });
        try { await window.storage.delete(K.github); } catch (e) {}
        const uid = session.user.id; const cacheKey = "cb_supa_" + uid;
        let d = null;
        if (SB) {
          try { const { data, error } = await SB.from("carnets").select("data, updated_at").eq("user_id", uid).maybeSingle(); if (error) throw error; if (data && data.data) d = data.data; versionCloud.current = data ? data.updated_at : null; setCloudOk(true); }
          catch (e) { setCloudOk(false); setGhMsg("⚠ Serveur injoignable — carnet en lecture seule, rien ne sera enregistré."); }
        } else { setCloudOk(false); }
        if (d) await appliquerCarnet(d);
        // On n'ouvre l'accueil qu'une fois le carnet chargé, pour ne pas
        // masquer un éventuel bandeau d'erreur.
        if (!(gh && gh.accueilVu)) setShowAccueil(true);
      } catch (e) { console.error(e); } finally { setLoaded(true); }
    })();
  }, []);

  // Une minute après l'arrivée, si l'app n'est pas déjà installée
  // et si l'invitation n'a pas été refusée définitivement.
  const installVuRef = useRef(false); installVuRef.current = !!github.installVu;
  useEffect(() => {
    if (!loaded || !cloudOk) return;
    if (dejaInstallee() || github.installVu) return;
    // Première connexion : la fenêtre, une minute après l'arrivée.
    // Les suivantes : un simple bandeau, qui n'interrompt rien.
    if (!github.installProposee) {
      const t = setTimeout(() => {
        if (installVuRef.current) return;
        setShowInstall(true);
        setGithub((g) => ({ ...g, installProposee: true }));
      }, 60 * 1000);
      return () => clearTimeout(t);
    }
    setShowBandeau(true);
  }, [loaded, cloudOk, github.installVu, github.installProposee]);

  // Un seul enregistrement a la fois ; une demande pendant un envoi en relance un juste apres.
  const saveEnCours = useRef(null); const saveEncore = useRef(false);
  const [imgProg, setImgProg] = useState(null);
  const saveNow = async () => {
    if (saveEnCours.current) { saveEncore.current = true; return saveEnCours.current; }
    const pr = saveNowUnique();
    saveEnCours.current = pr;
    let r = false; try { r = await pr; } finally { saveEnCours.current = null; }
    if (saveEncore.current) { saveEncore.current = false; return saveNow(); }
    return r;
  };
  const saveNowUnique = async () => {
    if (!SB || !session) return false;
    if (!cloudOk) { setGhStatus("error"); setGhMsg("⚠ Sauvegarde bloquée : le carnet n'a pas pu être chargé. Recharge la page."); return false; }
    if (conflitRef.current) return false;
    setGhStatus("saving");
    const seq = modifSeq.current; const aEffacer = fbAEffacer.current.slice();
    try {
      const s = stateRef.current;
      const full = { version: 3, savedAt: Date.now(), participants: s.participants, terrains: s.terrains, journees: s.journees, safety: s.safety };
      const prep = await preparerEnvoi(full, session.user.id, (fait, total) => setImgProg(total ? { fait, total } : null));
      // Trop d'images pas encore parties : on n'envoie pas un carnet enorme, on reessaie (ce qui est parti est garde).
      // Apres 3 essais rates, on envoie quand meme (images restantes incluses) pour ne pas bloquer le texte.
      if (prep.echecs && prep.poidsEchecs > 2e6 && !IMGS.ko && IMGS.essais < 3) { IMGS.essais++; const err = new Error("Envoi des images incomplet : " + prep.echecs + " restante(s) sur " + prep.total + ". Celles déjà envoyées sont gardées."); err.images = true; throw err; }
      const payload = { ...prep.payload, version: IMGS.ko ? 3 : 4 };
      let taille = 0; try { taille = JSON.stringify(payload).length; } catch (e) {}
      saveTaille.current = taille;
      // Le carnet a-t-il ete enregistre par un autre appareil depuis notre dernier chargement ?
      const vr = await SB.from("carnets").select("updated_at").eq("user_id", session.user.id).maybeSingle();
      if (vr.error) throw vr.error;
      const distant = vr.data ? vr.data.updated_at : null;
      if (distant && !memeVersion(distant, versionCloud.current)) { conflitRef.current = { distant }; setConflit({ distant }); setGhStatus("conflit"); return false; }
      const maintenant = new Date().toISOString();
      const { data: up, error } = await SB.from("carnets").upsert({ user_id: session.user.id, data: payload, updated_at: maintenant }).select("updated_at").maybeSingle();
      if (error) throw error;
      versionCloud.current = (up && up.updated_at) || maintenant;
      seqEnregistre.current = Math.max(seqEnregistre.current, seq);
      try { await window.storage.set("cb_supa_" + session.user.id, JSON.stringify(payload)); } catch (e) {}
      // Les retours des chasseurs sont dans le carnet enregistre : on peut les effacer du serveur.
      if (aEffacer.length) { try { await SB.from("feedbacks").delete().in("id", aEffacer); fbAEffacer.current = fbAEffacer.current.filter((id) => aEffacer.indexOf(id) < 0); } catch (e) {} }
      IMGS.essais = 0; setSaveErr(null); setGhStatus("saved"); return true;
    } catch (e) {
      const msg = (e && (e.message || e.error_description || e.hint)) || String(e || "erreur inconnue");
      setSaveErr({ msg: String(msg).slice(0, 200), code: (e && (e.code || e.status)) || "", taille: saveTaille.current, hors: typeof navigator !== "undefined" && navigator.onLine === false, images: !!(e && e.images), t: Date.now() });
      setGhStatus("error"); return false;
    }
  };

  // En cas d'echec, nouvel essai automatique toutes les 20 secondes (et des que la connexion revient).
  useEffect(() => {
    if (ghStatus !== "error" || !cloudOk) return;
    const t = setTimeout(() => { saveNow(); }, 20000);
    const enLigne = () => saveNow();
    window.addEventListener("online", enLigne);
    return () => { clearTimeout(t); window.removeEventListener("online", enLigne); };
  }, [ghStatus, saveErr, cloudOk]);
  // Sauvegarde automatique dans ton compte Supabase (debounce)
  useEffect(() => {
    if (!loaded) return;
    if (sauterSave.current) { sauterSave.current = false; return; }
    modifSeq.current++;
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => { saveNow(); }, 1500);
    return () => clearTimeout(saveTimeout.current);
  }, [participants, terrains, journees, safety, loaded]);

  // Au retour sur l'app : le carnet a-t-il change sur un autre appareil ?
  // Rien en attente ici : on recharge sans rien demander. Sinon : conflit, l'organisateur choisit.
  const verifEnCours = useRef(false);
  const rechargerDepuisCloud = async () => {
    const { data, error } = await SB.from("carnets").select("data, updated_at").eq("user_id", session.user.id).maybeSingle();
    if (error || !data || !data.data) throw error || new Error("carnet introuvable");
    clearTimeout(saveTimeout.current);
    sauterSave.current = true;
    await appliquerCarnet(data.data);
    versionCloud.current = data.updated_at;
    seqEnregistre.current = modifSeq.current;
    fbAEffacer.current = [];
    conflitRef.current = null; setConflit(null); setSaveErr(null); setGhStatus("saved");
  };
  const verifierAutreAppareil = async () => {
    if (!SB || !session || !cloudOk || conflitRef.current || verifEnCours.current) return;
    verifEnCours.current = true;
    try {
      const { data, error } = await SB.from("carnets").select("updated_at").eq("user_id", session.user.id).maybeSingle();
      if (error || !data || !data.updated_at) return;
      if (memeVersion(data.updated_at, versionCloud.current)) return;
      if (modifSeq.current > seqEnregistre.current || saveEnCours.current) { conflitRef.current = { distant: data.updated_at }; setConflit({ distant: data.updated_at }); setGhStatus("conflit"); return; }
      await rechargerDepuisCloud();
      setInfoMaj(true); setTimeout(() => setInfoMaj(false), 6000);
    } catch (e) {} finally { verifEnCours.current = false; }
  };
  const garderLesMiennes = () => { if (!conflitRef.current) return; versionCloud.current = conflitRef.current.distant; conflitRef.current = null; setConflit(null); setGhStatus("idle"); saveNow(); };
  const reprendreAutreAppareil = async () => { try { await rechargerDepuisCloud(); setInfoMaj(true); setTimeout(() => setInfoMaj(false), 6000); } catch (e) { setSaveErr({ msg: String((e && e.message) || e).slice(0, 200), code: "", taille: 0, hors: typeof navigator !== "undefined" && navigator.onLine === false, images: false, t: Date.now() }); } };

  // Retours des chasseurs (table feedbacks) : fusionnes dans le carnet, enregistres par l'envoi normal
  // (photos a part), puis effaces du serveur seulement quand cet enregistrement a reussi.
  const pullFeedback = async () => {
    if (!SB || !session || !cloudOk) return;
    await verifierAutreAppareil();
    if (conflitRef.current) return;
    try {
      const { data, error } = await SB.from("feedbacks").select("*").eq("user_id", session.user.id).order("ts", { ascending: true });
      if (error || !data || !data.length) return;
      const ids = {}; (stateRef.current.journees || []).forEach((j) => { ids[j.id] = true; });
      const neufs = data.filter((f) => ids[f.journee_id] && fbAEffacer.current.indexOf(f.id) < 0);
      if (!neufs.length) return;
      fbAEffacer.current = fbAEffacer.current.concat(neufs.map((f) => f.id));
      const parts = stateRef.current.participants || [];
      setJournees((prev) => fusionnerRetours(prev, neufs, parts));
    } catch (e) {}
  };
  const pullRef = useRef(null); pullRef.current = pullFeedback;
  useEffect(() => {
    if (!loaded) return;
    const iv = setInterval(() => { if (pullRef.current) pullRef.current(); }, 45000);
    const onFocus = () => { if (pullRef.current) pullRef.current(); };
    const onVis = () => { if (!document.hidden && pullRef.current) pullRef.current(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    if (pullRef.current) pullRef.current();
    return () => { clearInterval(iv); window.removeEventListener("focus", onFocus); document.removeEventListener("visibilitychange", onVis); };
  }, [loaded]);

  // Reglages GitHub (publication) gardes par appareil, en local
  useEffect(() => { if (!loaded || !session) return; try { window.storage.set(K.github + ":" + session.user.id, JSON.stringify(github)); } catch (e) {} }, [github, loaded]);

  const buildWorkbook = () => {
    const wb = XLSX.utils.book_new();
    const add = (rows, fb, name) => XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.length ? rows : [fb]), name);
    add(participants.map((p) => ({ Nom: p.name, Prénom_: p.prenom || "", Nom_: p.nom || "", Téléphone: p.phone || "", Participe: yn(p.participe), Invité: yn(p.invitation), Rôle: p.role || "", Arme: p.arme || "", Mobilité: p.mobility || "", Places: p.places || 4, Vehicule: p.vehicule || "", Dîner: yn(p.diner?.vient), Invités_sup: p.diner?.invitesSupplementaires || 0, id: p.id })), { Nom: "" }, "Participants");
    add(terrains.map((t) => ({ Territoire: t.name, Secteurs: (t.secteurs || []).map((s) => s.nom).join("|"), Zones: (t.secteurs || []).map((s) => s.zone ? [s.zone.x, s.zone.y, s.zone.w, s.zone.h].join(",") : "").join("|"), id: t.id })), { Territoire: "" }, "Territoires");
    const trk = []; terrains.forEach((t) => t.tracks.forEach((k) => trk.push({ Territoire: t.name, TerritoireId: t.id, Traque: k.name, TraqueId: k.id, SecteurId: k.secteurId || "", Couleur: k.color, crop_x: k.crop?.x ?? 0, crop_y: k.crop?.y ?? 0, crop_w: k.crop?.w ?? 100, crop_h: k.crop?.h ?? 100 })));
    add(trk, { Traque: "" }, "Traques");
    const mir = []; terrains.forEach((t) => t.tracks.forEach((k) => k.miradors.forEach((m) => mir.push({ Territoire: t.name, TerritoireId: t.id, Traque: k.name, TraqueId: k.id, Mirador: m.label, MiradorId: m.id, gx: m.gx, gy: m.gy, Priorite: m.priority || 1, Armes: armesList(m).join("|"), DeposeHab: m.deposeHab || "", Consignes: m.consignes || "" }))));
    add(mir, { Mirador: "" }, "Miradors");
    const tab = []; journees.forEach((j) => (j.tableau || []).forEach((k) => tab.push({ JourneeId: j.id, Date: j.date, Espece: k.espece, EspeceLibre: k.especeLabel || "", Quantite: k.quantite || 0, TireurId: k.tireurId || "" })));
    add(tab, { JourneeId: "" }, "Tableau");
    add(journees.map((j) => ({ Date: j.date, Territoire: terrains.find((t) => t.id === j.terrainId)?.name || "", TerritoireId: j.terrainId || "", id: j.id })), { Date: "" }, "Journées");
    const pl = []; journees.forEach((j) => Object.entries(j.placements || {}).forEach(([trackId, hunters]) => Object.entries(hunters).forEach(([hid, mid]) => { let tn = "", ml = mid; terrains.forEach((t) => t.tracks.forEach((k) => { if (k.id === trackId) { tn = k.name; const mm = k.miradors.find((x) => x.id === mid); if (mm) ml = mm.label; } })); pl.push({ JournéeId: j.id, Date: j.date, Traque: tn, TraqueId: trackId, Chasseur: participants.find((p) => p.id === hid)?.name || hid, ChasseurId: hid, Mirador: ml, MiradorId: mid }); })));
    add(pl, { Chasseur: "" }, "Placements");
    add(safety.consignes.map((c, i) => ({ Ordre: i, Consigne: c })), { Ordre: 0, Consigne: "" }, "Consignes");
    add(safety.sonneries.map((s, i) => ({ Ordre: i, Événement: s.evenement, Signal: s.signal })), { Ordre: 0, Événement: "", Signal: "" }, "Sonneries");
    const ph = []; terrains.forEach((t) => { (t.secteurs || []).forEach((sec, si) => { if (sec && sec.image) chunkStr(sec.image).forEach((d, i) => ph.push({ Kind: "plan", OwnerId: t.id, PhotoIndex: si, Chunk: i, Data: d })); }); if (t.vueEnsemble) chunkStr(t.vueEnsemble).forEach((d, i) => ph.push({ Kind: "vue", OwnerId: t.id, PhotoIndex: 0, Chunk: i, Data: d })); t.tracks.forEach((k) => k.miradors.forEach((m) => (m.photos || []).forEach((pht, pi) => chunkStr(pht).forEach((d, i) => ph.push({ Kind: "mirador", OwnerId: m.id, PhotoIndex: pi, Chunk: i, Data: d }))))); });
    add(ph, { Kind: "", OwnerId: "", PhotoIndex: 0, Chunk: 0, Data: "" }, "_Photos");
    return wb;
  };
  const exportJson = async () => {
    try {
      // Les images pas encore revenues sur cet appareil sont recuperees pour que le fichier soit complet.
      let contenu = { version: 2, participants, terrains, journees, safety };
      try { contenu = (await resoudreImages(contenu, session.user.id, true)).v; } catch (e) {}
      const blob = new Blob([JSON.stringify(contenu)], { type: "application/json" });
      const fname = `carnet-de-battue-${new Date().toISOString().slice(0, 10)}.json`;
      const file = new File([blob], fname, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: fname }); }
      else { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = fname; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    } catch (e) { if (e && e.name !== "AbortError") window.alert("Export impossible : " + (e.message || e)); }
  };
  const exportExcel = async () => {
    try {
      const wb = buildWorkbook(); const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const fname = `carnet-de-battue-${new Date().toISOString().slice(0, 10)}.xlsx`;
      const file = new File([blob], fname, { type: blob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: fname }); }
      else { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = fname; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
      setDirty(false);
    } catch (e) { if (e && e.name !== "AbortError") window.alert("Export impossible : " + (e.message || e)); }
  };

  const importFromWorkbook = (wb) => {
    const sh = (name) => (wb.Sheets[name] ? XLSX.utils.sheet_to_json(wb.Sheets[name]) : []);
    const P = sh("Participants"), T = sh("Territoires"), TRK = sh("Traques"), M = sh("Miradors"), J = sh("Journées"), PL = sh("Placements"), PH = sh("_Photos"), CO = sh("Consignes"), SO = sh("Sonneries");
    const photoMap = {}; PH.forEach((r) => { if (!r.Kind) return; const key = `${r.Kind}|${r.OwnerId}|${r.PhotoIndex || 0}`; (photoMap[key] = photoMap[key] || []).push({ c: Number(r.Chunk) || 0, d: String(r.Data || "") }); });
    const blob = (key) => (photoMap[key] ? photoMap[key].sort((a, b) => a.c - b.c).map((x) => x.d).join("") : null);
    const parts = P.filter((r) => r.Nom || r.Prénom || r.Prenom).map((r, i) => ({ id: r.id || `p-${Date.now()}-${i}`, name: [r.Prénom || r.Prenom, r.Nom].filter(Boolean).map((x) => String(x).trim()).join(" ").trim() || String(r.Nom || ""), phone: r.Téléphone ? String(r.Téléphone) : "", email: r.Email ? String(r.Email) : "", permis: r.Permis ? String(r.Permis) : "", validation: r.Validation ? String(r.Validation) : "", assurance: r.Assurance ? String(r.Assurance) : "", role: (function(){ var rr = String(r.Rôle || r.Role || "").toLowerCase(); return rr.indexOf("rab") >= 0 ? "rabatteur" : (rr ? "chasseur" : null); })(), mobility: (function(m){ m=String(r.Mobilité||r.Mobilite||"").toLowerCase(); return m.indexOf("fauteuil")>=0?"fauteuil":(m.indexOf("canne")>=0?"canne":null); })(), arme: (function(){ var a=String(r.Arme||"").toLowerCase(); return a.indexOf("ray")>=0?"rayee":(a.indexOf("liss")>=0?"lisse":(a.indexOf("arc")>=0?"arc":null)); })(), places: Number(r.Places)||4, vehicule: String(r.Vehicule||"").slice(0,24), prenom: r["Prénom_"]!=null?String(r["Prénom_"]):undefined, nom: r["Nom_"]!=null?String(r["Nom_"]):undefined }));
    const terrs = T.filter((r) => r.Territoire || r.id).map((r) => ({ id: r.id || `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: r.Territoire || "Territoire", vueEnsemble: blob(`vue|${r.id}|0`) || null, secteurs: (function () {
      const noms = String(r.Secteurs || "").split("|").map((x) => x.trim()).filter(Boolean);
      const out = [];
      for (let k = 0; k < MAX_SECTEURS; k++) {
        const img = blob(`plan|${r.id}|${k}`);
        if (k > 0 && !img && !noms[k]) continue;
        const zs = String(r.Zones || "").split("|")[k] || "";
        const zp = zs.split(",").map(Number);
        out.push({ id: k === 0 ? "sec-1" : `sec-${k + 1}`, nom: noms[k] || `Secteur ${k + 1}`, image: img || null,
          zone: zp.length === 4 && zp.every((v) => isFinite(v)) ? { x: zp[0], y: zp[1], w: zp[2], h: zp[3] } : null });
      }
      return out.length ? out : [{ id: "sec-1", nom: "Secteur 1", image: null }];
    })(), tracks: [] }));
    const terrById = Object.fromEntries(terrs.map((t) => [t.id, t]));
    TRK.filter((r) => r.TraqueId).forEach((r) => { const t = terrById[r.TerritoireId]; if (!t) return; t.tracks.push({ id: r.TraqueId, name: r.Traque || "Traque", secteurId: r.SecteurId || "", color: r.Couleur || "#dc2626", crop: { x: Number(r.crop_x) || 0, y: Number(r.crop_y) || 0, w: Number(r.crop_w) || 100, h: Number(r.crop_h) || 100 }, miradors: [] }); });
    const trkById = {}; terrs.forEach((t) => t.tracks.forEach((k) => { trkById[k.id] = k; }));
    M.filter((r) => r.MiradorId).forEach((r) => { const k = trkById[r.TraqueId]; if (!k) return; const photos = []; for (let pi = 0; ; pi++) { const b = blob(`mirador|${r.MiradorId}|${pi}`); if (!b) break; photos.push(b); } k.miradors.push({ id: r.MiradorId, label: r.Mirador || "Poste", gx: Number(r.gx) || 50, gy: Number(r.gy) || 50, priority: Number(r.Priorite) || 1, armes: String(r.Armes || r.Arme || "").split("|").map((x) => x.trim().toLowerCase()).filter((x) => x && x !== "indifferent"), deposeHab: r.DeposeHab ? String(r.DeposeHab) : "", consignes: r.Consignes || "", photos }); });
    terrs.forEach((t) => { if (!t.tracks.length) t.tracks.push({ id: `trk-${Date.now()}`, name: "Traque 1", color: "#dc2626", crop: { ...DEFAULT_CROP }, miradors: [] }); });
    const jours = J.filter((r) => r.Date || r.id).map((r, i) => ({ id: r.id || `j-${Date.now()}-${i}`, date: excelDate(r.Date), terrainId: r.TerritoireId || null, placements: {}, tableau: [] }));
    const jourById = Object.fromEntries(jours.map((j) => [j.id, j]));
    PL.forEach((r) => { const j = jourById[r.JournéeId]; if (!j || !r.TraqueId || !r.ChasseurId || !r.MiradorId) return; (j.placements[r.TraqueId] = j.placements[r.TraqueId] || {})[r.ChasseurId] = r.MiradorId; });
    (sh("Tableau") || []).forEach((r, i) => { const j = jourById[r.JourneeId]; if (!j || !r.Espece) return; j.tableau.push({ id: "k-imp-" + Date.now() + "-" + i, espece: String(r.Espece), especeLabel: r.EspeceLibre || "", quantite: Number(r.Quantite) || 0, tireurId: r.TireurId || "" }); });
    const consignes = CO.filter((r) => r.Consigne).sort((a, b) => (a.Ordre || 0) - (b.Ordre || 0)).map((r) => String(r.Consigne));
    const sonneries = SO.filter((r) => r.Événement || r.Signal).sort((a, b) => (a.Ordre || 0) - (b.Ordre || 0)).map((r) => ({ evenement: String(r.Événement || ""), signal: String(r.Signal || "") }));
    if (parts.length) setParticipants(parts.map(normParticipant));
    if (terrs.length) setTerrains(terrs.map(normTerrain));
    if (jours.length) setJournees(jours);
    setSafety(normSafety({ consignes, sonneries }));
  };
  const importFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      if (file.name.toLowerCase().endsWith(".json")) { const data = JSON.parse(await file.text()); if (data.participants) setParticipants(data.participants.map(normParticipant)); if (data.terrains) setTerrains(data.terrains.map(normTerrain)); if (data.journees) setJournees(data.journees.map(normJournee)); if (data.safety) setSafety(normSafety(data.safety)); }
      else { const wb = XLSX.read(await file.arrayBuffer(), { type: "array" }); importFromWorkbook(wb); }
      setDismissBanner(true); skipDirty.current = true; setDirty(false); window.alert("Sauvegarde importée ✔ (photos comprises).");
    } catch (ex) { window.alert("Import impossible : " + (ex.message || ex)); } finally { if (importFileRef.current) importFileRef.current.value = ""; }
  };
  const missingImages = terrains.some((t) => (t.tracks || []).some((k) => (k.miradors?.length > 0)) && !aUneImage(t));
  const tabs = [{ id: "journees", label: "Journées", icon: CalendarDays }, { id: "terrains", label: "Territoires", icon: MapPin }, { id: "carnet", label: "Carnet de chasse", icon: BookOpen }, { id: "participants", label: "Membres", icon: Users }, { id: "securite", label: "Sécurité", icon: Shield }];

  if (!loaded) return <div className="min-h-screen bg-stone-100 flex items-center justify-center text-stone-500 text-sm">Chargement du carnet…</div>;

  return (<div className="min-h-screen bg-stone-100">
    {showBandeau && !showInstall && !showAccueil && !showPub && <InstallBandeau onOuvrir={() => { setShowBandeau(false); setShowInstall(true); }} onFermer={() => setShowBandeau(false)} />}
    {showInstall && !showAccueil && <InstallModal onClose={() => setShowInstall(false)} onNePlusAfficher={() => setGithub((g) => ({ ...g, installVu: true }))} />}
    {showAccueil && <AccueilModal onClose={() => setShowAccueil(false)} onNePlusAfficher={() => setGithub((g) => ({ ...g, accueilVu: true }))} />}
    {showPub && <SettingsSheet onInstall={() => { setShowPub(false); setShowInstall(true); }} poids={poids} github={github} setGithub={setGithub} onClose={() => setShowPub(false)} session={session} onSignOut={onSignOut} onExportExcel={exportExcel} onExportJson={exportJson} onImportPick={() => importFileRef.current && importFileRef.current.click()} />}
    <input ref={importFileRef} type="file" accept=".xlsx,.json" onChange={importFile} className="hidden" />

    <header className="bg-stone-900 text-stone-50 px-4 py-3" style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top))" }}><div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0"><span className="text-2xl">🦌</span><h1 className="font-serif text-xl tracking-wide truncate">Carnet de Chasse</h1></div>
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex items-center gap-1.5" title={saveBad ? "Tes modifications ne sont pas enregistrées" : "Tout est enregistré"}>
          {saveBad ? <AlertTriangle size={16} className="text-red-400" /> : <Cloud size={16} className={ghStatus === "saving" ? "text-stone-400" : "text-emerald-400"} />}
          <span className={`text-[11px] ${saveBad ? "text-red-400" : ghStatus === "saving" ? "text-stone-400" : "text-emerald-400"}`}>{saveBad ? "Non enregistré" : ghStatus === "saving" ? (imgProg ? "Images " + imgProg.fait + "/" + imgProg.total : "Enregistrement…") : "Enregistré"}</span>
        </div>
        <button onClick={() => setShowPub(true)} className="p-2 -mr-1 rounded-lg hover:bg-stone-800" title="Réglages"><Settings size={21} /></button>
      </div>
    </div></header>

    {conflit && (<div className="bg-amber-100 border-b border-amber-300 text-amber-950 text-sm px-4 py-3"><div className="max-w-3xl mx-auto">
      <p className="flex items-start gap-2"><AlertTriangle size={17} className="shrink-0 mt-0.5" /><span><b>Carnet modifié sur un autre appareil.</b> Tes dernières modifications faites ici ne sont pas enregistrées, pour ne pas effacer celles de l'autre appareil. Que veux-tu garder ?</span></p>
      <div className="flex flex-wrap gap-2 mt-2.5">
        <button onClick={reprendreAutreAppareil} className="bg-amber-800 hover:bg-amber-900 text-white text-[13px] font-semibold rounded-lg px-3 py-2">Recharger la version de l'autre appareil</button>
        <button onClick={garderLesMiennes} className="bg-white border border-amber-400 text-amber-900 text-[13px] font-semibold rounded-lg px-3 py-2">Garder les miennes</button>
      </div>
      <p className="text-[11.5px] mt-1.5 text-amber-800">« Garder les miennes » remplace la version de l'autre appareil par celle de cet appareil.</p>
    </div></div>)}
    {infoMaj && !conflit && (<div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-sm px-4 py-2"><div className="max-w-3xl mx-auto">🔄 Carnet mis à jour : il avait été modifié sur un autre appareil.</div></div>)}
    {saveBad && !conflit && (<div className="bg-red-100 border-b border-red-300 text-red-900 text-sm px-4 py-2.5"><div className="max-w-3xl mx-auto flex items-start gap-2"><AlertTriangle size={17} className="shrink-0 mt-0.5" /><span className="flex-1">{!cloudOk ? <span><b>Carnet non chargé</b> — rien ne sera enregistré. Recharge la page.</span> : <span><b>Rien n'est enregistré.</b> {saveErr && saveErr.hors ? "Tu n'es pas connecté à Internet." : (saveErr && saveErr.images) ? "Les images partent une seule fois dans ton stockage : l'envoi n'est pas terminé (réseau faible ?). Ensuite, chaque enregistrement sera léger." : (saveErr && saveErr.taille > 12e6) ? "Ton carnet est devenu très lourd (surtout les photos) : l'envoi n'a pas abouti." : "Tes dernières modifications ne sont pas sauvegardées."} Ne ferme pas la page : nouvel essai automatique toutes les 20 secondes.
          {saveErr && <span className="block text-[11px] text-red-800 mt-1">Détail : {saveErr.code ? saveErr.code + " — " : ""}{saveErr.msg} · poids du carnet : {(saveErr.taille / 1e6).toFixed(1)} Mo</span>}</span>}</span>
        {cloudOk && <button onClick={() => saveNow()} disabled={ghStatus === "saving"} className="shrink-0 text-xs font-semibold bg-red-700 text-white rounded-md px-2.5 py-1 disabled:opacity-50">{ghStatus === "saving" ? "Envoi…" : "Réessayer"}</button>}</div></div>)}

    <nav className="bg-stone-800 px-4"><div className="max-w-3xl mx-auto flex gap-1 overflow-x-auto">{tabs.map(({ id, label, icon: Icon }) => (<button key={id} onClick={() => setTab(id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap ${tab === id ? "bg-stone-100 text-stone-900" : "text-stone-300 hover:text-stone-50"}`}><Icon size={15} /> {label}</button>))}</div></nav>

    <main className="max-w-3xl mx-auto px-4 py-5">
      {tab === "participants" && <ParticipantsView participants={participants} setParticipants={setParticipants} />}
      {tab === "terrains" && <TerrainsView terrains={terrains} setTerrains={setTerrains} journees={journees} github={github} />}
      {tab === "journees" && <JourneesView journees={journees} setJournees={setJournees} terrains={terrains} setTerrains={setTerrains} participants={participants} safety={safety} github={github} setGithub={setGithub} openSettings={() => setShowPub(true)} userId={session?.user?.id} orgEmail={session?.user?.email} />}
      {tab === "securite" && <SecurityView safety={safety} setSafety={setSafety} />}
      {tab === "carnet" && <CarnetView journees={journees} terrains={terrains} participants={participants} setJournees={setJournees} />}
    </main>
  </div>);
}

function UpdatePasswordScreen({ onDone }) {
  const [pass, setPass] = useState(""); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async () => {
    if ((pass || "").length < 6) { setMsg("⚠ Au moins 6 caractères."); return; }
    setBusy(true); setMsg("");
    try { const { error } = await SB.auth.updateUser({ password: pass }); if (error) throw error; setMsg("✓ Mot de passe mis à jour !"); setTimeout(onDone, 900); }
    catch (e) { setMsg("⚠ " + ((e && e.message) || e)); setBusy(false); }
  };
  return (<div className="min-h-screen bg-stone-100 flex items-center justify-center px-4 py-8"><div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
    <div className="flex items-center gap-2 mb-1"><span className="text-3xl">🦌</span><h1 className="font-serif text-xl text-stone-800">Nouveau mot de passe</h1></div>
    <p className="text-sm text-stone-500 mb-4">Choisis ton nouveau mot de passe.</p>
    <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 mb-3 bg-white" placeholder="••••••••" />
    <button onClick={submit} disabled={busy || !pass} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg py-2.5 font-medium disabled:bg-stone-300">{busy ? "…" : "Valider"}</button>
    {msg && <p className="text-sm mt-3 text-stone-700">{msg}</p>}
  </div></div>);
}

function CarnetDeBattue() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [recovery, setRecovery] = useState(false);
  useEffect(() => {
    if (!SB) { setReady(true); return; }
    SB.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); }).catch(() => setReady(true));
    const { data: sub } = SB.auth.onAuthStateChange((event, s) => { setSession(s); if (event === "PASSWORD_RECOVERY") setRecovery(true); });
    return () => { try { sub.subscription.unsubscribe(); } catch (e) {} };
  }, []);
  if (!ready) return <div className="min-h-screen bg-stone-100 flex items-center justify-center text-stone-500 text-sm">Chargement…</div>;
  if (!SB) return <div className="min-h-screen bg-stone-100 flex items-center justify-center text-red-700 text-sm px-6 text-center">Impossible de charger Supabase (connexion internet ?). Recharge la page.</div>;
  if (recovery && session) return <UpdatePasswordScreen onDone={() => setRecovery(false)} />;
  if (!session) return <AuthScreen />;
  return <CarnetApp key={session.user.id} session={session} onSignOut={() => SB.auth.signOut()} />;
}

class __ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: null, info: null }; }
  static getDerivedStateFromError(err) { return { err: err }; }
  componentDidCatch(err, info) { this.setState({ err: err, info: info }); try { console.error(err, info); } catch (e) {} }
  render() {
    if (this.state.err) {
      var msg = String((this.state.err && this.state.err.message) || this.state.err);
      var stack = (this.state.info && this.state.info.componentStack) ? String(this.state.info.componentStack).split("\n").slice(0, 6).join("\n") : "";
      return React.createElement("div", { style: { padding: 16, fontFamily: "-apple-system,sans-serif" } },
        React.createElement("div", { style: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 16 } },
          React.createElement("h2", { style: { margin: "0 0 8px", fontSize: 18, color: "#991b1b" } }, "⚠️ Une erreur est survenue"),
          React.createElement("p", { style: { margin: "0 0 10px", fontSize: 14, color: "#7f1d1d" } }, "Envoie cette information pour qu'on corrige :"),
          React.createElement("pre", { style: { background: "#fff", border: "1px solid #fecaca", borderRadius: 8, padding: 10, fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#b91c1c", margin: 0 } }, msg + (stack ? "\n\n" + stack : "")),
          React.createElement("button", { onClick: function () { location.reload(); }, style: { marginTop: 12, width: "100%", background: "#166534", color: "#fff", border: "none", borderRadius: 10, padding: 12, fontSize: 15, fontWeight: 700 } }, "Recharger l'application")
        )
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(<__ErrorBoundary><CarnetDeBattue /></__ErrorBoundary>);
