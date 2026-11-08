function TerritoryEditor({ initialTerrain, journees, onSave, onCancel, onDelete, onLiveCommit }) {
  const suggDep = useMemo(() => histoDeposes(journees, initialTerrain && initialTerrain.id), [journees, initialTerrain]);
  const [tid] = useState(initialTerrain?.id || `t-${Date.now()}`);
  const [name, setName] = useState(initialTerrain?.name || "");
  const [vueEnsemble, setVueEnsemble] = useState(initialTerrain?.vueEnsemble || null);
  const [vueGeo, setVueGeo] = useState(initialTerrain?.vueGeo || null);
  const [fondSec, setFondSec] = useState({ ortho: 100, plan: 0 });
  const [decoupe, setDecoupe] = useState("");
  const [secActif, setSecActif] = useState(null);
  const [secteurs, setSecteurs] = useState(() => {
    const l = initialTerrain && Array.isArray(initialTerrain.secteurs) ? initialTerrain.secteurs : null;
    if (l && l.length) return l.map((s, k) => ({ id: s.id, nom: s.nom || `Secteur ${k + 1}`, image: s.image || null, zone: s.zone || null, geo: s.geo || null }));
    return [{ id: "sec-1", nom: "Secteur 1", image: (initialTerrain && initialTerrain.planImage) || null }];
  });
  const [planChasse, setPlanChasse] = useState(normPlan(initialTerrain?.planChasse));
  const [tracks, setTracks] = useState(initialTerrain?.tracks?.length ? initialTerrain.tracks.map(normTrack) : [{ id: `trk-${Date.now()}`, name: "Traque 1", color: "#dc2626", crop: { ...DEFAULT_CROP }, miradors: [] }]);
  const [tab, setTab] = useState("plan");
  const [consignesCommunes, setConsignesCommunes] = useState(initialTerrain?.consignesCommunes || []);
  const firstRun = useRef(true);
  // Auto-enregistrement en direct : dès qu'on change photo / traque / mirador, on l'enregistre sans attendre le bouton
  useEffect(() => { if (firstRun.current) { firstRun.current = false; return; } onLiveCommit && onLiveCommit({ id: tid, name: name.trim() || "Territoire", vueEnsemble, vueGeo, secteurs, tracks, planChasse, consignesCommunes }); }, [name, vueEnsemble, vueGeo, secteurs, tracks, planChasse, consignesCommunes]);
  const updateTrack = (id, patch) => setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  // Un morceau du puzzle = une portion de la vue d'ensemble. Comme on connait ses bornes
  // geographiques, on redemande cette portion a l'IGN en pleine resolution.
  const decouperSecteur = async (id, fonds) => {
    if (!vueGeo) return;
    const sec = secteurs.find((x) => x.id === id); if (!sec || !sec.zone) return;
    const nbPostes = tracks.filter((t) => t.secteurId === id).reduce((n, t) => n + (t.miradors || []).length, 0);
    // Sans les bornes de l'ancienne carte, on ne sait pas ou etaient les postes : on previent.
    if (sec.image && nbPostes > 0 && !sec.geo && !window.confirm(`« ${sec.nom} » a déjà une carte avec ${nbPostes} poste(s) placé(s), mais l'app ne connaît pas la position de cette ancienne carte : les postes ne pourront pas être reportés et seront à replacer. Continuer ?`)) return;
    const z = sec.zone;
    const LX = vueGeo.x2 - vueGeo.x1, LY = vueGeo.y2 - vueGeo.y1;
    // En image, y descend ; en coordonnees projetees, y monte.
    const sw = { x: vueGeo.x1 + (z.x / 100) * LX, y: vueGeo.y2 - ((z.y + z.h) / 100) * LY };
    const ne = { x: vueGeo.x1 + ((z.x + z.w) / 100) * LX, y: vueGeo.y2 - (z.y / 100) * LY };
    setDecoupe(`Découpe de « ${sec.nom} » en cours…`);
    try {
      const data = await composeIgn(sw, ne, fonds || fondSec);
      const B = { x1: sw.x, y1: sw.y, x2: ne.x, y2: ne.y };
      setSecteurs((prev) => prev.map((x) => x.id === id ? { ...x, image: data, geo: B } : x));
      if (sec.geo && nbPostes > 0) {
        let perdus = 0;
        setTracks((prev) => prev.map((t) => {
          if (t.secteurId !== id) return t;
          const r = reporterTraque(t, sec.geo, B); perdus += r.perdus; return r.tr;
        }));
        setDecoupe(perdus > 0
          ? `« ${sec.nom} » mis à jour. ${nbPostes - perdus} poste(s) reporté(s), ${perdus} hors du nouveau cadrage — élargis le morceau pour les récupérer.`
          : `« ${sec.nom} » mis à jour. Les ${nbPostes} poste(s) ont suivi, rien à replacer.`);
      } else {
        setDecoupe(`« ${sec.nom} » mis à jour depuis l'IGN.`);
      }
    } catch (e) {
      setDecoupe("Découpe impossible : " + (e.message || e));
    }
  };

  const addTrack = () => { const id = `trk-${Date.now()}`; setTracks((prev) => [...prev, { id, name: `Traque ${prev.length + 1}`, secteurId: (secteurs[0] || {}).id || "sec-1", color: PALETTE[prev.length % PALETTE.length], crop: { ...DEFAULT_CROP }, miradors: [] }]); setTab(id); };
  // Suppression d'une traque en deux appuis (pas de fenetre du navigateur, qui peut etre bloquee).
  const [delArme, setDelArme] = useState(null);
  useEffect(() => { if (!delArme) return; const t = setTimeout(() => setDelArme(null), 4000); return () => clearTimeout(t); }, [delArme]);
  const deleteTrack = (id) => { if (tracks.length <= 1) return; setDelArme(null); setTracks((prev) => prev.filter((t) => t.id !== id)); if (tab === id) setTab("plan"); };
  const current = tracks.find((t) => t.id === tab);
  return (<SectionCard className="p-4 space-y-4">
    <div className="flex items-center justify-between"><button onClick={onCancel} className="flex items-center gap-1 text-sm text-stone-500"><ArrowLeft size={15} /> Retour</button>{initialTerrain && <button onClick={onDelete} className="flex items-center gap-1 text-xs text-red-700 hover:text-red-900"><Trash2 size={13} /> Supprimer le territoire</button>}</div>
    <div><label className="text-xs uppercase tracking-wide text-stone-400">Nom du territoire</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Bois de l'Île" className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1" /></div>
    <div className="flex flex-wrap gap-1 border-b border-stone-200 pb-2">
      <button onClick={() => setTab("chasse")} className={`px-3 py-1.5 text-sm font-medium rounded-md ${tab === "chasse" ? "bg-amber-800 text-stone-50" : "bg-stone-100 text-stone-600"}`}>🎯 Plan de chasse</button>
      <button onClick={() => setTab("plan")} className={`px-3 py-1.5 text-sm font-medium rounded-md ${tab === "plan" ? "bg-amber-800 text-stone-50" : "bg-stone-100 text-stone-600"}`}>🗺️ Cartes</button>
      {tracks.map((t) => (<button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-1.5 text-sm font-medium rounded-md ${tab === t.id ? "bg-emerald-800 text-stone-50" : "bg-stone-100 text-stone-600"}`}>{t.name}</button>))}
      <button onClick={addTrack} className="px-2.5 py-1.5 text-sm font-medium rounded-md bg-stone-100 text-amber-800 flex items-center gap-1"><Plus size={14} /> Traque</button>
    </div>
    {tab === "plan" ? (<div className="space-y-3">
      <p className="text-xs uppercase tracking-wide text-stone-400">Secteurs du territoire</p>
      <p className="text-[11px] text-stone-400 -mt-1.5">Un secteur = une capture de carte. Utilise-en plusieurs si tes bois sont trop éloignés pour tenir sur une seule image lisible.</p>

      <div className="border border-stone-200 rounded-lg p-2.5 bg-stone-50 space-y-2">
        <p className="text-[10px] uppercase tracking-wide text-stone-400">🧩 Vue d'ensemble</p>
        <p className="text-[11px] text-stone-500">Charge une capture large de tout le territoire, puis pose chaque secteur dessus. Touche un morceau pour ouvrir son secteur.</p>
        <PlanImagePicker image={vueEnsemble} geo={vueGeo} onChange={(img, geo) => {
          // Si l'ancienne et la nouvelle vue sont toutes deux situees, on reporte les morceaux du puzzle.
          if (vueGeo && geo && isFinite(geo.x1)) {
            const A = vueGeo, B = geo;
            setSecteurs((prev) => prev.map((s) => {
              if (!s.zone) return s;
              const a = reporterPoint(s.zone.x, s.zone.y, A, B);
              const b = reporterPoint(s.zone.x + s.zone.w, s.zone.y + s.zone.h, A, B);
              const bn = (v) => Math.max(0, Math.min(100, v));
              const x = Math.min(96, bn(a.gx)), y = Math.min(96, bn(a.gy)), x2 = bn(b.gx), y2 = bn(b.gy);
              return { ...s, zone: { x, y, w: Math.max(4, x2 - x), h: Math.max(4, y2 - y) } };
            }));
          }
          setVueEnsemble(img); setVueGeo(geo || null);
        }} />
        {vueEnsemble && !vueGeo && (<p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">L'app ne connaît pas la position de cette vue sur le terrain : soit elle a été importée, soit elle a été prise avant la v3.0. Elle ne peut donc pas découper les secteurs. Reprends-la avec « Choisir sur la carte IGN », puis réajuste tes morceaux sur la nouvelle image.</p>)}
        {vueEnsemble && (<>
          <PuzzleBox image={vueEnsemble} secteurs={secteurs} actifId={secActif}
            onSelect={(id) => setSecActif(id)}
            onZone={(id, z) => setSecteurs((prev) => prev.map((x) => x.id === id ? { ...x, zone: z } : x))}
            onZoneFin={(id) => decouperSecteur(id, fondSec)} />
          {vueGeo && (<div className="bg-white border border-stone-200 rounded-lg p-2 space-y-1.5">
            <p className="text-[11px] text-stone-500">Dès que tu lâches un morceau, sa carte est découpée à ce cadrage et chargée en pleine résolution.</p>
            <div className="flex gap-1.5">
              {[["🛰️ Satellite", { ortho: 100, plan: 0 }], ["Sat + Plan", { ortho: 100, plan: 55 }], ["🗺️ Plan IGN", { ortho: 0, plan: 100 }]].map(([lbl, v]) => (
                <button key={lbl} onClick={() => { setFondSec(v); if (secActif) decouperSecteur(secActif, v); }}
                  className={`flex-1 text-[11.5px] font-medium rounded-md py-2 border ${fondSec.ortho === v.ortho && fondSec.plan === v.plan ? "bg-stone-800 text-stone-50 border-stone-800" : "bg-white text-stone-600 border-stone-300"}`}>{lbl}</button>))}
            </div>
            {decoupe && <p className="text-[11px] text-stone-500 text-center">{decoupe}</p>}
          </div>)}
          {secteurs.filter((s) => !s.zone).length > 0 && (<div className="flex flex-wrap gap-2">
            {secteurs.filter((s) => !s.zone).map((s, k) => (<button key={s.id} onClick={() => {
              setSecteurs((prev) => prev.map((x) => x.id === s.id ? { ...x, zone: { x: 10 + (k % 3) * 12, y: 10 + (k % 3) * 12, w: 30, h: 30 } } : x));
              setSecActif(s.id);
            }} className="bg-white border border-dashed border-amber-700 text-amber-800 rounded-lg px-3 py-1.5 text-[12px] font-medium">Poser « {s.nom} »</button>))}
          </div>)}
          {secActif && (<button onClick={() => { setSecteurs((prev) => prev.map((x) => x.id === secActif ? { ...x, zone: null } : x)); setSecActif(null); }}
            className="w-full text-[12px] font-medium text-stone-600 bg-white border border-stone-300 rounded-lg py-2">Retirer ce morceau de la vue d'ensemble</button>)}
        </>)}
      </div>
      {secteurs.map((s, k) => {
        const nbTraques = tracks.filter((t) => t.secteurId === s.id).length;
        return (<div key={s.id} onClick={() => setSecActif(s.id)} className={`border rounded-lg p-2.5 bg-white space-y-2 ${secActif === s.id ? "border-amber-700 ring-1 ring-amber-700" : "border-stone-200"}`}>
          <div className="flex items-center gap-2">
            <input value={s.nom} onChange={(e) => setSecteurs((prev) => prev.map((x) => x.id === s.id ? { ...x, nom: e.target.value.slice(0, 30) } : x))}
              placeholder={`Secteur ${k + 1}`} className="flex-1 min-w-0 border border-stone-300 rounded px-2 py-1.5 text-sm bg-white font-medium" />
            {secteurs.length > 1 && (<button onClick={() => {
              if (nbTraques > 0) { alert(`Impossible : ${nbTraques} traque(s) utilisent ce secteur. Déplace-les d'abord.`); return; }
              if (!window.confirm(`Supprimer « ${s.nom} » et sa carte ?`)) return;
              setSecteurs((prev) => prev.filter((x) => x.id !== s.id));
            }} className="text-red-700 shrink-0 px-1.5" title="Supprimer ce secteur"><Trash2 size={15} /></button>)}
          </div>
          <PlanImagePicker image={s.image} geo={s.geo} onChange={(img, geo) => {
            const B = geo ? { x1: geo.x1, y1: geo.y1, x2: geo.x2, y2: geo.y2 } : null;
            const nb = tracks.filter((t) => t.secteurId === s.id).reduce((n, t) => n + (t.miradors || []).length, 0);
            if (s.geo && B && nb > 0) {
              let perdus = 0;
              setTracks((prev) => prev.map((t) => { if (t.secteurId !== s.id) return t; const r = reporterTraque(t, s.geo, B); perdus += r.perdus; return r.tr; }));
              setDecoupe(perdus > 0 ? `${nb - perdus} poste(s) reporté(s), ${perdus} hors cadrage.` : `Les ${nb} poste(s) ont suivi.`);
            }
            setSecteurs((prev) => prev.map((x) => x.id === s.id ? { ...x, image: img, geo: B } : x));
          }} />
          <p className="text-[10px] text-stone-400">{nbTraques === 0 ? "Aucune traque sur ce secteur." : `${nbTraques} traque(s) sur ce secteur.`}</p>
        </div>);
      })}
      <button onClick={() => setSecteurs((prev) => [...prev, { id: "sec-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), nom: `Secteur ${prev.length + 1}`, image: null }])}
        className="w-full border border-dashed border-stone-300 rounded-lg py-2.5 text-sm font-medium text-amber-800 bg-white">+ Ajouter un secteur</button>
    </div>)
      : tab === "chasse" ? (<PlanChasseEditor planChasse={planChasse} setPlanChasse={setPlanChasse} journees={journees} tid={tid} />)
      : current ? (<div className="space-y-3"><div className="flex justify-end items-center gap-2">{tracks.length <= 1
        ? <span className="text-[11px] text-stone-400">Dernière traque : elle ne peut pas être supprimée.</span>
        : delArme === current.id
          ? (<><span className="text-xs text-red-800">Supprimer « {current.name} » et ses {(current.miradors || []).length} poste(s) ?</span><button onClick={() => setDelArme(null)} className="text-xs text-stone-600 border border-stone-300 bg-white rounded px-2 py-1">Annuler</button><button onClick={() => deleteTrack(current.id)} className="text-xs font-semibold text-white bg-red-700 rounded px-2 py-1">Supprimer</button></>)
          : <button onClick={() => setDelArme(current.id)} className="flex items-center gap-1 text-xs text-red-700 hover:text-red-900"><Trash2 size={13} /> Supprimer cette traque</button>}</div><TrackEditor image={(secteurs.find((s) => s.id === current.secteurId) || secteurs[0] || {}).image || null} secteurs={secteurs} track={current} updateTrack={(patch) => updateTrack(current.id, patch)} consignesCommunes={consignesCommunes} setConsignesCommunes={setConsignesCommunes} suggDep={suggDep} /></div>) : null}
    <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200"><span className="text-xs text-emerald-700 flex items-center gap-1"><Check size={13} /> Enregistrement automatique</span><button onClick={() => onSave({ id: tid, name: name.trim() || "Territoire", vueEnsemble, vueGeo, secteurs, tracks, planChasse, consignesCommunes })} className="bg-emerald-800 hover:bg-emerald-900 text-stone-50 text-sm font-medium px-4 py-1.5 rounded-md">Terminé</button></div>
  </SectionCard>);
}

