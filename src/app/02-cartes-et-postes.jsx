async function carteTraqueImpression(planImage, track) {
  const img = await loadImg(planImage);
  const W = img.naturalWidth, H = img.naturalHeight, crop = track.crop || FULL_CROP;
  const sx = crop.x / 100 * W, sy = crop.y / 100 * H, sw = crop.w / 100 * W, sh = crop.h / 100 * H;
  // Le plus grand cote fait 1600 px : sur une carte haute et etroite, les etiquettes restent lisibles.
  const L = 1600, cw = sw >= sh ? L : Math.max(200, Math.round(L * sw / sh)), ch = sw >= sh ? Math.max(200, Math.round(L * sh / sw)) : L;
  const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  const P = (gx, gy) => ({ x: (gx - crop.x) / crop.w * cw, y: (gy - crop.y) / crop.h * ch });
  const col = track.color || "#dc2626";
  // contour de la traque
  const z = Array.isArray(track.zone) ? track.zone : [];
  if (z.length >= 2) {
    const trace = () => { ctx.beginPath(); z.forEach((q, i) => { const p = P(q.gx, q.gy); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); if (track.zoneFermee && z.length >= 3) ctx.closePath(); };
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    trace(); ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 11; ctx.stroke();
    trace(); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.stroke();
  }
  // postes : comme dans l'application, une pastille a la couleur de la traque
  // et le nom du poste dans une etiquette sombre juste en dessous
  const r = 17, fs = 32, pad = 10;
  ctx.font = "600 " + fs + "px Helvetica, Arial, sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  (track.miradors || []).forEach((m, i) => {
    const p = P(m.gx, m.gy);
    if (p.x < -r || p.x > cw + r || p.y < -r || p.y > ch + r) return;
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = "#ffffff"; ctx.stroke();
    const txt = String(m.label || numeroPoste(m, i));
    const tw = ctx.measureText(txt).width;
    const bw = tw + pad * 2, bh = fs + pad * 1.3;
    const bx = Math.max(2, Math.min(cw - bw - 2, p.x - bw / 2)), by = Math.min(ch - bh - 2, p.y + r + 6);
    ctx.fillStyle = "rgba(28,25,23,.82)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 9); else ctx.rect(bx, by, bw, bh);
    ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.fillText(txt, bx + bw / 2, by + bh / 2 + 1);
  });
  return cv.toDataURL("image/jpeg", 0.82);
}
async function buildTrackImage(planImage, track, targetMiradorId, title, subtitle) {
  const img = await loadImg(planImage);
  const W = img.naturalWidth, H = img.naturalHeight, crop = track.crop || FULL_CROP;
  const sx = crop.x / 100 * W, sy = crop.y / 100 * H, sw = crop.w / 100 * W, sh = crop.h / 100 * H;
  const scale = Math.min(1, 1400 / sw), cw = Math.round(sw * scale), ch = Math.round(sh * scale);
  const head = Math.round(cw * 0.09) + 44;
  const canvas = document.createElement("canvas"); canvas.width = cw; canvas.height = ch + head;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#1c1917"; ctx.fillRect(0, 0, cw, head);
  ctx.textBaseline = "middle"; ctx.textAlign = "left";
  ctx.fillStyle = "#fafaf9"; ctx.font = `bold ${Math.round(head * 0.32)}px sans-serif`; ctx.fillText(title, 16, head * 0.36);
  ctx.fillStyle = "#d6d3d1"; ctx.font = `${Math.round(head * 0.24)}px sans-serif`; ctx.fillText(subtitle, 16, head * 0.72);
  ctx.drawImage(img, sx, sy, sw, sh, 0, head, cw, ch);
  (track.miradors || []).forEach((m) => {
    const lx = (m.gx - crop.x) / crop.w * cw, ly = (m.gy - crop.y) / crop.h * ch + head;
    if (lx < 0 || lx > cw || ly < head || ly > ch + head) return;
    const target = m.id === targetMiradorId;
    ctx.beginPath(); ctx.arc(lx, ly, target ? 17 : 9, 0, Math.PI * 2);
    ctx.fillStyle = target ? "#b45309" : (track.color || "#dc2626"); ctx.fill();
    ctx.lineWidth = target ? 5 : 2; ctx.strokeStyle = "#fff"; ctx.stroke();
    const label = m.label || ""; const fs = Math.round(cw * 0.02) + 6;
    ctx.font = `${target ? "bold " : ""}${fs}px sans-serif`; ctx.textAlign = "center";
    const tw = ctx.measureText(label).width; const by = ly + (target ? 22 : 13);
    ctx.fillStyle = "rgba(28,25,23,.82)"; ctx.fillRect(lx - tw / 2 - 5, by, tw + 10, fs + 8);
    ctx.fillStyle = "#fff"; ctx.fillText(label, lx, by + (fs + 8) / 2); ctx.textAlign = "left";
  });
  return await new Promise((res) => canvas.toBlob((b) => res(new File([b], "poste.png", { type: "image/png" })), "image/png", 0.85));
}

// ---------- Petits composants ----------
function Toggle({ value, onChange, labelOn = "Oui", labelOff = "Non" }) {
  return (<button onClick={() => onChange(!value)} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border transition-colors ${value ? "bg-emerald-800 border-emerald-800 text-stone-50" : "bg-stone-100 border-stone-300 text-stone-500"}`}>{value ? <Check size={14} /> : <X size={14} />}{value ? labelOn : labelOff}</button>);
}
// Ligne de journee qu'on fait glisser vers la gauche (comme Mail sur iPhone) pour faire apparaitre
// « Archiver » et « Supprimer ». Sur ordinateur, le bouton « ⋯ » fait la meme chose.
function LigneGlissable({ ouvert, setOuvert, onArchiver, onSupprimer, children }) {
  const LARG = 172;
  const [dx, setDx] = useState(null);
  const geste = useRef(null);
  const vientDeGlisser = useRef(false);
  const dernier = useRef(null);   // derniere position, a jour meme si React n'a pas encore redessine
  const base = ouvert ? -LARG : 0;
  const x = dx == null ? base : dx;
  const debut = (e) => { const t = e.touches[0]; geste.current = { x: t.clientX, y: t.clientY, base, glisse: false }; };
  const bouge = (e) => {
    const g = geste.current; if (!g) return;
    const t = e.touches[0]; const ddx = t.clientX - g.x, ddy = t.clientY - g.y;
    if (!g.glisse) {
      if (Math.abs(ddx) > 10 && Math.abs(ddx) > Math.abs(ddy) * 1.3) g.glisse = true;
      else if (Math.abs(ddy) > 10) { geste.current = null; return; }
      else return;
    }
    const v = Math.max(-LARG - 40, Math.min(0, g.base + ddx)); dernier.current = v; setDx(v);
  };
  const fin = () => {
    const g = geste.current; geste.current = null;
    if (g && g.glisse) { vientDeGlisser.current = true; setTimeout(() => { vientDeGlisser.current = false; }, 350); setOuvert((dernier.current == null ? base : dernier.current) < -LARG / 2); }
    dernier.current = null; setDx(null);
  };
  return (<div className="relative overflow-hidden">
    <div className="absolute inset-y-0 right-0 flex" style={{ width: LARG }}>
      <button onClick={() => { setOuvert(false); onArchiver(); }} className="flex-1 bg-amber-600 text-white text-[12px] font-semibold flex flex-col items-center justify-center gap-0.5"><span className="text-lg leading-none">📦</span>Archiver</button>
      <button onClick={() => { setOuvert(false); onSupprimer(); }} className="flex-1 bg-red-700 text-white text-[12px] font-semibold flex flex-col items-center justify-center gap-0.5"><Trash2 size={18} />Supprimer</button>
    </div>
    <div onTouchStart={debut} onTouchMove={bouge} onTouchEnd={fin} onTouchCancel={fin}
      onClickCapture={(e) => { if (vientDeGlisser.current) { e.preventDefault(); e.stopPropagation(); return; } if (ouvert && !e.target.closest("[data-plus]")) { e.preventDefault(); e.stopPropagation(); setOuvert(false); } }}
      className="relative bg-stone-50" style={{ transform: "translateX(" + x + "px)", transition: dx == null ? "transform .2s ease" : "none", touchAction: "pan-y" }}>
      {children}
    </div>
  </div>);
}
// Fenetre de suppression d'une journee : on rappelle que c'est definitif et on propose d'archiver a la place.
function FenetreSuppression({ journee, terrain, onArchiver, onSupprimer, onAnnuler, archivee }) {
  const quand = new Date(journee.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (<div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-3" onClick={onAnnuler}>
    <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
      <p className="text-3xl mb-1">⚠️</p>
      <h3 className="font-serif text-xl text-stone-900">Supprimer définitivement ?</h3>
      <p className="text-sm text-stone-600 mt-1">Journée du <b>{quand}</b>{terrain ? " · " + terrain.name : ""}</p>
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3 text-[13px] text-red-900 leading-snug">
        <b>C'est définitif : rien ne pourra être récupéré.</b> Vous perdrez toutes les données de cette journée : le tableau de chasse, les placements, les voitures, les retours des chasseurs et le chat. La page envoyée aux chasseurs sera retirée : leur lien ne fonctionnera plus.
      </div>
      {!archivee && <p className="text-[13px] text-stone-700 mt-3">💡 <b>Mieux vaut archiver</b> pour garder ces données : la journée disparaît de la liste, mais vous la retrouvez dans les Archives et elle continue de servir aux statistiques et aux propositions.</p>}
      <div className="space-y-2 mt-4">
        {!archivee && <button onClick={onArchiver} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg py-3">📦 Archiver plutôt (recommandé)</button>}
        <button onClick={onSupprimer} className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg py-3">🗑 Supprimer définitivement</button>
        <button onClick={onAnnuler} className="w-full text-stone-600 text-sm py-2">Annuler</button>
      </div>
    </div>
  </div>);
}
function SectionCard({ children, className = "", onClick }) { return <div onClick={onClick} className={`bg-stone-50 border border-stone-300 rounded-lg shadow-sm ${className}`}>{children}</div>; }
function RoleSelector({ value, onChange }) {
  const options = [{ key: "chasseur", label: "🦌 Chasseur" }, { key: "rabatteur", label: "🐇 Rabatteur" }];
  return (<div className="inline-flex rounded-full border border-stone-300 overflow-hidden">{options.map((o) => (<button key={o.key} onClick={() => onChange(value === o.key ? null : o.key)} className={`px-3 py-1 text-sm font-medium ${value === o.key ? "bg-emerald-800 text-stone-50" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}>{o.label}</button>))}</div>);
}
function MapNotice({ children }) { return <div className="min-h-32 py-6 rounded-md bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-700 flex items-center justify-center text-center text-stone-200 text-sm px-4">{children}</div>; }
function ColorPicker({ value, onChange }) {
  return (<div className="flex items-center gap-1.5 flex-wrap">{PALETTE.map((c) => (<button key={c} onClick={() => onChange(c)} className={`w-6 h-6 rounded-full border-2 ${value === c ? "border-stone-800" : "border-stone-300"}`} style={{ backgroundColor: c }} />))}<label className="w-6 h-6 rounded-full border-2 border-stone-300 overflow-hidden relative cursor-pointer"><span className="absolute inset-0 bg-gradient-to-br from-red-500 via-green-500 to-blue-500" /><input type="color" value={value || "#dc2626"} onChange={(e) => onChange(e.target.value)} className="opacity-0 w-full h-full cursor-pointer" /></label></div>);
}
function useImageAR(src) { const [ar, setAr] = useState(0); useEffect(() => { if (!src) { setAr(0); return; } let ok = true; const im = new Image(); im.onload = () => ok && setAr(im.naturalWidth / im.naturalHeight); im.src = src; return () => { ok = false; }; }, [src]); return ar; }
function cropWrapperStyle(crop, ar) { const pb = ar > 0 ? (crop.h / crop.w) / ar * 100 : (crop.h / crop.w) * 100; return { position: "relative", width: "100%", height: 0, paddingBottom: `${pb}%`, overflow: "hidden", borderRadius: 6 }; }
function cropBgStyle(image, crop) { const fw = crop.w / 100, fh = crop.h / 100, fx = crop.x / 100, fy = crop.y / 100; return { position: "absolute", inset: 0, backgroundImage: `url(${image})`, backgroundRepeat: "no-repeat", backgroundSize: `${100 / fw}% ${100 / fh}%`, backgroundPosition: `${fw < 1 ? (fx / (1 - fw)) * 100 : 0}% ${fh < 1 ? (fy / (1 - fh)) * 100 : 0}%` }; }

