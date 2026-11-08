function TableauSection({ j, terrain, participants, onAddKill, onUpdateKill, onRemoveKill, onSetShot, onSetState }) {
  const [sub, setSub] = useState("final");
  const shots = j.shots || {};
  const pName = (id) => participants.find((p) => p.id === id)?.name || "?";
  const totalPris = (j.tableau || []).reduce((s, k) => s + (Number(k.quantite) || 0), 0);
  const balleRows = [];
  let totalBalles = 0;
  (terrain?.tracks || []).forEach((trk) => { const pl = j.placements[trk.id] || {}; Object.entries(pl).forEach(([hid, mid]) => { const m = trk.miradors.find((x) => x.id === mid); balleRows.push({ trackId: trk.id, trackName: trk.name, mid, label: m ? m.label : "?", hunter: pName(hid) }); totalBalles += Number((shots[trk.id] || {})[mid]) || 0; }); });
  return (<div className="mt-1 border-t border-stone-200 pt-2 space-y-2">
    <div className="flex items-center gap-1"><BookOpen size={13} className="text-stone-400" /><div className="flex gap-1">
      <button onClick={() => setSub("final")} className={`text-xs font-medium px-2.5 py-1 rounded ${sub === "final" ? "bg-emerald-800 text-stone-50" : "bg-stone-100 text-stone-600"}`}>Tableau final</button>
      <button onClick={() => setSub("balles")} className={`text-xs font-medium px-2.5 py-1 rounded ${sub === "balles" ? "bg-emerald-800 text-stone-50" : "bg-stone-100 text-stone-600"}`}>Balles / poste</button>
    </div><span className="ml-auto text-xs text-stone-500">{sub === "final" ? totalPris + " pris" : totalBalles + " balles"}</span></div>
    {sub === "final" ? (<>
      {(j.tableau || []).length === 0 && <p className="text-xs text-stone-400 italic">Aucun animal noté. Ajoute une prise.</p>}
      {(j.tableau || []).map((k) => (<div key={k.id} className={`border rounded-md p-2 space-y-2 ${k.source === "chasseur" ? "bg-emerald-50 border-emerald-300" : "bg-white border-stone-200"}`}>
        {k.source === "chasseur" && <p className="text-[10px] font-medium text-emerald-700">🦌 Déclaré par le chasseur — modifiable</p>}
        <div className="flex gap-1 flex-wrap">{ESPECES.filter((e) => e.key === "autre" || e.key === k.espece || (terrain && terrain.planChasse && terrain.planChasse[e.key] && terrain.planChasse[e.key].enabled)).map((e) => (<button key={e.key} onClick={() => onUpdateKill(k.id, { espece: e.key })} className={`px-2 py-1 rounded text-xs font-medium border ${k.espece === e.key ? "bg-emerald-800 text-stone-50 border-emerald-800" : "bg-stone-100 text-stone-600 border-stone-200"}`}>{e.emoji} {e.label}</button>))}
          <button onClick={() => onRemoveKill(k.id)} className="ml-auto text-stone-400 hover:text-red-700"><X size={15} /></button></div>
        {k.espece === "autre" && <input value={k.especeLabel || ""} onChange={(e) => onUpdateKill(k.id, { especeLabel: e.target.value })} placeholder="Quelle espèce ?" className="w-full border border-stone-300 rounded px-2 py-1 text-sm bg-white" />}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1"><span className="text-xs text-stone-500">Sexe :</span>
            <button onClick={() => onUpdateKill(k.id, { sexe: k.sexe === "M" ? "" : "M" })} className={`px-2 py-1 rounded text-xs font-medium border ${k.sexe === "M" ? "bg-sky-700 text-white border-sky-700" : "bg-stone-100 text-stone-600 border-stone-200"}`}>♂ Mâle</button>
            <button onClick={() => onUpdateKill(k.id, { sexe: k.sexe === "F" ? "" : "F" })} className={`px-2 py-1 rounded text-xs font-medium border ${k.sexe === "F" ? "bg-pink-700 text-white border-pink-700" : "bg-stone-100 text-stone-600 border-stone-200"}`}>♀ Femelle</button></div>
          <div className="flex items-center gap-1"><span className="text-xs text-stone-500">Poids :</span><input type="number" inputMode="decimal" step="0.1" min="0" onFocus={(e) => e.target.select()} value={k.poids ?? ""} onChange={(e) => onUpdateKill(k.id, { poids: e.target.value })} placeholder="kg" className="w-16 border border-stone-300 rounded px-2 py-1 text-sm bg-white" /><span className="text-xs text-stone-400">kg</span></div>
          <div className="flex items-center gap-1"><span className="text-xs text-stone-500">Bracelet :</span><input value={k.bracelet || ""} onChange={(e) => onUpdateKill(k.id, { bracelet: e.target.value })} placeholder="n°" className="w-24 border border-stone-300 rounded px-2 py-1 text-sm bg-white" /></div>
          <div className="flex items-center gap-1"><span className="text-xs text-stone-500">Traque :</span>
            <select value={k.trackId || ""} onChange={(e) => onUpdateKill(k.id, { trackId: e.target.value })} className="border border-stone-300 rounded px-2 py-1 text-sm bg-white max-w-[130px]"><option value="">—</option>{(terrain?.tracks || []).map((trk) => <option key={trk.id} value={trk.id}>{trk.name}</option>)}</select></div>
          <div className="flex items-center gap-1"><span className="text-xs text-stone-500">Tireur :</span>
            <select value={k.tireurId || ""} onChange={(e) => onUpdateKill(k.id, { tireurId: e.target.value })} className="border border-stone-300 rounded px-2 py-1 text-sm bg-white max-w-[150px]"><option value="">—</option>{participants.filter((p) => p.role !== "rabatteur").map((p) => <option key={p.id} value={p.id}>{p.name || "Sans nom"}</option>)}</select></div>
        </div>
      </div>))}
      <button onClick={onAddKill} className="w-full flex items-center justify-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-stone-50 text-sm font-medium px-3 py-2 rounded-md"><Plus size={15} /> Ajouter une prise</button>
    </>) : (<>
      {!terrain ? <p className="text-xs text-stone-400 italic">Choisis un territoire.</p> : balleRows.length === 0 ? <p className="text-xs text-stone-400 italic">Aucun poste occupé. Poste des chasseurs d'abord (bouton « Poster les fusils »).</p> : balleRows.map((r) => { const st = ((j.miradorStates || {})[r.trackId] || {})[r.mid]; const stColor = st ? (st.state === "Dangereux" ? "text-red-700" : st.state === "À réparer" ? "text-amber-700" : "text-emerald-700") : ""; return (<div key={r.trackId + r.mid} className="bg-white border border-stone-200 rounded-md p-2">
        <div className="flex items-center gap-2"><div className="flex-1 min-w-0"><p className="text-sm text-stone-800 truncate"><b>{r.trackName}</b> — {r.label}</p><p className="text-[10px] text-stone-400">{r.hunter}</p></div>
        <input type="number" inputMode="numeric" min="0" placeholder="0" onFocus={(e) => e.target.select()} value={(shots[r.trackId] || {})[r.mid] ?? ""} onChange={(e) => onSetShot(r.trackId, r.mid, e.target.value === "" ? "" : Number(e.target.value))} className="w-16 border border-stone-300 rounded px-2 py-1 text-sm bg-white" />
        <span className="text-xs text-stone-400">balles</span></div>
        {st && (st.state || st.comment) && <p className={`text-[11px] mt-1 ${stColor}`}>🛠️ Mirador : {st.state || "—"}{st.comment ? " — " + st.comment : ""}{st.hunter ? " (signalé par " + st.hunter + ")" : ""}</p>}
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap"><span className="text-[10px] uppercase tracking-wide text-stone-400">Mirador :</span>
          <select value={st?.state || ""} onChange={(e) => onSetState(r.trackId, r.mid, { state: e.target.value })} className="border border-stone-300 rounded px-1.5 py-1 text-xs bg-white"><option value="">—</option><option>Bon</option><option>À réparer</option><option>Dangereux</option></select>
          <input value={st?.comment || ""} onChange={(e) => onSetState(r.trackId, r.mid, { comment: e.target.value })} placeholder="commentaire" className="flex-1 min-w-[100px] border border-stone-300 rounded px-2 py-1 text-xs bg-white" /></div>
      </div>); })}
    </>)}
  </div>);
}

// ---------- Journées ----------
function SecWrap({ bare, children }) {
  if (bare) return <div className="space-y-2">{children}</div>;
  return <SectionCard className="p-3 space-y-2">{children}</SectionCard>;
}

