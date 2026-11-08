const GROUPE_COULEURS = ["#047857", "#b45309", "#0369a1", "#7c3aed", "#be123c", "#4d7c0f", "#a16207", "#0f766e"];
function groupeCouleur(nom) {
  let h = 0; const s = String(nom || "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return GROUPE_COULEURS[h % GROUPE_COULEURS.length];
}
function tousLesGroupes(participants) {
  const m = new Map();
  (participants || []).forEach((p) => (p.groupes || []).forEach((g) => {
    const k = g.trim(); if (!k) return;
    m.set(k, (m.get(k) || 0) + 1);
  }));
  return Array.from(m.entries()).map(([nom, n]) => ({ nom, n })).sort((a, b) => byNom(a.nom, b.nom));
}
function PastilleGroupe({ nom, actif, compte, onClick, small }) {
  const c = groupeCouleur(nom);
  return (<button onClick={onClick} className={`flex items-center gap-1.5 rounded-full border transition-colors ${small ? "pl-2 pr-2.5 py-1 text-[12px]" : "pl-2.5 pr-3 py-1.5 text-sm"}`}
    style={actif ? { background: c, borderColor: c, color: "#fff" } : { background: "#fff", borderColor: "#d6d3d1", color: "#44403c" }}>
    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: actif ? "rgba(255,255,255,.85)" : c }} />
    {nom}
    {compte != null && <span className={actif ? "text-[11px] text-white/70" : "text-[11px] text-stone-400"}>{compte}</span>}
  </button>);
}
function PointsGroupes({ groupes }) {
  const list = (groupes || []).slice(0, 4);
  if (!list.length) return null;
  return (<span className="flex gap-1 shrink-0">
    {list.map((g) => <span key={g} className="w-2 h-2 rounded-full" style={{ background: groupeCouleur(g) }} title={g} />)}
  </span>);
}