// ---------- Recadrage ----------
// Report d'un point d'une carte a l'autre. Les deux cartes connaissent leurs bornes
// geographiques : un poste garde donc sa position reelle, quel que soit le recadrage.
function reporterPoint(gx, gy, A, B) {
  const X = A.x1 + (gx / 100) * (A.x2 - A.x1);
  const Y = A.y2 - (gy / 100) * (A.y2 - A.y1);
  return { gx: +(((X - B.x1) / (B.x2 - B.x1)) * 100).toFixed(2), gy: +(((B.y2 - Y) / (B.y2 - B.y1)) * 100).toFixed(2) };
}
function dansLaCarte(p) { return p.gx >= -2 && p.gx <= 102 && p.gy >= -2 && p.gy <= 102; }
// Reporte tout ce qu'une traque porte : postes, points de depose, departs, contour, cadrage.
function reporterTraque(tr, A, B) {
  const pt = (o) => { const p = reporterPoint(o.gx, o.gy, A, B); return { ...o, gx: p.gx, gy: p.gy }; };
  const out = { ...tr };
  let perdus = 0;
  out.miradors = (tr.miradors || []).map((m) => { const n = pt(m); if (!dansLaCarte(n)) perdus++; return n; });
  out.deposes = (tr.deposes || []).map(pt);
  out.departs = (tr.departs || []).map(pt);
  out.zone = Array.isArray(tr.zone) ? tr.zone.map(pt) : [];
  if (tr.crop) {
    const a = reporterPoint(tr.crop.x, tr.crop.y, A, B);
    const b = reporterPoint(tr.crop.x + tr.crop.w, tr.crop.y + tr.crop.h, A, B);
    // On borne chaque coin a la nouvelle carte : si le haut depasse, la hauteur
    // raccourcit d'autant au lieu de faire glisser tout le cadrage vers le bas.
    const bn = (v) => Math.max(0, Math.min(100, v));
    const x = bn(a.gx), y = bn(a.gy), x2 = bn(b.gx), y2 = bn(b.gy);
    out.crop = { x, y, w: Math.max(5, x2 - x), h: Math.max(5, y2 - y) };
  }
  return { tr: out, perdus };
}
// Puzzle des secteurs : chaque secteur occupe un rectangle de la carte d'ensemble.
// Une capture n'a aucune coordonnee : c'est l'utilisateur qui pose ses morceaux.
function PuzzleBox({ image, secteurs, actifId, onSelect, onZone, onZoneFin }) {
  const boxRef = useRef(null); const drag = useRef(null);
  const secRef = useRef(secteurs); secRef.current = secteurs;
  const MIN = 6;
  const pct = (cx, cy) => { const r = boxRef.current.getBoundingClientRect(); return { x: Math.max(0, Math.min(100, ((cx - r.left) / r.width) * 100)), y: Math.max(0, Math.min(100, ((cy - r.top) / r.height) * 100)) }; };
  useEffect(() => {
    const onMove = (e) => {
      const d = drag.current; if (!d || !boxRef.current) return; e.preventDefault();
      const s = (secRef.current || []).find((x) => x.id === d.id); if (!s || !s.zone) return;
      const p = pct(e.clientX, e.clientY); const z = { ...s.zone };
      if (d.type === "move") { z.x = Math.max(0, Math.min(100 - z.w, d.ox + (p.x - d.px))); z.y = Math.max(0, Math.min(100 - z.h, d.oy + (p.y - d.py))); }
      else {
        let x1 = z.x, y1 = z.y, x2 = z.x + z.w, y2 = z.y + z.h;
        if (d.type.includes("l")) x1 = Math.min(p.x, x2 - MIN);
        if (d.type.includes("r")) x2 = Math.max(p.x, x1 + MIN);
        if (d.type.includes("t")) y1 = Math.min(p.y, y2 - MIN);
        if (d.type.includes("b")) y2 = Math.max(p.y, y1 + MIN);
        z.x = x1; z.y = y1; z.w = x2 - x1; z.h = y2 - y1;
      }
      onZone(d.id, { x: +z.x.toFixed(2), y: +z.y.toFixed(2), w: +z.w.toFixed(2), h: +z.h.toFixed(2) });
    };
    const onUp = () => { const d = drag.current; drag.current = null; if (d && onZoneFin) onZoneFin(d.id); };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp); window.addEventListener("pointercancel", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp); };
  }, [onZone, onZoneFin]);
  const startMove = (e, s) => {
    e.stopPropagation(); e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    onSelect(s.id);
    const p = pct(e.clientX, e.clientY);
    drag.current = { id: s.id, type: "move", px: p.x, py: p.y, ox: s.zone.x, oy: s.zone.y };
  };
  const startResize = (e, s, type) => {
    e.stopPropagation(); e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    onSelect(s.id); drag.current = { id: s.id, type };
  };
  const poses = (secteurs || []).filter((s) => s.zone);
  return (<div ref={boxRef} className="relative w-full rounded-lg overflow-hidden border border-stone-300 bg-stone-100" style={{ touchAction: "none" }}>
    <img src={image} alt="Vue d'ensemble" className="w-full block select-none pointer-events-none" draggable={false} />
    {poses.map((s) => {
      const actif = s.id === actifId;
      return (<div key={s.id} onPointerDown={(e) => startMove(e, s)}
        style={{ position: "absolute", left: `${s.zone.x}%`, top: `${s.zone.y}%`, width: `${s.zone.w}%`, height: `${s.zone.h}%`,
          border: actif ? "2.5px solid #b45309" : "2px solid rgba(255,255,255,.9)",
          boxShadow: actif ? "0 0 0 2px rgba(180,83,9,.35)" : "0 0 0 1px rgba(0,0,0,.35)",
          background: actif ? "rgba(180,83,9,.18)" : "rgba(28,25,23,.14)", borderRadius: 6, cursor: "move" }}>
        <span style={{ position: "absolute", left: 3, top: 3, fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
          background: actif ? "#b45309" : "rgba(28,25,23,.8)", color: "#fafaf9", whiteSpace: "nowrap", maxWidth: "95%", overflow: "hidden" }}>{s.nom}</span>
        {actif && ["tl", "tr", "bl", "br"].map((c) => (<span key={c} onPointerDown={(e) => startResize(e, s, c)}
          style={{ position: "absolute", width: 18, height: 18, background: "#b45309", border: "2px solid #fff", borderRadius: "50%",
            left: c.includes("l") ? -9 : undefined, right: c.includes("r") ? -9 : undefined,
            top: c.includes("t") ? -9 : undefined, bottom: c.includes("b") ? -9 : undefined, cursor: "nwse-resize" }} />))}
      </div>);
    })}
  </div>);
}
function CropBox({ image, crop, setCrop }) {
  const boxRef = useRef(null); const drag = useRef(null); const cropRef = useRef(crop); cropRef.current = crop; const MIN = 8;
  const pct = (cx, cy) => { const r = boxRef.current.getBoundingClientRect(); return { x: Math.max(0, Math.min(100, ((cx - r.left) / r.width) * 100)), y: Math.max(0, Math.min(100, ((cy - r.top) / r.height) * 100)) }; };
  useEffect(() => {
    const onMove = (e) => {
      if (!drag.current || !boxRef.current) return; e.preventDefault(); const p = pct(e.clientX, e.clientY); const c = { ...cropRef.current }; const d = drag.current;
      if (d.type === "move") { c.x = Math.max(0, Math.min(100 - c.w, d.ox + (p.x - d.px))); c.y = Math.max(0, Math.min(100 - c.h, d.oy + (p.y - d.py))); }
      else { let x1 = c.x, y1 = c.y, x2 = c.x + c.w, y2 = c.y + c.h; if (d.type.includes("l")) x1 = Math.min(p.x, x2 - MIN); if (d.type.includes("r")) x2 = Math.max(p.x, x1 + MIN); if (d.type.includes("t")) y1 = Math.min(p.y, y2 - MIN); if (d.type.includes("b")) y2 = Math.max(p.y, y1 + MIN); c.x = x1; c.y = y1; c.w = x2 - x1; c.h = y2 - y1; }
      setCrop({ x: +c.x.toFixed(2), y: +c.y.toFixed(2), w: +c.w.toFixed(2), h: +c.h.toFixed(2) }); };
    const onUp = () => { drag.current = null; };
    window.addEventListener("pointermove", onMove, { passive: false }); window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [setCrop]);
  const startMove = (e) => { e.stopPropagation(); e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} const p = pct(e.clientX, e.clientY); drag.current = { type: "move", ox: crop.x, oy: crop.y, px: p.x, py: p.y }; };
  const startHandle = (type) => (e) => { e.stopPropagation(); e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} drag.current = { type }; };
  const handle = (pos, style) => (<div onPointerDown={startHandle(pos)} style={{ position: "absolute", width: 22, height: 22, touchAction: "none", ...style }} className="rounded-full bg-white border-2 border-emerald-700 shadow -translate-x-1/2 -translate-y-1/2" />);
  return (<div ref={boxRef} className="relative select-none rounded-md overflow-hidden border border-stone-300" style={{ touchAction: "none" }}>
    <img src={image} alt="" className="w-full block" draggable={false} style={{ pointerEvents: "none" }} />
    <div onPointerDown={startMove} style={{ position: "absolute", left: `${crop.x}%`, top: `${crop.y}%`, width: `${crop.w}%`, height: `${crop.h}%`, boxShadow: "0 0 0 9999px rgba(0,0,0,.45)", touchAction: "none" }} className="border-2 border-emerald-400 cursor-move">
      {handle("tl", { left: 0, top: 0 })}{handle("tr", { left: "100%", top: 0 })}{handle("bl", { left: 0, top: "100%" })}{handle("br", { left: "100%", top: "100%" })}
    </div></div>);
}

// Contour de traque : trait fin doublé d'un liseré blanc, pour rester visible
// sur toutes les cartes. Les postes sont dessinés par-dessus le tracé.
function zonePath(zone, crop, fermee) {
  const pts = (zone || []).map((p) => ({
    x: ((p.gx - crop.x) / crop.w) * 100,
    y: ((p.gy - crop.y) / crop.h) * 100
  }));
  if (pts.length < 2) return "";
  let d = "M " + pts[0].x + " " + pts[0].y;
  for (let i = 1; i < pts.length; i++) d += " L " + pts[i].x + " " + pts[i].y;
  if (fermee && pts.length >= 3) d += " Z";
  return d;
}
function ZoneSvg({ zone, crop, color, fermee }) {
  const d = zonePath(zone, crop, fermee);
  if (!d) return null;
  return (<svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
    <path d={d} fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.55" vectorEffect="non-scaling-stroke" />
    <path d={d} fill="none" stroke={color || "#dc2626"} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.85" vectorEffect="non-scaling-stroke" />
  </svg>);
}

