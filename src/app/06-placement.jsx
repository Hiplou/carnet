function HunterList({ pending, selectedHunter, setSelectedHunter, armeOf, onSetArme, onRabat, onPoste, rabatList, verrouNums }) {
  const [armeEdit, setArmeEdit] = useState(null);
  return (<SectionCard className="p-3 sm:col-span-1"><p className="text-xs uppercase tracking-wide text-stone-400 mb-2">Fusils à placer</p>
    <div className="space-y-1.5">{pending.length === 0 && <p className="text-sm text-stone-400 italic">Tous les fusils sont placés 🎯</p>}
      {pending.map((p) => { const a = armeOf ? armeOf(p) : (p.arme || null); const isEdit = armeEdit === p.id;
        return (<div key={p.id}>
          <div className={`w-full rounded border flex items-center gap-1 ${selectedHunter === p.id ? "bg-amber-800 border-amber-800" : "bg-white border-stone-300"}`}>
            <button onClick={() => setSelectedHunter(p.id)} className={`flex-1 text-left px-2.5 py-1.5 text-sm ${selectedHunter === p.id ? "text-stone-50" : "text-stone-700"}`}>🦌 {p.name}</button>
            {onRabat && !(verrouNums && numDe(p.id)) && <button onClick={() => onRabat(p.id)} title="Ce fusil rabat dans cette traque" aria-label="Mettre au rabat" className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold border ${selectedHunter === p.id ? "bg-white/20 text-stone-50 border-white/40" : "bg-orange-50 text-orange-700 border-orange-300"}`}>Rabat</button>}
            <button onClick={() => setArmeEdit(isEdit ? null : p.id)} title="Arme du jour" className={`shrink-0 mr-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${a ? (selectedHunter === p.id ? "bg-white/20 text-stone-50 border-white/40" : "bg-stone-100 text-stone-600 border-stone-300") : (selectedHunter === p.id ? "bg-white/10 text-stone-200 border-white/30" : "bg-white text-stone-400 border-stone-200")}`}>{a ? armeShort(a) : "—"}</button>
          </div>
          {isEdit && onSetArme && (<div className="flex gap-1 mt-1 mb-1.5 flex-wrap">
            {[{ v: null, l: "—" }].concat(ARMES.map((x) => ({ v: x.key, l: x.label }))).map((o) => (<button key={o.l} onClick={() => { onSetArme(p.id, o.v); setArmeEdit(null); }} className={`px-2 py-1 rounded text-[11px] font-medium border flex items-center gap-1 ${a === o.v ? "bg-emerald-700 text-white border-emerald-700" : "bg-white text-stone-600 border-stone-300"}`}>{o.v && <ArmeIcon k={o.v} size={12} color={a === o.v ? "#fff" : "#166534"} />}{o.l}</button>))}
          </div>)}
        </div>); })}</div>
    {selectedHunter && <p className="text-xs text-amber-800 mt-2">Clique un poste pour l'y placer.</p>}
    {rabatList && rabatList.length > 0 && (<div className="mt-3"><p className="text-xs uppercase tracking-wide text-orange-700 mb-1.5">🟠 Au rabat dans cette traque</p>
      <div className="space-y-1.5">{rabatList.map((p) => (<div key={p.id} className="rounded border border-orange-300 bg-orange-50 flex items-center gap-1">
        <span className="flex-1 px-2.5 py-1.5 text-sm text-orange-900">{p.name}</span>
        {onPoste && !(verrouNums && numDe(p.id)) && <button onClick={() => onPoste(p.id)} className="shrink-0 mr-1 px-2 py-1 rounded text-[11px] font-semibold border border-stone-300 bg-white text-stone-700">Remettre au poste</button>}
      </div>))}</div></div>)}
    </SectionCard>);
}
const ARROW_COLORS = ["#2563eb", "#dc2626", "#ea580c", "#7c3aed", "#059669", "#111827", "#f59e0b"];
function ChefAssign({ terrain, journee, chefId, chefName, participants, onToggle, onBack }) {
  const [tab, setTab] = useState(0);
  const track = terrain.tracks[tab] || terrain.tracks[0];
  const image = imageDe(terrain, track); const ar = useImageAR(image);
  if (!track) return (<div className="space-y-3"><button onClick={onBack} className="flex items-center gap-1 text-sm font-medium text-stone-700"><ArrowLeft size={16} /> Retour</button><p className="text-sm text-stone-500">Aucune traque.</p></div>);
  const crop = track.crop || FULL_CROP;
  const placements = journee.placements[track.id] || {};
  const cl = journee.chefLignes || {};
  const myCount = Object.keys(cl).filter((mid) => cl[mid] === chefId).length;
  return (<div className="space-y-3">
    <div className="flex items-center justify-between gap-2"><button onClick={onBack} className="flex items-center gap-1 text-sm font-medium text-stone-700"><ArrowLeft size={16} /> Retour</button><span className="text-sm font-semibold text-stone-800">👨‍✈️ {chefName} <span className="font-normal text-stone-400">· {myCount} poste(s)</span></span></div>
    <p className="text-xs text-stone-500">Tape les postes dont <b>{chefName}</b> est responsable (traque par traque). Les postes surlignés en vert sont les siens.</p>
    <div className="flex gap-1.5 flex-wrap">{terrain.tracks.map((t, i) => <button key={t.id} onClick={() => setTab(i)} className={`text-xs font-medium px-2.5 py-1 rounded ${tab === i ? "bg-stone-800 text-stone-50" : "bg-stone-200 text-stone-700"}`}>{t.name}</button>)}</div>
    <div style={cropWrapperStyle(crop, ar)} className="border border-stone-300 select-none"><div style={cropBgStyle(image, crop)} />
      {track.miradors.map((m) => { const hid = Object.entries(placements).find(([, mid2]) => mid2 === m.id)?.[0]; if (!hid) return null; const hunter = participants.find((p) => p.id === hid); const lx = ((m.gx - crop.x) / crop.w) * 100, ly = ((m.gy - crop.y) / crop.h) * 100; if (lx < -3 || lx > 103 || ly < -3 || ly > 103) return null; const mine = cl[m.id] === chefId; const other = cl[m.id] && cl[m.id] !== chefId;
        return (<button key={m.id} style={{ position: "absolute", left: `${lx}%`, top: `${ly}%`, opacity: other ? 0.5 : 1 }} onClick={() => onToggle(m.id, mine ? null : chefId)} className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 shadow text-white" style={{ backgroundColor: mine ? "#166534" : other ? "#a8a29e" : "#78716c", borderColor: mine ? "#4ade80" : "#fff" }}>{mine ? "✓" : ""}</span>
          <span className={`text-[9px] px-1 rounded leading-tight text-center max-w-[92px] break-words ${mine ? "bg-emerald-700 text-white ring-1 ring-emerald-300" : "bg-stone-900/70 text-stone-50"}`}>{hunter ? hunter.name : "?"}</span></button>); })}
    </div>
  </div>);
}
function AssignSurface({ image, track, placements, participants, selectedHunter, setSelectedHunter, onAssign, onUnassign, recommendedIds, arrows, onAddArrow, onClearArrows, onUpdateArrow, onDeleteArrow, flagMode, rdvList, onSetRdv }) {
  const crop = track.crop || FULL_CROP; const ar = useImageAR(image);
  const [draw, setDraw] = useState(false); const [draft, setDraft] = useState(null); const mapRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [selArrow, setSelArrow] = useState(null);
  const [arrowColor, setArrowColor] = useState(ARROW_COLORS[0]);
  const dragH = useRef(null);
  useEffect(() => { const el = mapRef.current; if (!el) return; const upd = () => setDims({ w: el.clientWidth, h: el.clientHeight }); upd(); let ro; try { ro = new ResizeObserver(upd); ro.observe(el); } catch (e) {} return () => { try { ro && ro.disconnect(); } catch (e) {} }; }, [crop, ar]);
  const arr = arrows || [];
  const toG = (cx, cy) => { const r = mapRef.current.getBoundingClientRect(); const lx = Math.max(0, Math.min(100, (cx - r.left) / r.width * 100)); const ly = Math.max(0, Math.min(100, (cy - r.top) / r.height * 100)); return { gx: crop.x + lx / 100 * crop.w, gy: crop.y + ly / 100 * crop.h }; };
  const down = (e) => { if (flagMode) { e.preventDefault(); const g = toG(e.clientX, e.clientY); onSetRdv && onSetRdv(g); return; } if (!draw) return; e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} setSelArrow(null); const g = toG(e.clientX, e.clientY); setDraft({ x1: g.gx, y1: g.gy, x2: g.gx, y2: g.gy, color: arrowColor }); };
  const move = (e) => { if (!draw) return; const g = toG(e.clientX, e.clientY); if (dragH.current) { const h = dragH.current; onUpdateArrow(h.i, h.which === 1 ? { x1: g.gx, y1: g.gy } : { x2: g.gx, y2: g.gy }); return; } if (draft) setDraft((d) => ({ ...d, x2: g.gx, y2: g.gy })); };
  const up = () => { if (dragH.current) { dragH.current = null; return; } if (draft) { if (Math.abs(draft.x2 - draft.x1) + Math.abs(draft.y2 - draft.y1) > 2) onAddArrow({ ...draft }); setDraft(null); } };
  const selectArrow = (i) => (e) => { e.stopPropagation(); e.preventDefault(); setSelArrow(i); };
  const startHandle = (i, which) => (e) => { e.stopPropagation(); e.preventDefault(); try { mapRef.current.setPointerCapture(e.pointerId); } catch {} dragH.current = { i, which }; setSelArrow(i); };
  const clickPost = (m) => { const occ = Object.entries(placements).find(([, mid]) => mid === m.id)?.[0]; if (occ) onUnassign(occ); else if (selectedHunter) { onAssign(selectedHunter, m.id); setSelectedHunter(null); } };
  const gl = (x, y) => ({ x: (x - crop.x) / crop.w * dims.w, y: (y - crop.y) / crop.h * dims.h });
  const allArrows = draft ? [...arr, draft] : arr;
  const selA = (draw && selArrow != null && arr[selArrow]) ? arr[selArrow] : null;
  const mid = (c) => "ah" + String(c || "#2563eb").replace("#", "");
  return (<div>
    <div className="flex items-center gap-2 mb-2 flex-wrap"><button onClick={() => { setDraw((d) => !d); setSelArrow(null); }} className={`text-xs font-medium px-2.5 py-1 rounded ${draw ? "bg-blue-700 text-stone-50" : "bg-stone-200 text-stone-700"}`}>✏️ Sens de traque</button>{arr.length > 0 && <button onClick={() => { onClearArrows(); setSelArrow(null); }} className="text-xs font-medium px-2.5 py-1 rounded bg-stone-200 text-stone-700">Tout effacer</button>}{draw && selArrow != null && <button onClick={() => { onDeleteArrow(selArrow); setSelArrow(null); }} className="text-xs font-medium px-2.5 py-1 rounded bg-red-100 text-red-700">Supprimer la flèche</button>}</div>
    {draw && <div className="flex items-center gap-1.5 mb-2 flex-wrap"><span className="text-[11px] text-stone-500">Couleur :</span>{ARROW_COLORS.map((c) => <button key={c} onClick={() => { setArrowColor(c); if (selArrow != null) onUpdateArrow(selArrow, { color: c }); }} style={{ background: c }} className={`w-6 h-6 rounded-full ${arrowColor === c ? "ring-2 ring-offset-1 ring-stone-800" : ""}`} />)}<span className="text-[11px] text-blue-700 ml-1">{selArrow != null ? "Déplace les bouts • recolorie • supprime" : "Trace du départ vers l'arrivée"}</span></div>}
    <div ref={mapRef} style={cropWrapperStyle(crop, ar)} className="border border-stone-300 select-none" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}><div style={cropBgStyle(image, crop)} />
    {track.miradors.map((m) => { const lx = ((m.gx - crop.x) / crop.w) * 100, ly = ((m.gy - crop.y) / crop.h) * 100; if (lx < -3 || lx > 103 || ly < -3 || ly > 103) return null;
      const hid = Object.entries(placements).find(([, mid2]) => mid2 === m.id)?.[0]; const hunter = hid ? participants.find((p) => p.id === hid) : null;
      const reco = recommendedIds && recommendedIds.has(m.id) && !hunter;
      const dim = recommendedIds && !recommendedIds.has(m.id) && !hunter;
      return (<button key={m.id} style={{ position: "absolute", left: `${lx}%`, top: `${ly}%`, opacity: dim ? 0.4 : 1, pointerEvents: draw ? "none" : "auto" }} onClick={() => clickPost(m)} className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 shadow ${reco ? "border-emerald-400 ring-2 ring-emerald-400" : (m.accFauteuil || m.accCanne) ? "border-emerald-500" : "border-white"}`} style={{ backgroundColor: hunter ? "#b45309" : track.color }}>{hunter ? "🦌" : (m.priority || 1)}</span>
        <span className="text-[9px] bg-stone-900/70 text-stone-50 px-1 rounded leading-tight text-center max-w-[92px] break-words">{(m.accFauteuil || m.accCanne) ? (m.accFauteuil ? <Fauteuil size={9} color="#fff" /> : "🦯") : null}{(m.accFauteuil || m.accCanne) ? " " : ""}{hunter ? hunter.name : m.label}</span></button>); })}
    {(rdvList || []).map((r) => { const flx = ((r.gx - crop.x) / crop.w) * 100, fly = ((r.gy - crop.y) / crop.h) * 100; if (flx < -3 || flx > 103 || fly < -3 || fly > 103) return null;
      return (<div key={"rdv" + r.chefId} style={{ position: "absolute", left: `${flx}%`, top: `${fly}%`, transform: "translate(-50%,-100%)", pointerEvents: "none", zIndex: 4 }} className="flex flex-col items-center">
        <span className="text-[10px] font-bold bg-amber-700 text-white px-1.5 py-0.5 rounded shadow whitespace-nowrap">🚩 {r.chefName}</span>
        <span style={{ width: 2, height: 10, background: "#b45309" }} />
      </div>); })}
    {dims.w > 0 && allArrows.length > 0 && <svg viewBox={`0 0 ${dims.w} ${dims.h}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}><defs>{ARROW_COLORS.map((c) => <marker key={c} id={mid(c)} markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" refX="13" refY="9" orient="auto"><path d="M1,1 L17,9 L1,17 Z" fill={c} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></marker>)}</defs>{allArrows.map((a, i) => { const p1 = gl(a.x1, a.y1), p2 = gl(a.x2, a.y2); const col = a.color || "#2563eb"; const isSel = draw && i === selArrow; return (<g key={i}><line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#fff" strokeWidth={isSel ? 12 : 9} strokeLinecap="round" /><line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={col} strokeWidth={isSel ? 6.5 : 5} strokeLinecap="round" markerEnd={`url(#${mid(col)})`} />{draw && i < arr.length && <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="transparent" strokeWidth="24" style={{ pointerEvents: "stroke", cursor: "pointer" }} onPointerDown={selectArrow(i)} />}</g>); })}{selA && (() => { const p1 = gl(selA.x1, selA.y1), p2 = gl(selA.x2, selA.y2); return (<g><circle cx={p1.x} cy={p1.y} r="10" fill="#fff" stroke={selA.color || "#2563eb"} strokeWidth="3" style={{ pointerEvents: "auto", cursor: "move" }} onPointerDown={startHandle(selArrow, 1)} /><circle cx={p2.x} cy={p2.y} r="10" fill="#fff" stroke={selA.color || "#2563eb"} strokeWidth="3" style={{ pointerEvents: "auto", cursor: "move" }} onPointerDown={startHandle(selArrow, 2)} /></g>); })()}</svg>}
    </div>
  </div>);
}
// ---------- Voitures et covoiturage, traque par traque ----------
function VoituresSection({ journee, terrain, participants, presentIds, journees, onSet, onOuvrirPoints }) {
  const histoCond = useMemo(() => histoConducteurs(journees), [journees]);
  const tracks = terrain.tracks || [];
  const [ti, setTi] = useState(0);
  const [choix, setChoix] = useState(null);
  const track = tracks[ti];
  const tid = track ? track.id : "";

  const voitures = ((journee.voitures || {})[tid]) || [];
  const transport = ((journee.transport || {})[tid]) || {};
  const pts = track ? [
    ...((track.deposes || []).map((d) => ({ ...d, src: "terr" }))),
    ...((((journee.deposesJourParTraque || {})[tid]) || []).map((d) => ({ ...d, src: "jour" })))
  ] : [];
  const departs = track ? (track.departs || []) : [];

  const nom = (id) => { const p = participants.find((x) => x.id === id); return p ? p.name : "?"; };
  const estTraqueur = (id) => { const p = participants.find((x) => x.id === id); return p && p.role === "rabatteur"; };

  const presents = presentIds.filter((id) => participants.some((p) => p.id === id));
  const conducteurs = voitures.map((v) => v.conducteurId);
  const passagers = Object.keys(transport).filter((id) => (transport[id] || {}).voitureId);
  const sansVoiture = presents.filter((id) => conducteurs.indexOf(id) < 0 && passagers.indexOf(id) < 0);
  const libres = sansVoiture;

  // Toute écriture reste cantonnée à la traque affichée
  const setV = (liste) => onSet({ voitures: { ...(journee.voitures || {}), [tid]: liste } });
  const setT = (t) => onSet({ transport: { ...(journee.transport || {}), [tid]: t } });
  const majT = (hid, patch) => setT({ ...transport, [hid]: { ...(transport[hid] || {}), ...patch } });

  const designerConducteur = (hid) => { const q = participants.find((x) => x.id === hid); setV([...voitures, { id: "v-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), conducteurId: hid, places: (q && q.places) || 4, vehicule: (q && q.vehicule) || "", deposeId: "" }]); };

  // Propose une organisation pour une traque : complete l'existant, ne l'ecrase jamais.
  // Regle : on regroupe par point de depose, deduit de la depose habituelle du mirador.
  const proposerTraque = (tr, voit0, tp0) => {
    const idsPts = [
      ...((tr.deposes || []).map((d) => d.id)),
      ...((((journee.deposesJourParTraque || {})[tr.id]) || []).map((d) => d.id))
    ];
    const pl = ((journee.placements || {})[tr.id]) || {};
    const deposeDe = (hid) => {
      const mid = pl[hid]; if (!mid) return "";
      const m = (tr.miradors || []).find((x) => x.id === mid);
      const d = (m && m.deposeHab) || "";
      return idsPts.indexOf(d) >= 0 ? d : "";
    };
    const fiche = (hid) => participants.find((x) => x.id === hid);
    // Un chauffeur est quelqu'un qui a deja conduit lors de SUGG_MIN journees.
    const conduitHab = (hid) => (histoCond[hid] || 0) >= SUGG_MIN;

    const vs = voit0.map((v) => ({ ...v }));
    const tp = { ...tp0 };
    const pris = {};
    vs.forEach((v) => { pris[v.conducteurId] = true; });
    Object.keys(tp).forEach((id) => { const vid = (tp[id] || {}).voitureId; if (vid && vs.some((v) => v.id === vid)) pris[id] = true; });
    let libres2 = presents.filter((id) => !pris[id]);

    const nbDans = (v) => Object.keys(tp).filter((id) => (tp[id] || {}).voitureId === v.id).length;
    const monter = (v, hid, dep) => { tp[hid] = { ...(tp[hid] || {}), voitureId: v.id, deposeId: dep }; libres2 = libres2.filter((x) => x !== hid); };

    // 1. completer d'abord les voitures deja formees, avec les gens du meme point
    vs.forEach((v) => {
      if (!v.deposeId) return;
      libres2.slice().forEach((hid) => {
        if (nbDans(v) >= (v.places || 0)) return;
        if (deposeDe(hid) !== v.deposeId) return;
        monter(v, hid, v.deposeId);
      });
    });

    // 2. puis creer des voitures, un point de depose a la fois
    const groupes = {};
    libres2.forEach((hid) => { const d = deposeDe(hid); if (d) (groupes[d] = groupes[d] || []).push(hid); });
    let seq = 0;
    Object.keys(groupes).forEach((point) => {
      const reste = groupes[point].slice();
      while (reste.length) {
        // le chauffeur le plus souvent au volant passe en premier
        let ci = -1, meilleur = 0;
        reste.forEach((hid, k) => { if (conduitHab(hid) && (histoCond[hid] || 0) > meilleur) { meilleur = histoCond[hid] || 0; ci = k; } });
        if (ci < 0) break;   // personne pour conduire jusqu'a ce point : les autres restent a la main
        const cond = reste.splice(ci, 1)[0];
        const q = fiche(cond);
        seq += 1;
        const v = {
          id: "v-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5) + seq,
          conducteurId: cond, places: (q && q.places) || 4, vehicule: (q && q.vehicule) || "", deposeId: point
        };
        vs.push(v);
        libres2 = libres2.filter((x) => x !== cond);
        while (reste.length && nbDans(v) < v.places) monter(v, reste.shift(), point);
      }
    });
    return { vs, tp };
  };

  const proposer = (liste) => {
    const nv = { ...(journee.voitures || {}) }, nt = { ...(journee.transport || {}) };
    liste.forEach((tr) => {
      const r = proposerTraque(tr, (nv[tr.id] || []), (nt[tr.id] || {}));
      nv[tr.id] = r.vs; nt[tr.id] = r.tp;
    });
    onSet({ voitures: nv, transport: nt });
  };

  const ListeLibres = ({ titre, onChoisir }) => (
    <div className="bg-stone-50 border-t border-stone-200 p-2.5">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] uppercase tracking-widest text-stone-400">{titre}</span>
        <button onClick={() => setChoix(null)} className="text-[11px] text-stone-500 underline">Fermer</button>
      </div>
      {libres.length === 0 ? (
        <p className="text-[12px] text-stone-400 italic">Tout le monde est déjà placé sur cette traque.</p>
      ) : (<div className="flex flex-wrap gap-1.5">
        {libres.map((id) => (<button key={id} onClick={() => onChoisir(id)}
          className="bg-white border border-stone-300 hover:border-emerald-600 rounded-full px-3 py-1.5 text-[13px] text-stone-700">
          {estTraqueur(id) ? "🚩 " : ""}{nom(id)}
        </button>))}
      </div>)}
      <p className="text-[11px] text-stone-400 mt-1.5">La liste reste ouverte : touche les noms à la suite.</p>
    </div>
  );

  if (!track) return <p className="text-sm text-stone-500 italic">Ce territoire n'a pas encore de traque.</p>;

  return (<div className="space-y-3">
    {tracks.length > 1 && (<div className="flex gap-1 overflow-x-auto -mx-1 px-1">
      {tracks.map((t, k) => (
        <button key={t.id} onClick={() => { setTi(k); setChoix(null); }} className={`px-3 py-1.5 text-[12px] font-medium rounded-md whitespace-nowrap border ${k === ti ? "bg-stone-800 text-stone-50 border-stone-800" : "bg-white text-stone-700 border-stone-300"}`}>
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: t.color }} />{t.name}
        </button>))}
    </div>)}

    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] uppercase tracking-widest text-stone-400">Points de « {track.name} »</span>
        <button onClick={onOuvrirPoints} className="text-[11px] text-emerald-800 underline">Gérer sur la carte</button>
      </div>
      {pts.length === 0 ? (
        <p className="text-[12px] text-stone-400 italic">Aucun point sur cette traque. Touche « Gérer sur la carte ».</p>
      ) : (<div className="flex flex-wrap gap-1.5">
        {pts.map((d) => (<span key={d.id} className={`rounded-full px-2.5 py-1 text-[12px] border ${d.src === "jour" ? "bg-amber-50 border-amber-300 text-amber-900" : "bg-white border-stone-300 text-stone-700"}`}>
          📍 {d.nom} <span className={d.src === "jour" ? "text-amber-600" : "text-stone-400"}>{d.src === "jour" ? "ce jour" : "territoire"}</span>
        </span>))}
      </div>)}
    </div>

    <div className="border-t border-stone-200 pt-3 space-y-2">
      <div className="flex gap-2">
        <button onClick={() => proposer([track])} className="flex-1 text-[12px] font-medium bg-emerald-800 text-stone-50 rounded-lg py-2">✨ Proposer pour « {track.name} »</button>
        {tracks.length > 1 && (<button onClick={() => { if (window.confirm("Proposer une organisation sur les " + tracks.length + " traques ?")) proposer(tracks); }}
          className="text-[12px] font-medium bg-white text-stone-700 border border-stone-300 rounded-lg py-2 px-3 shrink-0">Toutes</button>)}
      </div>
      <p className="text-[11px] text-stone-400">Complète ce qui manque sans toucher à ce que tu as déjà organisé : les chauffeurs sont ceux qui ont déjà conduit lors d'au moins {SUGG_MIN} journées, les passagers sont regroupés par point de dépose habituel de leur poste.</p>
      <span className="text-[11px] uppercase tracking-widest text-stone-400">Voitures de cette traque</span>
      {voitures.length === 0 && <p className="text-[12px] text-stone-400 italic">Aucun conducteur désigné.</p>}

      {voitures.map((v) => {
        const mes = presents.filter((id) => (transport[id] || {}).voitureId === v.id);
        const trop = v.places > 0 && mes.length > v.places;
        return (<div key={v.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="bg-stone-100 px-3 py-2 flex items-center gap-2">
            <span className="text-lg">🚗</span>
            <span className="text-sm font-medium text-stone-800 truncate">{nom(v.conducteurId)}</span>
            <input value={v.vehicule || ""} placeholder="véhicule" onChange={(e) => setV(voitures.map((x) => x.id === v.id ? { ...x, vehicule: e.target.value.slice(0, 24) } : x))}
              className="flex-1 min-w-0 text-[12px] text-stone-600 bg-transparent border-b border-transparent focus:border-stone-300 focus:bg-white rounded px-1 py-0.5" />
            <input type="number" min="0" max="9" value={v.places} onChange={(e) => setV(voitures.map((x) => x.id === v.id ? { ...x, places: Math.max(0, Math.min(9, Number(e.target.value) || 0)) } : x))}
              className="w-11 text-[11px] border border-stone-300 rounded px-1 py-0.5 bg-white text-center" />
            <span className="text-[11px] text-stone-500">passagers</span>
            <button onClick={() => { if (!window.confirm("Retirer cette voiture ?")) return;
              const t2 = { ...transport }; mes.forEach((id) => { t2[id] = { ...(t2[id] || {}), voitureId: "" }; });
              onSet({ voitures: { ...(journee.voitures || {}), [tid]: voitures.filter((x) => x.id !== v.id) }, transport: { ...(journee.transport || {}), [tid]: t2 } }); }} className="text-red-600 px-1 text-sm">✕</button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 border-b border-stone-100">
            <span className="text-[11px] text-stone-500 shrink-0">Se gare à</span>
            <select value={v.deposeId || ""} onChange={(e) => {
              const np = e.target.value, ancien = v.deposeId || "";
              setV(voitures.map((x) => x.id === v.id ? { ...x, deposeId: np } : x));
              // les passagers restés sur l'ancien point suivent la voiture
              const t2 = { ...transport };
              Object.keys(t2).forEach((id) => {
                if ((t2[id] || {}).voitureId !== v.id) return;
                let d = (t2[id] || {}).deposeId || "";
                if (d && !pts.some((q) => q.id === d)) d = "";
                if (!d || d === ancien) t2[id] = { ...t2[id], deposeId: np };
              });
              setT(t2);
            }} className="text-[11px] border border-stone-300 rounded px-1.5 py-1 bg-white flex-1 min-w-0">
              <option value="">Point de dépose de la voiture…</option>
              {pts.map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}
            </select>
          </div>
          <p className={`text-[11px] px-3 py-1 ${trop ? "text-amber-800 bg-amber-50" : "text-stone-500 bg-white"}`}>
            {mes.length}/{v.places} passagers — soit {mes.length + 1} personnes avec le conducteur{trop ? " · au-delà des places, mais rien n'est bloqué" : ""}
          </p>

          <div className="divide-y divide-stone-100">
            {mes.length === 0 && <p className="px-3 py-2 text-[12px] text-stone-400 italic">Aucun passager.</p>}
            {mes.map((id) => { const tq = estTraqueur(id); const inf = transport[id] || {};
              return (<div key={id} className={tq ? "bg-emerald-50/50" : ""}>
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="text-sm text-stone-700 flex-1 truncate">{tq ? "🚩 " : ""}{nom(id)}</span>
                  <select value={inf.deposeId || ""} onChange={(e) => majT(id, { deposeId: e.target.value })} className="text-[11px] border border-stone-300 rounded px-1.5 py-1 bg-white max-w-[42%]">
                    <option value="">Comme la voiture</option>
                    {pts.map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}
                  </select>
                  <button onClick={() => majT(id, { voitureId: "" })} className="text-red-600 px-1 text-sm">✕</button>
                </div>
                {tq && (<div className="px-3 pb-2">
                  <span className="text-[11px] text-stone-500">↳ départ de traque : </span>
                  <select value={inf.departId || ""} onChange={(e) => majT(id, { departId: e.target.value })} className="text-[11px] border border-stone-300 rounded px-1.5 py-0.5 bg-white">
                    <option value="">à définir…</option>
                    {departs.map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}
                  </select>
                </div>)}
              </div>); })}
          </div>
          {choix === v.id
            ? <ListeLibres titre={"Qui monte avec " + nom(v.conducteurId) + " ?"} onChoisir={(hid) => majT(hid, { voitureId: v.id, deposeId: (transport[hid] || {}).deposeId || v.deposeId || "" })} />
            : <button onClick={() => setChoix(v.id)} className="w-full text-[12px] text-emerald-800 py-2 border-t border-stone-100">+ Ajouter un passager</button>}
        </div>);
      })}

      {choix === "conducteur"
        ? <div className="bg-white border border-stone-200 rounded-xl overflow-hidden"><ListeLibres titre="Qui conduit ?" onChoisir={designerConducteur} /></div>
        : <button onClick={() => setChoix("conducteur")} className="w-full text-[12px] text-stone-700 bg-white border border-stone-300 rounded-lg py-2">+ Désigner un conducteur</button>}
    </div>

    {sansVoiture.length > 0 && (<div className="bg-amber-50 border border-amber-300 rounded-lg p-2.5">
      <p className="text-[12px] text-amber-900"><b>{sansVoiture.length} personne(s) sans voiture</b> sur cette traque — {sansVoiture.map(nom).join(", ")}</p>
    </div>)}
  </div>);
}

// ---------- Pose des points, traque par traque ----------
// Onglets de traque comme pour les miradors : chaque traque a ses propres points.
function PointsView({ terrain, journee, onAjouter, onRenommer, onSupprimer, onDeplacer, onBack }) {
  const tracks = terrain.tracks || [];
  const [ti, setTi] = useState(0);
  const [type, setType] = useState("terr");   // terr | jour | depart
  const [renomme, setRenomme] = useState(null);
  const boxRef = useRef(null);
  const tap = useRef(null);
  const track = tracks[ti];
  const imgSecteur = imageDe(terrain, track);
  const ar = useImageAR(imgSecteur);
  const crop = (track && track.crop) || { ...FULL_CROP };
  const listes = track ? {
    terr: track.deposes || [],
    jour: (journee.deposesJourParTraque || {})[track.id] || [],
    depart: track.departs || []
  } : { terr: [], jour: [], depart: [] };
  const couleurs = { terr: "#1c1917", jour: "#b45309", depart: "#166534" };

  const drag = useRef(null);
  const posDe = (e) => {
    const r = boxRef.current.getBoundingClientRect();
    return { gx: +(crop.x + ((e.clientX - r.left) / r.width) * crop.w).toFixed(2), gy: +(crop.y + ((e.clientY - r.top) / r.height) * crop.h).toFixed(2) };
  };
  const onMove = (e) => {
    if (!drag.current || !boxRef.current || !track || !onDeplacer) return;
    const p = posDe(e);
    onDeplacer(track.id, drag.current.type, drag.current.id, p.gx, p.gy);
  };
  const finDrag = () => { drag.current = null; tap.current = null; };
  const onDown = (e) => { tap.current = { x: e.clientX, y: e.clientY, t: Date.now() }; };
  const onUp = (e) => {
    const t = tap.current; tap.current = null;
    if (!t || !boxRef.current || !track) return;
    if (Math.hypot(e.clientX - t.x, e.clientY - t.y) > 12) return;
    if (Date.now() - t.t > 700) return;
    const r = boxRef.current.getBoundingClientRect();
    const gx = crop.x + ((e.clientX - r.left) / r.width) * crop.w;
    const gy = crop.y + ((e.clientY - r.top) / r.height) * crop.h;
    const base = type === "depart" ? "Départ" : "Dépose";
    const id = "pt-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    onAjouter(track.id, type, { id: id, nom: base + " " + ((listes[type] || []).length + 1), gx: +gx.toFixed(2), gy: +gy.toFixed(2) });
    setRenomme(id);
  };

  return (<div className="fixed inset-0 z-50 bg-stone-100 flex flex-col">
    <div className="bg-stone-900 text-stone-50 px-4 py-3 flex items-center gap-3 shrink-0" style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top))" }}>
      <button onClick={onBack} className="p-1 -ml-1"><ArrowLeft size={22} /></button>
      <h2 className="font-serif text-lg">Points de dépose</h2>
    </div>

    {tracks.length > 1 && (<div className="bg-stone-800 px-2 shrink-0">
      <div className="flex gap-1 overflow-x-auto">
        {tracks.map((t, k) => (
          <button key={t.id} onClick={() => setTi(k)} className={`px-3 py-2 text-[13px] font-medium rounded-t-lg whitespace-nowrap ${k === ti ? "bg-stone-100 text-stone-900" : "text-stone-300"}`}>
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: t.color }} />{t.name}
          </button>))}
      </div>
    </div>)}

    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto p-3.5 space-y-3">
        {!track ? <p className="text-sm text-stone-500 italic">Ce territoire n'a pas encore de traque.</p> : (<>
          <div className="flex gap-1.5">
            {[["terr", "📍 Territoire"], ["jour", "📍 Ce jour"], ["depart", "🚩 Départ"]].map(([k, lab]) => (
              <button key={k} onClick={() => setType(k)} className={`flex-1 text-[12px] font-medium py-2 rounded-md border ${type === k ? "text-stone-50 border-transparent" : "bg-white text-stone-700 border-stone-300"}`}
                style={type === k ? { background: couleurs[k] } : {}}>{lab}</button>))}
          </div>
          <p className="text-[11px] text-stone-500">
            {type === "terr" ? "Points de cette traque, réutilisés à chaque battue."
              : type === "jour" ? "Points de cette traque, valables pour cette journée seulement."
              : "Point où un traqueur commence cette traque."}
            {" Touche la carte pour en poser un, glisse un point pour le déplacer."}
          </p>

          {imgSecteur ? (
            <div ref={boxRef} onPointerDown={onDown} onPointerMove={onMove}
              onPointerUp={(e) => { if (drag.current) { finDrag(); return; } onUp(e); }} onPointerCancel={finDrag}
              style={{ ...cropWrapperStyle(crop, ar), touchAction: "none" }}
              className="border border-stone-300 select-none relative">
              <div style={cropBgStyle(imgSecteur, crop)} />
              <ZoneSvg zone={track.zone} crop={crop} color={track.color} fermee={track.zoneFermee} />
              {(track.miradors || []).map((m) => {
                const lx = ((m.gx - crop.x) / crop.w) * 100, ly = ((m.gy - crop.y) / crop.h) * 100;
                if (lx < -3 || lx > 103 || ly < -3 || ly > 103) return null;
                return (<div key={m.id} style={{ position: "absolute", left: `${lx}%`, top: `${ly}%` }} className="-translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                  <span className="block w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: track.color }} />
                </div>); })}
              {["terr", "jour", "depart"].map((k) => (listes[k] || []).map((d) => {
                const lx = ((d.gx - crop.x) / crop.w) * 100, ly = ((d.gy - crop.y) / crop.h) * 100;
                const actif = k === type;
                return (<div key={k + d.id}
                  onPointerDown={actif ? ((e) => { e.stopPropagation(); e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} drag.current = { id: d.id, type: k }; }) : undefined}
                  onPointerUp={actif ? ((e) => { if (drag.current) { e.stopPropagation(); finDrag(); } }) : undefined}
                  style={{ position: "absolute", left: `${lx}%`, top: `${ly}%`, touchAction: "none", pointerEvents: actif ? "auto" : "none" }} className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="w-4 h-4 rounded-full border-2 border-white shadow" style={{ background: couleurs[k] }} />
                  <span className="text-[9px] bg-white/90 rounded px-1 mt-0.5 whitespace-nowrap">{d.nom}</span>
                </div>); }))}
            </div>
          ) : <p className="text-sm text-stone-500 italic">Ce territoire n'a pas encore de carte.</p>}

          <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-100">
            {(listes[type] || []).length === 0 && <p className="text-sm text-stone-400 italic px-3 py-3">Aucun point pour l'instant.</p>}
            {(listes[type] || []).map((d) => (<div key={d.id} className="flex items-center gap-2 px-3 py-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: couleurs[type] }} />
              <input value={d.nom} onChange={(e) => onRenommer(track.id, type, d.id, e.target.value.slice(0, 40))}
                onFocus={(e) => e.target.select()} ref={(el) => { if (el && renomme === d.id) { el.focus(); el.select(); setRenomme(null); } }}
                className="flex-1 min-w-0 text-sm text-stone-800 bg-transparent border-b border-transparent focus:border-stone-300 focus:bg-white rounded px-1 py-0.5" />
              <button onClick={() => { if (window.confirm("Supprimer « " + d.nom + " » ?")) onSupprimer(track.id, type, d.id); }} className="text-red-600 px-1 text-sm">✕</button>
            </div>))}
          </div>
        </>)}
      </div>
    </div>
  </div>);
}

