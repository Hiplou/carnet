async function dessinerZone(root, scale, zone) {
  const doc = root.ownerDocument, win = doc.defaultView;
  const base = root.getBoundingClientRect();
  const Z = zone || { x: base.left, y: base.top, w: base.width, h: base.height };
  const cv = document.createElement("canvas");
  cv.width = Math.max(1, Math.round(Z.w * scale)); cv.height = Math.max(1, Math.round(Z.h * scale));
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.scale(scale, scale); ctx.translate(-Z.x, -Z.y);
  const px = (v) => parseFloat(v) || 0;
  const inter = (a, b) => { if (!a) return b; const x = Math.max(a.x, b.x), y = Math.max(a.y, b.y); return { x, y, w: Math.max(0, Math.min(a.x + a.w, b.x + b.w) - x), h: Math.max(0, Math.min(a.y + a.h, b.y + b.h) - y) }; };
  const clipper = (c) => { if (c) { ctx.beginPath(); ctx.rect(c.x, c.y, c.w, c.h); ctx.clip(); } };
  const rr = (x, y, w, h, r) => { ctx.beginPath(); r = Math.max(0, Math.min(r, w / 2, h / 2)); if (r && ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };
  const rayon = (cs, r) => { const v = cs.borderTopLeftRadius || "0"; return v.indexOf("%") > 0 ? parseFloat(v) / 100 * Math.min(r.width, r.height) : px(v); };
  const visible = (c) => (c.a === undefined || c.a > 0) && c !== "transparent" && c !== "rgba(0, 0, 0, 0)";
  const boite = (el, cs, r, clip, alpha) => {
    if (r.width <= 0 || r.height <= 0) return;
    ctx.save(); clipper(clip); ctx.globalAlpha = alpha;
    const rad = rayon(cs, r);
    if (cs.boxShadow && cs.boxShadow !== "none") {
      const m = cs.boxShadow.match(/(rgba?\([^)]*\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px(?:\s+(-?[\d.]+)px)?/);
      if (m) { const sp = px(m[5]); ctx.fillStyle = m[1]; rr(r.left - sp + px(m[2]), r.top - sp + px(m[3]), r.width + 2 * sp, r.height + 2 * sp, rad + sp); ctx.fill(); }
    }
    if (visible(cs.backgroundColor)) { ctx.fillStyle = cs.backgroundColor; rr(r.left, r.top, r.width, r.height, rad); ctx.fill(); }
    const cotes = [["Top", r.left, r.top, r.width, 0], ["Right", r.right, r.top, 0, r.height], ["Bottom", r.left, r.bottom, r.width, 0], ["Left", r.left, r.top, 0, r.height]];
    const w0 = px(cs.borderTopWidth), uni = rad > 0 && ["Right", "Bottom", "Left"].every((s) => px(cs["border" + s + "Width"]) === w0 && cs["border" + s + "Color"] === cs.borderTopColor && cs["border" + s + "Style"] === cs.borderTopStyle);
    if (uni && w0 > 0 && cs.borderTopStyle !== "none") { ctx.strokeStyle = cs.borderTopColor; ctx.lineWidth = w0; rr(r.left + w0 / 2, r.top + w0 / 2, r.width - w0, r.height - w0, rad - w0 / 2); ctx.stroke(); }
    else cotes.forEach(([s, x, y, w, h]) => {
      const bw = px(cs["border" + s + "Width"]), st = cs["border" + s + "Style"];
      if (!bw || st === "none" || st === "hidden" || !visible(cs["border" + s + "Color"])) return;
      ctx.strokeStyle = cs["border" + s + "Color"]; ctx.lineWidth = bw; ctx.setLineDash(st === "dashed" ? [bw * 3, bw * 2] : st === "dotted" ? [bw, bw] : []);
      ctx.beginPath();
      if (s === "Top") { ctx.moveTo(x, y + bw / 2); ctx.lineTo(x + w, y + bw / 2); }
      else if (s === "Bottom") { ctx.moveTo(x, y - bw / 2); ctx.lineTo(x + w, y - bw / 2); }
      else if (s === "Left") { ctx.moveTo(x + bw / 2, y); ctx.lineTo(x + bw / 2, y + h); }
      else { ctx.moveTo(x - bw / 2, y); ctx.lineTo(x - bw / 2, y + h); }
      ctx.stroke();
    });
    ctx.restore();
  };
  const texte = (node, cs, clip, alpha) => {
    const t = node.nodeValue || ""; if (!t.trim()) return;
    ctx.save(); clipper(clip); ctx.globalAlpha = alpha;
    ctx.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
    ctx.fillStyle = cs.color; ctx.textBaseline = "alphabetic";
    const maj = cs.textTransform === "uppercase";
    const range = doc.createRange();
    const ecrire = (s, rc) => {
      if (rc.width <= 0 || rc.height <= 0) return;
      const mot = maj ? s.toUpperCase() : s;
      const m = ctx.measureText(mot);
      const asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent;
      const y = (asc !== undefined && desc !== undefined) ? rc.top + (rc.height - (asc + desc)) / 2 + asc : rc.top + rc.height * 0.78;
      ctx.fillText(mot, rc.left, y);
    };
    const re = /\S+/g; let m;
    while ((m = re.exec(t))) {
      range.setStart(node, m.index); range.setEnd(node, m.index + m[0].length);
      const rects = range.getClientRects();
      if (rects.length === 1) ecrire(m[0], rects[0]);
      else if (rects.length > 1) {
        // mot coupe sur deux lignes : lettre par lettre
        for (let k = 0; k < m[0].length; k++) { range.setStart(node, m.index + k); range.setEnd(node, m.index + k + 1); const rc = range.getClientRects()[0]; if (rc) ecrire(m[0][k], rc); }
      }
    }
    ctx.restore();
  };
  const parcours = (el, clip, alpha) => {
    const cs = win.getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return;
    const a = alpha * (parseFloat(cs.opacity) || (cs.opacity === "0" ? 0 : 1));
    if (a <= 0) return;
    const r = el.getBoundingClientRect();
    boite(el, cs, r, clip, a);
    if (el.tagName === "IMG" && el.complete && el.naturalWidth) {
      const bl = px(cs.borderLeftWidth) + px(cs.paddingLeft), bt = px(cs.borderTopWidth) + px(cs.paddingTop);
      const w = r.width - bl - px(cs.borderRightWidth) - px(cs.paddingRight), h = r.height - bt - px(cs.borderBottomWidth) - px(cs.paddingBottom);
      ctx.save(); clipper(clip); ctx.globalAlpha = a; const rad = rayon(cs, r); if (rad) { rr(r.left + bl, r.top + bt, w, h, rad); ctx.clip(); }
      try { ctx.drawImage(el, r.left + bl, r.top + bt, w, h); } catch (e) {}
      ctx.restore();
    }
    const deborde = cs.overflowX !== "visible" || cs.overflowY !== "visible";
    const c2 = deborde ? inter(clip, { x: r.left, y: r.top, w: r.width, h: r.height }) : clip;
    for (let n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 1) parcours(n, c2, a);
      else if (n.nodeType === 3) texte(n, cs, c2, a);
    }
  };
  parcours(root, Z, 1);
  return cv;
}
// Largeurs Helvetica (1/1000 de la taille) pour centrer ou caler a droite ; accents = lettre de base.
const LARG_HELV = "278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584".split(",").map(Number);
function largeurHelv(t, sz) { return Array.from(String(t)).reduce((s, ch) => { const c = ch.charCodeAt(0); const b = c === 183 ? 46 : ch.normalize("NFD")[0].charCodeAt(0); return s + (b >= 32 && b <= 126 ? LARG_HELV[b - 32] : 556); }, 0) * sz / 1000; }
function pdfDepuisImages(pages) {
  // PDF minimal : des images JPEG posees sur des pages, des textes en Helvetica (police standard
  // des PDF, rien a integrer) et des traits. Aucune bibliotheque externe.
  // Une page : { pw, ph, imgs:[{jpeg,w,h,x,y,dw,dh}], textes:[{t,sz,cx|xd,y}], lignes:[{x1,y1,x2,y2}], inv }
  const enc = new TextEncoder(); const parts = []; let len = 0; const off = [];
  const put = (d) => { const b = typeof d === "string" ? enc.encode(d) : d; parts.push(b); len += b.length; };
  // Texte en WinAnsi (les accents francais y sont), parentheses echappees.
  const pdfTxt = (t) => Array.from(String(t)).map((ch) => { const c = ch.charCodeAt(0); const v = c < 256 ? ch : ch === "’" ? "'" : ch.normalize("NFD")[0]; return v === "(" || v === ")" || v === "\\" ? "\\" + v : v; }).join("");
  const enLatin1 = (str) => { const a = new Uint8Array(str.length); for (let k = 0; k < str.length; k++) { const c = str.charCodeAt(k); a[k] = c < 256 ? c : 63; } return a; };
  // numerotation des objets : 1 catalogue, 2 pages, 3 police, puis page / contenu / images
  let num = 4; const plan = pages.map((p) => { const po = num++, co = num++; const ios = p.imgs.map(() => num++); return { po, co, ios }; });
  const total = num;
  put("%PDF-1.4\n");
  off[1] = len; put("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  off[2] = len; put("2 0 obj\n<< /Type /Pages /Kids [" + plan.map((q) => q.po + " 0 R").join(" ") + "] /Count " + pages.length + " >>\nendobj\n");
  off[3] = len; put("3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n");
  pages.forEach((p, i) => {
    const { po, co, ios } = plan[i];
    let flux = p.imgs.map((im, k) => "q " + im.dw.toFixed(2) + " 0 0 " + im.dh.toFixed(2) + " " + im.x.toFixed(2) + " " + im.y.toFixed(2) + " cm /Im" + k + " Do Q").join(" ");
    flux += (p.lignes || []).map((l) => " q 0.66 0.64 0.62 RG 0.6 w [3 2.5] 0 d " + l.x1.toFixed(2) + " " + l.y1.toFixed(2) + " m " + l.x2.toFixed(2) + " " + l.y2.toFixed(2) + " l S Q").join("");
    // Sur un verso retourne, les textes tournent avec la page (miroir du point d'ancrage).
    flux += (p.textes || []).map((o) => {
      const w = largeurHelv(o.t, o.sz), x0 = o.cx !== undefined ? o.cx - w / 2 : o.xd - w;
      const m = p.inv ? "-1 0 0 -1 " + (p.pw - x0).toFixed(2) + " " + (p.ph - o.y).toFixed(2) : "1 0 0 1 " + x0.toFixed(2) + " " + o.y.toFixed(2);
      return " BT /F1 " + o.sz.toFixed(2) + " Tf 0.6 0.58 0.56 rg " + m + " Tm (" + pdfTxt(o.t) + ") Tj ET";
    }).join("");
    off[po] = len; put(po + " 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + p.pw.toFixed(2) + " " + p.ph.toFixed(2) + "] /Resources << /XObject << " + ios.map((o, k) => "/Im" + k + " " + o + " 0 R").join(" ") + " >> /Font << /F1 3 0 R >> >> /Contents " + co + " 0 R >>\nendobj\n");
    const fluxB = enLatin1(flux);
    off[co] = len; put(co + " 0 obj\n<< /Length " + fluxB.length + " >>\nstream\n"); put(fluxB); put("\nendstream\nendobj\n");
    p.imgs.forEach((im, k) => {
      off[ios[k]] = len; put(ios[k] + " 0 obj\n<< /Type /XObject /Subtype /Image /Width " + im.w + " /Height " + im.h + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + im.jpeg.length + " >>\nstream\n");
      put(im.jpeg); put("\nendstream\nendobj\n");
    });
  });
  const xref = len;
  let x = "xref\n0 " + total + "\n0000000000 65535 f \n";
  for (let k = 1; k < total; k++) x += String(off[k]).padStart(10, "0") + " 00000 n \n";
  put(x + "trailer\n<< /Size " + total + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n");
  return new Blob(parts, { type: "application/pdf" });
}
function jpegOctets(cv, q) { const b64 = cv.toDataURL("image/jpeg", q).split(",")[1]; const bin = atob(b64); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a; }
function tourner180(cv0) { const cv = document.createElement("canvas"); cv.width = cv0.width; cv.height = cv0.height; const c = cv.getContext("2d"); c.translate(cv.width, cv.height); c.rotate(Math.PI); c.drawImage(cv0, 0, 0); return cv; }
// Fabrique le PDF d'un document imprimable (le meme HTML que l'apercu).
async function fabriquerPdf(html, onAvance) {
  const ifr = document.createElement("iframe");
  ifr.setAttribute("aria-hidden", "true");
  ifr.style.cssText = "position:fixed;left:-30000px;top:0;width:1200px;height:900px;border:0;visibility:hidden";
  document.body.appendChild(ifr);
  try {
    await new Promise((res) => { ifr.onload = res; ifr.srcdoc = html; });
    const doc = ifr.contentDocument;
    await Promise.all(Array.from(doc.images).map((im) => (im.complete ? Promise.resolve() : new Promise((r) => { im.onload = r; im.onerror = r; }))));
    try { if (doc.fonts && doc.fonts.ready) await doc.fonts.ready; } catch (e) {}
    const MM = 72 / 25.4, A4W = 210 * MM, A4H = 297 * MM, A5H = 148 * MM;
    const SIG = "carnetdechasse.fr";
    // Pose une image au centre d'une zone de la page (coordonnees PDF : origine en bas a gauche).
    const poser = (cv, z, marge, enHaut) => {
      const s = Math.min((z.w - 2 * marge) / cv.width, (z.h - 2 * marge) / cv.height);
      const dw = cv.width * s, dh = cv.height * s;
      return { jpeg: jpegOctets(cv, 0.88), w: cv.width, h: cv.height, dw, dh, x: z.x + (z.w - dw) / 2, y: enHaut ? z.y + z.h - marge - dh : z.y + (z.h - dh) / 2 };
    };
    // Livret : signature au centre de la couverture et du dos, nom + numero de page a droite de chaque demi-page.
    const piedsLivret = (el, z, petit) => {
      const mode = el.getAttribute("data-sig") || "aucune";
      const szSig = petit ? 6.5 : 8, szMax = petit ? 5.5 : 7, bas = (petit ? 4.5 : 6) * MM, m = (petit ? 7 : 10) * MM;
      const out = [];
      const centres = mode === "moities" ? [z.x + z.w / 4, z.x + z.w * 3 / 4] : [];
      centres.forEach((cx) => out.push({ t: SIG, sz: szSig, cx, y: z.y + bas }));
      let pp = null; try { pp = JSON.parse(el.getAttribute("data-pieds") || "null"); } catch (e) {}
      if (Array.isArray(pp)) pp.forEach((t, k) => {
        if (!t) return;
        const droite = k === 0 ? z.x + z.w / 2 - m - 2 * MM : z.x + z.w - m;
        const gauche = centres.length ? centres[k] + largeurHelv(SIG, szSig) / 2 + 6 : z.x + k * z.w / 2 + m;
        let sz = szMax; while (sz > 4.5 && largeurHelv(t, sz) > droite - gauche) sz -= 0.25;
        out.push({ t, sz, xd: droite, y: z.y + bas });
      });
      return out;
    };
    // La signature et les pieds HTML sont retires de l'image : ils sont ecrits directement dans le PDF.
    doc.querySelectorAll(".cdc, .cdc-fixe, .pnum, .coupe").forEach((e) => { e.style.display = "none"; });
    const format = doc.body.getAttribute("data-format") || "";
    const pages = [];
    const sections = Array.from(doc.querySelectorAll("section.page, section.feuille, section.duo"));
    if (sections.length) {
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const inv = sec.classList.contains("inv"); if (inv) sec.classList.remove("inv");
        if (sec.classList.contains("duo")) {
          // A4 a couper : deux livrets A5 l'un au-dessus de l'autre, trait de coupe au milieu.
          const pw = A4W, ph = A4H, zones = [{ x: 0, y: ph / 2, w: pw, h: ph / 2 }, { x: 0, y: 0, w: pw, h: ph / 2 }];
          const pg = { pw, ph, imgs: [], textes: [], lignes: [{ x1: 4 * MM, y1: ph / 2, x2: pw - 4 * MM, y2: ph / 2 }], inv };
          const fs = Array.from(sec.querySelectorAll(".feuille"));
          for (let k = 0; k < fs.length; k++) {
            const r = fs[k].getBoundingClientRect();
            let cv = await dessinerZone(fs[k], 1800 / r.width);
            // verso retourne : toute la page tourne, donc chaque livret tourne et change de moitie
            if (inv) cv = tourner180(cv);
            pg.imgs.push(poser(cv, zones[inv ? 1 - k : k], 7 * MM, false));
            pg.textes = pg.textes.concat(piedsLivret(fs[k], zones[k], true));
          }
          pages.push(pg);
        } else if (sec.classList.contains("feuille")) {
          // Livret plie : A4 ou A5 en paysage.
          const petit = format === "a5";
          const pw = petit ? 210 * MM : A4H, ph = petit ? A5H : A4W;
          const r = sec.getBoundingClientRect();
          let cv = await dessinerZone(sec, (petit ? 1800 : 2300) / r.width);
          if (inv) cv = tourner180(cv);
          const z = { x: 0, y: 0, w: pw, h: ph };
          pages.push({ pw, ph, inv, imgs: [poser(cv, z, (petit ? 7 : 10) * MM, false)], textes: piedsLivret(sec, z, petit) });
        } else {
          // Page portrait A4 (postes, resume) : contenu en haut, signature en bas au centre.
          const r = sec.getBoundingClientRect();
          let cv = await dessinerZone(sec, 1600 / r.width);
          if (inv) cv = tourner180(cv);
          const pw = A4W, ph = A4H;
          pages.push({ pw, ph, inv, imgs: [poser(cv, { x: 0, y: 0, w: pw, h: ph }, 10 * MM, true)], textes: [{ t: SIG, sz: 8, cx: pw / 2, y: 6 * MM }] });
        }
        if (onAvance) onAvance(i + 1, sections.length);
        await new Promise((r2) => setTimeout(r2, 0));
      }
    } else {
      // Document qui s'ecoule sur plusieurs pages : on coupe entre deux lignes, jamais au milieu.
      const body = doc.body, br = body.getBoundingClientRect();
      const hautPage = br.width * (277 / 190);
      const coupes = Array.from(body.querySelectorAll("tr, h1, h2, h3, p, li, header, .head, .tot, .foot, table, div")).map((e) => e.getBoundingClientRect().bottom - br.top).filter((v) => v > 0).sort((a, b) => a - b);
      let y = 0; const fin = Math.max(body.scrollHeight, br.height);
      while (y < fin - 2) {
        let c = y + hautPage;
        if (c < fin) { const ok = coupes.filter((v) => v > y + hautPage * 0.5 && v <= y + hautPage); if (ok.length) c = ok[ok.length - 1]; }
        else c = fin;
        const cv = await dessinerZone(body, 1600 / br.width, { x: br.left, y: br.top + y, w: br.width, h: c - y });
        pages.push({ pw: A4W, ph: A4H, imgs: [poser(cv, { x: 0, y: 0, w: A4W, h: A4H }, 10 * MM, true)], textes: [{ t: SIG, sz: 8, cx: A4W / 2, y: 6 * MM }] });
        y = c;
        if (onAvance) onAvance(pages.length, 0);
        await new Promise((r2) => setTimeout(r2, 0));
      }
    }
    return pdfDepuisImages(pages);
  } finally { ifr.remove(); }
}
function PrintOverlay({ html, onClose }) {
  const ref = useRef(null);
  const [pdf, setPdf] = useState({ etat: "rien" });
  const doPrint = () => { try { ref.current.contentWindow.focus(); ref.current.contentWindow.print(); } catch (e) { try { window.print(); } catch (e2) {} } };
  const titre = ((html.match(/<title>([^<]*)<\/title>/) || [])[1] || "Carnet de Chasse").replace(/&amp;/g, "&");
  const nomFichier = titre.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) + ".pdf";
  const creerPdf = async () => {
    setPdf({ etat: "calcul", txt: "Préparation du PDF…" });
    try {
      const blob = await fabriquerPdf(html, (i, n) => setPdf({ etat: "calcul", txt: n ? "Page " + i + " / " + n + "…" : "Page " + i + "…" }));
      setPdf({ etat: "pret", blob, url: URL.createObjectURL(blob) });
    } catch (e) { setPdf({ etat: "erreur" }); window.alert("Le PDF n'a pas pu être créé. Tu peux toujours utiliser Imprimer."); }
  };
  useEffect(() => () => { if (pdf.url) URL.revokeObjectURL(pdf.url); }, [pdf.url]);
  const fichier = pdf.blob ? new File([pdf.blob], nomFichier, { type: "application/pdf" }) : null;
  const peutPartager = !!(fichier && navigator.canShare && navigator.canShare({ files: [fichier] }));
  const partager = async () => { try { await navigator.share({ files: [fichier], title: titre }); } catch (e) {} };
  return (<div className="fixed inset-0 z-50 bg-white flex flex-col">
    <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-stone-200 bg-stone-50 shrink-0" style={{ paddingTop: "calc(0.5rem + env(safe-area-inset-top))" }}>
      <button onClick={onClose} className="flex items-center gap-1 text-sm font-medium text-stone-700 py-1.5"><ArrowLeft size={16} /> Retour</button>
      <div className="flex items-center gap-2">
        <button onClick={doPrint} className="flex items-center gap-1.5 bg-white border border-stone-300 text-stone-700 text-sm font-medium px-3 py-1.5 rounded-md">🖨️ Imprimer</button>
        {pdf.etat !== "pret" && <button disabled={pdf.etat === "calcul"} onClick={creerPdf} className="flex items-center gap-1.5 bg-emerald-800 disabled:bg-stone-400 text-stone-50 text-sm font-medium px-3 py-1.5 rounded-md"><FileText size={15} /> {pdf.etat === "calcul" ? pdf.txt : "Créer le PDF"}</button>}
        {pdf.etat === "pret" && peutPartager && <button onClick={partager} className="flex items-center gap-1.5 bg-emerald-800 text-stone-50 text-sm font-medium px-3 py-1.5 rounded-md">📤 Envoyer le PDF</button>}
        {pdf.etat === "pret" && <a href={pdf.url} download={nomFichier} className={"flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md " + (peutPartager ? "bg-white border border-stone-300 text-stone-700" : "bg-emerald-800 text-stone-50")}>⬇️ Enregistrer</a>}
      </div>
    </div>
    {pdf.etat === "pret" && <p className="px-3 py-1.5 text-[11px] text-emerald-800 bg-emerald-50 border-b border-emerald-100">PDF prêt, format A4, sans l'adresse ni la date ajoutées par le téléphone. « Envoyer » ouvre le menu de partage (Imprimer, Mail, WhatsApp, Fichiers…).</p>}
    <div className="flex-1 overflow-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <iframe ref={ref} srcDoc={html} title="Aperçu" className="border-0 block" style={{ width: "1px", minWidth: "100%", height: "100%" }} />
    </div>
  </div>);
}
// ---------- Groupes de membres ----------
// La liste des groupes est déduite des membres : pas de nouveau champ à sauvegarder,
// donc aucun risque pour les données existantes. Un groupe sans membre disparaît.