// Distance d'un point à un segment, pour savoir si l'on a touché une ligne du contour.
function distSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function PlaceMiradors({ image, track, updateTrack }) {
  const crop = track.crop || FULL_CROP; const ar = useImageAR(image);
  const boxRef = useRef(null); const wrapRef = useRef(null); const drag = useRef(null); const moved = useRef(false); const mRef = useRef(track.miradors); mRef.current = track.miradors;
  const [mode, setMode] = useState("poste");          // poste | contour
  // Zoom au pincement. La transformation est portée par la couche interne (boxRef),
  // si bien que toGlobal continue de fonctionner sans le moindre calcul supplémentaire.
  const [vue, setVue] = useState({ z: 1, tx: 0, ty: 0 });
  const doigts = useRef(new Map());
  const pinch = useRef(null);
  const vueRef = useRef(vue); vueRef.current = vue;
  const modeRef = useRef(mode); modeRef.current = mode;
  const [plein, setPlein] = useState(false);
  const [noms, setNoms] = useState(true);
  const [ecran, setEcran] = useState({ w: typeof window !== "undefined" ? window.innerWidth : 800, h: typeof window !== "undefined" ? window.innerHeight : 600 });
  useEffect(() => { if (!plein) return; const f = () => setEcran({ w: window.innerWidth, h: window.innerHeight }); f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, [plein]);
  const pan = useRef(null);
  // Zoom autour d'un point de l'ecran (molette, boutons + / -)
  const zoomAt = (f, cx, cy) => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect(), v = vueRef.current;
    const z = Math.max(1, Math.min(8, v.z * f));
    const ox = cx - r.left, oy = cy - r.top;
    let tx = ox - ((ox - v.tx) / v.z) * z, ty = oy - ((oy - v.ty) / v.z) * z;
    tx = Math.max(r.width - r.width * z, Math.min(0, tx)); ty = Math.max(r.height - r.height * z, Math.min(0, ty));
    setVue({ z, tx, ty });
  };
  // Molette : en plein ecran toujours ; sinon seulement avec Ctrl (ou le pincement du pave tactile),
  // pour ne pas bloquer le defilement de la page.
  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const fn = (e) => { if (!plein && !e.ctrlKey) return; e.preventDefault(); zoomAt(Math.exp(-e.deltaY * 0.0018), e.clientX, e.clientY); };
    el.addEventListener("wheel", fn, { passive: false });
    return () => el.removeEventListener("wheel", fn);
  }, [plein]);
  const zRef = useRef(track.zone || []); zRef.current = track.zone || [];
  const zDrag = useRef(null);
  const longTimer = useRef(null); const longRef = useRef(false); const hStart = useRef(null); const [sel, setSel] = useState(null);
  const toGlobal = (cx, cy) => { const r = boxRef.current.getBoundingClientRect(); const lx = Math.max(0, Math.min(100, ((cx - r.left) / r.width) * 100)); const ly = Math.max(0, Math.min(100, ((cy - r.top) / r.height) * 100)); return { gx: crop.x + (lx / 100) * crop.w, gy: crop.y + (ly / 100) * crop.h }; };
  useEffect(() => {
    const onMove = (e) => {
      if (zDrag.current !== null && boxRef.current) {
        e.preventDefault(); moved.current = true;
        if (longTimer.current) { clearTimeout(longTimer.current); longTimer.current = null; }
        const { gx, gy } = toGlobal(e.clientX, e.clientY);
        const z = (zRef.current || []).slice(); z[zDrag.current] = { gx, gy };
        updateTrack({ zone: z }); return;
      }
      if (!drag.current || !boxRef.current) return; e.preventDefault(); const { gx, gy } = toGlobal(e.clientX, e.clientY); moved.current = true; updateTrack({ miradors: mRef.current.map((m) => (m.id === drag.current ? { ...m, gx: +gx.toFixed(2), gy: +gy.toFixed(2) } : m)) }); };
    const onUp = () => { drag.current = null; zDrag.current = null; };
    window.addEventListener("pointermove", onMove, { passive: false }); window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [updateTrack, crop.x, crop.y, crop.w, crop.h]);
  const tap = useRef(null);
  const majDoigt = (e) => doigts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  const onDown = (e) => {
    majDoigt(e);
    // Un toucher est validé au relâcher, pas par l'événement « clic » :
    // Safari annule le clic dès que le doigt bouge de quelques pixels.
    if (doigts.current.size === 1) { tap.current = { id: e.pointerId, x: e.clientX, y: e.clientY, t: Date.now() }; pan.current = { x: e.clientX, y: e.clientY, tx: vueRef.current.tx, ty: vueRef.current.ty, actif: false }; }
    else { tap.current = null; pan.current = null; }
    if (doigts.current.size === 2) {
      const [a, b] = Array.from(doigts.current.values());
      pinch.current = {
        d0: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2,
        v0: { ...vueRef.current }
      };
      moved.current = true;              // empêche la pose d'un point à la fin du geste
      drag.current = null; zDrag.current = null;
    }
  };
  const onPinchMove = (e) => {
    if (!doigts.current.has(e.pointerId)) return;
    majDoigt(e);
    // Un seul doigt sur la carte zoomee : on la fait glisser (le toucher ne pose alors pas de poste)
    if (doigts.current.size === 1 && pan.current && vueRef.current.z > 1.01 && wrapRef.current && drag.current === null && zDrag.current === null) {
      const P0 = pan.current, dx = e.clientX - P0.x, dy = e.clientY - P0.y;
      if (!P0.actif && Math.hypot(dx, dy) > 8) { P0.actif = true; tap.current = null; moved.current = true; }
      if (P0.actif) {
        e.preventDefault();
        const r = wrapRef.current.getBoundingClientRect(), z = vueRef.current.z;
        setVue({ z, tx: Math.max(r.width - r.width * z, Math.min(0, P0.tx + dx)), ty: Math.max(r.height - r.height * z, Math.min(0, P0.ty + dy)) });
      }
      return;
    }
    if (doigts.current.size < 2 || !pinch.current || !wrapRef.current) return;
    e.preventDefault();
    const [a, b] = Array.from(doigts.current.values());
    const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const P = pinch.current;
    const z = Math.max(1, Math.min(8, P.v0.z * (d / P.d0)));
    const r = wrapRef.current.getBoundingClientRect();
    // Le point pincé reste sous les doigts
    const ox = P.mx - r.left, oy = P.my - r.top;
    let tx = mx - r.left - ((ox - P.v0.tx) / P.v0.z) * z;
    let ty = my - r.top - ((oy - P.v0.ty) / P.v0.z) * z;
    const maxX = 0, minX = r.width - r.width * z;
    const maxY = 0, minY = r.height - r.height * z;
    tx = Math.max(minX, Math.min(maxX, tx));
    ty = Math.max(minY, Math.min(maxY, ty));
    setVue({ z, tx, ty });
  };
  const onFin = (e) => {
    const t = tap.current;
    if (longTimer.current) { clearTimeout(longTimer.current); longTimer.current = null; }
    doigts.current.delete(e.pointerId);
    if (doigts.current.size < 2) pinch.current = null;
    if (doigts.current.size === 0) { if (pan.current && pan.current.actif) moved.current = false; pan.current = null; }
    if (!t || t.id !== e.pointerId) { tap.current = null; return; }
    tap.current = null;
    if (drag.current !== null || zDrag.current !== null || longRef.current) return;
    // 12 pixels de tolérance : un doigt ne reste jamais parfaitement immobile
    if (Math.hypot(e.clientX - t.x, e.clientY - t.y) > 12) return;
    if (Date.now() - t.t > 700) return;
    onTap(e);
  };

  const onTap = (e) => { if (moved.current) { moved.current = false; return; }
    if (modeRef.current === "contour") {
      const z = track.zone || [];
      const r = boxRef.current.getBoundingClientRect();
      const ecran = (pt) => ({
        x: r.left + ((pt.gx - crop.x) / crop.w) * r.width,
        y: r.top + ((pt.gy - crop.y) / crop.h) * r.height
      });
      // Une ligne touchée de près : on y insère un point
      if (z.length >= 2) {
        let best = -1, bd = 18;
        const nb = track.zoneFermee ? z.length : z.length - 1;   // le segment de fermeture n'existe que si fermé
        for (let i = 0; i < nb; i++) {
          const a = ecran(z[i]), b = ecran(z[(i + 1) % z.length]);
          const d = distSegment(e.clientX, e.clientY, a.x, a.y, b.x, b.y);
          if (d < bd) { bd = d; best = i; }
        }
        if (best >= 0) {
          const { gx, gy } = toGlobal(e.clientX, e.clientY);
          const nz = z.slice(); nz.splice(best + 1, 0, { gx, gy });
          updateTrack({ zone: nz }); return;
        }
      }
      // Une fois fermé, un toucher à l'écart ne fait plus rien
      if (track.zoneFermee) return;
      const { gx, gy } = toGlobal(e.clientX, e.clientY);
      updateTrack({ zone: [...z, { gx, gy }] }); return;
    }
    const { gx, gy } = toGlobal(e.clientX, e.clientY); const id = `m-${Date.now()}`; updateTrack({ miradors: [...track.miradors, { id, label: `Poste ${track.miradors.length + 1}`, gx: +gx.toFixed(2), gy: +gy.toFixed(2), photos: [], consignes: "" }] }); setSel(id); };
  // ---- Plein ecran, zoom a la molette / aux boutons, nom des postes ----
  const ratio = ar > 0 ? (crop.h / crop.w) / ar : (crop.h / crop.w);
  const tailleCarte = () => {
    const w = Math.max(200, Math.min(ecran.w - 16, (ecran.h - 150) / ratio));
    return { w, h: w * ratio };
  };
  const dims = plein ? tailleCarte() : null;
  const inv = 1 / vue.z;
  const carte = (<div ref={wrapRef}
      onPointerDown={onDown} onPointerMove={onPinchMove} onPointerUp={onFin} onPointerCancel={onFin}
      style={plein ? { position: "relative", width: dims.w, height: dims.h, touchAction: "none", overflow: "hidden", borderRadius: 6, background: "#292524" } : { ...cropWrapperStyle(crop, ar), touchAction: "none", overflow: "hidden", position: "relative" }}
      className="border border-stone-300 select-none relative">
      <div ref={boxRef}
        style={{ position: "absolute", inset: 0, transform: `translate(${vue.tx}px, ${vue.ty}px) scale(${vue.z})`, transformOrigin: "0 0", cursor: "crosshair" }}>
      <div style={cropBgStyle(image, crop)} />
      <ZoneSvg zone={track.zone} crop={crop} color={track.color} fermee={track.zoneFermee} />
      {mode === "contour" && (track.zone || []).map((pt, i) => {
        const lx = ((pt.gx - crop.x) / crop.w) * 100, ly = ((pt.gy - crop.y) / crop.h) * 100;
        if (lx < -3 || lx > 103 || ly < -3 || ly > 103) return null;
        return (<div key={"z" + i}
          onPointerDown={(e) => {
            if (mode !== "contour") return;
            e.stopPropagation(); zDrag.current = i; longRef.current = false;
            hStart.current = { i: i, x: e.clientX, y: e.clientY };
            if (longTimer.current) clearTimeout(longTimer.current);
            longTimer.current = setTimeout(() => {
              longRef.current = true; zDrag.current = null;
              updateTrack({ zone: (zRef.current || []).filter((_, k) => k !== i) });
            }, 600);
          }}
          onPointerUp={(e) => {
            if (longTimer.current) { clearTimeout(longTimer.current); longTimer.current = null; }
            const h = hStart.current; hStart.current = null;
            if (!h || h.i !== i || longRef.current) return;
            if (Math.hypot(e.clientX - h.x, e.clientY - h.y) > 12) return;
            const z = zRef.current || [];
            // Retoucher le premier ou le dernier point referme le tracé
            if (!track.zoneFermee && z.length >= 3 && (i === 0 || i === z.length - 1)) {
              zDrag.current = null;
              updateTrack({ zoneFermee: true });
            }
          }}
          style={{ position: "absolute", left: `${lx}%`, top: `${ly}%`, touchAction: "none", pointerEvents: mode === "contour" ? "auto" : "none", transform: `translate(-50%,-50%) scale(${inv})`, transformOrigin: "50% 50%" }}>
          <span className="block rounded-full shadow w-5 h-5 bg-white border-[3px]" style={{ borderColor: track.color || "#dc2626" }} />
        </div>);
      })}
      {track.miradors.map((m) => { const lx = ((m.gx - crop.x) / crop.w) * 100, ly = ((m.gy - crop.y) / crop.h) * 100; if (lx < -3 || lx > 103 || ly < -3 || ly > 103) return null; const s = sel === m.id;
        // Le poste garde la meme taille a l'ecran quel que soit le zoom : zoomer ecarte les postes
        // au lieu de les grossir, et le placement devient plus precis.
        return (<div key={m.id} style={{ position: "absolute", left: `${lx}%`, top: `${ly}%`, width: 0, height: 0, transform: `scale(${inv})`, transformOrigin: "0 0", zIndex: s ? 3 : 2, pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 28, height: 28, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "none", pointerEvents: mode === "poste" ? "auto" : "none", cursor: "grab" }}
            onClick={(e) => { if (mode !== "poste") return; e.stopPropagation(); setSel(m.id); }}
            onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} setSel(m.id); drag.current = m.id; moved.current = false; }}>
            <span className={`block rounded-full border-2 shadow ${s ? "border-stone-900 w-4 h-4" : "border-white w-3.5 h-3.5"}`} style={{ backgroundColor: track.color }} />
          </div>
          {(noms || s) && <span style={{ position: "absolute", left: 0, top: 9, transform: "translateX(-50%)", pointerEvents: "none" }} className={`${plein ? "text-[11px]" : "text-[9px]"} leading-tight ${s ? "bg-stone-900" : "bg-stone-900/70"} text-stone-50 px-1 rounded whitespace-nowrap`}>{m.label}{(m.photos && m.photos.length) ? " 📷" : ""}</span>}
        </div>); })}
    </div></div>);
  const centreZoom = (f) => { const r = wrapRef.current && wrapRef.current.getBoundingClientRect(); if (r) zoomAt(f, r.left + r.width / 2, r.top + r.height / 2); };
  const boutonsZoom = (sombre) => (<span className="flex items-center gap-1">
    <button onClick={() => centreZoom(1 / 1.6)} disabled={vue.z <= 1.01} className={`w-7 h-7 rounded-md border text-base leading-none disabled:opacity-40 ${sombre ? "bg-stone-700 text-stone-100 border-stone-600" : "bg-white text-stone-700 border-stone-300"}`}>−</button>
    <span className={`text-[11px] w-10 text-center ${sombre ? "text-stone-300" : "text-stone-500"}`}>×{vue.z.toFixed(1)}</span>
    <button onClick={() => centreZoom(1.6)} disabled={vue.z >= 7.9} className={`w-7 h-7 rounded-md border text-base leading-none disabled:opacity-40 ${sombre ? "bg-stone-700 text-stone-100 border-stone-600" : "bg-white text-stone-700 border-stone-300"}`}>+</button>
    {vue.z > 1.02 && <button onClick={() => setVue({ z: 1, tx: 0, ty: 0 })} className={`text-[11px] underline ml-1 ${sombre ? "text-amber-300" : "text-emerald-800"}`}>Tout voir</button>}
  </span>);
  const caseNoms = (sombre) => (<label className={`flex items-center gap-1 text-[11px] ${sombre ? "text-stone-200" : "text-stone-600"}`}><input type="checkbox" checked={noms} onChange={() => setNoms(!noms)} className="w-3.5 h-3.5 accent-emerald-700" />Noms</label>);
  const aide = mode === "poste"
    ? "Touche la carte pour poser un mirador, glisse une pastille pour la déplacer. Pince à deux doigts (ou molette) pour zoomer, glisse la carte pour te déplacer."
    : "Touche pour poser un point · retouche le premier ou le dernier pour fermer · glisse pour déplacer · touche la ligne pour insérer · appui long pour supprimer.";
  return (<div>
    <div className="flex gap-1.5 mb-2">
      {[["poste", "📍 Postes"], ["contour", "✏️ Contour"]].map(([k, lab]) => (
        <button key={k} onClick={() => setMode(k)} className={`flex-1 text-[12px] font-medium py-1.5 rounded-md border ${mode === k ? "bg-emerald-800 text-stone-50 border-emerald-800" : "bg-white text-stone-700 border-stone-300"}`}>{lab}</button>
      ))}
    </div>
    <p className="text-[11px] text-stone-500 mb-1.5">{aide}</p>
    {mode === "contour" && (<div className="flex gap-1.5 mb-2">
      <button onClick={() => updateTrack({ zone: (track.zone || []).slice(0, -1) })} disabled={!(track.zone || []).length} className="flex-1 text-[11px] text-stone-600 bg-white border border-stone-300 disabled:opacity-40 rounded-md py-1.5">↶ Dernier point</button>
      <button onClick={() => updateTrack({ zoneFermee: !track.zoneFermee })} disabled={(track.zone || []).length < 3} className="flex-1 text-[11px] text-stone-700 bg-white border border-stone-300 disabled:opacity-40 rounded-md py-1.5">{track.zoneFermee ? "↔ Rouvrir" : "⭘ Fermer"}</button>
      <button onClick={() => { if ((track.zone || []).length && !window.confirm("Effacer le contour de cette traque ?")) return; updateTrack({ zone: [], zoneFermee: false }); }} disabled={!(track.zone || []).length} className="flex-1 text-[11px] text-red-700 bg-white border border-stone-300 disabled:opacity-40 rounded-md py-1.5">🗑 Effacer</button>
    </div>)}
    <div className="flex items-center gap-2 mb-1.5 bg-stone-100 border border-stone-200 rounded-md px-2 py-1.5">
      <button onClick={() => { setVue({ z: 1, tx: 0, ty: 0 }); setPlein(true); }} className="text-[12px] font-medium bg-stone-700 text-stone-50 rounded-md px-2.5 py-1">⛶ Plein écran</button>
      {caseNoms(false)}
      <span className="ml-auto">{boutonsZoom(false)}</span>
    </div>
    {plein ? <div className="text-[11px] text-stone-400 italic border border-dashed border-stone-300 rounded-md p-3 text-center">Carte ouverte en plein écran.</div> : carte}
    {plein && (<div className="fixed inset-0 z-[55] bg-stone-900 flex flex-col" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-center gap-2 px-3 py-2 bg-stone-800">
        <button onClick={() => { setVue({ z: 1, tx: 0, ty: 0 }); setPlein(false); }} className="text-[12px] font-semibold bg-amber-500 text-stone-900 rounded-md px-2.5 py-1.5 shrink-0">✕ Quitter le plein écran</button>
        <span className="text-[12px] text-stone-300 truncate">{track.name}</span>
        <div className="ml-auto flex gap-1 shrink-0">
          {[["poste", "📍"], ["contour", "✏️"]].map(([k, lab]) => (<button key={k} onClick={() => setMode(k)} className={`text-[12px] rounded-md px-2 py-1 ${mode === k ? "bg-emerald-700 text-white" : "bg-stone-700 text-stone-200"}`}>{lab} {k === "poste" ? "Postes" : "Contour"}</button>))}
        </div>
      </div>
      <div className="flex items-center gap-3 px-3 py-1.5 bg-stone-800 border-t border-stone-700">
        {boutonsZoom(true)}
        {caseNoms(true)}
        {mode === "contour" && (<span className="ml-auto flex gap-1">
          <button onClick={() => updateTrack({ zone: (track.zone || []).slice(0, -1) })} disabled={!(track.zone || []).length} className="text-[11px] bg-stone-700 text-stone-100 disabled:opacity-40 rounded px-2 py-1">↶ Dernier point</button>
          <button onClick={() => updateTrack({ zoneFermee: !track.zoneFermee })} disabled={(track.zone || []).length < 3} className="text-[11px] bg-stone-700 text-stone-100 disabled:opacity-40 rounded px-2 py-1">{track.zoneFermee ? "↔ Rouvrir" : "⭘ Fermer"}</button>
        </span>)}
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center p-2">{carte}</div>
      <p className="text-[11px] text-stone-300 px-3 pb-2">{aide}</p>
    </div>)}
  </div>);
}