function PosterFusils({ rabatIds, onRabat, onPoste, verrouNums, terrain, track, placements, participants, presentIds, journeeArmes, onSetArme, chefs, chefLignes, rdv, onSetRdv, onBack, onAssign, onUnassign, onAutoFill, onClearAll, arrows, onAddArrow, onClearArrows, onUpdateArrow, onDeleteArrow }) {
  const [selectedHunter, setSelectedHunter] = useState(null);
  const [flagChef, setFlagChef] = useState(null);
  const chefList = (chefs || []).map((cid) => participants.find((p) => p.id === cid)).filter(Boolean);
  const rdvList = Object.entries(rdv || {}).map(([cid, pos]) => { const c = participants.find((p) => p.id === cid); return c && pos ? { chefId: cid, chefName: c.name, gx: pos.gx, gy: pos.gy } : null; }).filter(Boolean);
  const armeOfHunter = (h) => ((journeeArmes && journeeArmes[h.id]) || h.arme || null);
  const assignWithCheck = (hid, mid) => { const h = participants.find((x) => x.id === hid); const m = track.miradors.find((x) => x.id === mid); if (h && m && !armeOk(armesList(m), armeOfHunter(h))) { if (!window.confirm("⚠️ " + (h.name || "Ce chasseur") + " est en " + (armeLabel(armeOfHunter(h)) || "arme non renseignée") + " et le poste " + m.label + " accepte : " + armesLabel(armesList(m)) + ".\n\nPlacer quand même ?")) return; } onAssign(hid, mid); };
  const assignedIds = Object.keys(placements);
  const auRabat = rabatIds || [];
  const pending = participants.filter((p) => (presentIds || []).includes(p.id) && p.role !== "rabatteur" && !assignedIds.includes(p.id) && auRabat.indexOf(p.id) < 0).sort((a, b) => byNom(a.name || "", b.name || ""));
  const rabatList = participants.filter((p) => (presentIds || []).includes(p.id) && auRabat.indexOf(p.id) >= 0).sort((a, b) => byNom(a.name || "", b.name || ""));
  const freeMiradors = track.miradors.filter((m) => !Object.values(placements).includes(m.id));
  const sortedFree = [...freeMiradors].sort((a, b) => (a.priority || 1) - (b.priority || 1) || a.label.localeCompare(b.label));
  // Surbrillance par PALIER de priorité : toute la priorité 1, puis 2, etc. jusqu'à couvrir le nb de chasseurs
  const freeByPrio = {}; sortedFree.forEach((m) => { const pr = m.priority || 1; (freeByPrio[pr] = freeByPrio[pr] || []).push(m); });
  const prios = Object.keys(freeByPrio).map(Number).sort((a, b) => a - b);
  const recommendedIds = new Set(); let acc = 0;
  for (const pr of prios) { freeByPrio[pr].forEach((m) => recommendedIds.add(m.id)); acc += freeByPrio[pr].length; if (acc >= pending.length) break; }
  const hasPlacements = Object.keys(placements).length > 0;
  return (<div className="space-y-3"><button onClick={onBack} className="flex items-center gap-1 text-sm text-stone-500"><ArrowLeft size={14} /> Retour à la journée</button>
    <h3 className="font-serif text-lg text-stone-800">Poster les fusils — {track.name}</h3>
    <div className="grid sm:grid-cols-3 gap-3"><HunterList pending={pending} selectedHunter={selectedHunter} setSelectedHunter={setSelectedHunter} armeOf={armeOfHunter} onSetArme={onSetArme} onRabat={onRabat ? (hid) => { if (selectedHunter === hid) setSelectedHunter(null); onRabat(hid); } : null} onPoste={onPoste} rabatList={rabatList} verrouNums={verrouNums} />
      <SectionCard className="p-3 sm:col-span-2">
        <div className="flex items-center justify-between mb-2 gap-2 flex-wrap"><p className="text-xs uppercase tracking-wide text-stone-400">Le chiffre = priorité · liseré vert = à utiliser</p><div className="flex gap-1.5">{pending.length > 0 && freeMiradors.length > 0 && <button onClick={() => onAutoFill(track, pending, sortedFree)} className="text-xs font-medium bg-emerald-700 text-stone-50 px-2.5 py-1 rounded">Remplir par priorité</button>}{hasPlacements && <button onClick={() => onClearAll(track)} className="text-xs font-medium bg-stone-200 hover:bg-stone-300 text-stone-700 px-2.5 py-1 rounded">Décocher tous</button>}</div></div>
        {chefList.length > 0 && (<div className="mb-2 bg-amber-50 border border-amber-200 rounded-md p-2">
          <p className="text-[11px] font-semibold text-amber-800 mb-1.5">🚩 Lieu de RDV après la traque — choisis un chef puis tape la carte</p>
          <div className="flex gap-1.5 flex-wrap">{chefList.map((c) => { const on = flagChef === c.id; const has = (rdv || {})[c.id]; return (<button key={c.id} onClick={() => setFlagChef(on ? null : c.id)} className={`text-xs font-medium px-2 py-1 rounded border ${on ? "bg-amber-700 text-white border-amber-700" : "bg-white text-stone-700 border-stone-300"}`}>{has ? "🚩 " : ""}{c.name}</button>); })}
            {flagChef && (rdv || {})[flagChef] && <button onClick={() => { onSetRdv(flagChef, null); }} className="text-xs text-red-700 px-2 py-1 rounded border border-red-200 bg-white">Retirer</button>}</div>
          {flagChef && <p className="text-[11px] text-amber-700 mt-1">Tape la carte pour poser le drapeau de {(chefList.find((c) => c.id === flagChef) || {}).name}.</p>}
        </div>)}
        {!imageDe(terrain, track) ? <MapNotice>Carte manquante pour ce secteur. Importe ta sauvegarde ou rajoute la capture (onglet Territoires).</MapNotice>
          : track.miradors.length === 0 ? <MapNotice>Cette traque n'a pas de miradors (onglet Territoires).</MapNotice>
          : <AssignSurface image={imageDe(terrain, track)} track={track} placements={placements} participants={participants} selectedHunter={selectedHunter} setSelectedHunter={setSelectedHunter} onAssign={assignWithCheck} onUnassign={onUnassign} recommendedIds={recommendedIds} arrows={arrows} onAddArrow={onAddArrow} onClearArrows={onClearArrows} onUpdateArrow={onUpdateArrow} onDeleteArrow={onDeleteArrow} flagMode={!!flagChef} rdvList={rdvList} onSetRdv={(g) => { if (flagChef) { onSetRdv(flagChef, g); setFlagChef(null); } }} />}</SectionCard></div>
  </div>);
}