function ParticipantsView({ participants, setParticipants }) {
  const [expanded, setExpanded] = useState(null); const [importing, setImporting] = useState(false); const [importErr, setImportErr] = useState(""); const listFileRef = useRef(null);
  const [search, setSearch] = useState(""); const [selected, setSelected] = useState({}); const [dupPanel, setDupPanel] = useState(false); const [mergePanel, setMergePanel] = useState(false);
  const nrm = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  const dg = (s) => (s || "").replace(/\D/g, "");
  const dupPairs = useMemo(() => {
    const norm = participants.map((p) => {
      const folded = foldName(p.name);
      const tokens = folded.split(" ").filter(Boolean);
      return { p, folded, swapKey: tokens.length > 1 ? tokens.slice().sort().join(" ") : folded, phone: dg(p.phone), email: nrm(p.email) };
    });
    const out = [];
    for (let i = 0; i < norm.length; i++) {
      for (let j = i + 1; j < norm.length; j++) {
        const A = norm[i], B = norm[j], a = A.p, b = B.p;
        if ((a.dupIgnore || []).indexOf(b.id) >= 0 || (b.dupIgnore || []).indexOf(a.id) >= 0) continue;
        let reason = "";
        if (A.folded && A.folded === B.folded) reason = "Même nom";
        else if (A.phone && A.phone === B.phone) reason = "Même téléphone";
        else if (A.email && A.email === B.email) reason = "Même email";
        else if (A.swapKey && A.swapKey === B.swapKey) reason = "Prénom/nom inversés ?";
        else if (A.folded.length >= 4 && B.folded.length >= 4 && Math.abs(A.folded.length - B.folded.length) <= 2) {
          const maxLen = Math.max(A.folded.length, B.folded.length);
          const tolerance = maxLen <= 6 ? 1 : 2;
          if (levDist(A.folded, B.folded) <= tolerance) reason = "Noms très proches";
        }
        if (reason) out.push({ a, b, reason });
      }
    }
    return out;
  }, [participants]);
  const selCount = Object.keys(selected).filter((id) => selected[id]).length;
  // ---- Groupes ----
  const [grpPanel, setGrpPanel] = useState(false);
  const [grpNouveau, setGrpNouveau] = useState("");
  const [grpFiltre, setGrpFiltre] = useState(null);
  const groupes = useMemo(() => tousLesGroupes(participants), [participants]);
  const selIdsList = () => Object.keys(selected).filter((id) => selected[id]);

  const affecterGroupe = (nom) => {
    const ids = selIdsList();
    if (!ids.length) { window.alert("Coche d'abord des membres, puis touche un groupe pour les y ajouter."); return; }
    const tous = participants.filter((p) => ids.indexOf(p.id) >= 0).every((p) => (p.groupes || []).indexOf(nom) >= 0);
    setParticipants((prev) => prev.map((p) => {
      if (ids.indexOf(p.id) < 0) return p;
      const g = p.groupes || [];
      return { ...p, groupes: tous ? g.filter((x) => x !== nom) : (g.indexOf(nom) >= 0 ? g : g.concat([nom])) };
    }));
  };
  const creerGroupe = () => {
    const nom = grpNouveau.trim().slice(0, 24);
    if (!nom) return;
    const ids = selIdsList();
    if (!ids.length) { window.alert("Coche d'abord les membres à mettre dans « " + nom + " »."); return; }
    setParticipants((prev) => prev.map((p) => (ids.indexOf(p.id) < 0 ? p : { ...p, groupes: (p.groupes || []).indexOf(nom) >= 0 ? p.groupes : (p.groupes || []).concat([nom]) })));
    setGrpNouveau("");
  };
  const renommerGroupe = (ancien) => {
    const nom = (window.prompt("Nouveau nom du groupe :", ancien) || "").trim().slice(0, 24);
    if (!nom || nom === ancien) return;
    setParticipants((prev) => prev.map((p) => ({ ...p, groupes: (p.groupes || []).map((g) => (g === ancien ? nom : g)).filter((g, i, a) => a.indexOf(g) === i) })));
    if (grpFiltre === ancien) setGrpFiltre(nom);
  };
  const supprimerGroupe = (nom) => {
    if (!window.confirm("Supprimer le groupe « " + nom + " » ?\n\nAucun membre ne sera supprimé, seule l'étiquette disparaît.")) return;
    setParticipants((prev) => prev.map((p) => ({ ...p, groupes: (p.groupes || []).filter((g) => g !== nom) })));
    if (grpFiltre === nom) setGrpFiltre(null);
  };
  const toggleGroupeMembre = (pid, nom) => setParticipants((prev) => prev.map((p) => {
    if (p.id !== pid) return p;
    const g = p.groupes || [];
    return { ...p, groupes: g.indexOf(nom) >= 0 ? g.filter((x) => x !== nom) : g.concat([nom]) };
  }));

  // Calculé ici, après grpFiltre, pour que le filtre par groupe soit disponible.
  const filtered = participants.filter((p) => {
    if (search.trim() && nrm(p.name).indexOf(nrm(search)) < 0) return false;
    if (grpFiltre && (p.groupes || []).indexOf(grpFiltre) < 0) return false;
    return true;
  }).sort((a, b) => byNom(a.name || "", b.name || ""));
  const toggleSel = (id) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const deleteSelected = () => { const ids = Object.keys(selected).filter((id) => selected[id]); if (!ids.length) return; if (!window.confirm("Supprimer " + ids.length + " membre(s) sélectionné(s) ?")) return; setParticipants((prev) => prev.filter((p) => !ids.includes(p.id))); setSelected({}); };
  const mergeMembers = (keepId, dropId) => { setParticipants((prev) => { const keep = prev.find((p) => p.id === keepId), drop = prev.find((p) => p.id === dropId); if (!keep || !drop) return prev; const merged = { ...keep }; ["prenom", "nom", "phone", "email", "permis", "validation", "assurance"].forEach((f) => { if (!(merged[f] || "").trim() && (drop[f] || "").trim()) merged[f] = drop[f]; }); merged.name = ((merged.prenom || "") + " " + (merged.nom || "")).trim() || merged.name; if (!merged.mobility && drop.mobility) merged.mobility = drop.mobility; if (!merged.role && drop.role) merged.role = drop.role; return prev.filter((p) => p.id !== dropId).map((p) => (p.id === keepId ? merged : p)); }); };
  const dismissPair = (aId, bId) => { setParticipants((prev) => prev.map((p) => { if (p.id === aId) return { ...p, dupIgnore: [...(p.dupIgnore || []), bId] }; if (p.id === bId) return { ...p, dupIgnore: [...(p.dupIgnore || []), aId] }; return p; })); };
  const update = (id, patch) => setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const updateDiner = (id, patch) => setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, diner: { ...p.diner, ...patch } } : p)));
  const addParticipant = () => { const id = `p-${Date.now()}`; setParticipants((prev) => [{ id, prenom: "", nom: "", name: "", phone: "", email: "", permis: "", validation: "", assurance: "", participe: false, invitation: false, role: "chasseur", mobility: null, arme: null, places: 4, vehicule: "", diner: { vient: false, invitesSupplementaires: 0 } }, ...prev]); setExpanded(id); setSearch(""); };
  const removeParticipant = (id) => setParticipants((prev) => prev.filter((p) => p.id !== id));
  const totalConvives = participants.reduce((s, p) => s + (p.diner?.vient ? 1 + Number(p.diner.invitesSupplementaires || 0) : 0), 0);
  const [dinerPrint, setDinerPrint] = useState(null);
  const printDiner = () => { setDinerPrint(buildDinnerPrintHtml(participants)); };
  const exportDinerExcel = () => {
    try {
      const rows = participants.map((p) => ({ Nom: p.name || "Sans nom", Vient: p.diner?.vient ? "oui" : "non", Invités_sup: p.diner?.invitesSupplementaires || 0, Total: p.diner?.vient ? (1 + Number(p.diner.invitesSupplementaires || 0)) : 0 }));
      rows.push({ Nom: "TOTAL CONVIVES", Vient: "", Invités_sup: "", Total: totalConvives });
      const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.length ? rows : [{ Nom: "" }]), "Diner");
      const out = XLSX.write(wb, { bookType: "xlsx", type: "array" }); const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const fn = "recap-diner-" + new Date().toISOString().slice(0, 10) + ".xlsx"; const file = new File([blob], fn, { type: blob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: fn }).catch(() => {}); }
      else { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = fn; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    } catch (e) { window.alert("Export impossible : " + (e.message || e)); }
  };
  const onImportList = async (e) => {
    const file = e.target.files?.[0]; if (!file) return; setImporting(true); setImportErr("");
    try { const n = file.name.toLowerCase(); let guests = [];
      if (n.endsWith(".xlsx") || n.endsWith(".xls") || n.endsWith(".csv")) guests = rowsToGuests(extractRowsFromExcel(await file.arrayBuffer()));
      else if (n.endsWith(".docx")) guests = parseGuestList(await extractDocxText(await file.arrayBuffer()));
      else if (n.endsWith(".pdf")) guests = parseGuestList(await extractPdfText(new Uint8Array(await file.arrayBuffer())));
      else if (n.endsWith(".txt")) guests = parseGuestList(await file.text());
      else if (n.endsWith(".vcf") || n.endsWith(".vcard")) guests = parseVCards(await file.text());
      else throw new Error("Format non reconnu. Utilise Excel (.xlsx), CSV, Word (.docx), PDF, texte (.txt) ou fiche contact (.vcf).");
      if (!guests.length) throw new Error("Aucun membre détecté dans le fichier.");
      let added = 0, skipped = 0;
      const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
      const dig = (s) => (s || "").replace(/\D/g, "");
      setParticipants((prev) => {
        const existName = new Set(prev.map((p) => norm(p.name)).filter(Boolean));
        const existPhone = new Set(prev.map((p) => dig(p.phone)).filter(Boolean));
        const existMail = new Set(prev.map((p) => norm(p.email)).filter(Boolean));
        const seen = new Set(); const additions = [];
        guests.forEach((gs, i) => {
          const nk = norm(gs.name), pk = dig(gs.phone), mk = norm(gs.email);
          if ((nk && (existName.has(nk) || seen.has("n:" + nk))) || (pk && (existPhone.has(pk) || seen.has("p:" + pk))) || (mk && (existMail.has(mk) || seen.has("m:" + mk)))) { skipped++; return; }
          if (nk) seen.add("n:" + nk); if (pk) seen.add("p:" + pk); if (mk) seen.add("m:" + mk);
          const spn = (gs.prenom || gs.nom) ? { prenom: gs.prenom || "", nom: gs.nom || "" } : splitFullName(gs.name);
          additions.push({ id: `p-imp-${Date.now()}-${i}`, prenom: spn.prenom, nom: spn.nom, name: gs.name || "", phone: fixPhone(gs.phone || ""), email: gs.email || "", permis: gs.permis || "", validation: gs.validation || "", assurance: gs.assurance || "", participe: false, invitation: true, role: gs.role || "chasseur", mobility: gs.mobility || null, diner: { vient: false, invitesSupplementaires: 0 } });
        });
        added = additions.length; return [...prev, ...additions];
      });
      window.alert(added + " membre(s) ajouté(s)." + (skipped ? " " + skipped + " doublon(s) ignoré(s)." : ""));
    } catch (ex) { setImportErr(ex.message || "Import impossible."); } finally { setImporting(false); if (listFileRef.current) listFileRef.current.value = ""; }
  };
  const col = (m, other, onKeep) => (<div className="flex-1 min-w-0 bg-white border border-stone-200 rounded-md p-2.5 space-y-1 flex flex-col">
      <p className="font-semibold text-stone-800 text-sm truncate">{m.name || <span className="italic text-stone-400">(sans nom)</span>}</p>
      <p className="text-xs text-stone-500 truncate">📞 {m.phone || "—"}</p>
      <p className="text-xs text-stone-500 break-all">✉️ {m.email || "—"}</p>
      <p className="text-xs text-stone-500 truncate">🎫 {m.permis || "—"}</p>
      <p className="text-xs text-stone-500 truncate">🛡️ {m.assurance || "—"}</p>
      <p className="text-xs text-stone-500">{m.role === "rabatteur" ? "🐇 Rabatteur" : "🦌 Chasseur"}{m.mobility ? " · " + (m.mobility === "fauteuil" ? "Fauteuil" : "Canne") : ""}</p>
      <button onClick={onKeep} className="mt-auto w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-2 py-2 rounded-md">✓ Garder celui-ci</button>
    </div>);
  if (dupPanel) { return (<div className="space-y-3">
      <div className="flex items-center justify-between"><h2 className="font-serif text-xl text-stone-800">Doublons possibles</h2><button onClick={() => setDupPanel(false)} className="flex items-center gap-1 text-sm font-medium text-stone-700"><ArrowLeft size={16} /> Retour</button></div>
      {dupPairs.length === 0 && <SectionCard className="p-6 text-center"><p className="text-3xl mb-2">🎉</p><p className="text-sm text-stone-600">Aucun doublon détecté.</p></SectionCard>}
      {dupPairs.map((pr, i) => (<div key={pr.a.id + "-" + pr.b.id} className="border border-amber-200 bg-amber-50 rounded-lg p-2.5 space-y-2">
        <p className="text-xs font-medium text-amber-800">⚠️ {pr.reason} — garde le bon (l'autre est fusionné puis supprimé)</p>
        <div className="flex gap-2 items-stretch">{col(pr.a, pr.b, () => mergeMembers(pr.a.id, pr.b.id))}{col(pr.b, pr.a, () => mergeMembers(pr.b.id, pr.a.id))}</div>
        <button onClick={() => dismissPair(pr.a.id, pr.b.id)} className="w-full text-xs text-stone-500 hover:text-stone-700 py-1.5 border border-stone-200 rounded-md bg-white">Ce ne sont pas des doublons</button>
      </div>))}
    </div>);
  }
  if (mergePanel) {
    const selIds = Object.keys(selected).filter((id) => selected[id]);
    const ma = participants.find((p) => p.id === selIds[0]) || null;
    const mb = participants.find((p) => p.id === selIds[1]) || null;
    const doMerge = (keepId, dropId) => { mergeMembers(keepId, dropId); setMergePanel(false); setSelected({}); };
    return (<div className="space-y-3">
      <div className="flex items-center justify-between"><h2 className="font-serif text-xl text-stone-800">Fusionner 2 membres</h2><button onClick={() => { setMergePanel(false); }} className="flex items-center gap-1 text-sm font-medium text-stone-700"><ArrowLeft size={16} /> Retour</button></div>
      {(!ma || !mb) ? (<SectionCard className="p-6 text-center"><p className="text-sm text-stone-600">Sélection invalide. Reviens et choisis exactement 2 membres.</p></SectionCard>) : (<div className="border border-amber-200 bg-amber-50 rounded-lg p-2.5 space-y-2">
        <p className="text-xs font-medium text-amber-800">Choisis lequel garder — l'autre sera fusionné dedans puis supprimé</p>
        <div className="flex gap-2 items-stretch">{col(ma, mb, () => doMerge(ma.id, mb.id))}{col(mb, ma, () => doMerge(mb.id, ma.id))}</div>
      </div>)}
    </div>);
  }
  return (<div className="space-y-6">
    {dinerPrint && <PrintOverlay html={dinerPrint} onClose={() => setDinerPrint(null)} />}    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2"><h2 className="font-serif text-xl text-stone-800">Membres <span className="text-sm font-sans text-stone-400">({participants.length})</span></h2>
        <div className="flex gap-2 flex-wrap"><input ref={listFileRef} type="file" accept=".xlsx,.xls,.csv,.docx,.pdf,.txt,.vcf,.vcard,text/vcard" onChange={onImportList} className="hidden" />
          <button onClick={() => listFileRef.current?.click()} disabled={importing} className="flex items-center gap-1.5 bg-stone-700 hover:bg-stone-800 disabled:bg-stone-300 text-stone-50 text-sm font-medium px-3 py-1.5 rounded-md"><FileText size={16} /> {importing ? "Import…" : "Importer"}</button>
          <button onClick={addParticipant} className="flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-stone-50 text-sm font-medium px-3 py-1.5 rounded-md"><Plus size={16} /> Ajouter</button></div></div>
      <div className="flex items-center gap-2 flex-wrap">
        {(groupes.length > 0 || selCount > 0) && (<div className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 mb-1">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-[11px] uppercase tracking-widest text-stone-400">Mes groupes</span>
            <button onClick={() => setGrpPanel(!grpPanel)} className="text-[11px] text-emerald-800 underline">{grpPanel ? "Fermer" : "Gérer"}</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {groupes.length === 0 && <span className="text-[11px] text-stone-400 italic">Coche des membres puis crée un groupe ci-dessous.</span>}
            {groupes.map((g) => (<PastilleGroupe key={g.nom} nom={g.nom} compte={g.n} small
              actif={selCount > 0 ? participants.filter((x) => selected[x.id]).every((x) => (x.groupes || []).indexOf(g.nom) >= 0) : grpFiltre === g.nom}
              onClick={() => { if (selCount > 0) affecterGroupe(g.nom); else setGrpFiltre(grpFiltre === g.nom ? null : g.nom); }} />))}
          </div>
          <p className="text-[11px] text-stone-400 mt-1.5">{selCount > 0 ? "Touche un groupe pour y ajouter ou retirer les " + selCount + " membre(s) cochés." : "Touche un groupe pour filtrer la liste. Coche des membres pour les y affecter."}</p>

          {grpPanel && (<div className="mt-2.5 pt-2.5 border-t border-stone-200 space-y-2">
            {groupes.map((g) => (<div key={g.nom} className="flex items-center gap-2 bg-white border border-stone-200 rounded px-2.5 py-1.5">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: groupeCouleur(g.nom) }} />
              <span className="text-sm text-stone-800 flex-1 truncate">{g.nom}</span>
              <span className="text-[11px] text-stone-400">{g.n}</span>
              <button onClick={() => renommerGroupe(g.nom)} className="text-stone-400 px-1 text-sm">✎</button>
              <button onClick={() => supprimerGroupe(g.nom)} className="text-red-600 px-1 text-sm">✕</button>
            </div>))}
            <div className="flex gap-2">
              <input value={grpNouveau} onChange={(e) => setGrpNouveau(e.target.value)} placeholder="Nom du nouveau groupe" maxLength={24} className="flex-1 min-w-0 border border-stone-300 rounded px-2 py-1.5 text-sm bg-white" />
              <button onClick={creerGroupe} className="shrink-0 bg-emerald-800 hover:bg-emerald-900 text-stone-50 text-xs font-medium px-3 py-1.5 rounded">Créer</button>
            </div>
            <p className="text-[11px] text-stone-400">Supprimer un groupe n'efface aucun membre : seule l'étiquette disparaît.</p>
          </div>)}
        </div>)}

        <div className="relative flex-1 min-w-[160px]"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Rechercher un membre…" className="w-full border border-stone-300 rounded-md px-3 py-1.5 text-sm bg-white" />{search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 text-sm">✕</button>}</div>
        <button onClick={() => setDupPanel(true)} className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md border shrink-0 bg-white text-stone-600 border-stone-300">⚠️ Doublons{dupPairs.length ? " (" + dupPairs.length + ")" : ""}</button>
      </div>
      {selCount > 0 && <div className="flex items-center justify-between gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2"><span className="text-sm text-red-800 font-medium">{selCount} sélectionné(s)</span><div className="flex gap-3 items-center">{selCount === 2 && <button onClick={() => setMergePanel(true)} className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-md"><Merge size={13} /> Fusionner</button>}<button onClick={() => setSelected({})} className="text-xs text-stone-600">Annuler</button><button onClick={deleteSelected} className="flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-md"><Trash2 size={13} /> Supprimer la sélection</button></div></div>}
      {importErr && <p className="text-sm text-red-700">{importErr}</p>}
      <p className="text-xs text-stone-400">Import : Excel (.xlsx), CSV, Word (.docx), PDF, texte ou fiche contact (.vcf). Colonnes reconnues : Prénom, Nom, Téléphone, Email, Permis, Validation, Assurance, Rôle, Mobilité.</p>
      <p className="text-xs text-stone-400">📇 Depuis un contact iPhone : Contacts → la fiche → <b>Partager le contact</b> → <b>Enregistrer dans Fichiers</b>, puis « Importer » ici. (Tu peux en partager plusieurs d'un coup.)</p>
      {participants.length === 0 && <p className="text-sm text-stone-500 italic">Aucun membre. Clique « Ajouter » ou importe ta liste.</p>}
      {participants.length > 0 && filtered.length === 0 && <p className="text-sm text-stone-500 italic">Aucun résultat.</p>}
      {filtered.map((p) => { const isOpen = expanded === p.id;
        return (<SectionCard key={p.id}>
          <div className="flex items-center px-4 py-3 gap-2">
            <input type="checkbox" checked={!!selected[p.id]} onChange={() => toggleSel(p.id)} className="w-4 h-4 shrink-0 accent-red-700" />
            <button onClick={() => setExpanded(isOpen ? null : p.id)} className="flex items-center gap-2 font-medium text-stone-800 min-w-0 flex-1">{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}<span className="truncate">{p.name || <span className="text-stone-400 italic font-normal">Sans nom</span>}</span>{p.role && <span className="text-xs font-normal bg-stone-200 text-stone-600 rounded-full px-2 py-0.5 shrink-0">{p.role === "chasseur" ? "🦌" : "🐇"}</span>}</button><PointsGroupes groupes={p.groupes} />
          </div>
          {isOpen && (<div className="border-t border-stone-200 px-4 py-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs uppercase tracking-wide text-stone-400">Prénom</label><input value={p.prenom || ""} onChange={(e) => update(p.id, { prenom: e.target.value, name: (e.target.value + " " + (p.nom || "")).trim() })} placeholder="Prénom" className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1" /></div>
              <div><label className="text-xs uppercase tracking-wide text-stone-400">Nom</label><input value={p.nom || ""} onChange={(e) => update(p.id, { nom: e.target.value, name: ((p.prenom || "") + " " + e.target.value).trim() })} placeholder="Nom" className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1" /></div>
            </div>
            <div><label className="text-xs uppercase tracking-wide text-stone-400 flex items-center gap-1"><Phone size={11} /> Téléphone (pour WhatsApp)</label>
              <div className="flex items-center gap-2 mt-1">
                <input value={p.phone || ""} onChange={(e) => { const raw = e.target.value; const prev = p.phone || ""; const endsWithSpace = /\s$/.test(raw); const isDeleting = raw.length < prev.length; update(p.id, { phone: isDeleting && endsWithSpace ? raw.replace(/\s+$/, "") : formatPhone(raw) }); }} placeholder="06 12 34 56 78" inputMode="tel" className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white" />
                {!isValidFrPhone(p.phone) && <span title="Numéro non valide (attendu : 06 ou 07 + 8 chiffres)" className="shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">✕</span>}
              </div>
            </div>
            <div><label className="text-xs uppercase tracking-wide text-stone-400">Email (pour les invitations)</label><input value={p.email || ""} onChange={(e) => update(p.id, { email: e.target.value })} placeholder="prenom.nom@email.fr" inputMode="email" autoCapitalize="none" className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs uppercase tracking-wide text-stone-400">N° de permis</label><input value={p.permis || ""} onChange={(e) => update(p.id, { permis: e.target.value })} placeholder="Permis de chasser" className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1" /></div>
              <div><label className="text-xs uppercase tracking-wide text-stone-400">N° de validation (saison)</label><input value={p.validation || ""} onChange={(e) => update(p.id, { validation: e.target.value })} placeholder="Validation annuelle" className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1" /></div>
            </div>
            <div><label className="text-xs uppercase tracking-wide text-stone-400">Assurance (compagnie + n° de police)</label><input value={p.assurance || ""} onChange={(e) => update(p.id, { assurance: e.target.value })} placeholder="ex : Groupama — n° 12345678" className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1" /></div>
            <div><p className="text-xs uppercase tracking-wide text-stone-400 mb-2">Rôle (seuls les chasseurs sont placés sur les miradors)</p><RoleSelector value={p.role} onChange={(v) => update(p.id, { role: v })} /></div>
            <div><p className="text-xs uppercase tracking-wide text-stone-400 mb-2">Mobilité réduite (placement adapté)</p><div className="flex gap-2">
              {[{ v: null, l: "Aucune" }, { v: "canne", l: "🦯 Canne", ic: "c" }, { v: "fauteuil", l: "Fauteuil", ic: "f" }].map((o) => (<button key={o.l} onClick={() => update(p.id, { mobility: o.v })} className={`flex-1 px-2 py-2 rounded-md text-xs font-medium border ${(p.mobility || null) === o.v ? "bg-emerald-700 text-stone-50 border-emerald-700" : "bg-white text-stone-600 border-stone-300"}`}>{o.ic === "f" ? <Fauteuil size={13} color={(p.mobility || null) === o.v ? "#fff" : "#166534"} /> : null} {o.l}</button>))}
            </div><p className="text-[11px] text-stone-400 mt-1">Fauteuil = accès aux postes fauteuil. Canne = postes canne ou fauteuil.</p></div>
            <div><p className="text-xs uppercase tracking-wide text-stone-400 mb-2">Arme habituelle</p><div className="flex gap-2">
              {[{ v: null, l: "Non renseignée" }].concat(ARMES.map((a) => ({ v: a.key, l: a.label }))).map((o) => { const on = (p.arme || null) === o.v; return (<button key={o.l} onClick={() => update(p.id, { arme: o.v })} className={`flex-1 px-2 py-2 rounded-md text-xs font-medium border flex items-center justify-center gap-1 ${on ? "bg-emerald-700 text-stone-50 border-emerald-700" : "bg-white text-stone-600 border-stone-300"}`}>{o.v && <ArmeIcon k={o.v} size={14} color={on ? "#fff" : "#166534"} />}{o.l}</button>); })}
            </div><p className="text-[11px] text-stone-400 mt-1">Sert au placement : une carabine (rayée) peut aller sur un poste lisse, l'inverse est interdit.</p></div>
            <div><p className="text-xs uppercase tracking-wide text-stone-400 mb-2">Voiture</p>
              <div className="flex gap-2 items-center">
                <input value={p.vehicule || ""} placeholder="Son véhicule (ex. Defender)" onChange={(e) => update(p.id, { vehicule: e.target.value.slice(0, 24) })}
                  className="flex-1 min-w-0 border border-stone-300 rounded px-2 py-1.5 text-sm bg-white" />
                <div className="flex items-center gap-1 shrink-0">
                  <input type="number" min="1" max="9" value={p.places || 4} onChange={(e) => update(p.id, { places: Math.max(1, Math.min(9, Number(e.target.value) || 1)) })} className="w-12 border border-stone-300 rounded px-1 py-1.5 text-sm bg-white text-center" />
                  <span className="text-xs text-stone-500">places</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Sert quand il conduit. Nombre de passagers, sans lui : 4 par défaut, soit 5 personnes dans la voiture. Le véhicule est repris automatiquement quand tu le désignes conducteur.</p></div>
            <div className="pt-1">
              <label className="text-[10px] uppercase tracking-wide text-stone-400">Groupes</label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {groupes.length === 0 && <span className="text-[11px] text-stone-400 italic">Aucun groupe créé pour l'instant.</span>}
                {groupes.map((g) => (<PastilleGroupe key={g.nom} nom={g.nom} small actif={(p.groupes || []).indexOf(g.nom) >= 0} onClick={() => toggleGroupeMembre(p.id, g.nom)} />))}
              </div>
              <div className="flex gap-2 mt-2">
                <input value={grpNouveau} onChange={(e) => setGrpNouveau(e.target.value)} placeholder="Nouveau groupe…" maxLength={24} className="flex-1 min-w-0 border border-stone-300 rounded px-2 py-1.5 text-sm bg-white" />
                <button onClick={() => { const nom = grpNouveau.trim().slice(0, 24); if (!nom) return; toggleGroupeMembre(p.id, nom); setGrpNouveau(""); }} className="shrink-0 bg-emerald-800 hover:bg-emerald-900 text-stone-50 text-xs font-medium px-3 py-1.5 rounded">Ajouter</button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button onClick={() => removeParticipant(p.id)} className="flex items-center gap-1 text-xs text-red-700 hover:text-red-900"><Trash2 size={13} /> Supprimer ce participant</button>
              <button onClick={() => setExpanded(null)} className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded-md"><Check size={15} /> Terminé</button>
            </div>
          </div>)}
        </SectionCard>); })}
    </div>
  </div>);
}

// ---------- Sécurité ----------
function SecurityView({ safety, setSafety }) {
  const setConsigne = (i, v) => setSafety((s) => ({ ...s, consignes: s.consignes.map((c, k) => (k === i ? v : c)) }));
  const addConsigne = () => setSafety((s) => ({ ...s, consignes: [...s.consignes, ""] }));
  const rmConsigne = (i) => setSafety((s) => ({ ...s, consignes: s.consignes.filter((_, k) => k !== i) }));
  const setSonnerie = (i, key, v) => setSafety((s) => ({ ...s, sonneries: s.sonneries.map((x, k) => (k === i ? { ...x, [key]: v } : x)) }));
  const addSonnerie = () => setSafety((s) => ({ ...s, sonneries: [...s.sonneries, { evenement: "", signal: "" }] }));
  const rmSonnerie = (i) => setSafety((s) => ({ ...s, sonneries: s.sonneries.filter((_, k) => k !== i) }));
  const reset = () => { if (window.confirm("Rétablir les consignes et sonneries par défaut ?")) setSafety(DEFAULT_SAFETY); };
  return (<div className="space-y-5">
    <div className="flex items-center justify-between"><h2 className="font-serif text-xl text-stone-800 flex items-center gap-2"><Shield size={20} className="text-emerald-800" /> Sécurité</h2><button onClick={reset} className="text-xs text-stone-500 underline hover:text-stone-700">Valeurs par défaut</button></div>
    <p className="text-xs text-stone-400">Code standard modifiable. Ajuste les sonneries au code exact de ta société / FDC72.</p>
    <SectionCard className="p-4 space-y-2">
      <h3 className="font-serif text-lg text-stone-800 flex items-center gap-2"><Bell size={17} className="text-amber-800" /> Sonneries & annonces</h3>
      <div className="space-y-1.5">{safety.sonneries.map((s, i) => (<div key={i} className="flex items-center gap-2">
        <input value={s.evenement} onChange={(e) => setSonnerie(i, "evenement", e.target.value)} placeholder="Événement" className="w-2/5 border border-stone-300 rounded px-2 py-1.5 text-sm bg-white" />
        <input value={s.signal} onChange={(e) => setSonnerie(i, "signal", e.target.value)} placeholder="Signal" className="flex-1 border border-stone-300 rounded px-2 py-1.5 text-sm bg-white" />
        <button onClick={() => rmSonnerie(i)} className="text-stone-400 hover:text-red-700"><X size={15} /></button></div>))}</div>
      <button onClick={addSonnerie} className="flex items-center gap-1 text-sm text-amber-800 mt-1"><Plus size={14} /> Ajouter une sonnerie</button>
    </SectionCard>
    <SectionCard className="p-4 space-y-2">
      <h3 className="font-serif text-lg text-stone-800 flex items-center gap-2"><Shield size={17} className="text-emerald-800" /> Consignes de sécurité</h3>
      <div className="space-y-1.5">{safety.consignes.map((c, i) => (<div key={i} className="flex items-start gap-2">
        <span className="text-emerald-800 mt-2">•</span>
        <textarea value={c} onChange={(e) => setConsigne(i, e.target.value)} rows={1} className="flex-1 border border-stone-300 rounded px-2 py-1.5 text-sm bg-white" />
        <button onClick={() => rmConsigne(i)} className="text-stone-400 hover:text-red-700 mt-2"><X size={15} /></button></div>))}</div>
      <button onClick={addConsigne} className="flex items-center gap-1 text-sm text-emerald-800 mt-1"><Plus size={14} /> Ajouter une consigne</button>
    </SectionCard>
  </div>);
}

function SafetyGate({ safety, onAccept }) {
  return (<div className="fixed inset-0 z-50 bg-stone-900/95 flex items-center justify-center p-4 overflow-auto">
    <div className="bg-stone-50 rounded-xl max-w-lg w-full my-6 shadow-2xl overflow-hidden">
      <div className="bg-stone-900 text-stone-50 px-5 py-4 flex items-center gap-3"><Shield size={26} className="text-amber-400" /><div><h2 className="font-serif text-xl">Consignes de sécurité</h2><p className="text-stone-400 text-xs">À lire avant chaque battue</p></div></div>
      <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-auto">
        <div><h3 className="font-medium text-stone-800 flex items-center gap-2 mb-2"><Bell size={16} className="text-amber-800" /> Annonces / sonneries</h3>
          <div className="space-y-1">{safety.sonneries.map((s, i) => (<div key={i} className="flex gap-2 text-sm"><span className="font-medium text-stone-800 w-1/3 shrink-0">{s.evenement}</span><span className="text-stone-600">{s.signal}</span></div>))}</div></div>
        <div><h3 className="font-medium text-stone-800 flex items-center gap-2 mb-2"><Shield size={16} className="text-emerald-800" /> Règles</h3>
          <ul className="space-y-1 text-sm text-stone-600 list-disc pl-5">{safety.consignes.map((c, i) => (<li key={i}>{c}</li>))}</ul></div>
      </div>
      <div className="px-5 py-4 border-t border-stone-200"><button onClick={onAccept} className="w-full bg-emerald-800 hover:bg-emerald-900 text-stone-50 font-medium py-3 rounded-lg flex items-center justify-center gap-2"><Check size={18} /> J'ai compris les consignes de sécurité</button></div>
    </div>
  </div>);
}

// ---------- Poster les fusils ----------