// ---------- Ecran « Poster les fusils » : placement nominatif ou tirage au sort ----------
const PRIO_COUL = { 1: "bg-emerald-800 text-white", 2: "bg-emerald-300 text-emerald-950", 3: "bg-amber-200 text-amber-900", 4: "bg-stone-200 text-stone-700" };
function RabatSection({ journee, terrain, rows, verrouNums, onToggle, onToggleJamais, onMajRegle, onRepartir }) {
  const tracks = terrain.tracks || [];
  const rab = normRabat(journee.rabat);
  const rg = normRabatRegle(journee.rabatRegle);
  const t = normTirage(journee.tirage);
  const [ouvert, setOuvert] = useState(false);
  const [msg, setMsg] = useState("");
  const estR = (tid, hid) => !!(rab[tid] || {})[hid];
  const bloque = (hid) => !!(verrouNums && numDe(hid));
  const nbTot = rows.reduce((s, r) => s + tracks.filter((trk) => estR(trk.id, r.id)).length, 0);
  const manque = t.actif && t.nb > 0 && rows.some((r) => numDe(r.id) && tracks.some((trk) => !estR(trk.id, r.id) && !((journee.placements || {})[trk.id] || {})[r.id]));
  const Carte = ({ on, onClick, titre, sous }) => (<button onClick={onClick} className={`text-left rounded-xl border-2 p-2.5 ${on ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white"}`}><span className="block text-sm font-semibold text-stone-800">{titre}</span><span className="block text-[11.5px] text-stone-500 mt-0.5 leading-snug">{sous}</span></button>);
  const setNb = (tid, v) => onMajRegle({ nb: { ...rg.nb, [tid]: Math.max(0, Math.min(rows.length, v)) } });
  return (<div className="bg-white border border-stone-200 rounded-lg mb-3">
    <button onClick={() => setOuvert(!ouvert)} className="w-full text-left px-3 py-2.5 flex justify-between items-center gap-2">
      <span><span className="block text-sm font-medium text-stone-800">🟠 Fusils au rabat</span><span className="block text-[11.5px] text-stone-500">{nbTot ? nbTot + " place" + (nbTot > 1 ? "s" : "") + " au rabat sur la journée" : "Des fusils rabattent dans certaines traques ?"}</span></span>
      <span className="text-stone-400">{ouvert ? "▴" : "▾"}</span></button>
    {ouvert && (<div className="px-3 pb-3 pt-2.5 border-t border-stone-100 space-y-3">
      <p className="text-[12px] text-stone-500 leading-snug">Dans certaines traques, des fusils rabattent au lieu d'être postés. Un fusil au rabat n'a pas de poste dans cette traque : son poste reste libre pour un autre. Sur son lien, son livret ou son carton, il lit « 🟠 Tu rabats ».</p>
      {rows.length === 0 ? <p className="text-sm text-stone-400 italic">Aucun chasseur noté présent dans « Qui vient ? ».</p> : (<>
        <div className="border border-stone-200 rounded-lg p-2.5 space-y-2">
          <p className="text-sm font-semibold text-stone-800">1 · Répartition automatique</p>
          <p className="text-[11.5px] text-stone-500 leading-snug">L'app choisit qui rabat, à tour de rôle : personne ne rabat deux fois avant que tous aient rabattu une fois. Vous corrigez ensuite dans le tableau.</p>
          <div className="grid grid-cols-2 gap-2">
            <Carte on={rg.regle === "nombre"} onClick={() => { setMsg(""); onMajRegle({ regle: "nombre" }); }} titre="Nombre par traque" sous="Ex. Traque 2 : 3 fusils" />
            <Carte on={rg.regle === "alterne"} onClick={() => { setMsg(""); onMajRegle({ regle: "alterne" }); }} titre="Moitié / moitié" sous="Groupe A puis groupe B" />
          </div>
          {rg.regle === "nombre" ? (<div>
            <p className="text-[11px] uppercase tracking-wide text-stone-400 mb-1">Fusils au rabat par traque (0 = tout le monde posté)</p>
            {tracks.map((trk) => (<div key={trk.id} className="flex items-center justify-between gap-2 py-1 border-b border-stone-50 last:border-0">
              <span className="text-sm text-stone-800 truncate">{trk.name}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => setNb(trk.id, (rg.nb[trk.id] || 0) - 1)} aria-label="Un de moins" className="w-10 h-9 rounded-md border border-stone-300 bg-stone-50 text-lg text-stone-700">−</button>
                <span className="w-7 text-center font-semibold">{rg.nb[trk.id] || 0}</span>
                <button onClick={() => setNb(trk.id, (rg.nb[trk.id] || 0) + 1)} aria-label="Un de plus" className="w-10 h-9 rounded-md border border-stone-300 bg-stone-50 text-lg text-stone-700">+</button>
              </div></div>))}
          </div>) : (<p className="text-[12px] text-stone-600 bg-stone-50 border border-stone-200 rounded-md p-2 leading-snug">Les fusils sont coupés en deux groupes au hasard. Le groupe A rabat aux traques 1, 3, 5…, le groupe B aux traques 2, 4, 6… Chacun est posté une traque sur deux.</p>)}
          <button onClick={() => setMsg(onRepartir())} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-lg py-2.5">Répartir au rabat</button>
          {msg && <p className="text-[12.5px] text-stone-700 bg-stone-50 border border-stone-200 rounded-lg p-2">{msg}</p>}
        </div>

        <div className="border border-stone-200 rounded-lg p-2.5 space-y-2">
          <p className="text-sm font-semibold text-stone-800">2 · Tableau de la journée</p>
          <p className="text-[11.5px] text-stone-500 leading-snug">Touchez une case pour passer de Poste à Rabat. 🔒 = jamais mis au rabat par la répartition automatique (vous pouvez toujours le faire à la main).</p>
          <div className="overflow-x-auto -mx-1"><table className="text-[12.5px]" style={{ borderCollapse: "separate", borderSpacing: "3px" }}>
            <thead><tr className="text-[11px] text-stone-400">
              <th></th><th className="text-left font-medium px-1">Fusil</th>
              {tracks.map((trk) => <th key={trk.id} className="font-medium px-0.5"><span className="block max-w-[64px] truncate mx-auto">{trk.name}</span></th>)}
            </tr></thead>
            <tbody>{rows.map((r) => { const nR = tracks.filter((trk) => estR(trk.id, r.id)).length; const jam = rg.jamais.indexOf(r.id) >= 0; return (<tr key={r.id}>
              <td><button onClick={() => onToggleJamais(r.id)} aria-label={jam ? "Autoriser au rabat" : "Ne jamais mettre au rabat"} title={jam ? "Jamais au rabat" : "Peut rabattre"} className={`w-9 h-10 rounded-md border text-sm ${jam ? "bg-stone-200 border-stone-400" : "bg-white border-stone-200 opacity-40"}`}>🔒</button></td>
              <td className="px-1 min-w-[96px]"><span className="block font-medium text-stone-800 leading-tight">{r.name}</span><span className="block text-[10.5px] text-stone-400">{jam ? "jamais au rabat" : nR ? "rabat " + nR + " fois" : "toujours posté"}</span></td>
              {tracks.map((trk) => { const on = estR(trk.id, r.id); const lock = bloque(r.id); return (<td key={trk.id}>
                <button onClick={() => { if (!lock) onToggle(trk.id, r.id); }} className={`w-[56px] h-10 rounded-md text-[11.5px] ${on ? "border-2 border-orange-400 bg-orange-100 text-orange-900 font-bold" : "border border-stone-300 bg-white text-stone-600"} ${lock ? "opacity-50" : ""}`}>{on ? "Rabat" : "Poste"}</button></td>); })}
            </tr>); })}</tbody>
            <tfoot><tr className="text-[11px] text-stone-500"><td></td><td className="px-1 pt-1">Postés / rabat</td>
              {tracks.map((trk) => { const nr = rows.filter((r) => estR(trk.id, r.id)).length; return <td key={trk.id} className="text-center pt-1 leading-tight"><b className="text-emerald-800">{rows.length - nr}</b><br /><b className="text-orange-700">{nr}</b></td>; })}</tr></tfoot>
          </table></div>
          {verrouNums && <p className="text-[12px] text-stone-600 bg-stone-50 border border-stone-200 rounded p-2">🔒 Le lien a été envoyé : les numéros du tirage ne bougent plus. Débloquez la répartition du tirage pour les changer.</p>}
          {manque && !verrouNums && <p className="text-[12px] text-amber-800 bg-amber-50 rounded p-2">Des numéros n'ont ni poste ni rabat dans une traque : relancez la répartition des numéros (étape 3 du tirage).</p>}
        </div>

        <div className="border border-stone-200 rounded-lg p-2.5 space-y-2">
          <p className="text-sm font-semibold text-stone-800">3 · Au rabat, les fusils sont…</p>
          <div className="grid grid-cols-2 gap-2">
            <Carte on={rg.arme === "avec"} onClick={() => onMajRegle({ arme: rg.arme === "avec" ? "" : "avec" })} titre="Avec leur arme" sous="Traqueurs armés" />
            <Carte on={rg.arme === "sans"} onClick={() => onMajRegle({ arme: rg.arme === "sans" ? "" : "sans" })} titre="Sans arme" sous="Ils laissent leur fusil" />
          </div>
          <p className="text-[11.5px] text-stone-500">Réglage de la journée. Il s'imprime seulement sur votre feuille des postes, pas chez les chasseurs.</p>
        </div>
      </>)}
    </div>)}
  </div>);
}
function TirageSection({ journee, terrain, participants, presentIds, onMaj, onPlacer, onGenerer, onHasard, onQuitterTirage }) {
  const t = normTirage(journee.tirage);
  const tracks = terrain.tracks || [];
  const [aide, setAide] = useState("");
  const [hasardOuvert, setHasardOuvert] = useState(false);
  const [algoManuel, setAlgoManuel] = useState("equi");
  const [portee, setPortee] = useState("toutes");
  const [msgHasard, setMsgHasard] = useState("");
  const [arme, setArme] = useState("");
  const [nomsOuvert, setNomsOuvert] = useState(false);
  const presents = participants.filter((p) => presentIds.indexOf(p.id) >= 0 && p.role !== "rabatteur").sort((a, b) => byNom(a.name || "", b.name || ""));
  const reserves = t.reserves.filter((id) => presents.some((p) => p.id === id));
  const nbCartons = Math.max(0, presents.length - reserves.length);
  const verrou = t.actif && t.publie && t.nb > 0;
  const majT = (patch) => onMaj({ tirage: { ...t, ...patch } });
  const Q = ({ k }) => (<span role="button" aria-label="Explication" onClick={(e) => { e.stopPropagation(); setAide(aide === k ? "" : k); }} className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 text-xs font-bold flex items-center justify-center ${aide === k ? "border-emerald-700 text-emerald-800 bg-emerald-50" : "border-stone-400 text-stone-600 bg-white"}`}>?</span>);
  const Bulle = ({ k, children }) => (aide === k ? (<div className="relative bg-stone-900 text-stone-100 rounded-xl p-3 pr-8 text-[13px] leading-snug"><button onClick={() => setAide("")} className="absolute top-1.5 right-2.5 text-stone-400 text-base">✕</button>{children}</div>) : null);
  const Carte = ({ on, onClick, titre, sous, k }) => (<button onClick={onClick} className={`relative text-left rounded-xl border-2 p-3 pr-9 ${on ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white"}`}><span className="block text-sm font-semibold text-stone-800">{titre}</span><span className="block text-[11.5px] text-stone-500 mt-0.5 leading-snug">{sous}</span><Q k={k} /></button>);
  const exEqui = (<><b className="text-emerald-300">Aléatoire équilibré</b> — le hasard décide, mais l'app partage les bons postes sur la journée. Elle se base sur la <b>priorité</b> de vos postes : priorité 1 = meilleur poste, priorité 4 = moins bon. Celui qui a un poste de priorité 1 à une traque aura plutôt un poste de priorité 3 ou 4 aux autres, et inversement.<div className="mt-2 pt-2 border-t border-stone-700 text-stone-300 text-[12.5px]">Exemple : le n°4 a un poste de priorité 1 à la première traque → il aura plutôt des postes de fin de ligne ensuite. Sur la journée, chacun a à peu près la même chance.</div></>);
  const exComplet = (<><b className="text-emerald-300">Aléatoire complet</b> — chaque traque est tirée séparément, comme si on remettait tous les cartons dans le chapeau à chaque traque. Aucune règle.<div className="mt-2 pt-2 border-t border-stone-700 text-stone-300 text-[12.5px]">Conséquence : une même personne peut avoir trois fois un très bon poste… ou trois fois un moins bon. C'est le hasard pur, simple à expliquer, mais pas forcément juste sur la journée.</div></>);
  const changerMode = (tirage) => {
    if (tirage === t.actif) return;
    if (!tirage && t.nb > 0) { if (arme !== "manuel") { setArme("manuel"); return; } setArme(""); onQuitterTirage(); return; }
    setArme(""); majT({ actif: tirage });
  };
  const posteNum = (trk, n) => { const mid = ((journee.placements || {})[trk.id] || {})[NUM_ID(n)]; const i = (trk.miradors || []).findIndex((m) => m.id === mid); return i >= 0 ? { m: trk.miradors[i], i } : null; };
  const reservePlace = (trk) => reserves.filter((id) => ((journee.placements || {})[trk.id] || {})[id]).length;
  const nomsPris = Object.values(t.noms || {});
  const lancerHasard = () => { const r = onHasard(algoManuel, portee); setMsgHasard(r); };
  return (<div className="space-y-2.5">
    <p className="text-[11px] uppercase tracking-wide text-stone-400">Comment placer les chasseurs ?</p>
    <div className="grid grid-cols-2 gap-2">
      <Carte on={!t.actif} onClick={() => changerMode(false)} titre="👤 Placement nominatif" sous="Chacun à son nom : vous ou le hasard" k="manuel" />
      <Carte on={t.actif} onClick={() => changerMode(true)} titre="🎲 Tirage au sort" sous="Cartons tirés le matin, anonyme" k="tirage" />
    </div>
    <Bulle k="manuel"><b className="text-emerald-300">Placement nominatif</b> — chaque chasseur est placé avec son nom. Vous le placez vous-même sur la carte, traque par traque, ou vous demandez à l'app de les placer au hasard puis vous corrigez. Les livrets et le lien affichent le nom de chacun.<div className="mt-2 pt-2 border-t border-stone-700 text-stone-300 text-[12.5px]">À choisir si vous voulez décider qui va où, ou faire un hasard nominatif que vous pouvez retoucher. Les armes et les besoins (fauteuil, canne) sont respectés.</div></Bulle>
    <Bulle k="tirage"><b className="text-emerald-300">Tirage au sort</b> — l'app prépare à l'avance un numéro par chasseur présent. Chaque numéro a un poste dans <b>chaque traque</b> de la journée. Le matin, aux consignes, chacun tire un carton dans le chapeau et découvre ses postes.<div className="mt-2 pt-2 border-t border-stone-700 text-stone-300 text-[12.5px]">À choisir quand les chasseurs veulent l'équité : personne ne choisit. Livrets et lien sont anonymes (numéro seulement). Les armes ne sont pas prises en compte : placez à la main ceux qui ont un besoin particulier.</div></Bulle>
    {arme === "manuel" && (<div className="bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-[12.5px] text-amber-900">Repasser en placement nominatif retire les {t.nb} numéros des postes. <button onClick={() => changerMode(false)} className="ml-1 font-semibold underline">Confirmer</button> · <button onClick={() => setArme("")} className="underline">Annuler</button></div>)}

    {!t.actif && (<div className="bg-white border border-stone-200 rounded-lg">
      <button onClick={() => setHasardOuvert(!hasardOuvert)} className="w-full text-left px-3 py-2.5 text-sm font-medium text-stone-800 flex justify-between"><span>🎲 Placer au hasard (nominatif)</span><span className="text-stone-400">{hasardOuvert ? "▴" : "▾"}</span></button>
      {hasardOuvert && (<div className="px-3 pb-3 space-y-2.5 border-t border-stone-100 pt-2.5">
        <div className="grid grid-cols-2 gap-2">
          <Carte on={algoManuel === "equi"} onClick={() => setAlgoManuel("equi")} titre="⚖️ Équilibré" sous="Bons postes partagés · recommandé" k="equi-m" />
          <Carte on={algoManuel === "complet"} onClick={() => setAlgoManuel("complet")} titre="🎲 Complet" sous="Pur hasard à chaque traque" k="complet-m" />
        </div>
        <Bulle k="equi-m">{exEqui}</Bulle>
        <Bulle k="complet-m">{exComplet}</Bulle>
        <label className="block text-[11px] uppercase tracking-wide text-stone-400">Sur quelles traques ?</label>
        <select value={portee} onChange={(e) => setPortee(e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="toutes">Toutes les traques</option>
          {tracks.map((trk) => <option key={trk.id} value={trk.id}>{trk.name}</option>)}
        </select>
        <p className="text-[11.5px] text-stone-500">Les chasseurs déjà placés ne bougent pas : seuls les autres sont placés. Les armes du jour et les besoins (fauteuil, canne) sont respectés. Vous pouvez tout corriger ensuite sur la carte.</p>
        <button onClick={lancerHasard} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-lg py-2.5">🎲 Placer les chasseurs restants</button>
        {msgHasard && <p className="text-[12.5px] text-stone-700 bg-stone-50 border border-stone-200 rounded-lg p-2">{msgHasard}</p>}
      </div>)}
    </div>)}

    {t.actif && (<div className="space-y-2.5">
      <div className="bg-white border border-stone-200 rounded-lg p-3">
        <p className="text-sm font-semibold text-stone-800">1 · Des chasseurs à placer à la main ?</p>
        <p className="text-[11.5px] text-stone-500 mb-1.5">Handicap, chef de ligne, personne âgée… Cochez ceux qui ne tirent pas de carton : vous choisirez leurs postes vous-même.</p>
        {presents.length === 0 && <p className="text-sm text-stone-400 italic">Aucun chasseur noté présent dans « Qui vient ? ».</p>}
        {presents.map((p) => { const on = reserves.indexOf(p.id) >= 0; return (<label key={p.id} className="flex items-center gap-2.5 py-1.5 text-sm text-stone-800 border-b border-stone-50 last:border-0">
          <input type="checkbox" checked={on} disabled={verrou} onChange={() => majT({ reserves: on ? t.reserves.filter((x) => x !== p.id) : [...t.reserves, p.id] })} className="w-4 h-4 accent-emerald-700" />
          <span className="flex-1">{p.name}</span>
          {p.mobility === "fauteuil" && <span className="text-[11px] bg-sky-100 text-sky-800 rounded px-1.5">♿ fauteuil</span>}
          {p.mobility === "canne" && <span className="text-[11px] bg-sky-100 text-sky-800 rounded px-1.5">🦯 canne</span>}
          {on && <span className="text-[11px] font-semibold bg-stone-100 text-stone-600 rounded px-1.5">✋ à la main</span>}
        </label>); })}
        {presents.some((p) => (p.mobility === "fauteuil" || p.mobility === "canne") && reserves.indexOf(p.id) < 0) && <p className="text-[12px] text-amber-800 bg-amber-50 rounded p-2 mt-1.5">♿ Un chasseur a un besoin particulier : pensez à le cocher pour le placer sur un poste adapté.</p>}
        <p className="text-[12.5px] text-stone-700 mt-2"><b>{nbCartons}</b> carton{nbCartons > 1 ? "s" : ""} à tirer{reserves.length ? " · " + reserves.length + " placé" + (reserves.length > 1 ? "s" : "") + " à la main" : ""}</p>
        {reserves.length > 0 && (<div className="mt-2 space-y-1.5">{tracks.map((trk) => { const n = reservePlace(trk); return (<div key={trk.id} className="flex items-center justify-between gap-2 text-[12.5px]"><span className="text-stone-700">{trk.name} : <b className={n < reserves.length ? "text-amber-700" : "text-emerald-700"}>{n}/{reserves.length}</b> placé{reserves.length > 1 ? "s" : ""}</span><button onClick={() => onPlacer(trk.id)} className="shrink-0 text-xs font-medium bg-emerald-800 text-white px-2.5 py-1 rounded-md">Placer</button></div>); })}</div>)}
      </div>

      <div className="bg-white border border-stone-200 rounded-lg p-3 space-y-2">
        <p className="text-sm font-semibold text-stone-800">2 · Règle du tirage</p>
        <div className="grid grid-cols-2 gap-2">
          <Carte on={t.algo === "equi"} onClick={() => !verrou && majT({ algo: "equi" })} titre="⚖️ Équilibré" sous="Bons postes partagés · recommandé" k="equi" />
          <Carte on={t.algo === "complet"} onClick={() => !verrou && majT({ algo: "complet" })} titre="🎲 Complet" sous="Pur hasard à chaque traque" k="complet" />
        </div>
        <Bulle k="equi">{exEqui}</Bulle>
        <Bulle k="complet">{exComplet}</Bulle>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg p-3 space-y-2">
        <p className="text-sm font-semibold text-stone-800">3 · Répartition des numéros</p>
        {reserves.length > 0 && tracks.some((trk) => reservePlace(trk) < reserves.length) && !verrou && <p className="text-[12px] text-amber-800 bg-amber-50 rounded p-2">Placez d'abord les chasseurs « à la main » sur toutes les traques, sinon le tirage peut prendre leurs postes.</p>}
        {!verrou && <button onClick={onGenerer} disabled={!nbCartons} className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white text-sm font-semibold rounded-lg py-2.5">{t.nb ? "🔄 Relancer la répartition" : "🎲 Préparer la répartition"} ({nbCartons} carton{nbCartons > 1 ? "s" : ""})</button>}
        {t.nb > 0 && t.nb !== nbCartons && !verrou && <p className="text-[12px] text-amber-800">La liste des présents a changé ({t.nb} numéros préparés, {nbCartons} attendus) : relancez la répartition.</p>}
        {t.nb > 0 && (<div className="overflow-x-auto"><table className="w-full text-[12.5px]"><thead><tr className="text-[11px] text-stone-400"><th className="text-left py-1 pr-1"></th>{tracks.map((trk) => <th key={trk.id} className="text-left py-1 px-1 font-medium">{trk.name}</th>)}<th className="text-right py-1 pl-1 font-medium">Total</th></tr></thead>
          <tbody>{Array.from({ length: t.nb }, (_, k) => k + 1).map((n) => { let tot = 0; return (<tr key={n} className="border-t border-stone-100"><td className="py-1 pr-1 font-serif font-bold text-[15px]">n°{n}</td>{tracks.map((trk) => { const x = posteNum(trk, n); if (x) tot += Number(x.m.priority) || 1; return (<td key={trk.id} className="py-1 px-1">{x ? <span className={`inline-block min-w-[40px] text-center rounded px-1.5 py-0.5 font-semibold ${PRIO_COUL[Number(x.m.priority) || 1] || PRIO_COUL[4]}`}>{x.m.label || numeroPoste(x.m, x.i)}</span> : (((journee.rabat || {})[trk.id] || {})[NUM_ID(n)] ? <span className="inline-block min-w-[40px] text-center rounded px-1.5 py-0.5 font-semibold bg-orange-100 text-orange-800">Rabat</span> : <span className="text-red-600">—</span>)}</td>); })}<td className="py-1 pl-1 text-right text-stone-400">{tot}</td></tr>); })}</tbody></table>
          <p className="text-[11px] text-stone-500 mt-1.5">Couleur = priorité du poste (vert foncé = 1). Total = somme des priorités sur la journée : plus les totaux sont proches, plus c'est équitable.</p></div>)}
        {t.manques.length > 0 && <p className="text-[12px] text-red-700 bg-red-50 rounded p-2">⚠ Pas assez de postes libres : {t.manques.length} place{t.manques.length > 1 ? "s" : ""} manquante{t.manques.length > 1 ? "s" : ""} ({Array.from(new Set(t.manques.map((x) => (tracks.find((trk) => trk.id === x.trackId) || {}).name))).join(", ")}).</p>}
        {verrou ? (<div className="text-[12.5px] text-stone-700 bg-stone-50 border border-stone-200 rounded-lg p-2.5">🔒 <b>Répartition bloquée</b> : le lien a été envoyé aux chasseurs. Les livrets imprimés et le lien restent justes.
          <div className="mt-1.5">{arme === "deverrou" ? <><button onClick={() => { setArme(""); majT({ publie: false }); }} className="font-semibold text-red-700 underline">Confirmer le déblocage</button> <span className="text-stone-500">— il faudra réimprimer les livrets et mettre à jour le lien.</span></> : <button onClick={() => setArme("deverrou")} className="underline text-stone-600">Débloquer…</button>}</div></div>)
          : (t.nb > 0 && <p className="text-[11.5px] text-stone-500">🔓 Vous pouvez relancer autant que vous voulez. La répartition se bloquera dès que le lien sera envoyé aux chasseurs.</p>)}
      </div>

      {t.nb > 0 && (<div className="bg-white border border-stone-200 rounded-lg">
        <button onClick={() => setNomsOuvert(!nomsOuvert)} className="w-full text-left px-3 py-2.5 text-sm font-medium text-stone-800 flex justify-between"><span>4 · Après le tirage : qui a tiré quel numéro ? <span className="text-stone-400 font-normal">(facultatif)</span></span><span className="text-stone-400">{nomsOuvert ? "▴" : "▾"}</span></button>
        {nomsOuvert && (<div className="px-3 pb-3 border-t border-stone-100 pt-2 space-y-1.5">
          <p className="text-[11.5px] text-stone-500">Si vous le notez, la feuille des postes et le résumé affichent aussi les noms. Les livrets et le lien restent anonymes.</p>
          {Array.from({ length: t.nb }, (_, k) => k + 1).map((n) => (<div key={n} className="flex items-center gap-2"><span className="w-11 font-serif font-bold">n°{n}</span>
            <select value={t.noms[n] || ""} onChange={(e) => { const noms = { ...t.noms }; if (e.target.value) noms[n] = e.target.value; else delete noms[n]; majT({ noms }); }} className="flex-1 border border-stone-300 rounded-lg px-2 py-1.5 text-sm bg-white">
              <option value="">— pas noté —</option>
              {presents.filter((p) => reserves.indexOf(p.id) < 0 && (t.noms[n] === p.id || nomsPris.indexOf(p.id) < 0)).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select></div>))}
          <label className="block text-[11px] uppercase tracking-wide text-stone-400 pt-1.5">Précisions (texte libre)</label>
          <textarea value={t.note} onChange={(e) => majT({ note: e.target.value })} rows={3} placeholder="Échanges de cartons, remarques sur le tirage…" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm" />
        </div>)}
      </div>)}
    </div>)}
  </div>);
}
function ChefsSection({ journee, terrain, participants, journees, onSet, onToggleChef, onSetChefLigne, onAssignPosts, bare }) {
  const [open, setOpen] = useState(false);
  const placedPosts = []; (terrain.tracks || []).forEach((trk) => { const pl = journee.placements[trk.id] || {}; Object.entries(pl).forEach(([hid, mid]) => { const m = (trk.miradors || []).find((x) => x.id === mid); if (!m) return; const p = participants.find((x) => x.id === hid); placedPosts.push({ mid, label: m.label, trackId: trk.id, traqueName: trk.name, hid, hunterName: p ? p.name : "?" }); }); });
  const seen = {}; const placedHunters = []; placedPosts.forEach((pp) => { if (!seen[pp.hid]) { seen[pp.hid] = 1; placedHunters.push({ id: pp.hid, name: pp.hunterName }); } }); placedHunters.sort((a, b) => byNom(a.name || "", b.name || ""));
  const chefs = journee.chefs || []; const cl = journee.chefLignes || {};
  const nb = chefs.length;
  return (<SecWrap bare={bare}>
    {!bare && <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between"><span className="font-medium text-stone-800">👨‍✈️ Chefs de ligne</span><span className="text-xs text-stone-500">{nb ? nb + " désigné(s)" : "aucun"} {open ? "▲" : "▼"}</span></button>}
    {(bare || open) && (placedPosts.length === 0 ? <p className="text-xs text-stone-400 italic">Place d'abord des chasseurs sur les postes.</p> : (<div className="space-y-2 pt-1">
      <p className="text-[11px] text-stone-400">Désigne les chefs (parmi les chasseurs placés), puis coche les postes dont chacun est responsable.</p>
      <button onClick={() => {
        const h = histoChefs(journees, terrain.id, journee.id);
        const retenus = chefs.slice();
        const cible = Math.max(retenus.length, h.nbLignes);
        placedHunters.filter((x) => (h.nChef[x.id] || 0) >= SUGG_MIN)
          .sort((a, b) => (h.nChef[b.id] || 0) - (h.nChef[a.id] || 0))
          .forEach((x) => { if (retenus.length < cible && retenus.indexOf(x.id) < 0) retenus.push(x.id); });
        const cl2 = { ...cl };
        // 1. chaque poste va a son chef habituel, s'il est de la partie
        placedPosts.forEach((pp) => {
          if (cl2[pp.mid]) return;
          const c = chefHabituel(h.parMir[pp.mid], (x) => retenus.indexOf(x) >= 0);
          if (c) cl2[pp.mid] = c;
        });
        // 2. sinon on suit la ligne : le chef retenu qui a repris le plus de postes du chef absent
        placedPosts.forEach((pp) => {
          if (cl2[pp.mid]) return;
          const hab = chefHabituel(h.parMir[pp.mid]);
          if (!hab) return;
          const siens = Object.keys(h.parMir).filter((mid) => chefHabituel(h.parMir[mid]) === hab);
          const score = {};
          siens.forEach((mid) => { const c = cl2[mid]; if (c) score[c] = (score[c] || 0) + 1; });
          const pick = chefHabituel(score);
          if (pick) cl2[pp.mid] = pick;
        });
        const rien = retenus.length === chefs.length && Object.keys(cl2).length === Object.keys(cl).length;
        if (rien) { window.alert("Pas encore assez d'historique sur ce territoire : il faut au moins " + SUGG_MIN + " journées avec des chefs de ligne."); return; }
        onSet(journee.id, { chefs: retenus, chefLignes: cl2 });
      }} className="w-full text-[12px] font-medium bg-emerald-800 text-stone-50 rounded-lg py-2">✨ Proposer d'après l'historique</button>
      <p className="text-[11px] text-stone-400">Reprend les chefs habituels présents aujourd'hui et leurs postes, sans toucher à ce que tu as déjà désigné.</p>
      <div><span className="text-[10px] uppercase tracking-wide text-stone-400">Qui est chef de ligne ?</span>
        <div className="flex flex-wrap gap-1.5 mt-1">{placedHunters.map((h) => { const on = chefs.indexOf(h.id) >= 0; return (<button key={h.id} onClick={() => onToggleChef(journee.id, h.id)} className={`text-xs px-2 py-1 rounded-full border ${on ? "bg-stone-800 text-white border-stone-800" : "bg-white text-stone-600 border-stone-300"}`}>{on ? "👨‍✈️ " : ""}{h.name}</button>); })}</div></div>
      {chefs.map((chefId) => { const chef = placedHunters.find((h) => h.id === chefId); if (!chef) return null; const mine = placedPosts.filter((pp) => cl[pp.mid] === chefId); return (<div key={chefId} className="bg-white border border-stone-200 rounded-md p-2">
        <div className="flex items-center justify-between gap-2"><p className="text-sm font-medium text-stone-800">👨‍✈️ {chef.name} <span className="text-xs font-normal text-stone-400">· {mine.length} poste(s)</span></p>
          <button onClick={() => onAssignPosts(journee.id, chefId)} className="shrink-0 text-xs font-medium bg-emerald-800 hover:bg-emerald-900 text-white px-2.5 py-1.5 rounded-md flex items-center gap-1"><Crosshair size={13} /> Attribuer les postes</button></div>
      </div>); })}
    </div>))}
  </SecWrap>);
}
function AttributionsSection({ journee, terrain, participants, onSet, bare, canal, onSetCanal, onSetResp }) {
  const [open, setOpen] = useState(false);
  const enabled = ESPECES.filter((e) => e.key !== "autre" && terrain.planChasse && terrain.planChasse[e.key] && terrain.planChasse[e.key].enabled);
  const attr = journee.attributions || {};
  // En mode vignette on affiche toujours le bloc : le canal talkie y vit aussi.
  if (!enabled.length && !bare) return null;
  const nb = enabled.filter((e) => { const a = attr[e.key] || {}; return a.mode === "bracelets" || a.mode === "interdit" || (a.note || "").trim(); }).length;
  return (<SecWrap bare={bare}>
    {!bare && <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
      <span className="font-medium text-stone-800 flex items-center gap-2">🎯 Attributions du jour</span>
      <span className="text-xs text-stone-500">{nb ? nb + " définie(s)" : "à définir"} {open ? "▲" : "▼"}</span>
    </button>}
    {(bare || open) && (<div className="space-y-2 pt-1">
      {bare && (<div className="bg-white border border-stone-200 rounded-md p-2.5">
        <label className="text-[10px] uppercase tracking-wide text-stone-400">📻 Canal talkie</label>
        <input value={canal || ""} onChange={(ev) => onSetCanal(ev.target.value)} placeholder="ex. 8" className="w-24 border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1 block" />
        <p className="text-[10px] text-stone-400 mt-1">Affiché aux chasseurs sur leur page.</p>
        <label className="text-[10px] uppercase tracking-wide text-stone-400 block mt-3">🚨 Responsable de la battue</label>
        <select value={journee.responsableId || ""} onChange={(ev) => onSetResp(ev.target.value)} className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1">
          <option value="">Personne</option>
          {(participants || []).slice().sort((a, b) => (a.name || "").localeCompare(b.name || "")).map((p) => (
            <option key={p.id} value={p.id}>{p.name}{p.phone ? "" : " (sans téléphone)"}</option>))}
        </select>
        <p className="text-[10px] text-stone-400 mt-1">Son nom et son téléphone apparaissent dans le bouton Urgence de la page des chasseurs.</p>
      </div>)}
      {enabled.length > 0 && <p className="text-[11px] text-stone-400">Ce que les chasseurs peuvent prélever aujourd'hui. Apparaît sur la page publiée.</p>}
      {enabled.map((e) => { const a = attr[e.key] || { mode: "libre", count: 1, note: "" }; return (
        <div key={e.key} className="bg-white border border-stone-200 rounded-md p-2">
          <span className="text-sm font-medium text-stone-800">{e.emoji} {e.label}</span>
          <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
            <button onClick={() => onSet(journee.id, e.key, { mode: "libre" })} className={`px-2 py-1 rounded text-xs font-medium border ${a.mode === "libre" ? "bg-stone-700 text-white border-stone-700" : "bg-stone-100 text-stone-600 border-stone-200"}`}>Libre</button>
            <button onClick={() => onSet(journee.id, e.key, { mode: "bracelets" })} className={`px-2 py-1 rounded text-xs font-medium border ${a.mode === "bracelets" ? "bg-emerald-700 text-white border-emerald-700" : "bg-stone-100 text-stone-600 border-stone-200"}`}>Bracelets</button>
            {a.mode === "bracelets" && <input type="number" inputMode="numeric" min="0" onFocus={(ev) => ev.target.select()} value={a.count ?? 1} onChange={(ev) => onSet(journee.id, e.key, { count: Math.max(0, parseInt(ev.target.value || "0", 10) || 0) })} className="w-14 border border-stone-300 rounded px-2 py-1 text-sm bg-white" />}
            <button onClick={() => onSet(journee.id, e.key, { mode: "interdit" })} className={`px-2 py-1 rounded text-xs font-medium border ${a.mode === "interdit" ? "bg-red-700 text-white border-red-700" : "bg-stone-100 text-stone-600 border-stone-200"}`}>Interdit</button>
          </div>
          <input value={a.note || ""} onChange={(ev) => onSet(journee.id, e.key, { note: ev.target.value })} placeholder="Restriction (poids, sexe…) — optionnel" className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1.5" />
        </div>); })}
    </div>)}
  </SecWrap>);
}
function InvitationsSection({ journee, terrain, participants, orgEmail, onToggleInvite, onSetPresence, onSetMsg, bare, part }) {
  // part : "invite" (envoi du mail) ou "presence" (réponses). Sans valeur : les deux.
  const showInvite = !part || part === "invite";
  const showPresence = !part || part === "presence";
  const [open, setOpen] = useState(false);
  const [showMailPick, setShowMailPick] = useState(false);
  const [emarg, setEmarg] = useState(null);
  const [qInv, setQInv] = useState(""); const [qPres, setQPres] = useState(""); const [showInv, setShowInv] = useState(true); const [showPres, setShowPres] = useState(true);
  const matchQ = (p, q) => !q.trim() || (p.name || "").toLowerCase().indexOf(q.toLowerCase()) >= 0;
  const invites = journee.invites || [];
  const invited = participants.filter((p) => invites.includes(p.id)).sort((a, b) => byNom(a.name || "", b.name || ""));
  const pres = journee.presence || {};
  const dateFr = journee.date ? new Date(journee.date + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";
  const terrName = terrain ? terrain.name : "";
  const defSubject = "Battue du " + dateFr + (terrName ? " — " + terrName : "");
  const defBody = "Bonjour,\n\nJe t'invite à la battue du " + dateFr + (terrName ? " sur " + terrName : "") + ".\nMerci de me confirmer ta présence.\n\nÀ bientôt !";
  const subject = journee.inviteSubject != null ? journee.inviteSubject : defSubject;
  const body = journee.inviteBody != null ? journee.inviteBody : defBody;
  const invitedEmails = () => invited.map((p) => (p.email || "").trim()).filter(Boolean);
  const openMail = (provider) => {
    const emails = invitedEmails();
    if (!emails.length) { window.alert("Coche au moins un invité qui a une adresse email."); return; }
    const to = encodeURIComponent(orgEmail || "");
    const bcc = encodeURIComponent(emails.join(","));
    const su = encodeURIComponent(subject);
    const bd = encodeURIComponent(body);
    let url = "";
    if (provider === "gmail") url = "googlegmail:///co?to=" + to + "&bcc=" + bcc + "&subject=" + su + "&body=" + bd;
    else if (provider === "gmailweb") url = "https://mail.google.com/mail/?view=cm&fs=1&to=" + to + "&bcc=" + bcc + "&su=" + su + "&body=" + bd;
    else if (provider === "outlook") url = "https://outlook.live.com/mail/0/deeplink/compose?to=" + to + "&bcc=" + bcc + "&subject=" + su + "&body=" + bd;
    else if (provider === "yahoo") url = "https://compose.mail.yahoo.com/?to=" + to + "&bcc=" + bcc + "&subject=" + su + "&body=" + bd;
    else url = "mailto:" + to + "?bcc=" + bcc + "&subject=" + su + "&body=" + bd; // défaut / Apple Mail / iCloud
    if (provider === "gmailweb" || provider === "outlook" || provider === "yahoo") window.open(url, "_blank");
    else window.location.href = url;
    setShowMailPick(false);
  };
  const copyEmails = () => { const emails = invitedEmails(); if (!emails.length) { window.alert("Aucun invité avec email."); return; } const txt = emails.join(", "); if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => window.alert("Emails copiés ✓ Colle-les dans le champ Cci.")); else window.prompt("Copie les emails :", txt); };
  const copyMsg = () => { const txt = subject + "\n\n" + body; if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => window.alert("Message copié ✓")); else window.prompt("Copie le message :", txt); };
  const exportDinerExcel = () => exportRepasExcel("diner");
  const exportRepasExcel = (repas) => {
    const RP = REPAS[repas] || REPAS.diner;
    try {
      const list = invited.filter((p) => { const pr = pres[p.id] || {}; return pr.statut === "present" && pr[RP.cle]; }).sort((a, b) => byNom(a.name || "", b.name || ""));
      const rows = list.map((p) => { const sup = Number((pres[p.id] || {})[RP.inv]) || 0; return { Nom: p.name || "", "Invités supplémentaires": sup, Convives: 1 + sup }; });
      const total = rows.reduce((s, r) => s + r.Convives, 0);
      rows.push({ Nom: "TOTAL", "Invités supplémentaires": "", Convives: total });
      const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.length ? rows : [{ Nom: "" }]), RP.onglet);
      const out = XLSX.write(wb, { bookType: "xlsx", type: "array" }); const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const fn = RP.fichier + "-" + (journee.date || "") + ".xlsx"; const file = new File([blob], fn, { type: blob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: fn }).catch(() => {}); } else { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = fn; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    } catch (e) { window.alert("Export impossible : " + (e.message || e)); }
  };
  const nbPres = invited.filter((p) => (pres[p.id] || {}).statut === "present").length;
  const nbDiner = invited.filter((p) => (pres[p.id] || {}).statut === "present" && (pres[p.id] || {}).diner).length;
  const nbDej = invited.filter((p) => (pres[p.id] || {}).statut === "present" && (pres[p.id] || {}).dej).length;
  const nbDejSup = invited.reduce((s, p) => s + (((pres[p.id] || {}).statut === "present" && (pres[p.id] || {}).dej) ? (Number((pres[p.id] || {}).dejInvites) || 0) : 0), 0);
  const nbSup = invited.reduce((s, p) => s + (((pres[p.id] || {}).statut === "present") ? (Number((pres[p.id] || {}).invitesSup) || 0) : 0), 0);
  return (<SecWrap bare={bare}>
    {!bare && <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
      <span className="font-medium text-stone-800 flex items-center gap-2">📧 Invitations</span>
      <span className="text-xs text-stone-500">{invited.length} invités · {nbPres} présents {open ? "▲" : "▼"}</span>
    </button>}
    {(bare || open) && (<div className="space-y-3 pt-1">
      {showInvite && (<><div className="space-y-1">
        <label className="text-xs uppercase tracking-wide text-stone-400">Objet du mail</label>
        <input value={subject} onChange={(e) => onSetMsg(journee.id, { inviteSubject: e.target.value })} className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white" />
        <label className="text-xs uppercase tracking-wide text-stone-400">Message</label>
        <textarea value={body} onChange={(e) => onSetMsg(journee.id, { inviteBody: e.target.value })} rows={4} className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1"><button onClick={() => setShowInv((v) => !v)} className="text-xs uppercase tracking-wide text-stone-400 flex items-center gap-1">Qui inviter {showInv ? "▲" : "▼"}</button></div>
        {showInv && participants.length === 0 && <p className="text-xs text-stone-400 italic">Ajoute d'abord des membres dans l'onglet Membres.</p>}
        {showInv && (() => {
          const gs = tousLesGroupes(participants);
          if (!gs.length) return null;
          const inv = journee.invites || [];
          const toggleGrp = (nom) => {
            const membres = participants.filter((p) => (p.groupes || []).indexOf(nom) >= 0);
            const tous = membres.length > 0 && membres.every((p) => inv.indexOf(p.id) >= 0);
            membres.forEach((p) => {
              const dedans = inv.indexOf(p.id) >= 0;
              if (tous && dedans) onToggleInvite(journee.id, p.id);
              if (!tous && !dedans) onToggleInvite(journee.id, p.id);
            });
          };
          return (<div className="mb-2">
            <div className="flex flex-wrap gap-1.5">
              {gs.map((g) => {
                const membres = participants.filter((p) => (p.groupes || []).indexOf(g.nom) >= 0);
                const actif = membres.length > 0 && membres.every((p) => inv.indexOf(p.id) >= 0);
                return <PastilleGroupe key={g.nom} nom={g.nom} compte={g.n} small actif={actif} onClick={() => toggleGrp(g.nom)} />;
              })}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Touche un groupe pour ajouter ses membres. Retouche-le pour les retirer.</p>
          </div>);
        })()}
        {showInv && participants.length > 4 && <input value={qInv} onChange={(e) => setQInv(e.target.value)} placeholder="🔍 Rechercher un membre…" className="w-full border border-stone-300 rounded px-2 py-1 text-sm bg-white mb-1" />}
        {showInv && <div className="space-y-1 max-h-56 overflow-auto">
          {[...participants].filter((p) => matchQ(p, qInv)).sort((a, b) => byNom(a.name || "", b.name || "")).map((p) => { const on = invites.includes(p.id); const noMail = !(p.email || "").trim(); return (
            <button key={p.id} onClick={() => onToggleInvite(journee.id, p.id)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded border text-left text-sm ${on ? "bg-emerald-50 border-emerald-300" : "bg-white border-stone-200"}`}>
              <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${on ? "bg-emerald-700 border-emerald-700 text-white" : "border-stone-300"}`}>{on ? "✓" : ""}</span>
              <span className="flex-1 text-stone-800 truncate">{p.name || "(sans nom)"}</span>
              {noMail && <span className="text-[10px] text-amber-700 shrink-0">pas d'email</span>}
            </button>); })}
        </div>}
      </div>
      <button onClick={() => { if (!invitedEmails().length) { window.alert("Coche au moins un invité qui a une adresse email."); return; } setShowMailPick(true); }} className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white text-sm font-medium px-3 py-2 rounded-md">✉️ Écrire l'invitation</button>
      {showMailPick && (<div className="border border-stone-300 rounded-lg p-2 bg-stone-50 space-y-1">
        <p className="text-xs text-stone-500 px-1 pb-1">Ouvrir avec :</p>
        <button onClick={() => openMail("gmail")} className="w-full text-left text-sm px-3 py-2 rounded-md bg-white border border-stone-200 hover:bg-stone-100">📧 Application Gmail</button>
        <button onClick={() => openMail("gmailweb")} className="w-full text-left text-sm px-3 py-2 rounded-md bg-white border border-stone-200 hover:bg-stone-100">🌐 Gmail (navigateur)</button>
        <button onClick={() => openMail("apple")} className="w-full text-left text-sm px-3 py-2 rounded-md bg-white border border-stone-200 hover:bg-stone-100">✉️ Mail / iCloud (app par défaut)</button>
        <button onClick={() => openMail("outlook")} className="w-full text-left text-sm px-3 py-2 rounded-md bg-white border border-stone-200 hover:bg-stone-100">🔵 Outlook (navigateur)</button>
        <button onClick={() => openMail("yahoo")} className="w-full text-left text-sm px-3 py-2 rounded-md bg-white border border-stone-200 hover:bg-stone-100">🟣 Yahoo (navigateur)</button>
        <button onClick={() => setShowMailPick(false)} className="w-full text-center text-xs text-stone-400 pt-1">Annuler</button>
      </div>)}
      <div className="flex gap-2">
        <button onClick={copyEmails} className="flex-1 flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium px-2 py-2 rounded-md">📋 Copier les emails</button>
        <button onClick={copyMsg} className="flex-1 flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium px-2 py-2 rounded-md">📋 Copier le message</button>
      </div>
      <p className="text-[11px] text-stone-400">Destinataires en copie cachée (Cci). Choisis ta messagerie ci-dessus, ou utilise « Copier » si besoin.</p>
      </>)}
      {showPresence && invited.length > 0 && (<div>
        {emarg && <PrintOverlay html={emarg} onClose={() => setEmarg(null)} />}
        <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
          <button onClick={() => setShowPres((v) => !v)} className="text-xs uppercase tracking-wide text-stone-400 flex items-center gap-1">Présences · {nbPres}/{invited.length} présents · 🥪 {nbDej}{nbDejSup ? " (+" + nbDejSup + ")" : ""} · 🍽️ {nbDiner}{nbSup ? " (+" + nbSup + ")" : ""} {showPres ? "▲" : "▼"}</button>
          <div className="flex gap-1.5 flex-wrap">
            <button onClick={() => { if (!nbPres) { window.alert("Coche au moins un présent."); return; } setEmarg(buildEmargementHtml(journee, terrain, participants)); }} className="flex items-center gap-1 text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white px-2 py-1 rounded shrink-0"><FileText size={13} /> Émargement</button>
            <button onClick={() => { if (!nbDej) { window.alert("Personne n'est inscrit au déjeuner."); return; } setEmarg(buildDejeunerHtml(journee, terrain, participants)); }} className="flex items-center gap-1 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded shrink-0"><FileText size={13} /> Déjeuner PDF</button>
            <button onClick={() => exportRepasExcel("dejeuner")} className="flex items-center gap-1 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded shrink-0"><Download size={13} /> Déjeuner Excel</button>
            <button onClick={() => { if (!nbDiner) { window.alert("Personne n'est inscrit au dîner."); return; } setEmarg(buildDinerHtml(journee, terrain, participants)); }} className="flex items-center gap-1 text-xs font-medium bg-amber-700 hover:bg-amber-800 text-white px-2 py-1 rounded shrink-0"><FileText size={13} /> Dîner PDF</button>
            <button onClick={exportDinerExcel} className="flex items-center gap-1 text-xs font-medium bg-amber-700 hover:bg-amber-800 text-white px-2 py-1 rounded shrink-0"><Download size={13} /> Dîner Excel</button>
          </div>
        </div>
        {showPres && invited.length > 4 && <input value={qPres} onChange={(e) => setQPres(e.target.value)} placeholder="🔍 Rechercher un présent…" className="w-full border border-stone-300 rounded px-2 py-1 text-sm bg-white mb-1.5" />}
        {showPres && <div className="space-y-1.5">
          {invited.filter((p) => matchQ(p, qPres)).map((p) => { const pr = pres[p.id] || {}; return (
            <div key={p.id} className="bg-white border border-stone-200 rounded-md p-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-stone-800 flex-1 truncate">{p.name}</span>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => onSetPresence(journee.id, p.id, { statut: pr.statut === "present" ? null : "present" })} className={`px-2 py-1 rounded text-xs font-medium border ${pr.statut === "present" ? "bg-emerald-700 text-white border-emerald-700" : "bg-stone-100 text-stone-600 border-stone-200"}`}>Présent</button>
                  <button onClick={() => onSetPresence(journee.id, p.id, { statut: pr.statut === "absent" ? null : "absent" })} className={`px-2 py-1 rounded text-xs font-medium border ${pr.statut === "absent" ? "bg-red-700 text-white border-red-700" : "bg-stone-100 text-stone-600 border-stone-200"}`}>Absent</button>
                </div>
              </div>
              {pr.statut === "present" && (<div className="flex items-center gap-3 mt-2 pt-2 border-t border-stone-100 flex-wrap">
                <button onClick={() => onSetPresence(journee.id, p.id, { dej: !pr.dej })} className={`px-2 py-1 rounded text-xs font-medium border ${pr.dej ? "bg-amber-600 text-white border-amber-600" : "bg-stone-100 text-stone-600 border-stone-200"}`}>🥪 Déjeuner</button>
                {pr.dej && (<span className="flex items-center gap-1 text-xs text-stone-600">+ invités
                  <input type="number" inputMode="numeric" value={pr.dejInvites || 0} onFocus={(e) => e.target.select()} onChange={(e) => onSetPresence(journee.id, p.id, { dejInvites: Math.max(0, parseInt(e.target.value || "0", 10) || 0) })} className="w-14 border border-stone-300 rounded px-2 py-1 bg-white" /></span>)}
                <button onClick={() => onSetPresence(journee.id, p.id, { diner: !pr.diner })} className={`px-2 py-1 rounded text-xs font-medium border ${pr.diner ? "bg-amber-700 text-white border-amber-700" : "bg-stone-100 text-stone-600 border-stone-200"}`}>🍽️ Dîner</button>
                {pr.diner && (<span className="flex items-center gap-1 text-xs text-stone-600">+ invités
                  <input type="number" inputMode="numeric" value={pr.invitesSup || 0} onFocus={(e) => e.target.select()} onChange={(e) => onSetPresence(journee.id, p.id, { invitesSup: Math.max(0, parseInt(e.target.value || "0", 10) || 0) })} className="w-14 border border-stone-300 rounded px-2 py-1 bg-white" /></span>)}
              </div>)}
            </div>); })}
        </div>}
      </div>)}
    </div>)}
  </SecWrap>);
}
// ---------- Vignettes de l'écran Journée ----------
const MiradorIcon = ({ size = 26, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.4 9.6 12 3.4l9.6 6.2" /><path d="M6 9.6V15h12V9.6" /><path d="M9.4 12.1h5.2" />
    <path d="M7.6 15 5 21.4" /><path d="M16.4 15 19 21.4" /><path d="M8.7 17.7h6.6" /><path d="M8 19.7h8" />
  </svg>
);
// state : "done" (vert), "partial" (ambre), "todo" (gris)
function StepTile({ id, num, emoji, icon, title, sub, state, open, onToggle }) {
  const isOpen = open === id;
  const mark = state === "done" ? "✓" : state === "partial" ? "⋯" : "○";
  const markCls = state === "done" ? "text-emerald-600" : state === "partial" ? "text-amber-600" : "text-stone-300";
  const numCls = state === "done" ? "bg-emerald-100 text-emerald-800" : state === "partial" ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-500";
  return (<button onClick={() => onToggle(id)} className={`w-full rounded-xl border p-3.5 text-left flex items-center gap-3 transition-colors ${isOpen ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white hover:border-stone-300"}`}>
    {num != null && <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${numCls}`}>{num}</span>}
    {icon ? <span className="shrink-0 text-stone-800">{icon}</span> : <span className="text-2xl shrink-0">{emoji}</span>}
    <span className="flex-1 min-w-0">
      <span className="block text-sm font-medium text-stone-800">{title}</span>
      <span className="block text-[11px] text-stone-400 mt-0.5 truncate">{sub}</span>
    </span>
    <span className={`text-sm shrink-0 ${markCls}`}>{mark}</span>
  </button>);
}
function GridTile({ id, emoji, title, sub, subCls = "text-stone-400", open, onToggle }) {
  const isOpen = open === id;
  return (<button onClick={() => onToggle(id)} className={`rounded-xl border p-3.5 text-left transition-colors ${isOpen ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white hover:border-stone-300"}`}>
    <div className="text-2xl mb-1.5">{emoji}</div>
    <div className="text-sm font-medium text-stone-800">{title}</div>
    <div className={`text-[11px] mt-0.5 ${subCls}`}>{sub}</div>
  </button>);
}
function StepPanel({ id, open, children }) {
  if (open !== id) return null;
  return <div className="mt-2.5 bg-stone-50 rounded-xl border border-emerald-600 p-4">{children}</div>;
}
function StepGroup({ label, children }) {
  return (<div><p className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 px-1">{label}</p>{children}</div>);
}

function JourneesView({ journees, setJournees, terrains, setTerrains, participants, safety, github, setGithub, openSettings, userId, orgEmail }) {
  const [openJournee, setOpenJournee] = useState(null);
  const [ligneOuverte, setLigneOuverte] = useState(null);   // journee dont les boutons Archiver/Supprimer sont visibles
  const [aSupprimer, setASupprimer] = useState(null);       // journee dans la fenetre de suppression
  const [msgListe, setMsgListe] = useState("");
  const [voirArchives, setVoirArchives] = useState(false);
  const majJournee = (jid, patch) => setJournees((prev) => prev.map((j) => j.id === jid ? { ...j, ...patch } : j));
  const majPoints = (jid, terrId, trackId, type, action, data) => {
    if (type === "jour") {
      setJournees((prev) => prev.map((jj) => {
        if (jj.id !== jid) return jj;
        const par = jj.deposesJourParTraque || {};
        const l = par[trackId] || [];
        const nl = action === "add" ? [...l, data]
          : action === "ren" ? l.map((d) => d.id === data.id ? { ...d, nom: data.nom } : d)
          : action === "mov" ? l.map((d) => d.id === data.id ? { ...d, gx: data.gx, gy: data.gy } : d)
          : l.filter((d) => d.id !== data.id);
        return { ...jj, deposesJourParTraque: { ...par, [trackId]: nl } };
      }));
      return;
    }
    const champ = type === "depart" ? "departs" : "deposes";
    setTerrains((prev) => prev.map((t) => {
      if (t.id !== terrId) return t;
      return { ...t, tracks: (t.tracks || []).map((tr) => {
        if (tr.id !== trackId) return tr;
        const l = tr[champ] || [];
        const nl = action === "add" ? [...l, data]
          : action === "ren" ? l.map((d) => d.id === data.id ? { ...d, nom: data.nom } : d)
          : action === "mov" ? l.map((d) => d.id === data.id ? { ...d, gx: data.gx, gy: data.gy } : d)
          : l.filter((d) => d.id !== data.id);
        return { ...tr, [champ]: nl };
      }) };
    }));
  };

  const [openStep, setOpenStep] = useState(null); // vignette dépliée dans la journée ouverte
  // Ouvrir « Envoyer les postes » prépare le lien immédiatement : l'organisateur
  // n'a plus qu'à le transmettre. On ne relance pas si un envoi est déjà en cours.
  const dejaEnvoye = useRef(null);
  useEffect(() => {
    if (openStep !== "partage" || !openJournee) return;
    if (dejaEnvoye.current === openJournee) return;
    const j = journees.find((x) => x.id === openJournee);
    if (!j) return;
    if (!terrains.some((t) => t.id === j.terrainId)) return;
    dejaEnvoye.current = openJournee;
    publish(j);
  }, [openStep, openJournee]);
  useEffect(() => { if (openStep !== "partage") dejaEnvoye.current = null; }, [openStep]);
  const [posterView, setPosterView] = useState(null); const [pointsView, setPointsView] = useState(null); const [shareView, setShareView] = useState(null); const [chefView, setChefView] = useState(null);
  const [pub, setPub] = useState({ status: "idle" });
  const pubSlug = userId ? String(userId).replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 12) : "public";
  // Une adresse par journée : identifiant du compte + identifiant de la journée.
  // Elle ne change jamais pour une journée donnée, quel que soit le nombre d'envois.
  // Nom du territoire, ramene a des lettres simples pour tenir dans une adresse.
  const slugTerr = (t) => {
    const n = ((t && t.name) || "territoire").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 28);
    return n || "territoire";
  };
  const bout = (v, n) => String(v || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(-n);
  // Adresse lisible : nom du territoire, un bout du compte, un bout de la journee.
  // Les deux derniers restent illisibles : c'est ce qui empeche de deviner le lien.
  const slugNeuf = (j) => {
    const t = terrains.find((x) => x.id === (j && j.terrainId));
    return slugTerr(t) + "-" + pubSlug.slice(0, 6) + "-" + bout((j && j.id) || "", 6);
  };
  // Une fois publiee, l'adresse d'une journee ne change plus jamais.
  // Les journees d'avant la v2.2 gardent l'ancienne forme : leurs liens restent valables.
  const slugJournee = (j) => {
    if (j && j.pubSlug) return j.pubSlug;
    if (j && j.pubV === 2) return slugNeuf(j);
    return pubSlug + "-" + String((j && j.id) || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 10);
  };
  const urlDe = (j) => "https://poste.carnetdechasse.fr/b/" + slugJournee(j) + "/";
  const pubUrl = "https://poste.carnetdechasse.fr/b/" + pubSlug + "/";
  const publish = async (journee0) => {
    // Cle secrete pour le suivi GPS de cette journee (creee une seule fois, gardee ensuite).
    let journee = journee0;
    const aleat = (n) => { const a = "abcdefghijkmnopqrstuvwxyz23456789"; const r = new Uint32Array(n); crypto.getRandomValues(r); let c = ""; for (let i = 0; i < n; i++) c += a.charAt(r[i] % a.length); return c; };
    const ajouts = {};
    if (!journee.gpsCle) ajouts.gpsCle = aleat(20);
    // Cle organisateur du chat : elle ne quitte jamais l'app, le Worker n'en garde que l'empreinte.
    if (github.chatActif && !journee.chatAdmin) ajouts.chatAdmin = aleat(28);
    if (Object.keys(ajouts).length) {
      journee = { ...journee0, ...ajouts };
      setJournees((prev) => prev.map((x) => (x.id === journee0.id ? { ...x, ...ajouts } : x)));
    }
    const terrain = terrains.find((t) => t.id === journee.terrainId);
    if (!terrain) { window.alert("Choisis d'abord un territoire pour cette journée."); return; }
    setPub({ status: "publishing" });
    try {
      // Photos annotees : voisin, notes et angles de tir fusionnes dans l'image envoyee au chasseur.
      const photosAnn = {};
      for (const trk of (terrain.tracks || [])) for (const mm of (trk.miradors || [])) {
        if (!(mm.photoNotes || []).some((l) => l && l.length)) continue;
        photosAnn[mm.id] = [];
        for (let k = 0; k < (mm.photos || []).length; k++) { try { photosAnn[mm.id].push(await aplatirPhoto(mm.photos[k], (mm.photoNotes || [])[k] || [], 1100, 0.62)); } catch (e) { photosAnn[mm.id].push(mm.photos[k]); } }
      }
      // Chat : on ouvre (ou on retrouve) le salon de la journee aupres du Worker GPS avant de publier.
      let chatOk = false, chatErr = "";
      if (github.chatActif) {
        try {
          const h = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(journee.chatAdmin)))).map((b) => b.toString(16).padStart(2, "0")).join("");
          const rc = await fetch(GPS_URL + "/chat/init", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ j: journee.gpsCle, h }) });
          const dc = await rc.json().catch(() => null);
          chatOk = !!(dc && dc.ok);
          if (!chatOk) chatErr = (dc && dc.reason === "pris") ? "Le chat de cette journée est déjà lié à une autre clé." : "Le Worker n'a pas pu ouvrir le chat.";
        } catch (e) { chatErr = "Worker GPS introuvable : le chat n'apparaîtra pas sur la page."; }
      }
      const html = generateSharedHtml(journee, terrain, participantsDuJour(participants, journee, false), safety, github.fnUrl || DEFAULT_FACTEUR, github.orgName, userId, photosAnn, !!github.gpsActif, chatOk);
      const token = "PUBTS-" + Date.now();
      const stamped = html + "\n<!--" + token + "-->";
      const fn = (github.fnUrl || DEFAULT_FACTEUR).replace(/\/+$/, "");
      let sess = null;
      try { sess = (await SB.auth.getSession()).data.session; } catch (e) {}
      if (!sess || !sess.access_token) throw new Error("Session expirée — reconnecte-toi et réessaie.");
      // On propose une adresse au Worker, mais c'est lui qui decide et qui repond
      // avec celle qu'il a vraiment utilisee : c'est elle qu'on retient et qu'on affiche.
      const rp = await fetch(fn + "/publish", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + sess.access_token }, body: JSON.stringify({ html: stamped, journeeId: journee.id, slug: slugJournee(journee) }) });
      if (!rp.ok) { const t = await rp.text(); throw new Error("Publication refusée — " + t.slice(0, 200)); }
      let rep = null; try { rep = await rp.json(); } catch (e) {}
      const slugReel = (rep && rep.slug) ? String(rep.slug) : slugJournee(journee);
      if (slugReel !== journee.pubSlug) majJournee(journee.id, { pubSlug: slugReel });
      // Tirage au sort : une fois le lien envoye, la repartition ne bouge plus (livrets et lien restent justes).
      if (tirageActif(journee) && normTirage(journee.tirage).nb > 0 && !normTirage(journee.tirage).publie) majJournee(journee.id, { tirage: { ...normTirage(journee.tirage), publie: true } });
      setPub({ status: "live", url: "https://poste.carnetdechasse.fr/b/" + slugReel + "/", chatErr });
    } catch (e) { setPub({ status: "error", msg: (e && e.message) || String(e) }); }
  };
  const shareLinkWhatsApp = (lien) => { const link = lien || ((pub && pub.url) ? pub.url : pubUrl); const msg = "🦌 Battue — chasseurs & rabatteurs\nChacun choisit son rôle et son nom sur le lien (lecture seule) :\n" + link; window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank"); };
  const copyPubLink = () => { const link = (pub && pub.url) ? pub.url : pubUrl; if (navigator.clipboard) navigator.clipboard.writeText(link).then(() => window.alert("Lien copié ✓ Colle-le dans ton groupe WhatsApp.")); else window.prompt("Copie le lien :", link); };
  const [postesPrint, setPostesPrint] = useState(null);
  const [choixPrint, setChoixPrint] = useState(null);
  // Livrets : quelle journee, quels chasseurs coches, verso a retourner ou non.
  const [livret, setLivret] = useState(null);
  const chasseursPlaces = (j, terr) => {
    if (!terr) return [];
    const ids = {};
    (terr.tracks || []).forEach((trk) => Object.keys((j.placements || {})[trk.id] || {}).forEach((hid) => { ids[hid] = true; }));
    const rabL = normRabat(j.rabat); (terr.tracks || []).forEach((trk) => Object.keys(rabL[trk.id] || {}).forEach((hid) => { ids[hid] = true; }));
    return participantsDuJour(participants, j, false).filter((p) => ids[p.id]).sort((a, b) => triAvecNumeros(a, b, (x, y) => (x.nom || nomKey(x.name)).localeCompare(y.nom || nomKey(y.name), "fr", { sensitivity: "base" }) || (x.prenom || "").localeCompare(y.prenom || "", "fr", { sensitivity: "base" })));
  };
  const ouvrirLivrets = (j) => {
    const terr = terrains.find((t) => t.id === j.terrainId);
    if (!terr) { window.alert("Choisis d'abord un territoire pour cette journée."); return; }
    const liste = chasseursPlaces(j, terr);
    if (!liste.length) { window.alert("Aucun chasseur n'est encore placé sur un poste."); return; }
    setLivret({ jid: j.id, sel: Object.fromEntries(liste.map((p) => [p.id, true])), retourner: false, format: "a4" });
  };
  const choisirCouverture = async (terrId, file) => {
    try { const url = await downscaleImage(file, 1000, 0.75); setTerrains((prev) => prev.map((t) => (t.id === terrId ? { ...t, imageCouverture: url } : t))); }
    catch (e) { window.alert(e.message || "Image illisible."); }
  };
  const printLivrets = async (j) => {
    const terr = terrains.find((t) => t.id === j.terrainId); if (!terr || !livret) return;
    const ids = chasseursPlaces(j, terr).filter((p) => livret.sel[p.id]).map((p) => p.id);
    if (!ids.length) return;
    // Une seule carte par traque pour tout le monde : le poste de chacun est surligne par-dessus.
    const cartes = {};
    for (const trk of (terr.tracks || [])) {
      const im = imageDe(terr, trk);
      if (im) { try { const src = await carteResumeImpression(im, trk); const el = await loadImg(src); cartes[trk.id] = { src, a: el.naturalHeight / Math.max(1, el.naturalWidth) }; } catch (e) {} }
    }
    const logo = await logoDataUrl();
    setLivret(null);
    setPostesPrint(buildLivretsHtml(j, terr, participantsDuJour(participants, j, false), safety, ids, cartes, { image: terr.imageCouverture || "", logo, retourner: !!livret.retourner, format: livret.format || "a4" }));
  };
  // Resume de la journee : un tableau general puis toutes les cartes sur une page.
  const printResume = async (journee) => {
    const terrain = terrains.find((t) => t.id === journee.terrainId);
    if (!terrain) { window.alert("Choisis d'abord un territoire pour cette journée."); return; }
    const cartes = {};
    for (const trk of (terrain.tracks || [])) {
      const im = imageDe(terrain, trk);
      if (im) { try { cartes[trk.id] = await carteResumeImpression(im, trk); } catch (e) {} }
    }
    setPostesPrint(buildResumeHtml(journee, terrain, participantsDuJour(participants, journee, true), cartes));
  };
  const printPostes = async (journee) => {
    const terrain = terrains.find((t) => t.id === journee.terrainId);
    if (!terrain) { window.alert("Choisis d'abord un territoire pour cette journée."); return; }
    // Les cartes sont dessinees avant d'ouvrir l'apercu : elles sont pretes quand on imprime.
    const cartes = {};
    for (const trk of (terrain.tracks || [])) {
      const im = imageDe(terrain, trk);
      if (im) { try { cartes[trk.id] = await carteTraqueImpression(im, trk); } catch (e) {} }
    }
    setPostesPrint(buildPrintHtml(journee, terrain, participantsDuJour(participants, journee, true), safety, cartes));
  };
  const addJournee = () => { const id = `j-${Date.now()}`; setJournees((prev) => [...prev, normJournee({ id, pubV: 2, date: new Date().toISOString().slice(0, 10), terrainId: terrains[0]?.id || null })]); setOpenJournee(id); };
  // Archiver ne perd rien : la journee disparait seulement de la liste. Elle continue de
  // nourrir les propositions (chauffeurs, deposes, chefs de ligne).
  const archiverSansQuestion = (id) => { setJournees((prev) => prev.map((j) => j.id === id ? { ...j, archivee: true } : j)); setOpenJournee(null); setMsgListe("📦 Journée archivée : vous la retrouvez dans les Archives, en bas de la page."); };
  const archiverJournee = (id) => {
    if (!window.confirm("Archiver cette journée ?\n\nElle disparaît de la liste, mais rien n'est perdu : tu la retrouves dans les Archives, en bas de la page.")) return;
    setJournees((prev) => prev.map((j) => j.id === id ? { ...j, archivee: true } : j));
    setOpenJournee(null);
  };
  const desarchiverJournee = (id) => setJournees((prev) => prev.map((j) => j.id === id ? { ...j, archivee: false } : j));
  // La suppression definitive n'est possible que depuis les archives, et retire aussi la page en ligne.
  const supprimerDefinitivement = async (j) => {
    const quand = new Date(j.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    // La confirmation se fait dans la fenetre FenetreSuppression (avertissement + « Archiver plutôt »).
    let avert = "";
    try {
      const fn = (github.fnUrl || DEFAULT_FACTEUR).replace(/\/+$/, "");
      let sess = null; try { sess = (await SB.auth.getSession()).data.session; } catch (e) {}
      if (!sess || !sess.access_token) throw new Error("session expirée");
      const ancien = pubSlug + "-" + String(j.id || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 10);
      const slugs = Array.from(new Set([slugJournee(j), ancien].filter(Boolean)));
      const r = await fetch(fn + "/unpublish", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + sess.access_token }, body: JSON.stringify({ slugs }) });
      if (!r.ok) throw new Error("réponse " + r.status);
    } catch (e) {
      avert = "La journée est supprimée, mais la page en ligne n'a pas pu être retirée (" + ((e && e.message) || e) + "). Le lien envoyé aux chasseurs peut encore fonctionner.";
    }
    // Le chat de la journee est vide aussi (au mieux : sans reseau, il reste inaccessible a tous).
    if (j.chatAdmin && j.gpsCle) { try { await fetch(GPS_URL + "/chat/vider", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ j: j.gpsCle, k: j.chatAdmin }) }); } catch (e) {} }
    setJournees((prev) => prev.filter((x) => x.id !== j.id));
    setOpenJournee(null);
    setMsgListe(avert ? "⚠️ " + avert : "🗑 La journée du " + quand + " a été supprimée définitivement.");
  };
  const setJourneeDate = (id, date) => setJournees((prev) => prev.map((j) => (j.id === id ? { ...j, date } : j)));
  const setJourneeTerrain = (id, terrainId) => setJournees((prev) => prev.map((j) => (j.id === id ? { ...j, terrainId, placements: {} } : j)));
  const toggleInvite = (jid, mid) => setJournees((prev) => prev.map((j) => { if (j.id !== jid) return j; const inv = j.invites || []; return { ...j, invites: inv.includes(mid) ? inv.filter((x) => x !== mid) : [...inv, mid] }; }));
  const setPresence = (jid, mid, patch) => setJournees((prev) => prev.map((j) => { if (j.id !== jid) return j; const pr = { ...(j.presence || {}) }; pr[mid] = { ...(pr[mid] || { statut: null, diner: false, invitesSup: 0 }), ...patch }; return { ...j, presence: pr }; }));
  const setInviteMsg = (jid, patch) => setJournees((prev) => prev.map((j) => (j.id === jid ? { ...j, ...patch } : j)));
  const setAttribution = (jid, key, patch) => setJournees((prev) => prev.map((j) => { if (j.id !== jid) return j; const a = { ...(j.attributions || {}) }; a[key] = { ...(a[key] || { mode: "libre", count: 1, note: "" }), ...patch }; return { ...j, attributions: a }; }));
  const toggleChef = (jid, hid) => setJournees((prev) => prev.map((j) => { if (j.id !== jid) return j; const chefs = j.chefs || []; const on = chefs.indexOf(hid) >= 0; if (on) { const cl = { ...(j.chefLignes || {}) }; Object.keys(cl).forEach((mid) => { if (cl[mid] === hid) delete cl[mid]; }); return { ...j, chefs: chefs.filter((x) => x !== hid), chefLignes: cl }; } return { ...j, chefs: [...chefs, hid] }; }));
  const setChefLigne = (jid, mid, chefId) => setJournees((prev) => prev.map((j) => { if (j.id !== jid) return j; const cl = { ...(j.chefLignes || {}) }; if (!chefId) delete cl[mid]; else cl[mid] = chefId; return { ...j, chefLignes: cl }; }));
  const setArmeJour = (jid, hid, arme) => setJournees((prev) => prev.map((j) => { if (j.id !== jid) return j; const am = { ...(j.armes || {}) }; if (!arme) delete am[hid]; else am[hid] = arme; return { ...j, armes: am }; }));
  const setRdv = (jid, trackId, chefId, pos) => setJournees((prev) => prev.map((j) => { if (j.id !== jid) return j; const all = { ...(j.rdv || {}) }; const t = { ...(all[trackId] || {}) }; if (!pos) delete t[chefId]; else t[chefId] = pos; all[trackId] = t; return { ...j, rdv: all }; }));
  // Placer un fusil sur un poste le retire du rabat de cette traque.
  const assign = (jid, trackId, hid, mid) => setJournees((prev) => prev.map((j) => { if (j.id !== jid) return j; const rab = normRabat(j.rabat); const rt = { ...(rab[trackId] || {}) }; delete rt[hid]; return { ...j, rabat: { ...rab, [trackId]: rt }, placements: { ...(j.placements || {}), [trackId]: { ...((j.placements || {})[trackId] || {}), [hid]: mid } } }; }));
  // Fusils au rabat : une case du tableau (ou le bouton de Poster les fusils). Au rabat = plus de poste dans cette traque.
  const toggleRabat = (jid, trackId, hid) => setJournees((prev) => prev.map((j) => {
    if (j.id !== jid) return j;
    const rab = normRabat(j.rabat); const rt = { ...(rab[trackId] || {}) }; let pl = j.placements || {};
    if (rt[hid]) delete rt[hid];
    else { rt[hid] = true; const pt = { ...(pl[trackId] || {}) }; delete pt[hid]; pl = { ...pl, [trackId]: pt }; }
    return { ...j, rabat: { ...rab, [trackId]: rt }, placements: pl };
  }));
  const majRabatRegle = (jid, patch) => setJournees((prev) => prev.map((j) => (j.id !== jid ? j : { ...j, rabatRegle: { ...normRabatRegle(j.rabatRegle), ...patch } })));
  const toggleJamaisRabat = (jid, hid) => setJournees((prev) => prev.map((j) => { if (j.id !== jid) return j; const rg = normRabatRegle(j.rabatRegle); const on = rg.jamais.indexOf(hid) >= 0; return { ...j, rabatRegle: { ...rg, jamais: on ? rg.jamais.filter((x) => x !== hid) : [...rg.jamais, hid] } }; }));
  const unassign = (jid, trackId, hid) => setJournees((prev) => prev.map((j) => { if (j.id !== jid) return j; const t = { ...((j.placements || {})[trackId] || {}) }; delete t[hid]; return { ...j, placements: { ...(j.placements || {}), [trackId]: t } }; }));
  const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[k]; a[k] = t; } return a; };
  const autoFill = (jid, track, pending, sortedFree) => {
    const okFauteuil = (m) => !!m.accFauteuil;
    const okCanne = (m) => !!m.accCanne || !!m.accFauteuil;
    const jCur = journees.find((j) => j.id === jid);
    const armeOf = (h) => ((jCur && jCur.armes && jCur.armes[h.id]) || h.arme || null);
    const armeRank = (m, a) => { const list = armesList(m); if (!list.length) return 1; if (a && list.indexOf(a) >= 0) return 0; return 2; };
    let free = sortedFree.slice();
    const cur = { ...((jCur && jCur.placements && jCur.placements[track.id]) || {}) };
    const pickPost = (cands, a) => {
      if (!cands.length) return null;
      const allowed = cands.filter((m) => armeOk(armesList(m), a));
      const pool = shuffle((allowed.length ? allowed : cands).slice());
      const scored = pool.map((m) => ({ m, p: m.priority || 1, w: armeRank(m, a) }));
      scored.sort((x, y) => (x.p - y.p) || (x.w - y.w));
      return scored[0].m;
    };
    const place = (hunters, ok) => { shuffle(hunters.slice()).forEach((h) => { const post = pickPost(free.filter(ok), armeOf(h)); if (!post) return; cur[h.id] = post.id; free = free.filter((m) => m.id !== post.id); }); };
    place(pending.filter((h) => h.mobility === "fauteuil"), okFauteuil);
    place(pending.filter((h) => h.mobility === "canne"), okCanne);
    place(pending.filter((h) => h.mobility !== "fauteuil" && h.mobility !== "canne"), () => true);
    setJournees((prev) => prev.map((j) => (j.id !== jid ? j : { ...j, placements: { ...(j.placements || {}), [track.id]: cur } })));
  };
  // Tirage au sort : prepare la repartition des numeros sur toutes les traques.
  const presentsDe = (j) => participants.filter((p) => ((j.presence || {})[p.id] || {}).statut === "present" && p.role !== "rabatteur").map((p) => p.id);
  const genererTirage = (jid, rabatOv, placementsOv) => {
    const j = journees.find((x) => x.id === jid); if (!j) return;
    const rabat = rabatOv || normRabat(j.rabat);
    const terrain = terrains.find((x) => x.id === j.terrainId); if (!terrain) return;
    const t = normTirage(j.tirage); if (t.publie) return;
    const presents = presentsDe(j);
    const reserves = t.reserves.filter((id) => presents.indexOf(id) >= 0);
    const nb = Math.max(0, presents.length - reserves.length);
    const placements = {};
    const trs = (terrain.tracks || []).map((trk) => {
      const cur = {}; Object.entries(((placementsOv || j.placements) || {})[trk.id] || {}).forEach(([hid, mid]) => { if (reserves.indexOf(hid) >= 0 && !(rabat[trk.id] || {})[hid]) cur[hid] = mid; });
      placements[trk.id] = cur;
      const pris = {}; Object.values(cur).forEach((mid) => { pris[mid] = true; });
      return { id: trk.id, postes: trk.miradors || [], pris, deja: {}, exclus: rabat[trk.id] || {} };
    });
    const personnes = Array.from({ length: nb }, (_, k) => ({ id: NUM_ID(k + 1) }));
    const r = meilleureRepartition(personnes, trs, t.algo, false, {});
    Object.keys(r.placements).forEach((tid) => { Object.assign(placements[tid], r.placements[tid]); });
    majJournee(jid, { placements, tirage: { ...t, actif: true, nb, reserves, noms: {}, manques: r.manques }, ...(rabatOv ? { rabat: rabatOv } : {}) });
  };
  // Les lignes du tableau des fusils au rabat : les presents (nominatif) ou les places a la main + les numeros (tirage).
  const lignesRabat = (j) => {
    const pres = presentsDe(j); const t = normTirage(j.tirage);
    const nomDe = (id) => (participants.find((p) => p.id === id) || {}).name || "(sans nom)";
    if (!t.actif) return pres.map((id) => ({ id, name: nomDe(id) })).sort((a, b) => byNom(a.name, b.name));
    const res = t.reserves.filter((id) => pres.indexOf(id) >= 0);
    const nb = t.nb > 0 ? t.nb : Math.max(0, pres.length - res.length);
    return res.map((id) => ({ id, name: nomDe(id) })).sort((a, b) => byNom(a.name, b.name)).concat(Array.from({ length: nb }, (_, k) => ({ id: NUM_ID(k + 1), name: "N°" + (k + 1) })));
  };
  const repartirRabat = (jid) => {
    const j = journees.find((x) => x.id === jid); if (!j) return "";
    const terrain = terrains.find((x) => x.id === j.terrainId); if (!terrain) return "";
    const tracks = terrain.tracks || [];
    const rg = normRabatRegle(j.rabatRegle); const t = normTirage(j.tirage); const ancien = normRabat(j.rabat);
    const verrou = t.actif && t.publie && t.nb > 0;
    const ids = lignesRabat(j).map((r) => r.id).filter((id) => rg.jamais.indexOf(id) < 0 && !(verrou && numDe(id)));
    const rabat = calculerRabat(ids, tracks.map((trk) => trk.id), rg.regle, rg.nb);
    if (verrou) tracks.forEach((trk) => Object.keys(ancien[trk.id] || {}).forEach((hid) => { if (numDe(hid)) rabat[trk.id][hid] = true; }));
    let total = 0, liberes = 0;
    const placements = { ...(j.placements || {}) };
    tracks.forEach((trk) => { const pt = { ...(placements[trk.id] || {}) }; Object.keys(rabat[trk.id]).forEach((hid) => { total++; if (pt[hid]) { liberes++; delete pt[hid]; } }); placements[trk.id] = pt; });
    if (!total) { majJournee(jid, { rabat, placements }); return rg.regle === "nombre" ? "Personne au rabat : mettez un nombre au-dessus de 0 sur les traques où des fusils rabattent." : "Pas assez de fusils pour former deux groupes."; }
    const refaire = t.actif && t.nb > 0 && !t.publie;
    if (refaire) genererTirage(jid, rabat, placements); else majJournee(jid, { rabat, placements });
    return "✓ " + total + " place" + (total > 1 ? "s" : "") + " au rabat, à tour de rôle." + (refaire ? " La répartition des numéros a été refaite." : liberes ? " " + liberes + " poste" + (liberes > 1 ? "s" : "") + " libéré" + (liberes > 1 ? "s" : "") + " sur les cartes : pensez à les compléter." : "") + (rg.jamais.length ? " Les fusils au cadenas n'ont pas été mis au rabat." : "");
  };
  // Retour au placement nominatif : les numeros quittent les postes.
  const quitterTirage = (jid) => {
    const j = journees.find((x) => x.id === jid); if (!j) return;
    const placements = {}; Object.entries(j.placements || {}).forEach(([tid, pl]) => { const cur = {}; Object.entries(pl || {}).forEach(([hid, mid]) => { if (!numDe(hid)) cur[hid] = mid; }); placements[tid] = cur; });
    majJournee(jid, { placements, tirage: { ...normTirage(j.tirage), actif: false, nb: 0, noms: {}, manques: [], publie: false } });
  };
  // Placement nominatif au hasard : seuls les chasseurs pas encore places bougent.
  const placerAuHasard = (jid, algo, portee) => {
    const j = journees.find((x) => x.id === jid); if (!j) return "";
    const terrain = terrains.find((x) => x.id === j.terrainId); if (!terrain) return "";
    const ids = presentsDe(j);
    if (!ids.length) return "Aucun chasseur noté présent dans « Qui vient ? ».";
    const personnes = ids.map((id) => { const p = participants.find((x) => x.id === id); return { id, arme: ((j.armes || {})[id]) || p.arme || null, mobility: p.mobility || "" }; });
    const tracks = terrain.tracks || [];
    const cibles = portee === "toutes" ? tracks : tracks.filter((trk) => trk.id === portee);
    const histo = {};
    if (portee !== "toutes") tracks.filter((trk) => trk.id !== portee).forEach((trk) => Object.entries((j.placements || {})[trk.id] || {}).forEach(([hid, mid]) => { const m = (trk.miradors || []).find((x) => x.id === mid); if (m) (histo[hid] = histo[hid] || []).push(Number(m.priority) || 1); }));
    const rabJ = normRabat(j.rabat);
    const trs = cibles.map((trk) => { const cur = { ...((j.placements || {})[trk.id] || {}) }; const pris = {}; Object.values(cur).forEach((mid) => { pris[mid] = true; }); return { id: trk.id, postes: trk.miradors || [], pris, deja: cur, exclus: rabJ[trk.id] || {} }; });
    const r = meilleureRepartition(personnes, trs, algo, true, histo);
    const placements = { ...(j.placements || {}) }; let n = 0;
    trs.forEach((tr) => { const ajout = r.placements[tr.id] || {}; n += Object.keys(ajout).length; placements[tr.id] = { ...tr.deja, ...ajout }; });
    majJournee(jid, { placements });
    if (!n && !r.manques.length) return "Tous les chasseurs présents sont déjà placés.";
    return "✓ " + n + " placement" + (n > 1 ? "s" : "") + " au hasard." + (r.manques.length ? " ⚠ " + r.manques.length + " placement" + (r.manques.length > 1 ? "s" : "") + " impossible" + (r.manques.length > 1 ? "s" : "") + " (pas de poste libre compatible avec l'arme ou le besoin)." : " Vous pouvez corriger sur la carte.");
  };
  const clearAll = (jid, trackId) => setJournees((prev) => prev.map((j) => (j.id !== jid ? j : { ...j, placements: { ...j.placements, [trackId]: {} } })));
  const addArrow = (jid, trackId, a) => setJournees((prev) => prev.map((j) => (j.id !== jid ? j : { ...j, arrows: { ...(j.arrows || {}), [trackId]: [...((j.arrows || {})[trackId] || []), a] } })));
  const clearArrows = (jid, trackId) => setJournees((prev) => prev.map((j) => (j.id !== jid ? j : { ...j, arrows: { ...(j.arrows || {}), [trackId]: [] } })));
  const updateArrow = (jid, trackId, idx, patch) => setJournees((prev) => prev.map((j) => (j.id !== jid ? j : { ...j, arrows: { ...(j.arrows || {}), [trackId]: ((j.arrows || {})[trackId] || []).map((a, i) => (i === idx ? { ...a, ...patch } : a)) } })));
  const deleteArrow = (jid, trackId, idx) => setJournees((prev) => prev.map((j) => (j.id !== jid ? j : { ...j, arrows: { ...(j.arrows || {}), [trackId]: ((j.arrows || {})[trackId] || []).filter((a, i) => i !== idx) } })));
  const addKill = (jid) => setJournees((prev) => prev.map((j) => { if (j.id !== jid) return j; const terrain = terrains.find((t) => t.id === j.terrainId); const firstTrack = terrain?.tracks?.[0]?.id || ""; return { ...j, tableau: [...(j.tableau || []), { id: "k-" + Date.now(), espece: "chevreuil", especeLabel: "", quantite: 1, sexe: "", poids: "", bracelet: "", tireurId: "", trackId: firstTrack }] }; }));
  const updateKill = (jid, kid, patch) => setJournees((prev) => prev.map((j) => (j.id !== jid ? j : { ...j, tableau: (j.tableau || []).map((k) => (k.id === kid ? { ...k, ...patch } : k)) })));
  const removeKill = (jid, kid) => setJournees((prev) => prev.map((j) => (j.id !== jid ? j : { ...j, tableau: (j.tableau || []).filter((k) => k.id !== kid) })));
  const setShot = (jid, trackId, mid, val) => setJournees((prev) => prev.map((j) => (j.id !== jid ? j : { ...j, shots: { ...(j.shots || {}), [trackId]: { ...((j.shots || {})[trackId] || {}), [mid]: val } } })));
  const setMiradorState = (jid, trackId, mid, patch) => setJournees((prev) => prev.map((j) => (j.id !== jid ? j : { ...j, miradorStates: { ...(j.miradorStates || {}), [trackId]: { ...((j.miradorStates || {})[trackId] || {}), [mid]: { ...(((j.miradorStates || {})[trackId] || {})[mid] || {}), ...patch } } } })));

  if (chefView) { const journee = journees.find((j) => j.id === chefView.journeeId); const terrain = terrains.find((t) => t.id === journee?.terrainId); const chef = participants.find((p) => p.id === chefView.chefId); if (!journee || !terrain || !chef) { setChefView(null); return null; } return <ChefAssign terrain={terrain} journee={journee} chefId={chefView.chefId} chefName={chef.name} participants={participantsDuJour(participants, journee, true)} onToggle={(mid, chefId) => setChefLigne(journee.id, mid, chefId)} onBack={() => setChefView(null)} />; }
  if (pointsView) {
    const journee = journees.find((j) => j.id === pointsView.journeeId);
    const terrain = terrains.find((t) => t.id === journee?.terrainId);
    if (!journee || !terrain) { setPointsView(null); return null; }
    return <PointsView terrain={terrain} journee={journee}
      onAjouter={(trackId, type, d) => majPoints(journee.id, terrain.id, trackId, type, "add", d)}
      onRenommer={(trackId, type, id, nom) => majPoints(journee.id, terrain.id, trackId, type, "ren", { id, nom })}
      onSupprimer={(trackId, type, id) => majPoints(journee.id, terrain.id, trackId, type, "del", { id })}
      onDeplacer={(trackId, type, id, gx, gy) => majPoints(pointsView.journeeId, terrain.id, trackId, type, "mov", { id, gx, gy })}
      onBack={() => setPointsView(null)} />;
  }

  if (posterView) { const journee = journees.find((j) => j.id === posterView.journeeId); const terrain = terrains.find((t) => t.id === journee?.terrainId); const track = terrain?.tracks.find((t) => t.id === posterView.trackId); if (!journee || !terrain || !track) { setPosterView(null); return null; }
    const tirP = normTirage(journee.tirage);
    const presentsP = Object.keys(journee.presence || {}).filter((id) => (journee.presence[id] || {}).statut === "present");
    const presIdsP = tirP.actif ? tirP.reserves.filter((id) => presentsP.indexOf(id) >= 0).concat(Array.from({ length: tirP.nb }, (_, k) => NUM_ID(k + 1))) : presentsP;
    return <PosterFusils rabatIds={Object.keys(normRabat(journee.rabat)[track.id] || {}).filter((id) => presIdsP.indexOf(id) >= 0)} onRabat={(hid) => toggleRabat(journee.id, track.id, hid)} onPoste={(hid) => toggleRabat(journee.id, track.id, hid)} verrouNums={tirP.actif && tirP.publie && tirP.nb > 0} terrain={terrain} track={track} placements={journee.placements[track.id] || {}} participants={participantsDuJour(participants, journee, true)} presentIds={tirP.actif ? tirP.reserves.filter((id) => presentsP.indexOf(id) >= 0).concat(Array.from({ length: tirP.nb }, (_, k) => NUM_ID(k + 1))) : presentsP} journeeArmes={journee.armes || {}} onSetArme={(hid, arme) => setArmeJour(journee.id, hid, arme)} chefs={journee.chefs || []} chefLignes={journee.chefLignes || {}} rdv={(journee.rdv || {})[track.id] || {}} onSetRdv={(cid, pos) => setRdv(journee.id, track.id, cid, pos)} onBack={() => setPosterView(null)} onAssign={(hid, mid) => assign(journee.id, track.id, hid, mid)} onUnassign={(hid) => unassign(journee.id, track.id, hid)} onAutoFill={(trk, pending, sortedFree) => autoFill(journee.id, trk, pending, sortedFree)} onClearAll={(trk) => clearAll(journee.id, trk.id)} arrows={(journee.arrows || {})[track.id] || []} onAddArrow={(a) => addArrow(journee.id, track.id, a)} onClearArrows={() => clearArrows(journee.id, track.id)} onUpdateArrow={(idx, patch) => updateArrow(journee.id, track.id, idx, patch)} onDeleteArrow={(idx) => deleteArrow(journee.id, track.id, idx)} />; }
  if (shareView) { const journee = journees.find((j) => j.id === shareView.journeeId); const terrain = terrains.find((t) => t.id === journee?.terrainId); if (!journee || !terrain) { setShareView(null); return null; }
    return <EnvoiChasseurs journee={journee} terrain={terrain} participants={participants} safety={safety} onBack={() => setShareView(null)} />; }

  return (<div className="space-y-3">
    {postesPrint && <PrintOverlay html={postesPrint} onClose={() => setPostesPrint(null)} />}
    {aSupprimer && <FenetreSuppression journee={aSupprimer} terrain={terrains.find((t) => t.id === aSupprimer.terrainId)} archivee={!!aSupprimer.archivee}
      onAnnuler={() => setASupprimer(null)}
      onArchiver={() => { const id = aSupprimer.id; setASupprimer(null); archiverSansQuestion(id); }}
      onSupprimer={() => { const j = aSupprimer; setASupprimer(null); supprimerDefinitivement(j); }} />}
    {msgListe && <div className="bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 flex items-start gap-2"><span className="flex-1">{msgListe}</span><button onClick={() => setMsgListe("")} className="text-stone-400">✕</button></div>}
    <div className="flex items-center justify-between"><h2 className="font-serif text-xl text-stone-800">Journées de chasse</h2><button onClick={addJournee} className="flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-stone-50 text-sm font-medium px-3 py-1.5 rounded-md"><Plus size={16} /> Nouvelle journée</button></div>
    {[...journees].filter((j) => !j.archivee).sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).map((j) => { const isOpen = openJournee === j.id; const terrain = terrains.find((t) => t.id === j.terrainId);
      const dateFr = new Date(j.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

      // ---- Résumés et avancement de chaque étape ----
      const pres = j.presence || {};
      const invited = j.invites || [];
      const nbPres = participants.filter((p) => (pres[p.id] || {}).statut === "present").length;
      const nbDiner = participants.filter((p) => (pres[p.id] || {}).statut === "present" && (pres[p.id] || {}).diner).length;
      const nbDej = participants.filter((p) => (pres[p.id] || {}).statut === "present" && (pres[p.id] || {}).dej).length;
      const nbSup = participants.reduce((n, p) => n + (((pres[p.id] || {}).statut === "present") ? (Number((pres[p.id] || {}).invitesSup) || 0) : 0), 0);
      const tracks = terrain ? (terrain.tracks || []) : [];
      const totalPostes = tracks.reduce((n, t) => n + (t.miradors || []).length, 0);
      const totalPlaces = tracks.reduce((n, t) => n + Object.keys(j.placements[t.id] || {}).length, 0);
      const nbChefs = (j.chefs || []).length;
      const presentsIds = participants.filter((p) => (pres[p.id] || {}).statut === "present").map((p) => p.id);
      // Les voitures sont rangées par traque : on additionne, et on repère
      // la moindre traque où quelqu'un n'a pas de voiture.
      const vParT = j.voitures || {}, tParT = j.transport || {};
      let nbVoitures = 0, nbPassagers = 0, traquesIncompletes = 0;
      tracks.forEach((tr) => {
        const vs = vParT[tr.id] || [], tp = tParT[tr.id] || {};
        nbVoitures += vs.length;
        const cond = vs.map((v) => v.conducteurId);
        const pass = Object.keys(tp).filter((id) => (tp[id] || {}).voitureId);
        nbPassagers += pass.length;
        if (vs.length && presentsIds.some((id) => cond.indexOf(id) < 0 && pass.indexOf(id) < 0)) traquesIncompletes++;
      });
      const stVoitures = nbVoitures === 0 ? "todo" : (traquesIncompletes > 0 ? "partial" : "done");
      const especes = terrain ? ESPECES.filter((e) => e.key !== "autre" && terrain.planChasse && terrain.planChasse[e.key] && terrain.planChasse[e.key].enabled) : [];
      const nbAttr = especes.filter((e) => { const a = (j.attributions || {})[e.key] || {}; return a.mode === "bracelets" || a.mode === "interdit" || (a.note || "").trim(); }).length;
      const nbPrises = (j.tableau || []).reduce((n, k) => n + (Number(k.quantite) || 0), 0);

      const stInvit = invited.length ? "done" : "todo";
      const stPres = nbPres ? "done" : (invited.length ? "partial" : "todo");
      const stAttr = ((j.canal || "").trim() || nbAttr) ? "done" : "todo";
      const stPostes = totalPlaces === 0 ? "todo" : ((nbPres > 0 && totalPlaces >= Math.min(nbPres, totalPostes)) ? "done" : "partial");
      const stChefs = nbChefs ? "done" : "todo";
      const nbFaites = [stInvit, stPres, stAttr, stPostes, stChefs, stVoitures].filter((x) => x === "done").length;

      const step = isOpen ? openStep : null;
      const setStep = (id) => setOpenStep((o) => (o === id ? null : id));

      return (<SectionCard key={j.id} className="overflow-hidden p-0">
        {!isOpen && (<LigneGlissable ouvert={ligneOuverte === j.id} setOuvert={(v) => setLigneOuverte(v ? j.id : null)} onArchiver={() => archiverSansQuestion(j.id)} onSupprimer={() => setASupprimer(j)}>
          <div className="flex items-center">
            <button onClick={() => { setLigneOuverte(null); setOpenJournee(j.id); setOpenStep(null); }} className="flex-1 min-w-0 flex items-center justify-between pl-4 pr-1 py-3 text-left gap-2">
              <span className="flex items-center gap-2 font-medium text-stone-800 text-sm min-w-0"><ChevronRight size={16} className="shrink-0" /><CalendarDays size={16} className="text-amber-800 shrink-0" /><span className="truncate">{dateFr}</span></span>
              <span className="text-xs text-stone-400 shrink-0 truncate max-w-[45%]">{terrain ? terrain.name : "aucun territoire"}</span>
            </button>
            <button data-plus="1" onClick={() => setLigneOuverte(ligneOuverte === j.id ? null : j.id)} aria-label="Archiver ou supprimer" className="shrink-0 px-3 py-3 text-stone-400 hover:text-stone-700 text-lg leading-none">⋯</button>
          </div>
        </LigneGlissable>)}

        {isOpen && (<div>
          <div className="bg-stone-800 text-stone-50 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-serif text-lg leading-tight">{dateFr.charAt(0).toUpperCase() + dateFr.slice(1)}</p>
                <p className="text-stone-400 text-xs mt-0.5 truncate">{terrain ? terrain.name : "aucun territoire"}{tracks.length ? " · " + tracks.length + " traque" + (tracks.length > 1 ? "s" : "") : ""}{(j.canal || "").trim() ? " · canal " + j.canal : ""}</p>
              </div>
              <button onClick={() => { setOpenJournee(null); setOpenStep(null); }} className="text-stone-400 text-xs shrink-0 p-1">▲</button>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1"><span>Préparation</span><span>{nbFaites} étape{nbFaites > 1 ? "s" : ""} sur 6</span></div>
              <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: (nbFaites / 6 * 100) + "%" }} /></div>
            </div>
          </div>

          <div className="p-3.5 space-y-4">

            <StepGroup label="Le jour même">
              <StepTile id="jour" emoji="📅" title="Date & territoire" sub={new Date(j.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " · " + (terrain ? terrain.name : "territoire à choisir")} state={terrain ? "done" : "todo"} open={step} onToggle={setStep} />
              <StepPanel id="jour" open={step}>
                <div className="space-y-3">
                  <div><label className="text-[11px] uppercase tracking-wide text-stone-400">Date</label>
                    <input type="date" value={j.date} onChange={(e) => setJourneeDate(j.id, e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 mt-1 text-sm bg-white" /></div>
                  <div><label className="text-[11px] uppercase tracking-wide text-stone-400">Territoire</label>
                    <select value={terrains.some((t) => t.id === j.terrainId) ? j.terrainId : ""} onChange={(e) => setJourneeTerrain(j.id, e.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2 mt-1 text-sm bg-white"><option value="" disabled>Choisir…</option>{[...terrains].sort((a, b) => byNom(a.name || "", b.name || "")).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                  <button onClick={() => archiverJournee(j.id)} className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900">📦 Archiver cette journée</button>
                </div>
              </StepPanel>
            </StepGroup>

            <StepGroup label="Avant la battue">
              <div className="space-y-2.5">
                <StepTile id="invit" num={1} emoji="📧" title="Envoyer les invitations" sub={invited.length ? invited.length + " invité" + (invited.length > 1 ? "s" : "") : "personne d'invité"} state={stInvit} open={step} onToggle={setStep} />
                <StepPanel id="invit" open={step}>
                  <InvitationsSection bare part="invite" journee={j} terrain={terrain} participants={participants} orgEmail={orgEmail} onToggleInvite={toggleInvite} onSetPresence={setPresence} onSetMsg={setInviteMsg} />
                </StepPanel>

                <StepTile id="pres" num={2} emoji="✅" title="Présences" sub={invited.length ? nbPres + " présent" + (nbPres > 1 ? "s" : "") + " · " + nbDej + " au déj. · " + nbDiner + " au dîner" + (nbSup ? " (+" + nbSup + ")" : "") : "invite d'abord des membres"} state={stPres} open={step} onToggle={setStep} />
                <StepPanel id="pres" open={step}>
                  <InvitationsSection bare part="presence" journee={j} terrain={terrain} participants={participants} orgEmail={orgEmail} onToggleInvite={toggleInvite} onSetPresence={setPresence} onSetMsg={setInviteMsg} />
                </StepPanel>

                <StepTile id="attr" num={3} emoji="🎯" title="Attributions du jour" sub={(j.responsableId ? "" : "responsable à désigner · ") + ((j.canal || "").trim() ? "Canal " + j.canal : "canal non renseigné") + (nbAttr ? " · " + nbAttr + " espèce" + (nbAttr > 1 ? "s" : "") + " définie" + (nbAttr > 1 ? "s" : "") : "")} state={stAttr} open={step} onToggle={setStep} />
                <StepPanel id="attr" open={step}>
                  {terrain ? <AttributionsSection bare journee={j} terrain={terrain} participants={participants} onSet={setAttribution} canal={j.canal || ""} onSetCanal={(v) => setJournees((prev) => prev.map((x) => x.id === j.id ? { ...x, canal: v } : x))} onSetResp={(v) => majJournee(j.id, { responsableId: v })} /> : <p className="text-sm text-stone-500 italic">Choisis d'abord un territoire.</p>}
                </StepPanel>

                <StepTile id="postes" num={4} icon={<MiradorIcon size={27} />} title="Poster les fusils" sub={terrain ? (totalPostes ? totalPlaces + "/" + totalPostes + " postes attribués" : "aucun poste sur ce territoire") : "choisis un territoire"} state={stPostes} open={step} onToggle={setStep} />
                <StepPanel id="postes" open={step}>
                  {terrain && tracks.length > 0 && <div className="mb-3"><TirageSection journee={j} terrain={terrain} participants={participants} presentIds={presentsIds} onMaj={(patch) => majJournee(j.id, patch)} onPlacer={(tid) => setPosterView({ journeeId: j.id, trackId: tid })} onGenerer={() => genererTirage(j.id)} onHasard={(algo, portee) => placerAuHasard(j.id, algo, portee)} onQuitterTirage={() => quitterTirage(j.id)} /></div>}
                  {terrain && tracks.length > 0 && <RabatSection journee={j} terrain={terrain} rows={lignesRabat(j)} verrouNums={tirageActif(j) && normTirage(j.tirage).publie && normTirage(j.tirage).nb > 0} onToggle={(tid, hid) => toggleRabat(j.id, tid, hid)} onToggleJamais={(hid) => toggleJamaisRabat(j.id, hid)} onMajRegle={(patch) => majRabatRegle(j.id, patch)} onRepartir={() => repartirRabat(j.id)} />}
                  {terrain && tracks.length > 0 && <p className="text-[11px] uppercase tracking-wide text-stone-400 mb-1.5">{tirageActif(j) ? "Les traques (vérifier, placer les « à la main »)" : "Les traques"}</p>}
                  {terrain ? (tracks.length ? (<div className="space-y-2">
                    {tracks.map((trk) => { const placed = Object.keys(j.placements[trk.id] || {}).length; const tot = (trk.miradors || []).length; const vide = placed === 0;
                      return (<div key={trk.id} className={`flex items-center justify-between gap-2 bg-white border rounded-lg px-3 py-2.5 ${vide ? "border-amber-300" : "border-stone-200"}`}>
                        <div className="min-w-0"><p className="font-medium text-sm text-stone-800 truncate">{trk.name}</p><p className={`text-[11px] flex items-center gap-1 ${vide ? "text-amber-700" : "text-stone-500"}`}><MapPin size={11} /> {vide ? "aucun poste attribué" : placed + "/" + tot + " postes"}</p></div>
                        <button onClick={() => setPosterView({ journeeId: j.id, trackId: trk.id })} className="shrink-0 flex items-center gap-1.5 text-xs font-medium bg-emerald-800 hover:bg-emerald-900 text-stone-50 px-3 py-1.5 rounded-md"><Crosshair size={13} /> Placer</button>
                      </div>); })}
                  </div>) : <p className="text-sm text-stone-500 italic">Ce territoire n'a pas encore de traque.</p>) : <p className="text-sm text-stone-500 italic">Choisis d'abord un territoire.</p>}
                </StepPanel>

                <StepTile id="chefs" num={5} emoji="👨‍✈️" title="Chefs de ligne" sub={nbChefs ? nbChefs + " désigné" + (nbChefs > 1 ? "s" : "") : "aucun désigné"} state={stChefs} open={step} onToggle={setStep} />
                <StepPanel id="chefs" open={step}>
                  {terrain ? <ChefsSection bare journee={j} terrain={terrain} participants={participants} journees={journees} onSet={majJournee} onToggleChef={toggleChef} onSetChefLigne={setChefLigne} onAssignPosts={(jid, chefId) => setChefView({ journeeId: jid, chefId })} /> : <p className="text-sm text-stone-500 italic">Choisis d'abord un territoire.</p>}
                </StepPanel>

                <StepTile id="voitures" num={6} emoji="🚗" title="Voitures & dépose" sub={nbVoitures ? nbVoitures + " voiture" + (nbVoitures > 1 ? "s" : "") + " · " + nbPassagers + " passager" + (nbPassagers > 1 ? "s" : "") + (traquesIncompletes ? " · " + traquesIncompletes + " traque(s) incomplète(s)" : "") : "personne n'est affecté"} state={stVoitures} open={step} onToggle={setStep} />
                <StepPanel id="voitures" open={step}>
                  {terrain ? <VoituresSection journee={j} terrain={terrain} participants={participants} presentIds={presentsIds} journees={journees}
                    onSet={(patch) => majJournee(j.id, patch)}
                    onOuvrirPoints={() => setPointsView({ journeeId: j.id })} />
                    : <p className="text-sm text-stone-500 italic">Choisis d'abord un territoire.</p>}
                </StepPanel>
              </div>
            </StepGroup>

            <StepGroup label="Prêt à partir">
              <div className="grid grid-cols-2 gap-2.5">
                <GridTile id="partage" emoji="📤" title="Envoyer les postes" sub={(pub.status === "live" || pub.status === "ok") ? "● En ligne" : "pas encore envoyé"} subCls={(pub.status === "live" || pub.status === "ok") ? "text-emerald-700" : "text-stone-400"} open={step} onToggle={setStep} />
                <GridTile id="docs" emoji="🖨️" title="Documents" sub="Postes, émargement, repas" open={step} onToggle={setStep} />
              </div>
              <StepPanel id="docs" open={step}>
                {terrain ? (<div className="space-y-2">
                  <button onClick={() => setChoixPrint(choixPrint === j.id ? null : j.id)} className="w-full text-left text-sm text-stone-700 bg-white border border-stone-200 rounded-lg px-3 py-2.5">📄 Imprimer les postes {choixPrint === j.id ? "▴" : "▾"}</button>
                  {choixPrint === j.id && <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setChoixPrint(null); printPostes(j); }} className="text-left bg-white border-2 border-emerald-700 rounded-lg px-3 py-2">
                      <span className="block text-sm font-semibold text-stone-800">Une page par traque</span>
                      <span className="block text-xs text-stone-500 mt-0.5">Tableau des postes et carte de la traque</span>
                    </button>
                    <button onClick={() => { setChoixPrint(null); printResume(j); }} className="text-left bg-white border-2 border-emerald-700 rounded-lg px-3 py-2">
                      <span className="block text-sm font-semibold text-stone-800">Résumé de la journée</span>
                      <span className="block text-xs text-stone-500 mt-0.5">Tableau de tout le monde, puis toutes les cartes</span>
                    </button>
                    {tirageActif(j) && normTirage(j.tirage).nb > 0 && <button onClick={() => { setChoixPrint(null); const terr = terrains.find((t) => t.id === j.terrainId); if (terr) setPostesPrint(buildCartonsHtml(j, terr)); }} className="col-span-2 text-left bg-white border-2 border-amber-600 rounded-lg px-3 py-2">
                      <span className="block text-sm font-semibold text-stone-800">🎟 Cartons du tirage au sort</span>
                      <span className="block text-xs text-stone-500 mt-0.5">{normTirage(j.tirage).nb} numéros à découper pour le chapeau</span>
                    </button>}
                    <button onClick={() => { setChoixPrint(null); ouvrirLivrets(j); }} className="col-span-2 text-left bg-white border-2 border-emerald-700 rounded-lg px-3 py-2">
                      <span className="block text-sm font-semibold text-stone-800">📖 Livret par {tirageActif(j) ? "numéro" : "chasseur"}</span>
                      <span className="block text-xs text-stone-500 mt-0.5">A4 paysage recto-verso, plié en deux : accueil, ses postes, plan de chasse, annonces et ses cartes</span>
                    </button>
                  </div>}
                  {livret && livret.jid === j.id && (() => {
                    const terr = terrains.find((t) => t.id === j.terrainId);
                    const liste = chasseursPlaces(j, terr);
                    const nbSel = liste.filter((p) => livret.sel[p.id]).length;
                    return (<div className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-3">
                      <div className="flex items-center justify-between"><span className="text-sm font-semibold text-stone-800">📖 Livrets à imprimer</span><button onClick={() => setLivret(null)} className="text-xs text-stone-500 px-2 py-1">Fermer</button></div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-md border border-stone-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                          {terr && terr.imageCouverture ? <img src={terr.imageCouverture} alt="" className="max-w-full max-h-full" /> : <img src="icon.png" alt="" className="w-10 h-10 opacity-70" />}
                        </div>
                        <div className="text-xs text-stone-500 flex-1">Image de la page d'accueil, pour ce territoire. {terr && terr.imageCouverture ? "" : "À défaut, le logo Carnet de Chasse."}
                          <div className="flex gap-2 mt-1.5">
                            <label className="text-xs font-medium text-emerald-800 bg-white border border-emerald-700 rounded px-2 py-1 cursor-pointer">Choisir une image<input type="file" accept="image/*" className="hidden" onChange={(ev) => { const f = ev.target.files && ev.target.files[0]; ev.target.value = ""; if (f && terr) choisirCouverture(terr.id, f); }} /></label>
                            {terr && terr.imageCouverture && <button onClick={() => setTerrains((prev) => prev.map((t) => (t.id === terr.id ? { ...t, imageCouverture: null } : t)))} className="text-xs text-stone-500 px-2 py-1">Retirer</button>}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1"><span className="text-xs text-stone-500">{nbSel} / {liste.length} chasseur(s)</span>
                          <span className="flex gap-2"><button onClick={() => setLivret({ ...livret, sel: Object.fromEntries(liste.map((p) => [p.id, true])) })} className="text-xs text-emerald-800 px-1">Tous</button><button onClick={() => setLivret({ ...livret, sel: {} })} className="text-xs text-stone-500 px-1">Aucun</button></span></div>
                        <div className="max-h-64 overflow-auto bg-white border border-stone-200 rounded-md divide-y divide-stone-100">
                          {liste.map((p) => (<label key={p.id} className="flex items-center gap-2 px-2.5 py-2 text-sm text-stone-800">
                            <input type="checkbox" checked={!!livret.sel[p.id]} onChange={() => setLivret({ ...livret, sel: { ...livret.sel, [p.id]: !livret.sel[p.id] } })} className="w-4 h-4 accent-emerald-700" />{p.name}</label>))}
                          {!liste.length && <p className="text-xs text-stone-400 p-2.5">Aucun chasseur placé pour l'instant.</p>}
                        </div>
                      </div>
                      <label className="flex items-start gap-2 text-xs text-stone-600"><input type="checkbox" checked={!!livret.retourner} onChange={() => setLivret({ ...livret, retourner: !livret.retourner })} className="w-4 h-4 mt-0.5 accent-emerald-700" /><span>Le verso sort à l'envers ? Coche ici pour le retourner.</span></label>
                      <div>
                        <span className="text-xs text-stone-500">Format</span>
                        <div className="grid grid-cols-3 gap-1.5 mt-1">
                          {[["a4", "A4 plié", "livret A5"], ["a5", "A5 plié", "petit livret A6"], ["coupe", "A4 à couper", "2 livrets A5 / feuille"]].map(([k, t, st]) => (
                            <button key={k} onClick={() => setLivret({ ...livret, format: k })} className={"rounded-md border px-2 py-1.5 text-left " + ((livret.format || "a4") === k ? "border-emerald-700 bg-emerald-50" : "border-stone-200 bg-white")}>
                              <span className={"block text-xs font-semibold " + ((livret.format || "a4") === k ? "text-emerald-900" : "text-stone-700")}>{t}</span>
                              <span className="block text-[10px] text-stone-500">{st}</span>
                            </button>))}
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-400">{(livret.format || "a4") === "a5" ? "À l'impression : papier A5, paysage, recto-verso, retournement sur le bord court, puis pliez en deux. Une feuille par chasseur." : (livret.format || "a4") === "coupe" ? "À l'impression : papier A4, portrait, recto-verso, retournement sur le bord long. Coupez au pointillé, puis pliez chaque moitié. Deux chasseurs par feuille." : "À l'impression : papier A4, paysage, recto-verso, retournement sur le bord court, puis pliez en deux. Une feuille par chasseur."}</p>
                      <button disabled={!nbSel} onClick={() => printLivrets(j)} className="w-full bg-emerald-800 disabled:bg-stone-300 text-white text-sm font-semibold rounded-lg py-2.5">Imprimer {nbSel} livret{nbSel > 1 ? "s" : ""}</button>
                    </div>);
                  })()}
                  <button onClick={() => { if (!nbPres) { window.alert("Coche d'abord des présents à l'étape Présences."); return; } setPostesPrint(buildEmargementHtml(j, terrain, participants)); }} className="w-full text-left text-sm text-stone-700 bg-white border border-stone-200 rounded-lg px-3 py-2.5">✍️ Feuille d'émargement</button>
                  <button onClick={() => { if (!nbDej) { window.alert("Personne n'est inscrit au déjeuner."); return; } setPostesPrint(buildDejeunerHtml(j, terrain, participants)); }} className="w-full text-left text-sm text-stone-700 bg-white border border-stone-200 rounded-lg px-3 py-2.5">🥪 Liste du déjeuner (PDF)</button>
                  <button onClick={() => { if (!nbDiner) { window.alert("Personne n'est inscrit au dîner."); return; } setPostesPrint(buildDinerHtml(j, terrain, participants)); }} className="w-full text-left text-sm text-stone-700 bg-white border border-stone-200 rounded-lg px-3 py-2.5">🍽️ Liste du dîner (PDF)</button>
                </div>) : <p className="text-sm text-stone-500 italic">Choisis d'abord un territoire.</p>}
              </StepPanel>
              <StepPanel id="partage" open={step}>
                {terrain ? (<div className="space-y-2.5">
                  {pub.status === "publishing" && (<div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-center">
                    <p className="text-sm text-stone-600">Préparation du lien…</p>
                  </div>)}

                  <div className="bg-white border-2 border-emerald-700 rounded-xl p-3.5">
                    <p className="text-[17px] font-extrabold text-emerald-900 leading-tight">Lien à envoyer aux chasseurs</p>
                    {(pub.status === "live" || pub.status === "ok") ? (<>
                      <p className="text-xs text-stone-500 mt-1 mb-3 leading-snug">Il est en ligne. Chacun y retrouve son poste, sa carte, ses consignes et sa voiture.</p>
                      <a href={urlDe(j)} target="_blank" rel="noreferrer" className="block bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3 mb-2">
                        <span className="block text-[10px] uppercase tracking-widest text-emerald-700 font-bold">Ton lien du jour</span>
                        <span className="block text-[15px] font-bold text-emerald-900 break-all leading-tight mt-1">{urlDe(j)}</span>
                      </a>
                      <button onClick={() => shareLinkWhatsApp(urlDe(j))} className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-stone-50 text-[15px] font-bold py-3.5 rounded-xl"><Send size={17} /> Envoyer sur WhatsApp</button>
                      <div className="flex gap-2 mt-2">
                        <button onClick={copyPubLink} className="flex-1 text-[12.5px] font-medium text-stone-600 bg-white border border-stone-300 rounded-lg py-2.5">📋 Copier le lien</button>
                        <button onClick={() => publish(j)} disabled={pub.status === "publishing"} className="flex-1 text-[12.5px] font-medium text-stone-600 bg-white border border-stone-300 disabled:opacity-50 rounded-lg py-2.5">↻ Mettre à jour</button>
                      </div>
                      {pub.chatErr ? (<p className="text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-2 leading-snug">💬 {pub.chatErr}</p>) : null}
                      {github.chatActif && j.chatAdmin && !pub.chatErr ? (<div className="bg-amber-50 border border-amber-300 rounded-xl p-3 mt-2">
                        <p className="text-[13px] font-bold text-amber-900">👑 Ton lien organisateur du chat</p>
                        <p className="text-[11.5px] text-amber-800 mt-0.5 mb-2 leading-snug">Ouvre-le sur ton téléphone pour supprimer un message ou retirer quelqu'un du chat. <b>Ne l'envoie à personne</b> : il donne ces pouvoirs.</p>
                        <div className="flex gap-2">
                          <a href={urlDe(j) + "#org=" + j.chatAdmin} target="_blank" rel="noreferrer" className="flex-1 text-center text-[12.5px] font-semibold text-amber-900 bg-white border border-amber-300 rounded-lg py-2.5">Ouvrir</a>
                          <button onClick={() => { const l = urlDe(j) + "#org=" + j.chatAdmin; if (navigator.clipboard) navigator.clipboard.writeText(l).then(() => window.alert("Lien organisateur copié ✓ Garde-le pour toi.")).catch(() => window.prompt("Copie le lien :", l)); else window.prompt("Copie le lien :", l); }} className="flex-1 text-[12.5px] font-semibold text-amber-900 bg-white border border-amber-300 rounded-lg py-2.5">📋 Copier</button>
                        </div>
                      </div>) : null}
                    </>) : (<>
                      <p className="text-xs text-stone-500 mt-1 mb-3 leading-snug">Pas encore publié. Une fois en ligne, chacun ouvre le lien et retrouve son poste, sa carte, ses consignes et sa voiture.</p>
                      <button onClick={() => publish(j)} disabled={pub.status === "publishing"} className="w-full bg-emerald-700 disabled:opacity-60 text-stone-50 text-[15px] font-bold py-3.5 rounded-xl">📤 Publier la page en ligne</button>
                    </>)}
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 mt-3">
                      <p className="text-[13px] font-bold text-stone-800 mb-1.5">Comment l'envoyer</p>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li className="text-[12px] text-stone-600 leading-snug">Crée <b className="text-stone-800">un groupe WhatsApp avec tes chasseurs</b>, une fois pour toutes.</li>
                        <li className="text-[12px] text-stone-600 leading-snug">Avant chaque battue, <b className="text-stone-800">colle ce lien dans le groupe</b>.</li>
                        <li className="text-[12px] text-stone-600 leading-snug">Chacun ouvre le lien, choisit son nom, et retrouve son poste.</li>
                      </ol>
                      <p className="text-[11.5px] text-stone-500 mt-2 leading-snug">Chaque journée a son propre lien, et il ne change plus. Si tu modifies un placement, touche « Mettre à jour » : le lien déjà envoyé affichera la nouvelle version.</p>
                    </div>
                  </div>

                  {pub.status === "error" && (<div className="bg-red-50 border border-red-200 rounded-lg p-2.5 space-y-2">
                    <p className="text-sm text-red-800">⚠ Échec : {pub.msg}</p>
                    <button onClick={() => publish(j)} className="w-full bg-stone-800 text-stone-50 text-sm font-medium py-2 rounded-lg">Réessayer</button>
                  </div>)}

                  <button onClick={() => setShareView({ journeeId: j.id })} className="w-full text-[12px] text-stone-600 bg-white border border-stone-300 rounded-lg py-2">💬 Liste en texte</button>
                </div>) : <p className="text-sm text-stone-500 italic">Choisis d'abord un territoire.</p>}
              </StepPanel>
            </StepGroup>

            <StepGroup label="Après la battue">
              <StepTile id="tableau" emoji="🦌" title="Tableau de chasse" sub={nbPrises ? nbPrises + " animal" + (nbPrises > 1 ? "ux" : "") + " prélevé" + (nbPrises > 1 ? "s" : "") : "rien de déclaré"} state={nbPrises ? "done" : "todo"} open={step} onToggle={setStep} />
              <StepPanel id="tableau" open={step}>
                <TableauSection j={j} terrain={terrain} participants={participants} onAddKill={() => addKill(j.id)} onUpdateKill={(kid, patch) => updateKill(j.id, kid, patch)} onRemoveKill={(kid) => removeKill(j.id, kid)} onSetShot={(trackId, mid, val) => setShot(j.id, trackId, mid, val)} onSetState={(trackId, mid, patch) => setMiradorState(j.id, trackId, mid, patch)} />
              </StepPanel>
            </StepGroup>

            {terrain && (<div className="sticky bottom-0 z-30 -mx-4 px-4 pt-2 bg-stone-50/95 backdrop-blur border-t border-stone-200"
              style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}>
              {(pub.status === "live" || pub.status === "ok") ? (<>
                <button onClick={() => shareLinkWhatsApp(urlDe(j))} className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-stone-50 text-[15px] font-bold py-3.5 rounded-xl"><Send size={17} /> Envoyer le lien sur WhatsApp</button>
                <p className="text-[10.5px] text-stone-400 text-center mt-1.5 truncate">En ligne · {urlDe(j)}</p>
              </>) : (<>
                <button onClick={() => publish(j)} disabled={pub.status === "publishing"} className="w-full bg-emerald-700 disabled:opacity-60 text-stone-50 text-[15px] font-bold py-3.5 rounded-xl">{pub.status === "publishing" ? "Préparation du lien…" : "📤 Publier la page en ligne"}</button>
                <p className="text-[10.5px] text-stone-400 text-center mt-1.5">Le lien à envoyer aux chasseurs sera prêt en quelques secondes</p>
              </>)}
            </div>)}

          </div>
        </div>)}
      </SectionCard>); })}
    {journees.some((j) => j.archivee) && (<div className="pt-2">
      <button onClick={() => setVoirArchives((v) => !v)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-stone-100 border border-stone-200 text-sm text-stone-600">
        <span className="flex items-center gap-2">{voirArchives ? <ChevronDown size={15} /> : <ChevronRight size={15} />} 📦 Archives</span>
        <span className="text-xs text-stone-400">{journees.filter((j) => j.archivee).length} journée(s)</span>
      </button>
      {voirArchives && (<div className="mt-2 space-y-1.5">
        <p className="text-[11px] text-stone-400 px-1">Les journées archivées restent complètes et continuent de servir aux propositions. Tu peux les ramener dans la liste, ou les supprimer définitivement.</p>
        {[...journees].filter((j) => j.archivee).sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).map((j) => {
          const t = terrains.find((x) => x.id === j.terrainId);
          return (<div key={j.id} className="bg-white border border-stone-200 rounded-lg px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-stone-700 truncate">{new Date(j.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="text-xs text-stone-400 shrink-0">{t ? t.name : ""}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => desarchiverJournee(j.id)} className="flex-1 text-[12px] font-medium text-stone-700 bg-white border border-stone-300 rounded-md py-1.5">↩ Ramener dans la liste</button>
              <button onClick={() => setASupprimer(j)} className="flex-1 text-[12px] font-medium text-red-700 bg-white border border-red-200 rounded-md py-1.5 flex items-center justify-center gap-1"><Trash2 size={12} /> Supprimer</button>
            </div>
          </div>);
        })}
      </div>)}
    </div>)}
  </div>);
}

// ---------- Carnet de chasse (par saison) ----------