// ---------- Envoi WhatsApp aux chasseurs ----------
function buildHunterText(p, terrain, assigns, journee, safety) {
  const d = new Date(journee.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const prenom = p.name.split(" ")[0];
  let t = `🦌 Battue du ${d} — ${terrain.name}\n\nBonjour ${prenom}, voici ${assigns.length > 1 ? "tes postes" : "ton poste"} :`;
  assigns.forEach((a) => { t += `\n• ${a.track.name} → ${a.mirador.label}`; if (a.mirador.consignes) t += `\n   ⚠️ ${a.mirador.consignes}`; });
  t += `\n\n🔔 Sonneries :`; safety.sonneries.forEach((s) => { t += `\n• ${s.evenement} : ${s.signal}`; });
  t += `\n\n🛡️ Sécurité :`; safety.consignes.forEach((c) => { t += `\n• ${c}`; });
  return t;
}
function getAssignments(journee, terrain, hunterId) {
  const res = [];
  (terrain.tracks || []).forEach((track) => { const pl = journee.placements[track.id] || {}; const mid = pl[hunterId]; if (mid) { const mirador = track.miradors.find((m) => m.id === mid); if (mirador) res.push({ track, mirador }); } });
  return res;
}
function EnvoiChasseurs({ journee, terrain, participants, safety, onBack }) {
  const [busy, setBusy] = useState(null);
  const hunterIds = new Set(); Object.values(journee.placements || {}).forEach((pl) => Object.keys(pl).forEach((hid) => hunterIds.add(hid)));
  const hunters = [...hunterIds].map((id) => participants.find((p) => p.id === id)).filter(Boolean);
  const sendText = (p) => { const assigns = getAssignments(journee, terrain, p.id); const text = buildHunterText(p, terrain, assigns, journee, safety); const ph = waPhone(p.phone); window.open(`https://wa.me/${ph}?text=${encodeURIComponent(text)}`, "_blank"); };
  const sendVisual = async (p) => {
    setBusy(p.id);
    try {
      const assigns = getAssignments(journee, terrain, p.id); const files = [];
      for (const a of assigns) { const imgA = imageDe(terrain, a.track); if (imgA) files.push(await buildTrackImage(imgA, a.track, a.mirador.id, `${p.name.split(" ")[0]} — ${a.mirador.label}`, `${a.track.name} · ${terrain.name}`)); (a.mirador.photos || []).forEach((ph, i) => files.push(dataUrlToFile(ph, `poste-photo-${i + 1}.jpg`))); }
      const text = buildHunterText(p, terrain, assigns, journee, safety);
      if (navigator.canShare && files.length && navigator.canShare({ files })) { await navigator.share({ text, files }); }
      else { files.forEach((f) => { const u = URL.createObjectURL(f); const a = document.createElement("a"); a.href = u; a.download = f.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 1000); }); const ph = waPhone(p.phone); window.open(`https://wa.me/${ph}?text=${encodeURIComponent(text)}`, "_blank"); }
    } catch (e) { if (e && e.name !== "AbortError") window.alert("Partage impossible : " + (e.message || e)); } finally { setBusy(null); }
  };
  return (<div className="space-y-3"><button onClick={onBack} className="flex items-center gap-1 text-sm text-stone-500"><ArrowLeft size={14} /> Retour à la journée</button>
    <h3 className="font-serif text-lg text-stone-800 flex items-center gap-2"><Send size={18} className="text-emerald-800" /> Envoyer les postes aux chasseurs</h3>
    <p className="text-xs text-stone-500">Chaque chasseur reçoit son poste, le territoire et les consignes. Jamais les invités, le dîner ni les rabatteurs.</p>
    {hunters.length === 0 && <SectionCard className="p-4"><p className="text-sm text-stone-500 italic">Aucun chasseur posté. Va d'abord « Poster les fusils ».</p></SectionCard>}
    {hunters.map((p) => { const assigns = getAssignments(journee, terrain, p.id);
      return (<SectionCard key={p.id} className="p-3">
        <div className="flex items-center justify-between gap-2 mb-2"><div className="min-w-0"><p className="font-medium text-stone-800 truncate">🦌 {p.name}</p><p className="text-xs text-stone-500 truncate">{assigns.map((a) => `${a.track.name}: ${a.mirador.label}`).join(" · ") || "non posté"}</p>{!p.phone && <p className="text-[11px] text-amber-700">Pas de téléphone — WhatsApp ouvrira sans destinataire.</p>}</div></div>
        <div className="flex gap-2"><button onClick={() => sendText(p)} className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-stone-50 text-sm font-medium px-3 py-2 rounded-md"><Send size={15} /> Message</button>
          <button onClick={() => sendVisual(p)} disabled={busy === p.id} className="flex-1 flex items-center justify-center gap-1.5 bg-stone-700 hover:bg-stone-800 disabled:bg-stone-300 text-stone-50 text-sm font-medium px-3 py-2 rounded-md"><Share2 size={15} /> {busy === p.id ? "…" : "Image du poste"}</button></div>
      </SectionCard>); })}
  </div>);
}

// ---------- Publication en ligne (page chasseurs) ----------
function toBase64Utf8(str) { const bytes = new TextEncoder().encode(str); let bin = ""; bytes.forEach((b) => (bin += String.fromCharCode(b))); return btoa(bin); }
function fromBase64Utf8(b64) { const bin = atob(String(b64).replace(/\s/g, "")); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder().decode(bytes); }
async function githubPutFile(opts) {
  const base = "https://api.github.com/repos/" + opts.owner + "/" + opts.repo + "/contents/" + opts.path;
  const H = { Authorization: "Bearer " + opts.token, Accept: "application/vnd.github+json" };
  const getSha = async () => { try { const r = await fetch(base + "?ref=main&t=" + Date.now(), { headers: H, cache: "no-store" }); if (r.ok) { const j = await r.json(); return j.sha; } } catch (e) {} return undefined; };
  const put = async (sha) => { const body = { message: opts.message, content: opts.content, branch: "main" }; if (sha) body.sha = sha; return fetch(base, { method: "PUT", headers: { ...H, "Content-Type": "application/json" }, body: JSON.stringify(body) }); };
  let res = await put(await getSha());
  if (res.status === 409 || res.status === 422) { res = await put(await getSha()); }
  if (!res.ok) { const t = await res.text(); throw new Error("Code " + res.status + " — " + t.slice(0, 180)); }
  return true;
}