// ---------- Partage de territoire entre comptes ----------
// Copie indépendante : le destinataire reçoit un double qu'il modifie librement,
// sans que ses changements ne remontent chez l'expéditeur.
function nouvelId(prefixe) { return prefixe + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// Régénère tous les identifiants : sans ça, un territoire copié pourrait entrer
// en collision avec un territoire existant et mélanger les journées passées.
function copierTerritoire(t) {
  const nouveauxIds = {};
  const res = {
    id: nouvelId("t"),
    name: (t.name || "Territoire") + " (copie)",
    vueEnsemble: t.vueEnsemble || null,
    vueGeo: t.vueGeo || null,
    imageCouverture: t.imageCouverture || null,
    secteurs: (t.secteurs || []).map((s) => ({ ...s })),
    consignesCommunes: [],
    planChasse: t.planChasse || {},
    tracks: (t.tracks || []).map((tr) => ({
      id: nouvelId("tr"),
      name: tr.name || "Traque",
      color: tr.color || "#dc2626",
      crop: tr.crop || null,
      secteurId: tr.secteurId || "",
      zone: Array.isArray(tr.zone) ? tr.zone.map((p) => ({ gx: p.gx, gy: p.gy })) : [], zoneFermee: !!tr.zoneFermee, deposes: (tr.deposes || []).map((d) => ({ ...d })), departs: (tr.departs || []).map((d) => ({ ...d })),
      miradors: (tr.miradors || []).map((m) => { const id = nouvelId("m"); nouveauxIds[m.id] = id; return Object.assign({}, m, { id, useCommon: false }); })
    }))
  };
  // Les consignes communes suivent leurs postes (nouveaux identifiants).
  res.consignesCommunes = (t.consignesCommunes || []).map((c) => ({ id: nouvelId("cc"), text: c.text || "", miradorIds: (c.miradorIds || []).map((x) => nouveauxIds[x]).filter(Boolean) }));
  return res;
}
// Partage d'une partie d'un territoire : seulement les traques choisies, les cartes qu'elles utilisent
// et la vue d'ensemble ; le plan de chasse n'est pas partage.
function extraireTraques(t, ids) {
  const garde = {}; (ids || []).forEach((id) => { garde[id] = true; });
  const tracks = (t.tracks || []).filter((tr) => garde[tr.id]);
  const premierSec = ((t.secteurs || [])[0] || {}).id;
  const secUtiles = {}; tracks.forEach((tr) => { secUtiles[tr.secteurId || premierSec] = true; });
  const mids = {}; tracks.forEach((tr) => (tr.miradors || []).forEach((m) => { mids[m.id] = true; }));
  return {
    ...t,
    name: (t.name || "Territoire") + " (" + tracks.length + " traque" + (tracks.length > 1 ? "s" : "") + ")",
    tracks,
    secteurs: (t.secteurs || []).filter((sc) => secUtiles[sc.id]),
    consignesCommunes: (t.consignesCommunes || []).map((c) => ({ ...c, miradorIds: (c.miradorIds || []).filter((x) => mids[x]) })).filter((c) => c.miradorIds.length),
    planChasse: undefined,
  };
}

// Allège un territoire trop lourd. On ne touche jamais aux traques ni aux postes :
// seules les photos partent, car elles pèsent l'essentiel du poids.
function allegerTerritoire(t, niveau) {
  const out = Object.assign({}, t);
  if (niveau === "postes" || niveau === "tout") {
    out.tracks = (t.tracks || []).map((tr) => Object.assign({}, tr, {
      miradors: (tr.miradors || []).map((m) => Object.assign({}, m, { photos: [] }))
    }));
  }
  if (niveau === "tout") { out.secteurs = (out.secteurs || []).map((s) => ({ ...s, image: null })); out.vueEnsemble = null; }
  return out;
}
function poidsDe(obj) { try { return JSON.stringify(obj).length; } catch (e) { return 0; } }
function ko(n) { return n >= 1048576 ? (n / 1048576).toFixed(1) + " Mo" : Math.round(n / 1024) + " Ko"; }

function PartageTerritoire({ terrains, setTerrains, github, onClose }) {
  const [onglet, setOnglet] = useState("envoyer");
  const [choisi, setChoisi] = useState("");
  const [code, setCode] = useState(null);
  const [saisie, setSaisie] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [niveau, setNiveau] = useState("complet");   // complet | postes | tout
  const [quoi, setQuoi] = useState("territoire");    // territoire | traques
  const [selTr, setSelTr] = useState([]);
  const aPartager = (t) => (quoi === "traques" ? extraireTraques(t, selTr) : t);
  const LIMITE = 24 * 1024 * 1024;

  const facteur = () => (github.fnUrl || DEFAULT_FACTEUR).replace(/\/+$/, "");
  const appel = async (route, corps) => {
    let sess = null;
    try { sess = (await SB.auth.getSession()).data.session; } catch (e) {}
    if (!sess || !sess.access_token) throw new Error("Session expirée — reconnecte-toi.");
    const r = await fetch(facteur() + route, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + sess.access_token },
      body: JSON.stringify(corps)
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      if (d.reason === "lourd") throw new Error("Ce territoire pèse " + ko(d.taille) + ", au-delà du maximum de " + ko(d.max) + ". Choisis ci-dessous d'envoyer une version allégée.");
      const raisons = { introuvable: "Code inconnu ou expiré.", vide: "Territoire introuvable.", illisible: "Partage illisible." };
      throw new Error(raisons[d.reason] || ("Erreur " + r.status));
    }
    return d;
  };

  // Partage sans limite de poids : le territoire part en morceaux d'environ 800 Ko vers le Worker battue-gps.
  const MORCEAU = 800000;
  const jeton = async () => {
    let sess = null;
    try { sess = (await SB.auth.getSession()).data.session; } catch (e) {}
    if (!sess || !sess.access_token) throw new Error("Session expirée — reconnecte-toi.");
    return sess;
  };
  const appelGps = async (route, corps, sess) => {
    const r = await fetch(GPS_URL + route, corps ? { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + sess.access_token }, body: JSON.stringify(corps) } : { headers: { "Authorization": "Bearer " + sess.access_token }, cache: "no-store" });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.ok) { const e = new Error(({ introuvable: "Code inconnu ou expiré.", connexion: "Session expirée — reconnecte-toi.", trop: "Tu as déjà 10 partages en cours : attends qu'ils expirent (7 jours).", lourd: "Ce territoire pèse " + ko(d.taille || 0) + " : un partage est limité à " + ko(d.max || 0) + ". Choisis ci-dessous une version allégée." })[d.reason] || ("Erreur " + r.status)); e.reason = d.reason || ""; e.status = r.status; throw e; }
    return d;
  };
  const envoyer = async () => {
    const t = terrains.find((x) => x.id === choisi);
    if (!t) { setMsg("Choisis d'abord un territoire."); return; }
    setBusy(true); setMsg(""); setCode(null);
    try {
      const sess = await jeton();
      if (quoi === "traques" && !selTr.length) throw new Error("Coche au moins une traque à partager.");
      let aEnvoyer = allegerTerritoire(aPartager(t), niveau);
      // Images pas encore revenues sur cet appareil : on les recupere pour que la copie soit complete.
      try { aEnvoyer = (await resoudreImages(aEnvoyer, sess.user.id, true)).v; } catch (e) {}
      const texte = JSON.stringify(aEnvoyer);
      const n = Math.max(1, Math.ceil(texte.length / MORCEAU));
      let deb;
      try { deb = await appelGps("/share/debut", { n, taille: texte.length, nom: aEnvoyer.name || t.name || "" }, sess); }
      catch (e) {
        // Worker pas encore a jour : ancien partage (24 Mo maximum) si le territoire y tient.
        if (e.reason === "connexion" || e.reason === "trop" || e.reason === "lourd") throw e;
        if (texte.length > LIMITE) throw new Error("Le partage sans limite n'est pas encore installé : il faut mettre à jour la base et le Worker battue-gps (voir le guide).");
        const d = await appel("/share/create", { territoire: aEnvoyer });
        setCode(d); return;
      }
      for (let i = 0; i < n; i++) {
        setMsg("Envoi du territoire… " + (i + 1) + "/" + n + " (" + ko(texte.length) + ")");
        let ok = false;
        for (let essai = 0; essai < 3 && !ok; essai++) { try { await appelGps("/share/morceau", { code: deb.code, cle: deb.cle, i, data: texte.slice(i * MORCEAU, (i + 1) * MORCEAU) }, sess); ok = true; } catch (e) { if (essai === 2) throw new Error("Envoi interrompu (réseau ?). Réessaie."); } }
      }
      const fin = await appelGps("/share/fin", { code: deb.code, cle: deb.cle }, sess);
      setMsg("");
      setCode({ code: fin.code, jours: fin.jours, taille: fin.taille });
    } catch (e) { setMsg((e && e.message) || String(e)); }
    finally { setBusy(false); }
  };

  const recevoir = async () => {
    const c = saisie.trim().toUpperCase();
    if (c.length < 4) { setMsg("Saisis le code reçu."); return; }
    setBusy(true); setMsg("");
    try {
      let territoire = null;
      const sess = await jeton();
      try {
        const inf = await appelGps("/share/infos?code=" + encodeURIComponent(c), null, sess);
        let texte = "";
        for (let i = 0; i < inf.n; i++) {
          setMsg("Récupération du territoire… " + (i + 1) + "/" + inf.n + " (" + ko(inf.taille) + ")");
          let m = null;
          for (let essai = 0; essai < 3 && !m; essai++) { try { m = await appelGps("/share/morceau?code=" + encodeURIComponent(c) + "&i=" + i + "&lect=" + encodeURIComponent(inf.lect), null, sess); } catch (e) { if (essai === 2) throw new Error("Récupération interrompue (réseau ?). Réessaie."); } }
          texte += m.data;
        }
        territoire = JSON.parse(texte);
      } catch (e) {
        // Code inconnu du nouveau partage : c'est peut-etre un ancien code (avant la v4.32).
        if (e.reason !== "introuvable" && e.status !== 404 && e.status !== 500) throw e;
        territoire = (await appel("/share/get", { code: c })).territoire;
      }
      const copie = copierTerritoire(territoire);
      setTerrains((prev) => [...prev, copie]);
      setMsg("✅ « " + copie.name + " » a été ajouté à tes territoires.");
      setSaisie("");
    } catch (e) { setMsg((e && e.message) || String(e)); }
    finally { setBusy(false); }
  };

  const partagerCode = () => {
    if (!code) return;
    const txt = "Voici le code pour récupérer mon territoire dans Carnet de Chasse :\n\n" + code.code + "\n\nDans l'app : Territoires → Partager → Recevoir. Valable " + code.jours + " jours.";
    window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank");
  };

  return (<div className="fixed inset-0 z-50 bg-stone-100 flex flex-col">
    <div className="bg-stone-900 text-stone-50 px-4 py-3 flex items-center gap-3 shrink-0" style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top))" }}>
      <button onClick={onClose} className="p-1 -ml-1"><ArrowLeft size={22} /></button>
      <h2 className="font-serif text-lg">Partager un territoire</h2>
    </div>

    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto p-4 space-y-4">

        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={() => { setOnglet("envoyer"); setMsg(""); }} className={`rounded-xl border p-3.5 text-left transition-colors ${onglet === "envoyer" ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white"}`}>
            <div className="text-2xl mb-1.5">📤</div>
            <div className="text-sm font-medium text-stone-800">Envoyer</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Obtenir un code</div>
          </button>
          <button onClick={() => { setOnglet("recevoir"); setMsg(""); }} className={`rounded-xl border p-3.5 text-left transition-colors ${onglet === "recevoir" ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white"}`}>
            <div className="text-2xl mb-1.5">📥</div>
            <div className="text-sm font-medium text-stone-800">Recevoir</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Saisir un code</div>
          </button>
        </div>

        {onglet === "envoyer" && (<div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
          <p className="text-sm text-stone-600">Choisis le territoire à transmettre. Tu obtiendras un code à donner à l'autre organisateur.</p>
          <select value={choisi} onChange={(e) => { setChoisi(e.target.value); setCode(null); setNiveau("complet"); setMsg(""); setQuoi("territoire"); setSelTr([]); }} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="">Choisir un territoire…</option>
            {[...terrains].sort((a, b) => byNom(a.name || "", b.name || "")).map((t) => <option key={t.id} value={t.id}>{t.name} ({(t.tracks || []).length} traque(s))</option>)}
          </select>
          {choisi && (() => {
            const t0 = terrains.find((x) => x.id === choisi);
            if (!t0) return null;
            const traques = t0.tracks || [];
            const basculer = (id) => setSelTr((p) => (p.indexOf(id) >= 0 ? p.filter((x) => x !== id) : [...p, id]));
            const choixQuoi = (<div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setQuoi("territoire")} className={`rounded-lg border p-2.5 text-left ${quoi === "territoire" ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white"}`}>
                  <div className="text-sm font-medium text-stone-800">{quoi === "territoire" ? "✓ " : ""}Tout le territoire</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{traques.length} traque(s), plan de chasse compris</div>
                </button>
                <button onClick={() => setQuoi("traques")} className={`rounded-lg border p-2.5 text-left ${quoi === "traques" ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white"}`}>
                  <div className="text-sm font-medium text-stone-800">{quoi === "traques" ? "✓ " : ""}Choisir des traques</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Seulement celles que tu coches</div>
                </button>
              </div>
              {quoi === "traques" && (<div className="border border-stone-200 rounded-lg p-2.5 space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] text-stone-500">{selTr.length} / {traques.length} cochée(s)</span>
                  <button onClick={() => setSelTr(selTr.length === traques.length ? [] : traques.map((x) => x.id))} className="text-[12px] text-emerald-800 underline">{selTr.length === traques.length ? "Tout décocher" : "Tout cocher"}</button>
                </div>
                {traques.map((tr) => (<label key={tr.id} className="flex items-center gap-2.5 py-1.5 text-sm text-stone-800 cursor-pointer">
                  <input type="checkbox" checked={selTr.indexOf(tr.id) >= 0} onChange={() => basculer(tr.id)} className="w-4 h-4 accent-emerald-700" />
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: tr.color || "#dc2626" }} />
                  <span className="flex-1">{tr.name || "Traque"}</span>
                  <span className="text-[11px] text-stone-400">{(tr.miradors || []).length} poste(s)</span>
                </label>))}
                <p className="text-[11px] text-stone-500 pt-1.5 border-t border-stone-100">La personne reçoit un nouveau territoire avec ces traques, leurs postes, leurs photos, leurs cartes et la vue d'ensemble. Le plan de chasse n'est pas partagé.</p>
              </div>)}
            </div>);
            if (quoi === "traques" && !selTr.length) return choixQuoi;
            const t = aPartager(t0);
            const pComplet = poidsDe(t);
            const pPostes = poidsDe(allegerTerritoire(t, "postes"));
            const pTout = poidsDe(allegerTerritoire(t, "tout"));
            const tropLourd = pComplet > LIMITE;

            const options = [
              { k: "complet", t: "Tout envoyer", d: "Carte, photos des postes, traques et plan de chasse", p: pComplet },
              { k: "postes", t: "Sans les photos des postes", d: "La carte du territoire est conservée", p: pPostes },
              { k: "tout", t: "Sans aucune photo", d: "Traques, postes et plan de chasse uniquement", p: pTout }
            ];
            return (<div className="space-y-2">
              {choixQuoi}
              {tropLourd && (<p className="text-[12px] text-stone-500">Territoire lourd ({ko(pComplet)}) : il part en plusieurs morceaux, en pleine qualité. Compte une minute en Wi-Fi.</p>)}
              <div className="space-y-1.5">
                {options.map((o) => {
                  const trop = false;
                  const on = niveau === o.k;
                  return (<button key={o.k} onClick={() => !trop && setNiveau(o.k)} disabled={trop}
                    className={`w-full text-left rounded-lg border p-2.5 transition-colors ${on ? "border-emerald-600 bg-emerald-50" : trop ? "border-stone-200 bg-stone-50 opacity-60" : "border-stone-200 bg-white"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-stone-800">{on ? "✓ " : ""}{o.t}</span>
                      <span className="text-[11px] shrink-0 text-stone-400">{ko(o.p)}</span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{o.d}</div>
                  </button>);
                })}
              </div>
            </div>);
          })()}
          <button onClick={envoyer} disabled={busy || !choisi || (quoi === "traques" && !selTr.length)} className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-stone-50 text-sm font-medium py-2.5 rounded-lg">{busy ? "Envoi en cours…" : "Obtenir un code"}</button>

          {code && (<div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 text-center">
            <p className="text-[11px] uppercase tracking-widest text-emerald-700">Code de partage</p>
            <p className="font-serif text-3xl text-emerald-900 tracking-wider my-2">{code.code}</p>
            <p className="text-[11px] text-stone-500 mb-3">Valable {code.jours} jours · {ko(code.taille || 0)}</p>
            <button onClick={partagerCode} className="w-full flex items-center justify-center gap-1.5 bg-green-700 hover:bg-green-800 text-stone-50 text-sm font-medium py-2.5 rounded-lg"><Send size={14} /> Envoyer sur WhatsApp</button>
          </div>)}
        </div>)}

        {onglet === "recevoir" && (<div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
          <p className="text-sm text-stone-600">Saisis le code reçu. Le territoire sera copié chez toi avec ses traques, ses postes, ses photos et son plan de chasse.</p>
          <input value={saisie} onChange={(e) => setSaisie(e.target.value.toUpperCase())} placeholder="CHENE-4271" className="w-full border border-stone-300 rounded-lg px-3 py-3 text-center font-serif text-xl tracking-wider bg-white" />
          <button onClick={recevoir} disabled={busy || saisie.trim().length < 4} className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-stone-50 text-sm font-medium py-2.5 rounded-lg">{busy ? "Récupération…" : "Récupérer le territoire"}</button>
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
            <p className="text-[13px] text-stone-600">La copie est <b>indépendante</b> : tu peux la modifier librement, l'original de l'expéditeur n'en saura rien.</p>
          </div>
        </div>)}

        {msg && <div className="bg-white border border-stone-200 rounded-lg p-3"><p className="text-sm text-stone-700">{msg}</p></div>}
      </div>
    </div>
  </div>);
}

function TerrainsView({ terrains, setTerrains, journees, github }) {
  const [editorState, setEditorState] = useState(null);
  const [partage, setPartage] = useState(false);
  const commitTerrain = (terrain) => setTerrains((prev) => { const exists = prev.some((t) => t.id === terrain.id); return exists ? prev.map((t) => (t.id === terrain.id ? { ...terrain, imageCouverture: terrain.imageCouverture !== undefined ? terrain.imageCouverture : (t.imageCouverture || null) } : t)) : [...prev, terrain]; });
  const saveTerrain = (terrain) => { commitTerrain(terrain); setEditorState(null); };
  const deleteTerrain = (id) => { if (window.confirm("Supprimer ce territoire ?")) { setTerrains((prev) => prev.filter((t) => t.id !== id)); setEditorState(null); } };
  if (partage) return <PartageTerritoire terrains={terrains} setTerrains={setTerrains} github={github} onClose={() => setPartage(false)} />;

  return (<div className="space-y-3">
    <div className="flex items-center justify-between gap-2"><h2 className="font-serif text-xl text-stone-800">Territoires</h2>
      {!editorState && <button onClick={() => setPartage(true)} className="flex items-center gap-1.5 border border-stone-300 bg-white text-stone-700 text-sm font-medium px-3 py-1.5 rounded-md"><Share2 size={14} /> Partager</button>}{!editorState && <button onClick={() => setEditorState("new")} className="flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-stone-50 text-sm font-medium px-3 py-1.5 rounded-md"><Plus size={16} /> Nouveau territoire</button>}</div>
    {editorState ? (<TerritoryEditor initialTerrain={editorState === "new" ? null : editorState} journees={journees} onSave={saveTerrain} onCancel={() => setEditorState(null)} onDelete={() => deleteTerrain(editorState.id)} onLiveCommit={commitTerrain} />)
      : (<div className="grid sm:grid-cols-2 gap-3">{terrains.length === 0 && <p className="text-sm text-stone-500 italic sm:col-span-2">Aucun territoire. Clique « Nouveau territoire ».</p>}
        {[...terrains].sort((a, b) => byNom(a.name || "", b.name || "")).map((t) => (<SectionCard key={t.id} className="overflow-hidden cursor-pointer hover:border-emerald-700 transition-colors" onClick={() => setEditorState(t)}>
          {(((t.secteurs || []).find((s) => s && s.image) || {}).image) ? <img src={((t.secteurs || []).find((s) => s && s.image) || {}).image} alt={t.name} className="h-28 w-full object-cover" /> : <div className="h-28 bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-700 flex items-center justify-center text-stone-300"><MapPin size={20} /></div>}
          <div className="p-3"><p className="font-medium text-stone-800 truncate">{t.name}</p><p className="text-xs text-stone-500">{t.tracks.length} traque(s) · appuie pour ouvrir</p></div></SectionCard>))}
      </div>)}
  </div>);
}

// ---------- Participants ----------
// ======================= Export PDF =======================
// L'iPhone ajoute toujours l'adresse, la date et « Page x sur y » quand il imprime une page web,
// et il ignore l'orientation paysage. Un vrai PDF fabrique ici n'a aucun de ces defauts :
// on peut l'envoyer a l'imprimeur ou l'imprimer depuis l'app Fichiers.
// Principe : chaque page est redessinee dans une image (avec la mise en page calculee par le
// navigateur lui-meme), puis les images sont rangees dans un PDF A4.