// Editeur d'un mirador (nom, consignes, photos)
function tirRender(zones) {
  var n = zones.length; if (!n) return { reds: [], bands: [] };
  var Z = zones.map(function (z) { return { l: ((z.dir - z.width / 2) % 360 + 360) % 360, r: ((z.dir + z.width / 2) % 360 + 360) % 360, w: z.width, dir: z.dir }; });
  Z.sort(function (a, b) { return a.dir - b.dir; });
  var ml = [], mr = [];
  for (var i = 0; i < n; i++) { var j = (i + 1) % n; var g = ((Z[j].l - Z[i].r) % 360 + 360) % 360; var me = Math.min(30, Math.max(0, (g - 12) / 2)); mr[i] = me; ml[j] = me; }
  var reds = [], bands = [];
  for (var k = 0; k < n; k++) { reds.push({ start: Z[k].l, width: Z[k].w }); if (ml[k] > 0.5) bands.push({ start: Z[k].l - ml[k], width: ml[k] }); if (mr[k] > 0.5) bands.push({ start: Z[k].r, width: mr[k] }); }
  return { reds: reds, bands: bands };
}
function TirPreview({ image, crop, m, miradors }) {
  if (!image) return null;
  const c = crop || { x: 0, y: 0, w: 100, h: 100 };
  const lx = (m.gx - c.x) / c.w * 100, ly = (m.gy - c.y) / c.h * 100;
  const fw = c.w / 100, fh = c.h / 100, fx = c.x / 100, fy = c.y / 100;
  const disk = { position: "absolute", left: lx + "%", top: ly + "%", width: "2400px", height: "2400px", transform: "translate(-50%,-50%)", borderRadius: "50%", pointerEvents: "none" };
  const zones = (m.tir && m.tir.zones) || [];
  const tr = tirRender(zones);
  const band = (b, k) => <div key={k} style={{ ...disk, background: "repeating-linear-gradient(45deg, rgba(248,113,113,.55) 0 6px, rgba(255,255,255,.9) 6px 12px)", WebkitMaskImage: `conic-gradient(from ${b.start}deg, #000 0deg ${b.width}deg, transparent ${b.width}deg 360deg)`, maskImage: `conic-gradient(from ${b.start}deg, #000 0deg ${b.width}deg, transparent ${b.width}deg 360deg)` }} />;
  return (<div style={{ position: "relative", width: "100%", paddingBottom: "68%", overflow: "hidden", borderRadius: 8, border: "1px solid #d6d3d1" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${image})`, backgroundSize: `${100 / fw}% ${100 / fh}%`, backgroundPosition: `${fw < 1 ? fx / (1 - fw) * 100 : 0}% ${fh < 1 ? fy / (1 - fh) * 100 : 0}%` }} />
    {zones.length ? <div style={{ ...disk, background: "rgba(134,239,172,0.28)" }} /> : null}
    {tr.bands.map((b, i) => band(b, "bd" + i))}
    {tr.reds.map((r, i) => <div key={"r" + i} style={{ ...disk, background: `conic-gradient(from ${r.start}deg, rgba(252,165,165,0.55) 0deg ${r.width}deg, transparent ${r.width}deg 360deg)` }} />)}
    {(miradors || []).filter((nm) => nm.id !== m.id).map((nm) => { const nx = (nm.gx - c.x) / c.w * 100, ny = (nm.gy - c.y) / c.h * 100; if (nx < -3 || nx > 103 || ny < -3 || ny > 103) return null; return (<div key={nm.id} style={{ position: "absolute", left: nx + "%", top: ny + "%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}><div style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff", border: "2px solid #78716c", margin: "0 auto" }} /><div style={{ fontSize: 8, background: "rgba(255,255,255,.85)", borderRadius: 3, padding: "0 2px", color: "#57534e", whiteSpace: "nowrap", marginTop: 1 }}>{nm.label}</div></div>); })}
    <div style={{ position: "absolute", left: lx + "%", top: ly + "%", width: 13, height: 13, borderRadius: "50%", background: "#1c1917", border: "2px solid #fff", transform: "translate(-50%,-50%)", boxShadow: "0 0 0 1px rgba(0,0,0,.4)" }} />
  </div>);
}
// ======================= Annotations des photos de poste =======================
// Les dessins sont enregistres a part (m.photoNotes[i] = liste d'elements) : la photo d'origine
// n'est jamais modifiee, et tout reste deplacable / modifiable / effacable.
// Coordonnees entre 0 et 1 (relatives a la photo) pour ne pas dependre de la taille d'affichage.
const ANNOT_COULEURS = ["#dc2626", "#f97316", "#facc15", "#16a34a", "#2563eb", "#ffffff", "#1c1917"];
const ANNOT_EPAISSEURS = [[1, "Fin"], [2, "Moyen"], [3, "Épais"]];
const annotLargeur = (e, U) => ({ 1: 5, 2: 9, 3: 15 })[e || 2] * U;
function normAnnot(o) {
  if (!o || typeof o !== "object") return null;
  const c = (v) => Math.max(0, Math.min(1, Number(v) || 0));
  const coul = ANNOT_COULEURS.indexOf(o.c) >= 0 ? o.c : "#dc2626", ep = [1, 2, 3].indexOf(o.e) >= 0 ? o.e : 2;
  if (o.t === "perso" || o.t === "note" || o.t === "maison" || o.t === "piquet") return { t: o.t, x: c(o.x), y: c(o.y), txt: String(o.txt || "").slice(0, 80) };
  if (o.t === "ligne") return { t: "ligne", x1: c(o.x1), y1: c(o.y1), x2: c(o.x2), y2: c(o.y2), c: o.c === "v" ? "v" : "r" };
  if (o.t === "rect" || o.t === "ovale") return { t: o.t, x1: c(o.x1), y1: c(o.y1), x2: c(o.x2), y2: c(o.y2), c: coul, e: ep };
  if (o.t === "stylo" && Array.isArray(o.pts)) { const pts = o.pts.slice(0, 600).map((p) => [Math.round(c(p[0]) * 10000) / 10000, Math.round(c(p[1]) * 10000) / 10000]); return pts.length >= 2 ? { t: "stylo", pts, c: coul, e: ep } : null; }
  return null;
}
function normPhotoNotes(l) { return Array.isArray(l) ? l.slice(0, 40).map((a) => (Array.isArray(a) ? a.slice(0, 120).map(normAnnot).filter(Boolean) : [])) : []; }
// Etiquette sombre a texte blanc (comme les noms de postes sur les cartes). Renvoie sa boite.
function etiquetteAnnot(ctx, txt, x, y, U, mode, W, H) {
  const fs = 26 * U, pad = 9 * U, lh = fs * 1.2, maxW = 430 * U;
  ctx.font = "600 " + fs + "px Helvetica, Arial, sans-serif";
  const lignes = []; let cur = "";
  String(txt).split(/\s+/).filter(Boolean).forEach((w) => { const t = cur ? cur + " " + w : w; if (cur && ctx.measureText(t).width > maxW) { lignes.push(cur); cur = w; } else cur = t; });
  if (cur) lignes.push(cur);
  if (!lignes.length) lignes.push("…");
  const w = Math.min(maxW, Math.max(...lignes.map((l) => ctx.measureText(l).width))) + pad * 2, h = lignes.length * lh + pad * 1.2;
  // reste dans la photo : a cote du voisin, l'etiquette passe a gauche si elle deborde a droite
  let bx = mode === "gauche" ? x : x - w / 2, by = y - h / 2;
  if (W && mode === "gauche" && bx + w > W - 4 * U) bx = x - 52 * U - w;
  if (W) bx = Math.max(4 * U, Math.min(W - w - 4 * U, bx));
  if (H) by = Math.max(4 * U, Math.min(H - h - 4 * U, by));
  return { x: bx, y: by, w, h, dessiner: () => {
    ctx.fillStyle = "rgba(28,25,23,.86)"; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(bx, by, w, h, 8 * U); else ctx.rect(bx, by, w, h); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    lignes.forEach((l, k) => ctx.fillText(l, bx + pad, by + pad * 0.6 + lh * (k + 0.5)));
  } };
}
const ANNOT_COUCHE = { stylo: 0, rect: 0, ovale: 0, ligne: 0, perso: 1, maison: 1, piquet: 1, note: 2 };
// Dessine toutes les annotations ; renvoie la boite de chaque element (pour les toucher a l'ecran).
function dessinerAnnotations(ctx, W, H, items, sel) {
  const U = Math.max(W, H) / 1000, boites = [];
  ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
  const poignees = (pts) => pts.forEach(([hx, hy]) => { ctx.fillStyle = "#fff"; ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 4 * U; ctx.beginPath(); ctx.arc(hx, hy, 13 * U, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
  const cadre = (b) => { ctx.setLineDash([10 * U, 7 * U]); ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 4 * U; ctx.strokeRect(b.x - 5 * U, b.y - 5 * U, b.w + 10 * U, b.h + 10 * U); ctx.setLineDash([]); };
  // trait colore avec un liseré (blanc, ou sombre pour le blanc) : lisible sur n'importe quelle photo
  const tracer = (chemin, coul, larg) => {
    ctx.strokeStyle = coul === "#ffffff" ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.85)"; ctx.lineWidth = larg + 5 * U; chemin(); ctx.stroke();
    ctx.strokeStyle = coul; ctx.lineWidth = larg; chemin(); ctx.stroke();
  };
  // ordre de dessin : traits et formes, puis voisins, puis notes (les textes restent lisibles par-dessus)
  const ordre = items.map((it, i) => i).sort((a, b) => ANNOT_COUCHE[items[a].t] - ANNOT_COUCHE[items[b].t]);
  ordre.forEach((i) => {
    const it = items[i];
    if (it.t === "ligne") {
      const x1 = it.x1 * W, y1 = it.y1 * H, x2 = it.x2 * W, y2 = it.y2 * H;
      tracer(() => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); }, it.c === "v" ? "#16a34a" : "#dc2626", 9 * U);
      boites[i] = { ligne: [x1, y1, x2, y2] };
      if (sel === i) poignees([[x1, y1], [x2, y2]]);
    } else if (it.t === "stylo") {
      const pts = it.pts.map(([x, y]) => [x * W, y * H]);
      tracer(() => { ctx.beginPath(); pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); }, it.c, annotLargeur(it.e, U));
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const b = { x: Math.min(...xs), y: Math.min(...ys) }; b.w = Math.max(...xs) - b.x; b.h = Math.max(...ys) - b.y;
      boites[i] = { ...b, pts };
      if (sel === i) cadre(b);
    } else if (it.t === "rect" || it.t === "ovale") {
      const x1 = it.x1 * W, y1 = it.y1 * H, x2 = it.x2 * W, y2 = it.y2 * H;
      const b = { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1) };
      const larg = annotLargeur(it.e, U);
      if (it.t === "rect") tracer(() => { ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); }, it.c, larg);
      else tracer(() => { ctx.beginPath(); ctx.ellipse(b.x + b.w / 2, b.y + b.h / 2, Math.max(1, b.w / 2), Math.max(1, b.h / 2), 0, 0, Math.PI * 2); }, it.c, larg);
      boites[i] = { ...b, forme: true };
      if (sel === i) poignees([[x1, y1], [x2, y2]]);
    } else if (it.t === "perso") {
      // bonhomme orange : les pieds sont au point pose
      const px = it.x * W, py = it.y * H;
      const corps = (col, plus) => {
        ctx.strokeStyle = col; ctx.fillStyle = col;
        ctx.lineWidth = 8 * U + plus; ctx.beginPath(); ctx.moveTo(px - 6 * U, py - 20 * U); ctx.lineTo(px - 7 * U, py); ctx.moveTo(px + 6 * U, py - 20 * U); ctx.lineTo(px + 7 * U, py); ctx.stroke();
        ctx.lineWidth = 6 * U + plus; ctx.beginPath(); ctx.moveTo(px - 12 * U, py - 44 * U); ctx.lineTo(px - 21 * U, py - 24 * U); ctx.moveTo(px + 12 * U, py - 44 * U); ctx.lineTo(px + 21 * U, py - 24 * U); ctx.stroke();
        ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(px - 13 * U - plus / 2, py - 49 * U - plus / 2, 26 * U + plus, 31 * U + plus, 9 * U); else ctx.rect(px - 13 * U, py - 49 * U, 26 * U, 31 * U); ctx.fill();
        ctx.beginPath(); ctx.arc(px, py - 62 * U, 11 * U + plus / 2, 0, Math.PI * 2); ctx.fill();
      };
      corps("#ffffff", 6 * U); corps("#f97316", 0);
      let b = { x: px - 26 * U, y: py - 78 * U, w: 52 * U, h: 84 * U };
      if (it.txt) { const e = etiquetteAnnot(ctx, it.txt, px + 26 * U, py - 42 * U, U, "gauche", W, H); e.dessiner(); const x0 = Math.min(b.x, e.x), y0 = Math.min(b.y, e.y); b = { x: x0, y: y0, w: Math.max(b.x + b.w, e.x + e.w) - x0, h: Math.max(b.y + b.h, e.y + e.h) - y0 }; }
      boites[i] = b;
      if (sel === i) cadre(b);
    } else if (it.t === "piquet") {
      // poste sans mirador : un piquet plante, fanion jaune avec le numero ; le pied est au point pose
      const px = it.x * W, py = it.y * H, haut = 120 * U, txt = it.txt || "?";
      ctx.font = "bold " + (28 * U) + "px Helvetica, Arial, sans-serif";
      const fw = Math.max(70 * U, ctx.measureText(txt).width + 46 * U);
      const sens = px + fw > W - 4 * U ? -1 : 1;   // pres du bord droit, le fanion part vers la gauche
      ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(px, py + 2 * U, 18 * U, 6 * U, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 13 * U; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - haut); ctx.stroke();
      ctx.strokeStyle = "#1c1917"; ctx.lineWidth = 7 * U; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - haut); ctx.stroke();
      const ht = py - haut, hb = py - haut + 44 * U, hm = (ht + hb) / 2;
      ctx.beginPath(); ctx.moveTo(px, ht); ctx.lineTo(px + sens * (fw - 18 * U), ht); ctx.lineTo(px + sens * fw, hm); ctx.lineTo(px + sens * (fw - 18 * U), hb); ctx.lineTo(px, hb); ctx.closePath();
      ctx.fillStyle = "#facc15"; ctx.fill(); ctx.lineWidth = 4 * U; ctx.strokeStyle = "#1c1917"; ctx.stroke();
      ctx.fillStyle = "#1c1917"; ctx.textBaseline = "middle"; ctx.textAlign = sens > 0 ? "left" : "right";
      ctx.fillText(txt, px + sens * 14 * U, hm + 1 * U); ctx.textAlign = "left";
      const b = sens > 0 ? { x: px - 14 * U, y: ht - 6 * U, w: fw + 20 * U, h: haut + 16 * U } : { x: px - fw - 6 * U, y: ht - 6 * U, w: fw + 20 * U, h: haut + 16 * U };
      boites[i] = b;
      if (sel === i) cadre(b);
    } else if (it.t === "maison") {
      // maison : toit rouge, murs blancs, contour sombre ; le bas de la maison est au point pose
      const px = it.x * W, py = it.y * H, k = 4 * U;
      const toit = () => { ctx.beginPath(); ctx.moveTo(px - 30 * U, py - 30 * U); ctx.lineTo(px, py - 58 * U); ctx.lineTo(px + 30 * U, py - 30 * U); ctx.closePath(); };
      ctx.lineWidth = k + 6 * U; ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.strokeRect(px - 22 * U, py - 32 * U, 44 * U, 32 * U); toit(); ctx.stroke();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(px - 22 * U, py - 32 * U, 44 * U, 32 * U);
      ctx.lineWidth = k; ctx.strokeStyle = "#1c1917"; ctx.strokeRect(px - 22 * U, py - 32 * U, 44 * U, 32 * U);
      ctx.fillStyle = "#b91c1c"; toit(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#78350f"; ctx.fillRect(px - 6 * U, py - 17 * U, 12 * U, 17 * U);
      let b = { x: px - 32 * U, y: py - 62 * U, w: 64 * U, h: 66 * U };
      if (it.txt) { const e = etiquetteAnnot(ctx, it.txt, px + 34 * U, py - 30 * U, U, "gauche", W, H); e.dessiner(); const x0 = Math.min(b.x, e.x), y0 = Math.min(b.y, e.y); b = { x: x0, y: y0, w: Math.max(b.x + b.w, e.x + e.w) - x0, h: Math.max(b.y + b.h, e.y + e.h) - y0 }; }
      boites[i] = b;
      if (sel === i) cadre(b);
    } else if (it.t === "note") {
      const e = etiquetteAnnot(ctx, it.txt || "Note", it.x * W, it.y * H, U, "centre", W, H); e.dessiner();
      boites[i] = { x: e.x, y: e.y, w: e.w, h: e.h };
      if (sel === i) cadre(e);
    }
  });
  ctx.restore();
  return boites;
}
// Photo + annotations fusionnees en une seule image (pour la page des chasseurs et les vignettes).
async function aplatirPhoto(src, items, maxDim, q) {
  if (!items || !items.length) return src;
  const img = await loadImg(src);
  let W = img.naturalWidth, H = img.naturalHeight;
  if (maxDim && Math.max(W, H) > maxDim) { const r = maxDim / Math.max(W, H); W = Math.round(W * r); H = Math.round(H * r); }
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d"); ctx.drawImage(img, 0, 0, W, H);
  dessinerAnnotations(ctx, W, H, items, null);
  return cv.toDataURL("image/jpeg", q || 0.72);
}
function AnnotThumb({ src, items, onClick }) {
  const [url, setUrl] = useState(src);
  useEffect(() => { let vivant = true; aplatirPhoto(src, items, 260, 0.7).then((u) => { if (vivant) setUrl(u); }).catch(() => {}); return () => { vivant = false; }; }, [src, JSON.stringify(items || [])]);
  return <button onClick={onClick} className="block" title="Annoter la photo"><img src={url} alt="" className="w-16 h-16 object-cover rounded border border-stone-300" /></button>;
}
function PhotoAnnoteur({ src, items: depart, voisins, poste, onSave, onClose }) {
  const cvRef = useRef(null), imgRef = useRef(null), boites = useRef([]), glisse = useRef(null);
  const [items, setItems] = useState(() => (depart || []).map((x) => ({ ...x })));
  const [hist, setHist] = useState([]);
  const [mode, setMode] = useState("main");
  const [sel, setSel] = useState(null);
  const [temp, setTemp] = useState(null);
  const [pret, setPret] = useState(false);
  const [quitter, setQuitter] = useState(false);
  const [couleur, setCouleur] = useState("#dc2626");
  const [epaisseur, setEpaisseur] = useState(2);
  const modifie = JSON.stringify(items) !== JSON.stringify(depart || []);
  useEffect(() => { loadImg(src).then((im) => { imgRef.current = im; const cv = cvRef.current; if (cv) { cv.width = im.naturalWidth; cv.height = im.naturalHeight; } setPret(true); }).catch(() => {}); }, [src]);
  useEffect(() => {
    const cv = cvRef.current, im = imgRef.current; if (!cv || !im || !pret) return;
    const ctx = cv.getContext("2d"); ctx.drawImage(im, 0, 0, cv.width, cv.height);
    const liste = temp ? items.concat([temp]) : items;
    boites.current = dessinerAnnotations(ctx, cv.width, cv.height, liste, sel);
  }, [items, sel, temp, pret]);
  const memo = () => setHist((h) => h.concat([items.map((x) => ({ ...x }))]).slice(-40));
  const pos = (e) => { const cv = cvRef.current, r = cv.getBoundingClientRect(); return { x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)), px: (e.clientX - r.left) * cv.width / r.width, py: (e.clientY - r.top) * cv.height / r.height }; };
  const distSeg = (px, py, x1, y1, x2, y2) => { const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy || 1; const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L)); return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy)); };
  const toucher = (p) => {
    const cv = cvRef.current, U = Math.max(cv.width, cv.height) / 1000;
    const ordre = items.map((_, i) => i).sort((a, b) => ANNOT_COUCHE[items[b].t] - ANNOT_COUCHE[items[a].t]);
    for (const i of ordre) {
      const b = boites.current[i]; if (!b) continue;
      if (b.ligne) { const [x1, y1, x2, y2] = b.ligne; if (distSeg(p.px, p.py, x1, y1, x2, y2) < 22 * U) return i; }
      else if (b.pts) { for (let k = 1; k < b.pts.length; k++) if (distSeg(p.px, p.py, b.pts[k - 1][0], b.pts[k - 1][1], b.pts[k][0], b.pts[k][1]) < 22 * U) return i; }
      else if (p.px >= b.x - 14 * U && p.px <= b.x + b.w + 14 * U && p.py >= b.y - 14 * U && p.py <= b.y + b.h + 14 * U) return i;
    }
    return null;
  };
  const DESSIN = ["r", "v", "stylo", "rect", "ovale", "rond"];
  const down = (e) => {
    e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) {}
    const p = pos(e), cv = cvRef.current, U = Math.max(cv.width, cv.height) / 1000;
    if (mode === "perso" || mode === "note" || mode === "maison" || mode === "piquet") {
      // le piquet prend d'office le numero du poste (modifiable ensuite)
      const num = mode === "piquet" ? (((String(poste || "").match(/\d+/) || [])[0]) || String(poste || "").slice(0, 12)) : "";
      memo(); const n = { t: mode, x: p.x, y: p.y, txt: num };
      setItems((l) => l.concat([n])); setSel(items.length); setMode("main");
      setTimeout(() => { const el = document.getElementById("annotTxt"); if (el) el.focus(); }, 60);
      return;
    }
    if (DESSIN.indexOf(mode) >= 0) {
      glisse.current = { trait: true, x: p.x, y: p.y };
      if (mode === "r" || mode === "v") setTemp({ t: "ligne", x1: p.x, y1: p.y, x2: p.x, y2: p.y, c: mode });
      else if (mode === "stylo") setTemp({ t: "stylo", pts: [[p.x, p.y]], c: couleur, e: epaisseur });
      else setTemp({ t: mode === "rect" ? "rect" : "ovale", x1: p.x, y1: p.y, x2: p.x, y2: p.y, c: couleur, e: epaisseur, rond: mode === "rond" });
      return;
    }
    // mode main : choisir / deplacer / agrandir
    const it0 = sel !== null ? items[sel] : null;
    if (it0 && (it0.t === "ligne" || it0.t === "rect" || it0.t === "ovale")) {
      const W = cv.width, H = cv.height;
      if (Math.hypot(p.px - it0.x1 * W, p.py - it0.y1 * H) < 26 * U) { memo(); glisse.current = { i: sel, bout: 1 }; return; }
      if (Math.hypot(p.px - it0.x2 * W, p.py - it0.y2 * H) < 26 * U) { memo(); glisse.current = { i: sel, bout: 2 }; return; }
    }
    const i = toucher(p);
    setSel(i);
    if (i !== null) { memo(); glisse.current = { i, x: p.x, y: p.y, orig: JSON.parse(JSON.stringify(items[i])) }; if (items[i].c && items[i].c.length > 1) { setCouleur(items[i].c); setEpaisseur(items[i].e || 2); } }
  };
  const move = (e) => {
    const g = glisse.current; if (!g) return;
    const p = pos(e);
    if (g.trait) {
      setTemp((t) => {
        if (!t) return t;
        if (t.t === "stylo") { const d = t.pts[t.pts.length - 1]; return Math.hypot(p.x - d[0], p.y - d[1]) > 0.003 ? { ...t, pts: t.pts.concat([[p.x, p.y]]) } : t; }
        if (t.rond) {
          // rond : meme largeur et hauteur a l'ecran
          const cv = cvRef.current, W = cv.width, H = cv.height, dx = (p.x - t.x1) * W, dy = (p.y - t.y1) * H, s = Math.max(Math.abs(dx), Math.abs(dy));
          return { ...t, x2: Math.max(0, Math.min(1, t.x1 + Math.sign(dx || 1) * s / W)), y2: Math.max(0, Math.min(1, t.y1 + Math.sign(dy || 1) * s / H)) };
        }
        return { ...t, x2: p.x, y2: p.y };
      });
      return;
    }
    setItems((l) => l.map((it, k) => {
      if (k !== g.i) return it;
      if (g.bout === 1) return { ...it, x1: p.x, y1: p.y };
      if (g.bout === 2) return { ...it, x2: p.x, y2: p.y };
      const dx = p.x - g.x, dy = p.y - g.y, o = g.orig, c = (v) => Math.max(0, Math.min(1, v));
      if (it.t === "stylo") return { ...it, pts: o.pts.map(([x, y]) => [c(x + dx), c(y + dy)]) };
      if (it.t === "ligne" || it.t === "rect" || it.t === "ovale") return { ...it, x1: c(o.x1 + dx), y1: c(o.y1 + dy), x2: c(o.x2 + dx), y2: c(o.y2 + dy) };
      return { ...it, x: c(o.x + dx), y: c(o.y + dy) };
    }));
  };
  const up = () => {
    const g = glisse.current; glisse.current = null;
    if (g && g.trait && temp) {
      const t = { ...temp }; delete t.rond;
      const assez = t.t === "stylo" ? t.pts.length >= 2 : Math.hypot(t.x2 - t.x1, t.y2 - t.y1) > 0.025;
      if (assez) { memo(); setItems((l) => l.concat([t])); setSel(items.length); }
      setTemp(null);
    }
  };
  const annuler = () => { if (!hist.length) return; setItems(hist[hist.length - 1]); setHist((h) => h.slice(0, -1)); setSel(null); };
  const majSel = (patch) => setItems((l) => l.map((it, k) => (k === sel ? { ...it, ...patch } : it)));
  const suppr = () => { if (sel === null) return; memo(); setItems((l) => l.filter((_, k) => k !== sel)); setSel(null); };
  const it = sel !== null ? items[sel] : null;
  const libre = it && (it.t === "stylo" || it.t === "rect" || it.t === "ovale");
  const choisirCouleur = (c) => { setCouleur(c); if (libre) { memo(); majSel({ c }); } };
  const choisirEpaisseur = (n) => { setEpaisseur(n); if (libre) { memo(); majSel({ e: n }); } };
  const outils = [["main", "👆", "Déplacer"], ["perso", "🧍", "Voisin"], ["maison", "🏠", "Maison"], ["piquet", "🚩", "Poste"], ["r", "🟥", "Tir interdit"], ["v", "🟩", "Tir autorisé"], ["note", "📝", "Note"], ["stylo", "🖊️", "Stylo"], ["rect", "▭", "Rectangle"], ["ovale", "⬭", "Ovale"], ["rond", "◯", "Rond"]];
  const aide = { main: "Touche un élément pour le choisir, puis fais-le glisser. Les poignées rondes agrandissent les formes.", perso: "Touche la photo là où se trouve le voisin.", maison: "Touche la photo là où se trouve la maison (ou un bâtiment).", piquet: "Poste sans mirador : touche la photo à l'endroit exact du poste (le pied du piquet).", r: "Trace un trait rouge : direction de tir interdite.", v: "Trace un trait vert : direction de tir autorisée.", note: "Touche la photo là où poser la note.", stylo: "Dessine librement avec le doigt.", rect: "Glisse pour tracer un rectangle.", ovale: "Glisse pour tracer un ovale.", rond: "Glisse pour tracer un rond." }[mode];
  const montrerPalette = ["stylo", "rect", "ovale", "rond"].indexOf(mode) >= 0 || libre;
  return (<div className="fixed inset-0 z-[60] bg-stone-900 flex flex-col" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
    <div className="flex items-center justify-between gap-2 px-3 py-2 bg-stone-800">
      {quitter
        ? <span className="flex items-center gap-2"><span className="text-xs text-stone-200">Quitter sans enregistrer ?</span><button onClick={onClose} className="text-xs font-semibold bg-red-700 text-white rounded px-2 py-1">Quitter</button><button onClick={() => setQuitter(false)} className="text-xs text-stone-300 px-2 py-1">Rester</button></span>
        : <button onClick={() => (modifie ? setQuitter(true) : onClose())} className="text-sm text-stone-200 flex items-center gap-1"><ArrowLeft size={16} /> Fermer</button>}
      <div className="flex items-center gap-2">
        <button onClick={annuler} disabled={!hist.length} className="text-sm text-stone-200 disabled:text-stone-500 px-2 py-1">↶ Annuler</button>
        <button onClick={() => onSave(items)} className="text-sm font-semibold bg-emerald-700 text-white rounded-md px-3 py-1.5">Enregistrer</button>
      </div>
    </div>
    <div className="flex gap-1 px-2 py-2 bg-stone-800 border-t border-stone-700 overflow-x-auto">
      {outils.map(([k, ico, lab]) => (<button key={k} onClick={() => { setMode(k); if (k !== "main") setSel(null); }} className={"shrink-0 flex flex-col items-center rounded-md px-2.5 py-1 text-[11px] " + (mode === k ? "bg-amber-500 text-stone-900 font-semibold" : "bg-stone-700 text-stone-100")}><span className="text-base leading-tight">{ico}</span>{lab}</button>))}
    </div>
    {montrerPalette && (<div className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 border-t border-stone-700 overflow-x-auto">
      {ANNOT_COULEURS.map((c) => (<button key={c} onClick={() => choisirCouleur(c)} title="Couleur" className="shrink-0 w-7 h-7 rounded-full" style={{ background: c, border: (libre ? it.c : couleur) === c ? "3px solid #f59e0b" : "2px solid #57534e" }} />))}
      <span className="w-px h-6 bg-stone-600 shrink-0 mx-1" />
      {ANNOT_EPAISSEURS.map(([n, lab]) => (<button key={n} onClick={() => choisirEpaisseur(n)} className={"shrink-0 flex items-center gap-1 rounded-md px-2 py-1 text-[11px] " + (((libre ? it.e : epaisseur) || 2) === n ? "bg-amber-500 text-stone-900 font-semibold" : "bg-stone-700 text-stone-100")}><span className="inline-block rounded-full bg-current" style={{ width: 16, height: n === 1 ? 2 : n === 2 ? 4 : 7 }} />{lab}</button>))}
    </div>)}
    <p className="px-3 py-1 text-[11px] text-stone-300 bg-stone-800">{aide}</p>
    <div className="flex-1 min-h-0 flex items-center justify-center p-2">
      <canvas ref={cvRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ maxWidth: "100%", maxHeight: "100%", touchAction: "none", borderRadius: 6, background: "#292524" }} />
    </div>
    {it && (<div className="bg-stone-800 px-3 py-2 space-y-2 border-t border-stone-700">
      {(it.t === "perso" || it.t === "note" || it.t === "maison" || it.t === "piquet") && (<div>
        <input id="annotTxt" value={it.txt || ""} maxLength={80} onChange={(e) => majSel({ txt: e.target.value })} placeholder={it.t === "perso" ? "Texte à côté du voisin (ex. P5, voisin à 60 m)…" : it.t === "maison" ? "Texte à côté de la maison (ex. ferme habitée, 200 m)…" : it.t === "piquet" ? "Texte du fanion (ex. 4, P4)…" : "Texte de la note (ex. chemin, maison, ligne de crête)…"} className="w-full rounded-md px-2.5 py-2 text-sm bg-white text-stone-900" />
        {it.t === "perso" && (voisins || []).length > 0 && (<div className="flex gap-1.5 flex-wrap mt-1.5">{voisins.map((v) => (<button key={v} onClick={() => majSel({ txt: v })} className="text-[11px] bg-stone-700 text-stone-100 rounded-full px-2 py-0.5">{v}</button>))}</div>)}
      </div>)}
      <div className="flex items-center gap-2">
        {it.t === "ligne" && (<><button onClick={() => majSel({ c: "r" })} className={"text-xs rounded px-2 py-1 " + (it.c === "r" ? "bg-red-700 text-white" : "bg-stone-700 text-stone-200")}>🟥 Interdit</button><button onClick={() => majSel({ c: "v" })} className={"text-xs rounded px-2 py-1 " + (it.c === "v" ? "bg-green-700 text-white" : "bg-stone-700 text-stone-200")}>🟩 Autorisé</button></>)}
        {libre && <span className="text-[11px] text-stone-300">Couleur et épaisseur : choisis-les au-dessus.</span>}
        <button onClick={suppr} className="ml-auto text-xs font-semibold text-red-300 border border-red-400 rounded px-2 py-1">Supprimer</button>
      </div>
    </div>)}
  </div>);
}
function MiradorRow({ m, updateTrack, track, onDragStart, isDragging, inCommon, image, crop, sugg }) {
  const [open, setOpen] = useState(false); const fileRef = useRef(null); const [busy, setBusy] = useState(false); const [renaming, setRenaming] = useState(false);
  // Suppression en deux appuis, sans fenetre du navigateur (qui peut etre bloquee et ne rien afficher).
  const [armer, setArmer] = useState(false);
  useEffect(() => { if (!armer) return; const t = setTimeout(() => setArmer(false), 4000); return () => clearTimeout(t); }, [armer]);
  const patch = (p) => updateTrack({ miradors: track.miradors.map((x) => (x.id === m.id ? { ...x, ...p } : x)) });
  const del = () => updateTrack({ miradors: track.miradors.filter((x) => x.id !== m.id) });
  const addPhoto = async (e) => { const f = e.target.files?.[0]; if (!f) return; setBusy(true); try { const d = await downscaleImage(f, 1100, 0.55); patch({ photos: [...(m.photos || []), d] }); } catch {} finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; } };
  const rmPhoto = (i) => patch({ photos: (m.photos || []).filter((_, k) => k !== i), photoNotes: (m.photoNotes || []).filter((_, k) => k !== i) });
  const [annot, setAnnot] = useState(null);
  const notesDe = (i) => (m.photoNotes || [])[i] || [];
  const enregistrerNotes = (i, items) => { const l = (m.photos || []).map((_, k) => notesDe(k)); l[i] = items; patch({ photoNotes: l }); setAnnot(null); };
  const voisins = (track.miradors || []).filter((x) => x.id !== m.id).map((x) => x.label || "").filter(Boolean).slice(0, 30);
  return (<div data-mid={m.id} className={`border rounded ${isDragging ? "opacity-60 ring-2 ring-amber-400 " : ""}${(m.accFauteuil || m.accCanne) ? "bg-emerald-50 border-emerald-300" : "bg-white border-stone-200"}`}>
    <div className="flex items-center gap-1.5 px-2 py-1.5">
      <button onPointerDown={(e) => { e.preventDefault(); onDragStart && onDragStart(m.id); }} title="Glisser pour réordonner" className="shrink-0 text-stone-300 hover:text-stone-500 touch-none px-0.5"><Grip size={16} /></button>
      {renaming ? (
        <input value={m.label} autoFocus onChange={(e) => patch({ label: e.target.value })} onBlur={() => setRenaming(false)} onKeyDown={(e) => { if (e.key === "Enter") setRenaming(false); }} className="flex-1 text-sm border border-amber-300 rounded px-1.5 py-0.5 bg-white outline-none" />
      ) : (
        <button onClick={() => setOpen((o) => !o)} className="flex-1 text-left text-sm text-stone-800 min-w-0 flex items-center gap-1.5"><Target size={12} className="text-amber-800 shrink-0" /><span className="truncate">{m.label}</span>{open ? <ChevronDown size={13} className="text-stone-400 shrink-0" /> : <ChevronRight size={13} className="text-stone-400 shrink-0" />}</button>
      )}
      {(m.accFauteuil || m.accCanne) ? <span className="text-[11px] shrink-0" title="Accessible mobilité réduite">{m.accFauteuil ? <Fauteuil size={13} /> : "🦯"}</span> : null}
      {armesList(m).length ? <span className="shrink-0 flex items-center gap-0.5" title={"Armes acceptées : " + armesLabel(armesList(m))}>{armesList(m).map((k) => <ArmeIcon key={k} k={k} size={13} color="#b45309" />)}</span> : null}
      {(m.photos && m.photos.length) ? <span className="text-[10px] text-stone-400 shrink-0">📷{m.photos.length}</span> : null}
      {inCommon ? <span className="text-[10px] shrink-0" title="Reçoit une consigne commune">🔗</span> : null}
      <button onClick={() => setRenaming((r) => !r)} title="Renommer" className="shrink-0 text-stone-400 hover:text-amber-700 p-0.5"><Pencil size={14} /></button>
      {armer
        ? <button onClick={() => { setArmer(false); del(); }} className="shrink-0 bg-red-700 text-white text-[11px] font-semibold rounded px-2 py-1">Supprimer ?</button>
        : <button onClick={() => setArmer(true)} title="Supprimer" className="shrink-0 text-stone-400 hover:text-red-700 p-0.5"><Trash2 size={14} /></button>}
    </div>
    {open && (<div className="border-t border-stone-100 px-2 py-2 space-y-2">
      <div><label className="text-[10px] uppercase tracking-wide text-stone-400">Priorité d'attribution</label>
        <div className="flex gap-1.5 mt-1">{[1, 2, 3, 4].map((n) => (<button key={n} onClick={() => patch({ priority: n })} className={`w-9 h-8 rounded text-sm font-bold border ${(m.priority || 1) === n ? "bg-emerald-800 text-stone-50 border-emerald-800" : "bg-white text-stone-600 border-stone-300"}`}>{n}</button>))}</div>
        <p className="text-[10px] text-stone-400 mt-1">1 = poste rempli en priorité quand il y a peu de chasseurs.</p></div>
      <div><label className="text-[10px] uppercase tracking-wide text-stone-400">🅿️ Dépose habituelle</label>
        {(track.deposes || []).length === 0 ? (
          <p className="text-[11px] text-stone-400 italic mt-1">Aucun point de dépose sur cette traque. Pose-en d'abord sur la carte du territoire.</p>
        ) : (<select value={(track.deposes || []).some((d) => d.id === m.deposeHab) ? m.deposeHab : ""} onChange={(e) => patch({ deposeHab: e.target.value })} className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1">
          <option value="">Non renseignée</option>
          {(track.deposes || []).map((d) => <option key={d.id} value={d.id}>{d.nom}</option>)}
        </select>)}
        {(() => {
          if (!sugg || m.deposeHab) return null;
          const cible = (track.deposes || []).find((d) => d.id === sugg.deposeId);
          if (!cible) return null;
          return (<div className="mt-1.5 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">
            <span className="text-[11px] text-amber-900 flex-1">Le plus souvent déposé à <b>{cible.nom}</b> ({sugg.n} journées).</span>
            <button onClick={() => patch({ deposeHab: sugg.deposeId })} className="text-[11px] font-medium bg-amber-700 text-amber-50 rounded px-2 py-1 shrink-0">Adopter</button>
          </div>);
        })()}
        <p className="text-[10px] text-stone-400 mt-1">Là où on dépose le chasseur posté ici. Sert au bouton « Proposer » de l'organisation des voitures.</p></div>
      <div><label className="text-[10px] uppercase tracking-wide text-stone-400">Accessibilité (mobilité réduite)</label>
        <div className="flex gap-2 mt-1">
          <button onClick={() => patch({ accFauteuil: !m.accFauteuil })} className={`flex-1 px-2 py-2 rounded-md text-xs font-medium border ${m.accFauteuil ? "bg-emerald-100 text-emerald-800 border-emerald-500" : "bg-white text-stone-500 border-stone-300"}`}>{m.accFauteuil ? "✓ " : ""}<Fauteuil size={13} /> Fauteuil</button>
          <button onClick={() => patch({ accCanne: !m.accCanne })} className={`flex-1 px-2 py-2 rounded-md text-xs font-medium border ${m.accCanne ? "bg-emerald-100 text-emerald-800 border-emerald-500" : "bg-white text-stone-500 border-stone-300"}`}>{m.accCanne ? "✓ " : ""}🦯 Canne</button>
        </div>
        <p className="text-[10px] text-stone-400 mt-1">Un poste fauteuil accepte aussi une canne. Visible par toi seulement (jamais côté chasseur).</p></div>
      <div><label className="text-[10px] uppercase tracking-wide text-stone-400">Armes acceptées sur ce poste</label>
        <div className="flex gap-1.5 mt-1 flex-wrap">
          {ARMES.map((a) => { const cur = armesList(m); const on = cur.indexOf(a.key) >= 0; return (<button key={a.key} onClick={() => patch({ armes: on ? cur.filter((k) => k !== a.key) : cur.concat([a.key]) })} className={`flex-1 min-w-[70px] px-2 py-2 rounded-md text-xs font-medium border flex items-center justify-center gap-1 ${on ? "bg-emerald-700 text-stone-50 border-emerald-700" : "bg-white text-stone-600 border-stone-300"}`}>{on ? "✓ " : ""}<ArmeIcon k={a.key} size={14} color={on ? "#fff" : "#166534"} />{a.label}</button>); })}
        </div>
        <p className="text-[10px] text-stone-400 mt-1">{armesList(m).length === 0 ? "Aucune cochée = toutes les armes acceptées." : "Accepté : " + armesLabel(armesList(m)) + (armesList(m).indexOf("lisse") >= 0 && armesList(m).indexOf("rayee") < 0 ? " (carabine tolérée en dernier recours)" : "")}</p></div>
      <div className="border-t border-stone-100 pt-2"><label className="text-[10px] uppercase tracking-wide text-stone-400">🎯 Zones de tir interdites (affichées au chasseur)</label>
        {image && <div className="mt-1"><TirPreview image={image} crop={crop} m={m} miradors={track.miradors} /></div>}
        <p className="text-[10px] text-stone-400 mt-1">Dessine les zones interdites (rouge). Le reste devient autorisé (vert) automatiquement, avec une marge de 30° hachurée de chaque côté.</p>
        {(m.tir.zones || []).map((z, zi) => (<div key={zi} className="bg-red-50 border border-red-200 rounded p-2 mt-1.5 space-y-1">
          <div className="flex items-center justify-between"><span className="text-xs font-semibold text-red-800">Zone interdite {zi + 1}</span><button onClick={() => patch({ tir: { zones: m.tir.zones.filter((_, k) => k !== zi) } })} className="text-stone-400 hover:text-red-700"><Trash2 size={13} /></button></div>
          <div className="flex items-center gap-2 text-xs text-stone-600"><span className="w-16">Direction</span><input type="range" min="0" max="359" value={z.dir} onChange={(e) => patch({ tir: { zones: m.tir.zones.map((zz, k) => k === zi ? { ...zz, dir: Number(e.target.value) } : zz) } })} className="flex-1" /><span className="w-9 text-right">{z.dir}°</span></div>
          <div className="flex items-center gap-2 text-xs text-stone-600"><span className="w-16">Angle</span><input type="range" min="10" max="360" value={z.width} onChange={(e) => patch({ tir: { zones: m.tir.zones.map((zz, k) => k === zi ? { ...zz, width: Number(e.target.value) } : zz) } })} className="flex-1" /><span className="w-9 text-right">{z.width}°</span></div>
        </div>))}
        <button onClick={() => patch({ tir: { zones: [...(m.tir.zones || []), { dir: 180, width: 60 }] } })} className="mt-1.5 text-xs font-medium text-red-800 border border-red-300 bg-white rounded px-2 py-1 flex items-center gap-1"><Plus size={13} /> Ajouter une zone interdite</button>
      </div>
      <div><label className="text-[10px] uppercase tracking-wide text-stone-400">Consignes du poste (envoyées au chasseur)</label>
        <textarea value={m.consignes || ""} onChange={(e) => patch({ consignes: e.target.value })} rows={2} placeholder="Ex. Ne pas tirer vers le chemin à droite. Voisin à 40 m." className="w-full border border-stone-300 rounded px-2 py-1 text-sm bg-white mt-1" />
</div>
      <div><label className="text-[10px] uppercase tracking-wide text-stone-400">Photos du poste</label>
        <div className="flex gap-2 flex-wrap mt-1">
          {(m.photos || []).map((ph, i) => (<div key={i} className="relative"><AnnotThumb src={ph} items={notesDe(i)} onClick={() => setAnnot(i)} /><button onClick={() => setAnnot(i)} title="Annoter" className="absolute -bottom-1.5 -left-1.5 bg-amber-500 text-stone-900 rounded-full w-5 h-5 text-[10px] flex items-center justify-center shadow">✏️</button><button onClick={() => rmPhoto(i)} className="absolute -top-1.5 -right-1.5 bg-red-700 text-white rounded-full p-0.5"><X size={11} /></button></div>))}
          <input ref={fileRef} type="file" accept="image/*" onChange={addPhoto} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={busy} className="w-16 h-16 rounded border-2 border-dashed border-stone-300 text-stone-400 flex items-center justify-center"><Plus size={18} /></button>
        </div>{busy && <p className="text-xs text-stone-400 mt-1">Préparation…</p>}
        {(m.photos || []).length > 0 && <p className="text-[10px] text-stone-400 mt-1">Touche une photo (ou ✏️) pour y placer le voisin, des notes et les angles de tir. Le chasseur la voit annotée.</p>}
        {annot !== null && (m.photos || [])[annot] && <PhotoAnnoteur src={m.photos[annot]} items={notesDe(annot)} voisins={voisins} poste={m.label} onSave={(items) => enregistrerNotes(annot, items)} onClose={() => setAnnot(null)} />}</div>
    </div>)}
  </div>);
}

function TrackEditor({ image, secteurs, track, updateTrack, consignesCommunes, setConsignesCommunes, suggDep }) {
  const [showCrop, setShowCrop] = useState(false); const crop = track.crop || DEFAULT_CROP;
  const [dragId, setDragId] = useState(null);
  const groups = consignesCommunes || [];
  const commonMids = new Set(); groups.forEach((g) => (g.miradorIds || []).forEach((id) => commonMids.add(id)));
  const reorder = (fromId, toId) => { if (fromId === toId) return; const arr = track.miradors.slice(); const fi = arr.findIndex((x) => x.id === fromId), ti = arr.findIndex((x) => x.id === toId); if (fi < 0 || ti < 0) return; const [mv] = arr.splice(fi, 1); arr.splice(ti, 0, mv); updateTrack({ miradors: arr }); };
  useEffect(() => { if (!dragId) return; const mv = (e) => { const el = document.elementFromPoint(e.clientX, e.clientY); const row = el && el.closest ? el.closest("[data-mid]") : null; if (row) { const over = row.getAttribute("data-mid"); if (over && over !== dragId) reorder(dragId, over); } }; const up = () => setDragId(null); window.addEventListener("pointermove", mv, { passive: false }); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up); return () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); }; }, [dragId, track.miradors]);
  const setGroups = setConsignesCommunes;
  const addGroup = () => setGroups && setGroups((prev) => [...(prev || []), { id: "cc-" + Date.now(), text: "", miradorIds: [] }]);
  const updGroup = (gid, patch) => setGroups && setGroups((prev) => (prev || []).map((g) => (g.id === gid ? { ...g, ...patch } : g)));
  const rmGroup = (gid) => setGroups && setGroups((prev) => (prev || []).filter((g) => g.id !== gid));
  const toggleMid = (gid, mid) => setGroups && setGroups((prev) => (prev || []).map((g) => (g.id === gid ? { ...g, miradorIds: (g.miradorIds || []).indexOf(mid) >= 0 ? (g.miradorIds || []).filter((x) => x !== mid) : [...(g.miradorIds || []), mid] } : g)));
  const allInTraque = (g) => track.miradors.length > 0 && track.miradors.every((m) => (g.miradorIds || []).indexOf(m.id) >= 0);
  const toggleAllTraque = (g) => { const on = allInTraque(g); const tids = track.miradors.map((m) => m.id); updGroup(g.id, { miradorIds: on ? (g.miradorIds || []).filter((id) => tids.indexOf(id) < 0) : Array.from(new Set([...(g.miradorIds || []), ...tids])) }); };
  if (!image) return <MapNotice>Importe d'abord la photo du territoire dans l'onglet « 🗺️ Cartes », puis reviens ici pour recadrer la traque.</MapNotice>;
  return (<div className="space-y-3">
    <div><label className="text-xs uppercase tracking-wide text-stone-400">Nom de la traque</label>
      <input value={track.name} onChange={(e) => updateTrack({ name: e.target.value })} placeholder="Ex. La Mare, Le Grand Layon…" className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1" /></div>
    {(secteurs || []).length > 1 && (<div><label className="text-xs uppercase tracking-wide text-stone-400">🗺️ Secteur</label>
      <select value={track.secteurId || (secteurs[0] || {}).id || ""} disabled={(track.miradors || []).length > 0}
        onChange={(e) => updateTrack({ secteurId: e.target.value, crop: { ...DEFAULT_CROP } })}
        className={`w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1 ${(track.miradors || []).length > 0 ? "opacity-50" : ""}`}>
        {secteurs.map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}
      </select>
      <p className="text-[10px] text-stone-400 mt-1">{(track.miradors || []).length > 0
        ? "Verrouillé : des postes sont déjà placés sur cette carte. Supprime-les pour changer de secteur."
        : "La carte sur laquelle cette traque est dessinée."}</p></div>)}
    {(() => {
      const hors = (track.miradors || []).filter((m) => !(m.gx >= -2 && m.gx <= 102 && m.gy >= -2 && m.gy <= 102));
      if (!hors.length) return null;
      return (<p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">
        ⚠️ {hors.length} poste(s) hors de la carte de ce secteur : {hors.map((m) => m.label || "?").join(", ")}. Ils ne sont pas perdus — élargis le morceau de ce secteur sur la vue d'ensemble (onglet Cartes) pour les faire réapparaître.
      </p>);
    })()}
    <div><label className="text-xs uppercase tracking-wide text-stone-400 block mb-1.5">Couleur des pastilles</label><ColorPicker value={track.color || "#dc2626"} onChange={(c) => updateTrack({ color: c })} /></div>
    <button onClick={() => setShowCrop((s) => !s)} className="flex items-center gap-2 bg-stone-700 hover:bg-stone-800 text-stone-50 text-sm font-medium px-3 py-2 rounded-md"><Crop size={15} /> {showCrop ? "Terminer le cadrage" : "Choisir le cadrage de la traque"}</button>
    {showCrop && (<div className="space-y-1.5"><p className="text-xs text-stone-500">Déplace le rectangle (au centre) et tire ses 4 coins pour délimiter la zone de cette traque.</p><CropBox image={image} crop={crop} setCrop={(c) => updateTrack({ crop: c })} /></div>)}
    <PlaceMiradors image={image} track={{ ...track, crop }} updateTrack={updateTrack} />
    {setGroups && (<div className="bg-stone-50 border border-stone-200 rounded-md p-2.5 space-y-2">
      <div className="flex items-center justify-between"><label className="text-[10px] uppercase tracking-wide text-stone-400">🔗 Consignes communes du territoire</label><button onClick={addGroup} className="text-xs font-medium text-emerald-800 flex items-center gap-1"><Plus size={13} /> Ajouter</button></div>
      {groups.length === 0 && <p className="text-[11px] text-stone-400 italic">Aucune consigne commune. « Ajouter » pour en créer (ex. une pour les postes 1-4, une autre pour les autres).</p>}
      {groups.map((g, gi) => (<div key={g.id} className="bg-white border border-stone-200 rounded-md p-2 space-y-1.5">
        <div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide">Consigne {gi + 1}</span><button onClick={() => rmGroup(g.id)} className="text-stone-400 hover:text-red-700"><Trash2 size={13} /></button></div>
        <textarea value={g.text || ""} onChange={(e) => updGroup(g.id, { text: e.target.value })} rows={2} placeholder="Ex. Gilet fluo obligatoire. Fin de battue : 3 sonneries." className="w-full border border-stone-300 rounded px-2 py-1 text-sm bg-white" />
        {track.miradors.length > 0 && (<div><div className="flex items-center justify-between mb-1"><span className="text-[10px] uppercase tracking-wide text-stone-400">Postes concernés (cette traque)</span><button onClick={() => toggleAllTraque(g)} className="text-xs font-medium text-emerald-800">{allInTraque(g) ? "Tout retirer" : "Tout cocher"}</button></div>
          <div className="flex flex-wrap gap-1.5">{track.miradors.map((m) => { const on = (g.miradorIds || []).indexOf(m.id) >= 0; return (<button key={m.id} onClick={() => toggleMid(g.id, m.id)} className={`text-xs px-2 py-1 rounded-full border ${on ? "bg-emerald-700 text-white border-emerald-700" : "bg-white text-stone-600 border-stone-300"}`}>{on ? "✓ " : ""}{m.label}</button>); })}</div></div>)}
      </div>))}
      {groups.length > 0 && <p className="text-[10px] text-stone-400">Chaque poste affichera sa consigne propre + toutes les consignes communes qui le concernent.</p>}</div>)}
    {(() => { const seen = {}; const dups = []; track.miradors.forEach((m) => { const k = (m.label || "").trim().toLowerCase(); if (!k) return; seen[k] = (seen[k] || 0) + 1; if (seen[k] === 2) dups.push((m.label || "").trim()); }); return dups.length ? (<div className="bg-red-50 border border-red-300 rounded-md p-2.5 text-sm text-red-800">⚠️ Attention : plusieurs postes portent le même nom sur cette traque ({dups.join(", ")}). Renomme-les distinctement (✏️) — sinon impossible de les distinguer (photos/consignes pourraient sembler manquantes).</div>) : null; })()}
    {track.miradors.length > 0 && (<div><p className="text-xs uppercase tracking-wide text-stone-400 mb-1.5">Miradors ({track.miradors.length}) — glisse ≡ pour réordonner · clic sur le nom = fiche</p>
      <div className="space-y-1">{track.miradors.map((m) => (<MiradorRow key={m.id} m={m} track={track} updateTrack={updateTrack} onDragStart={setDragId} isDragging={dragId === m.id} sugg={(suggDep || {})[m.id]} inCommon={commonMids.has(m.id)} image={image} crop={crop} />))}</div></div>)}
  </div>);
}

const IGN_WMTS = "https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}";
// Recupere une portion de carte IGN pour des bornes donnees (coordonnees projetees EPSG:3857).
function loadWms(layer, fmt, sw, ne, W, H) {
  return new Promise((resolve, reject) => {
    const url = "https://data.geopf.fr/wms-r/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=" + layer + "&STYLES=&CRS=EPSG:3857&BBOX=" + sw.x + "," + sw.y + "," + ne.x + "," + ne.y + "&WIDTH=" + W + "&HEIGHT=" + H + "&FORMAT=" + fmt + "&TRANSPARENT=true";
    const img = new Image(); img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Téléchargement de la carte impossible."));
    img.src = url;
  });
}
// Compose une image a partir des fonds IGN demandes, pour la zone donnee.
async function composeIgn(sw, ne, op, largeur) {
  const ratio = (ne.y - sw.y) / (ne.x - sw.x);
  const W = largeur || 1600, H = Math.max(400, Math.min(2000, Math.round(W * ratio)));
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
  for (let fi = 0; fi < IGN_FONDS.length; fi++) {
    const f = IGN_FONDS[fi]; const a = (op[f.key] || 0) / 100; if (a <= 0) continue;
    try { const im = await loadWms(f.wms, fi === 0 ? f.fmt : "image/png", sw, ne, W, H); ctx.globalAlpha = a; ctx.drawImage(im, 0, 0, W, H); ctx.globalAlpha = 1; }
    catch (e) { if (fi === 0) throw e; }
  }
  return cv.toDataURL("image/jpeg", 0.85);
}
const IGN_FONDS = [
  { key: "ortho", label: "🛰️ Satellite", wmts: "HR.ORTHOIMAGERY.ORTHOPHOTOS", wms: "ORTHOIMAGERY.ORTHOPHOTOS", fmt: "image/jpeg" },
  { key: "plan", label: "🗺️ Plan IGN", wmts: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2", wms: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2", fmt: "image/png" }
];
function IgnMapPicker({ onCapture, onCancel }) {
  const mapRef = useRef(null); const divRef = useRef(null); const layersRef = useRef({});
  const [op, setOp] = useState({ ortho: 100, plan: 0 });
  const [q, setQ] = useState(""); const [res, setRes] = useState([]); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const ORTHO = IGN_FONDS[0], PLAN = IGN_FONDS[1];
  useEffect(() => {
    if (typeof L === "undefined" || !divRef.current) { setErr("La carte n'a pas pu se charger (connexion ?)."); return; }
    const map = L.map(divRef.current, { zoomControl: true }).setView([46.6, 2.5], 6);
    mapRef.current = map;
    IGN_FONDS.forEach((f, i) => { const ly = f.wmts ? L.tileLayer(IGN_WMTS + "&LAYER=" + f.wmts + "&FORMAT=" + f.fmt, { maxZoom: 19, opacity: i === 0 ? 1 : 0, attribution: i === 0 ? "© IGN" : undefined }) : L.tileLayer.wms("https://data.geopf.fr/wms-r/wms", { layers: f.wms, format: f.fmt, transparent: true, version: "1.3.0", maxZoom: 19, opacity: 0 }); ly.addTo(map); layersRef.current[f.key] = ly; });
    let nOk = 0;
    layersRef.current.ortho.on("tileload", () => { nOk++; setErr(""); });
    layersRef.current.ortho.on("tileerror", () => { if (nOk === 0) setErr("Les images IGN ne se chargent pas (connexion ?)."); });
    [60, 250, 700, 1500].forEach((d) => setTimeout(() => { try { map.invalidateSize(); } catch (e) {} }, d));
    return () => { try { map.remove(); } catch (e) {} };
  }, []);
  useEffect(() => { IGN_FONDS.forEach((f) => { const ly = layersRef.current[f.key]; if (ly) ly.setOpacity((op[f.key] || 0) / 100); }); }, [op]);
  const skipRef = useRef(false);
  const search = async (text) => {
    const t = (text != null ? text : q).trim();
    if (!t) { setRes([]); return; }
    setErr("");
    try {
      const r = await fetch("https://data.geopf.fr/geocodage/completion?text=" + encodeURIComponent(t) + "&type=PositionOfInterest,StreetAddress&maximumResponses=8");
      const j = await r.json();
      let list = (j.results || []).map((it) => ({ label: it.fulltext || it.city || "", lon: it.x, lat: it.y })).filter((x) => x.label && isFinite(x.lat) && isFinite(x.lon));
      if (!list.length) {
        const r2 = await fetch("https://data.geopf.fr/geocodage/search?q=" + encodeURIComponent(t) + "&limit=8");
        const j2 = await r2.json();
        list = (j2.features || []).map((ft) => ({ label: ft.properties.label, lon: ft.geometry.coordinates[0], lat: ft.geometry.coordinates[1] }));
      }
      setRes(list);
    } catch (e) { setRes([]); }
  };
  useEffect(() => {
    if (skipRef.current) { skipRef.current = false; return; }
    const t = q.trim();
    if (t.length < 3) { setRes([]); return; }
    const id = setTimeout(() => search(t), 300);
    return () => clearTimeout(id);
  }, [q]);
  const goTo = (r) => { const map = mapRef.current; if (map) map.setView([r.lat, r.lon], 15); setRes([]); skipRef.current = true; setQ(r.label); };
  const capture = async () => {
    const map = mapRef.current; if (!map) return;
    setBusy(true); setErr("");
    try {
      const b = map.getBounds(); const sw = L.CRS.EPSG3857.project(b.getSouthWest()); const ne = L.CRS.EPSG3857.project(b.getNorthEast());
      const data = await composeIgn(sw, ne, op);
      // On retient les bornes : elles permettront de redecouper la carte secteur par secteur.
      onCapture(data, { x1: sw.x, y1: sw.y, x2: ne.x, y2: ne.y, op: { ...op } });
    } catch (e) { setErr("Capture impossible : " + (e.message || e) + " Réessaie ou importe une image."); } finally { setBusy(false); }
  };
  const [panel, setPanel] = useState(false);
  return (<div className="fixed inset-0 z-50 bg-white flex flex-col">
    <div className="shrink-0 p-2 border-b border-stone-200 space-y-2" style={{ paddingTop: "max(8px, env(safe-area-inset-top))" }}>
      <div className="flex gap-2 items-center">
        <button onClick={onCancel} aria-label="Retour" className="shrink-0 flex items-center gap-1 text-sm font-medium text-stone-700"><ArrowLeft size={18} /> Retour</button>
        <span className="text-sm font-semibold text-stone-800 flex-1 text-right">Choisir la zone</span>
      </div>
      <div className="flex gap-1.5 border border-stone-300 rounded-lg px-3 py-2 items-center bg-white">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }} placeholder="Commune, lieu-dit…" autoComplete="off" autoCorrect="off" className="flex-1 min-w-0 bg-transparent outline-none" style={{ fontSize: 16 }} />
        {q && <button onClick={() => { setQ(""); setRes([]); }} aria-label="Effacer" className="shrink-0 w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center"><X size={15} /></button>}
      </div>
      {res.length > 0 && <div className="border border-stone-200 rounded-lg divide-y max-h-44 overflow-y-auto">{res.map((r, i) => <button key={i} onClick={() => goTo(r)} className="w-full text-left px-3 py-2.5 text-sm">{r.label}</button>)}</div>}
    </div>

    <div ref={divRef} className="flex-1 min-h-0" style={{ minHeight: 220, background: "#e7e5e4" }} />

    <div className="shrink-0 border-t border-stone-200 p-2 space-y-2" style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
      {err && <p className="text-xs text-white bg-red-700 rounded-lg px-3 py-2">{err}</p>}
      <button onClick={() => setPanel(!panel)} className="w-full flex items-center justify-between text-sm font-semibold text-stone-800">
        <span>{IGN_FONDS.filter((f) => (op[f.key] || 0) > 0).map((f) => f.label + " " + op[f.key] + "%").join(" + ") || "Aucun fond"}</span>
        <span className="text-xs font-normal text-stone-500">{panel ? "Masquer ▾" : "Réglage des fonds ▴"}</span>
      </button>
      {panel && (<div className="space-y-1.5">
        {IGN_FONDS.map((f) => (<div key={f.key}>
          <div className="flex justify-between text-[11px]"><span className="font-medium text-stone-700">{f.label}</span><span className="font-bold text-emerald-800">{op[f.key] || 0}%</span></div>
          <input type="range" min="0" max="100" step="5" value={op[f.key] || 0} onChange={(e) => setOp({ ...op, [f.key]: Number(e.target.value) })} className="w-full" style={{ height: 30 }} />
        </div>))}
        <div className="flex gap-1.5 pt-1">
          {[["🛰️ Satellite", { ortho: 100, plan: 0 }], ["Sat + Plan", { ortho: 100, plan: 55 }], ["🗺️ Plan IGN", { ortho: 0, plan: 100 }]].map(([lbl, v]) => <button key={lbl} onClick={() => setOp(v)} className="flex-1 text-[11px] font-medium px-1.5 py-2 rounded-lg border bg-white text-stone-600 border-stone-300">{lbl}</button>)}
        </div>
      </div>)}
      <button onClick={capture} disabled={busy} className="w-full bg-emerald-800 disabled:bg-stone-400 text-white font-bold px-3 py-3 rounded-lg text-base">{busy ? "Capture…" : "📸 Utiliser cette vue"}</button>
    </div>
  </div>);
}

function PlanImagePicker({ image, onChange, geo }) {
  const fileRef = useRef(null); const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [ign, setIgn] = useState(false);
  const [cropMode, setCropMode] = useState(false); const [crop, setCrop] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const applyCrop = async () => {
    if (!image) return; setBusy(true); setErr("");
    try {
      const im = await new Promise((res, rej) => { const i2 = new Image(); i2.onload = () => res(i2); i2.onerror = () => rej(new Error("Image illisible.")); i2.src = image; });
      const sx = Math.round(im.naturalWidth * crop.x / 100), sy = Math.round(im.naturalHeight * crop.y / 100);
      const sw = Math.max(1, Math.round(im.naturalWidth * crop.w / 100)), sh = Math.max(1, Math.round(im.naturalHeight * crop.h / 100));
      const cv = document.createElement("canvas"); cv.width = sw; cv.height = sh;
      cv.getContext("2d").drawImage(im, sx, sy, sw, sh, 0, 0, sw, sh);
      // L'image rognee garde sa position sur le terrain : on recalcule les bornes
      // de la portion conservee au lieu de les perdre.
      let g2 = null;
      if (geo && isFinite(geo.x1)) {
        const LX = geo.x2 - geo.x1, LY = geo.y2 - geo.y1;
        g2 = { ...geo,
          x1: geo.x1 + (crop.x / 100) * LX, x2: geo.x1 + ((crop.x + crop.w) / 100) * LX,
          y2: geo.y2 - (crop.y / 100) * LY, y1: geo.y2 - ((crop.y + crop.h) / 100) * LY };
      }
      onChange(cv.toDataURL("image/jpeg", 0.85), g2);
      setCrop({ x: 0, y: 0, w: 100, h: 100 }); setCropMode(false);
    } catch (e) { setErr(e.message || String(e)); } finally { setBusy(false); }
  };
  const onFile = async (e) => { const file = e.target.files?.[0]; if (!file) return; setBusy(true); setErr(""); try { onChange(await downscaleImage(file)); } catch (ex) { setErr(ex.message); } finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; } };
  if (ign) return <IgnMapPicker onCancel={() => setIgn(false)} onCapture={(d, geo) => { onChange(d, geo); setIgn(false); }} />;
  return (<div className="space-y-2"><input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
    <div className="flex gap-2 items-center flex-wrap"><button onClick={() => setIgn(true)} className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-stone-50 text-sm font-medium px-3 py-2 rounded-md"><MapPin size={16} /> Choisir sur la carte IGN</button><button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 bg-stone-700 hover:bg-stone-800 text-stone-50 text-sm font-medium px-3 py-2 rounded-md"><Upload size={16} /> {image ? "Changer la photo" : "Importer une image"}</button>{image && <button onClick={() => { setCrop({ x: 0, y: 0, w: 100, h: 100 }); setCropMode(true); }} className="flex items-center gap-2 bg-stone-100 border border-stone-300 text-stone-700 text-sm font-medium px-3 py-2 rounded-md"><Crop size={16} /> Rogner</button>}{image && <button onClick={() => onChange(null)} className="text-sm text-red-700">Retirer</button>}</div>
    {busy && <p className="text-sm text-stone-500">Préparation…</p>}{err && <p className="text-sm text-red-700">{err}</p>}
    {cropMode && image ? (<div className="space-y-2">
      <p className="text-xs text-stone-500">Déplace le rectangle et tire ses coins pour garder la zone utile. Le reste sera supprimé définitivement.</p>
      <CropBox image={image} crop={crop} setCrop={setCrop} />
      <div className="flex gap-2">
        <button onClick={() => setCropMode(false)} className="flex-1 bg-stone-100 border border-stone-300 text-stone-700 text-sm font-medium px-3 py-2 rounded-md">Annuler</button>
        <button onClick={applyCrop} disabled={busy} className="flex-1 bg-emerald-800 disabled:bg-stone-400 text-white text-sm font-semibold px-3 py-2 rounded-md">{busy ? "…" : "✓ Rogner"}</button>
      </div>
    </div>) : image ? <img src={image} alt="" className="w-full rounded-md border border-stone-300" /> : <MapNotice>Importe une seule photo (capture satellite d'ensemble). Chaque traque en sera un recadrage.</MapNotice>}</div>);
}

function PlanChasseEditor({ planChasse, setPlanChasse, journees, tid }) {
  const curSeason = seasonOf(new Date().toISOString());
  const [openFam, setOpenFam] = useState(null);
  const kills = {};
  (journees || []).filter((j) => j.terrainId === tid && seasonOf(j.date) === curSeason).forEach((j) => (j.tableau || []).forEach((k) => { kills[k.espece] = (kills[k.espece] || 0) + (Number(k.quantite) || 0); }));
  const chevCap = (planChasse.chevreuil && planChasse.chevreuil.enabled && planChasse.chevreuil.target) || 0;
  const setCfg = (key, patch) => setPlanChasse({ ...planChasse, [key]: { ...planChasse[key], ...patch } });
  const capOf = (cfg) => (cfg.mode === "proportionnel") ? chevCap : (cfg.target || 0);
  const isOn = (k) => !!(planChasse[k] && planChasse[k].enabled);
  const nbOn = (fam) => fam.sous.filter(isOn).length;
  const setFamille = (fam, on) => { const next = { ...planChasse }; fam.sous.forEach((k) => { next[k] = { ...(next[k] || { mode: "proportionnel", target: 0 }), enabled: on }; }); setPlanChasse(next); };

  const especeBlock = (k, compact) => {
    const e = especeOf(k);
    const cfg = planChasse[k] || { enabled: false, mode: "proportionnel", target: 0 };
    const tue = kills[k] || 0; const cap = capOf(cfg);
    const pct = cap > 0 ? Math.min(100, Math.round((tue / cap) * 100)) : (tue > 0 ? 100 : 0);
    const over = cap > 0 && tue >= cap;
    return (<div key={k} className={compact ? "border-t border-stone-100 pt-2 mt-2" : ""}>
      <button onClick={() => setCfg(k, { enabled: !cfg.enabled })} className="flex items-center gap-2 text-sm font-medium text-stone-800"><span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${cfg.enabled ? "bg-emerald-700 border-emerald-700 text-white" : "border-stone-300"}`}>{cfg.enabled ? "✓" : ""}</span>{compact ? e.label : (e.emoji + " " + e.label)}</button>
      {cfg.enabled && (<div className="mt-2 space-y-2 pl-6">
        <div className="flex gap-1.5">{[["bracelets", "Bracelets"], ["objectif", "Objectif"], ["proportionnel", "Proportionnel"]].map(([m, lbl]) => (<button key={m} onClick={() => setCfg(k, { mode: m })} className={`flex-1 px-2 py-1 rounded text-[11px] font-medium border ${cfg.mode === m ? "bg-emerald-800 text-stone-50 border-emerald-800" : "bg-stone-100 text-stone-600 border-stone-200"}`}>{lbl}</button>))}</div>
        {cfg.mode !== "proportionnel" ? (<div className="flex items-center gap-2 text-sm"><label className="text-xs text-stone-500">{cfg.mode === "bracelets" ? "Bracelets attribués" : "Objectif"} :</label><input type="number" inputMode="numeric" value={cfg.target || 0} onChange={(ev) => setCfg(k, { target: Math.max(0, parseInt(ev.target.value || "0", 10) || 0) })} onFocus={(ev) => ev.target.select()} className="w-20 border border-stone-300 rounded px-2 py-1 bg-white" /></div>)
          : <p className="text-[11px] text-stone-400">Mesuré sur l'échelle du chevreuil (plafond {chevCap || "à définir"}).</p>}
        <div><div className="flex justify-between text-[11px] mb-0.5"><span className="text-stone-500">Prélevés cette saison</span><span className={over ? "text-red-700 font-semibold" : "text-stone-700 font-semibold"}>{tue}{cap > 0 ? " / " + cap : ""}</span></div><div className="h-2.5 rounded-full bg-stone-200 overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: pct + "%", background: over ? "#b91c1c" : "#166534" }} /></div></div>
      </div>)}
    </div>);
  };

  const groupes = ["Grand gibier", "Petit gibier", "Gibier d'eau"];
  return (<div className="space-y-3">
    <p className="text-xs text-stone-500">Active les espèces présentes sur ce territoire : elles apparaîtront dans le tableau, les prélèvements des chasseurs et les stats. Les jauges cumulent la saison {curSeason}.</p>
    {groupes.map((g) => (<div key={g}>
      <p className="text-[11px] uppercase tracking-wide text-stone-400 font-semibold mb-1.5">{g}</p>
      <div className="grid grid-cols-2 gap-2">
        {FAMILLES.filter((f) => f.groupe === g).map((fam) => {
          const single = fam.sous.length === 1;
          const on = nbOn(fam) > 0;
          const open = openFam === fam.key;
          if (single) {
            const k = fam.sous[0];
            const cfg = planChasse[k] || { enabled: false };
            return (<button key={fam.key} onClick={() => setCfg(k, { enabled: !cfg.enabled })} className={`text-left rounded-lg p-2.5 border flex items-center gap-2 ${cfg.enabled ? "bg-white border-emerald-500" : "bg-stone-50 border-stone-200"}`}>
              <span className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center text-[10px] ${cfg.enabled ? "bg-emerald-700 border-emerald-700 text-white" : "border-stone-300"}`}>{cfg.enabled ? "✓" : ""}</span>
              <span className="text-sm font-medium text-stone-800 leading-tight">{fam.emoji} {fam.label}</span>
            </button>);
          }
          const allOn = nbOn(fam) === fam.sous.length;
          return (<React.Fragment key={fam.key}>
            <button onClick={() => { if (allOn) { setFamille(fam, false); setOpenFam(null); } else { setFamille(fam, true); setOpenFam(fam.key); } }} className={`text-left rounded-lg p-2.5 border flex items-center gap-2 ${on ? "bg-white border-emerald-500" : "bg-stone-50 border-stone-200"}`}>
              <span className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center text-[10px] ${on ? "bg-emerald-700 border-emerald-700 text-white" : "border-stone-300"}`}>{allOn ? "✓" : on ? "–" : ""}</span>
              <span className="text-sm font-medium text-stone-800 leading-tight flex-1">{fam.emoji} {fam.label}{on ? <span className="text-[10px] text-emerald-700 font-normal"> · {nbOn(fam)}</span> : null}</span>
              {open ? <ChevronDown size={14} className="text-stone-400 shrink-0" /> : <ChevronRight size={14} className="text-stone-400 shrink-0" />}
            </button>
            {open && (<div className="col-span-2 border border-emerald-300 bg-white rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-1"><p className="text-xs font-semibold text-emerald-800">{fam.emoji} {fam.label} — choisis les espèces présentes</p><button onClick={() => setOpenFam(null)} className="text-stone-400 hover:text-stone-600"><X size={14} /></button></div>
              {fam.sous.map((k) => especeBlock(k, true))}
            </div>)}
          </React.Fragment>);
        })}
      </div>
    </div>))}
    {FAMILLES.filter((f) => f.sous.length === 1 && isOn(f.sous[0])).length > 0 && (<div className="border-t border-stone-200 pt-2">
      <p className="text-[11px] uppercase tracking-wide text-stone-400 font-semibold mb-1.5">Réglages des espèces activées</p>
      <div className="space-y-2">{FAMILLES.filter((f) => f.sous.length === 1 && isOn(f.sous[0])).map((f) => (<div key={f.key} className="border border-stone-200 rounded-lg p-2.5 bg-white">{especeBlock(f.sous[0], false)}</div>))}</div>
    </div>)}
  </div>);
}
