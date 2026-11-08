function Tile({ id, emoji, title, sub, open, onToggle }) {
  return (<button onClick={() => onToggle(id)} className={`rounded-xl border p-3.5 text-left transition-colors ${open === id ? "border-emerald-600 bg-emerald-50" : "border-stone-200 bg-white hover:border-stone-300"}`}>
    <div className="text-2xl mb-1.5">{emoji}</div>
    <div className="text-sm font-medium text-stone-800">{title}</div>
    <div className="text-[11px] text-stone-400 mt-0.5">{sub}</div>
  </button>);
}
// Placé DANS la grille et étalé sur deux colonnes : le cadre s'ouvre ainsi
// juste sous la rangée de la vignette touchée, et non sous tout le groupe.
function Panel({ id, open, children }) {
  if (open !== id) return null;
  return <div className="col-span-2 bg-white rounded-xl border border-emerald-600 p-4">{children}</div>;
}
function Group({ label, children }) {
  return (<div><p className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 px-1">{label}</p>{children}</div>);
}

// ---------- Écran d'aide ----------
function HelpRow({ id, emoji, title, sub, open, onToggle, highlight }) {
  const isOpen = open === id;
  const base = isOpen ? "border-emerald-600 bg-emerald-50" : (highlight ? "border-emerald-300 bg-emerald-50/60" : "border-stone-200 bg-white");
  return (<button onClick={() => onToggle(id)} className={`w-full rounded-xl border p-3.5 text-left flex items-center gap-3 transition-colors ${base}`}>
    <span className="text-2xl shrink-0">{emoji}</span>
    <span className="flex-1 min-w-0">
      <span className="block text-sm font-medium text-stone-800">{title}</span>
      <span className={`block text-[11px] mt-0.5 ${highlight ? "text-emerald-700" : "text-stone-400"}`}>{sub}</span>
    </span>
    <span className="text-stone-300 text-xs shrink-0">{isOpen ? "▲" : "▼"}</span>
  </button>);
}
function HelpBody({ id, open, children }) {
  if (open !== id) return null;
  return <div className="mt-2.5 bg-white rounded-xl border border-emerald-600 p-4 text-sm text-stone-600 space-y-2">{children}</div>;
}
function HelpH({ children }) { return <p className="font-semibold text-stone-800 pt-1">{children}</p>; }

function HelpSheet({ onClose }) {
  const [open, setOpen] = useState(null);
  const toggle = (id) => setOpen((o) => (o === id ? null : id));
  const etapes = ["J'invite mes membres", "Je note les présents", "Je définis les attributions", "Je place les fusils", "Je partage le lien", "Les retours remontent tout seuls"];

  return (<div className="fixed inset-0 z-[60] bg-stone-100 flex flex-col">
    <div className="bg-stone-900 text-stone-50 px-4 py-3 flex items-center gap-3 shrink-0" style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top))" }}>
      <button onClick={onClose} className="p-1 -ml-1"><ArrowLeft size={22} /></button>
      <h2 className="font-serif text-lg">Aide</h2>
    </div>

    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto p-4 space-y-5">

        <div className="bg-stone-800 text-stone-50 rounded-xl p-4">
          <p className="font-serif text-base leading-snug">Tu prépares tes territoires et tes membres, puis pour chaque journée tu invites, tu places les chasseurs, tu partages un lien — et tout revient dans ton carnet.</p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-[11px] uppercase tracking-widest text-stone-400 mb-2.5">Le cycle d'une battue</p>
          <div className="space-y-1.5 text-sm text-stone-700">
            {etapes.map((t, i) => (<div key={i} className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <span>{t}</span>
            </div>))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 px-1">Tout savoir, écran par écran</p>
          <div className="space-y-2.5">

            <HelpRow id="h1" emoji="🚀" title="Premiers pas" sub="Connexion, sauvegarde, réglages" open={open} onToggle={toggle} />
            <HelpBody id="h1" open={open}>
              <HelpH>Se connecter</HelpH>
              <p>Chaque compte a son carnet, privé et séparé. Aucun organisateur ne voit les données d'un autre.</p>
              <HelpH>La sauvegarde</HelpH>
              <p>Tout s'enregistre tout seul. Le témoin ☁ Enregistré en haut à droite le confirme. Il n'y a pas de bouton Sauvegarder : il ferait doublon.</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-900 text-[13px]"><b>Bandeau rouge = rien n'est enregistré.</b> Recharge la page avant de continuer à saisir.</p>
              </div>
              <HelpH>L'engrenage ⚙️</HelpH>
              <p>Ton compte, le nom du groupe, tes sauvegardes et cette aide.</p>
            </HelpBody>

            <HelpRow id="h2" emoji="👥" title="Membres" sub="Ton carnet d'adresses" open={open} onToggle={toggle} />
            <HelpBody id="h2" open={open}>
              <p>Pour chaque personne : prénom, nom, téléphone, email, permis, validation, assurance, un rôle (chasseur ou rabatteur), le type d'arme et la mobilité réduite éventuelle.</p>
              <HelpH>Importer une liste</HelpH>
              <p><b>Excel ou CSV</b> — nomme tes colonnes : Prénom, Nom, Téléphone, Email, Permis, Validation, Assurance, Rôle, Mobilité.</p>
              <p><b>Contacts du téléphone (.vcf)</b> — exporte tes contacts et importe le fichier.</p>
              <HelpH>Doublons</HelpH>
              <p>L'app repère les doublons, même avec prénom et nom inversés. Tu peux fusionner deux fiches sans rien perdre.</p>
            </HelpBody>

            <HelpRow id="h3" emoji="🗺️" title="Territoires" sub="Cartes, postes, plan de chasse" open={open} onToggle={toggle} />
            <HelpBody id="h3" open={open}>
              <HelpH>La carte</HelpH>
              <p>Importe ta photo ou ton plan, ou utilise la carte IGN : satellite et plan mélangeables, recherche d'adresse, recadrage.</p>
              <HelpH>Traques et miradors</HelpH>
              <p>Touche la carte pour poser un mirador : nom, priorité de 1 à 4 (le 1 se remplit en premier), photos, consignes, armes autorisées, accessibilité.</p>
              <HelpH>Cônes de sécurité</HelpH>
              <p>Trace les zones de tir interdites. L'app ajoute une marge hachurée de 30° et colore les secteurs autorisés en vert.</p>
              <HelpH>Plan de chasse</HelpH>
              <p>Espèces rangées par famille. Trois modes : Bracelets, Objectif, Proportionnel. Les jauges se remplissent seules avec la saison.</p>
            </HelpBody>

            <HelpRow id="h4" emoji="📅" title="Une journée de A à Z" sub="Le cœur de l'appli" open={open} onToggle={toggle} highlight />
            <HelpBody id="h4" open={open}>
              <p>Chaque journée s'ouvre sur une barre de progression : cinq étapes de préparation, dans l'ordre.</p>
              <HelpH>1 · 📧 Invitations</HelpH>
              <p>Coche les invités, personnalise le message, envoie via ta messagerie. Destinataires en copie cachée.</p>
              <HelpH>2 · ✅ Présences</HelpH>
              <p>Présent ou absent, le dîner, les accompagnants.</p>
              <HelpH>3 · 🎯 Attributions</HelpH>
              <p>Le canal talkie et ce qui peut être prélevé. Les deux s'affichent chez les chasseurs.</p>
              <HelpH>4 · 🏚 Poster les fusils</HelpH>
              <p>À la main, ou remplissage automatique qui respecte l'accessibilité, puis la priorité du poste, puis l'arme.</p>
              <HelpH>5 · 👨‍✈️ Chefs de ligne</HelpH>
              <p>Un chef par ligne, avec son point de rendez-vous après la traque.</p>
              <HelpH>🖨️ Documents et 📤 Partager</HelpH>
              <p>Postes, émargement, dîner. Puis publication instantanée et envoi WhatsApp.</p>
              <HelpH>🦌 Tableau de chasse</HelpH>
              <p>Un animal = une ligne. Les retours des chasseurs remontent tout seuls, sur fond vert.</p>
            </HelpBody>

            <HelpRow id="h5" emoji="📖" title="Carnet de chasse" sub="Bilan et exports" open={open} onToggle={toggle} />
            <HelpBody id="h5" open={open}>
              <p>Filtre par territoire et par saison. Totaux, détail par personne, par poste, par espèce, et l'historique des journées.</p>
              <HelpH>Exporter</HelpH>
              <p><b>Carnet de chasse</b> (en vert) — le bilan complet.</p>
              <p><b>Fédération</b> (en gris) — une ligne par animal, prêt pour le retour à la fédération.</p>
            </HelpBody>

            <HelpRow id="h6" emoji="📱" title="Ce que voit le chasseur" sub="Et ce qu'il ne voit pas" open={open} onToggle={toggle} />
            <HelpBody id="h6" open={open}>
              <p>Il ouvre le lien, sans compte ni mot de passe : son poste, sa carte, les consignes, les participants, son retour à envoyer, et un petit jeu pour patienter.</p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-emerald-900 text-[13px]">Sa page contient les <b>noms</b> des participants, mais <b>jamais</b> les téléphones, emails, permis ni assurances. L'accessibilité n'est visible que par toi.</p>
              </div>
              <p>Le lien n'est pas devinable et les moteurs de recherche ne l'indexent pas — mais il n'a pas de mot de passe. Ne le diffuse qu'aux personnes concernées.</p>
            </HelpBody>

            <HelpRow id="h7" emoji="💡" title="Astuces et dépannage" sub="Les pièges courants" open={open} onToggle={toggle} />
            <HelpBody id="h7" open={open}>
              <p>• Après tout changement, <b>republie le lien</b> : les chasseurs voient la version publiée, pas la tienne.</p>
              <p>• Les retours arrivent tout seuls — reviens sur l'appli pour les voir.</p>
              <p>• Un animal = une ligne (un bracelet par animal).</p>
              <p>• Bandeau rouge = rien n'est enregistré. Recharge avant de saisir.</p>
              <p>• Garde une sauvegarde de temps en temps : ⚙️ puis Sauvegarde puis Exporter.</p>
            </HelpBody>

          </div>
        </div>

        <p className="text-center text-[11px] text-stone-400 pb-4">Carnet de Chasse — {APP_VERSION}</p>
      </div>
    </div>
  </div>);
}

// ---------- Confidentialité & mentions légales ----------
function LegalSheet({ onClose }) {
  const [open, setOpen] = useState(null);
  const toggle = (id) => setOpen((o) => (o === id ? null : id));

  return (<div className="fixed inset-0 z-50 bg-stone-100 flex flex-col">
    <div className="bg-stone-900 text-stone-50 px-4 py-3 flex items-center gap-3 shrink-0" style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top))" }}>
      <button onClick={onClose} className="p-1 -ml-1"><ArrowLeft size={22} /></button>
      <h2 className="font-serif text-lg">Confidentialité</h2>
    </div>

    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto p-4 space-y-5">

        <div className="bg-stone-800 text-stone-50 rounded-xl p-4">
          <p className="font-serif text-base leading-snug">Carnet de Chasse enregistre ce que tu y saisis, rien d'autre : aucun traceur, aucune publicité, aucune revente de données.</p>
          <p className="text-stone-400 text-[11px] mt-2">Dernière mise à jour : 16 août 2026</p>
        </div>

        <div className="space-y-2.5">

          <HelpRow id="l1" emoji="👤" title="Qui est responsable" sub="Éditeur et contact" open={open} onToggle={toggle} />
          <HelpBody id="l1" open={open}>
            <p>L'application est éditée à titre personnel et non professionnel par <b>Houdard</b>, joignable à <a href="mailto:contact@carnetdechasse.fr" className="text-emerald-800 underline">contact@carnetdechasse.fr</a>.</p>
            <p>Chaque organisateur reste responsable des informations qu'il saisit sur les membres de sa société de chasse.</p>
          </HelpBody>

          <HelpRow id="l2" emoji="📝" title="Ce qui est enregistré" sub="Et à quoi ça sert" open={open} onToggle={toggle} />
          <HelpBody id="l2" open={open}>
            <p><b>Ton compte</b> — email et mot de passe, pour te connecter.</p>
            <p><b>Tes membres</b> — identité et coordonnées pour les inviter et les contacter ; numéros de permis et d'assurance pour vérifier qu'ils sont en règle.</p>
            <p><b>Tes territoires</b> — cartes, postes et consignes, pour préparer la journée et la sécurité des tirs.</p>
            <p><b>Tes journées</b> — présences, dîner et tableau de chasse, pour le registre de la saison et les déclarations à la fédération.</p>
            <HelpH>Base légale</HelpH>
            <p>Pour les organisateurs, le traitement est nécessaire au service demandé. Pour les membres saisis par un organisateur, il repose sur l'intérêt légitime à organiser une battue en sécurité et sur les obligations pesant sur les sociétés de chasse.</p>
          </HelpBody>

          <HelpRow id="l3" emoji="🔑" title="Connexion avec Google" sub="Ce que Google transmet" open={open} onToggle={toggle} />
          <HelpBody id="l3" open={open}>
            <p>Si tu te connectes avec Google, Google transmet uniquement ton <b>nom, ta photo de profil et ton adresse email</b>.</p>
            <p>Nous n'accédons à aucune autre donnée de ton compte Google, et nous ne publions jamais rien en ton nom. Tu peux retirer cette autorisation à tout moment depuis les paramètres de ton compte Google.</p>
            <p>La connexion par email et mot de passe reste disponible si tu préfères.</p>
          </HelpBody>

          <HelpRow id="l4" emoji="🌍" title="Où sont mes données" sub="Hébergement" open={open} onToggle={toggle} />
          <HelpBody id="l4" open={open}>
            <p>La base de données est hébergée par Supabase dans l'Union européenne (Paris).</p>
            <p>Deux prestataires sont établis aux États-Unis : Cloudflare, qui diffuse les pages des chasseurs, et Resend, qui envoie les emails de confirmation. Les données qui leur sont confiées se limitent au contenu de la page publiée et à ton adresse email. Ces transferts sont encadrés par les clauses contractuelles types de la Commission européenne.</p>
            <p>Chaque compte est cloisonné : un organisateur ne peut ni voir ni modifier les données d'un autre.</p>
          </HelpBody>

          <HelpRow id="l5" emoji="📱" title="La page des chasseurs" sub="Ce qui y figure" open={open} onToggle={toggle} />
          <HelpBody id="l5" open={open}>
            <p>Quand tu publies une journée, la page devient accessible à toute personne disposant du lien.</p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-emerald-900 text-[13px]"><b>Elle contient</b> les prénoms et noms des participants, le territoire, la carte, les postes, les consignes et les attributions. <b>Jamais</b> les téléphones, emails, permis ni assurances.</p>
            </div>
            <p>Son adresse n'est pas devinable et les moteurs de recherche ne l'indexent pas. Elle n'a toutefois pas de mot de passe : ne diffuse le lien qu'aux personnes concernées.</p>
          </HelpBody>

          <HelpRow id="l6" emoji="🐗" title="Le jeu" sub="Ce que garde le classement" open={open} onToggle={toggle} />
          <HelpBody id="l6" open={open}>
            <p>Si un joueur enregistre un score, seuls <b>un pseudonyme de son choix et une distance</b> sont conservés.</p>
            <p>Aucun lien n'est fait avec son identité, son compte ou sa journée de chasse. Ce classement est visible par tous les joueurs.</p>
          </HelpBody>

          <HelpRow id="l7" emoji="⚖️" title="Tes droits" sub="Accès, correction, effacement" open={open} onToggle={toggle} />
          <HelpBody id="l7" open={open}>
            <p>Tu disposes d'un droit d'accès, de rectification, d'effacement, de portabilité, de limitation et d'opposition.</p>
            <p>L'export se fait depuis Réglages puis Sauvegarde. Pour toute autre demande, écris à <a href="mailto:contact@carnetdechasse.fr" className="text-emerald-800 underline">contact@carnetdechasse.fr</a> : réponse sous un mois.</p>
            <HelpH>Durée de conservation</HelpH>
            <p>Tes données restent enregistrées tant que ton compte existe. À sa suppression, elles sont effacées sous 30 jours.</p>
            <HelpH>Ta responsabilité envers tes membres</HelpH>
            <p>En saisissant les informations d'un membre, tu t'engages à l'avoir informé que ses données figurent ici. Ces personnes peuvent te demander à tout moment de les consulter, corriger ou supprimer.</p>
            <p>En cas de désaccord, tu peux saisir la CNIL (www.cnil.fr).</p>
          </HelpBody>

          <HelpRow id="l8" emoji="📜" title="Mentions légales" sub="Éditeur et hébergeurs" open={open} onToggle={toggle} />
          <HelpBody id="l8" open={open}>
            <HelpH>Éditeur</HelpH>
            <p>Carnet de Chasse est édité par <b>Houdard</b>, à titre personnel et non professionnel. Contact : contact@carnetdechasse.fr</p>
            <p className="text-[12px] text-stone-500">Conformément à l'article 6 III-2 de la loi pour la confiance dans l'économie numérique, l'éditeur non professionnel a communiqué ses coordonnées à son hébergeur et bénéficie du régime d'anonymat prévu par ce texte.</p>
            <HelpH>Hébergement</HelpH>
            <p>• Application : GitHub Pages — GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis</p>
            <p>• Base de données : Supabase Inc. — données stockées dans l'Union européenne (Paris)</p>
            <p>• Domaine et diffusion : Cloudflare Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis</p>
            <HelpH>Propriété intellectuelle</HelpH>
            <p>Le contenu de l'application est protégé. Les cartes proviennent de la Géoplateforme IGN et restent soumises à ses conditions d'utilisation.</p>
          </HelpBody>

        </div>

        <p className="text-center text-[11px] text-stone-400 pb-4">Carnet de Chasse — {APP_VERSION}</p>
      </div>
    </div>
  </div>);
}

function SettingsSheet({ github, setGithub, onClose, session, onSignOut, onExportExcel, onExportJson, onImportPick, poids, onInstall }) {
  const [open, setOpen] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [delMot, setDelMot] = useState(""); const [delBusy, setDelBusy] = useState(false); const [delOuvert, setDelOuvert] = useState(false);
  const [orgName, setOrgName] = useState(github.orgName || "");
  const [pass, setPass] = useState(""); const [pwMsg, setPwMsg] = useState(""); const [pwBusy, setPwBusy] = useState(false);
  const [toast, setToast] = useState("");
  // Classement du jeu : la vignette n'apparaît que si le facteur nous reconnaît
  // comme administrateur (comparaison faite côté serveur, jamais ici).
  const [isAdmin, setIsAdmin] = useState(false);
  const [board, setBoard] = useState([]);
  const [boardBusy, setBoardBusy] = useState(false);
  const [wipe, setWipe] = useState("");

  const email = (session && session.user && session.user.email) || "";
  const initials = (email.slice(0, 2) || "?").toUpperCase();
  const toggle = (id) => setOpen((o) => (o === id ? null : id));
  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 1800); };
  const saveOrg = () => { setGithub({ ...github, orgName: orgName.trim() }); flash("Nom du groupe enregistré"); setOpen(null); };

  const facteur = () => (github.fnUrl || DEFAULT_FACTEUR).replace(/\/+$/, "");

  const callBoard = async (route, body) => {
    let sess = null;
    try { sess = (await SB.auth.getSession()).data.session; } catch (e) {}
    if (!sess || !sess.access_token) throw new Error("Session expirée — reconnecte-toi.");
    const r = await fetch(facteur() + route, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + sess.access_token },
      body: JSON.stringify(body || {})
    });
    if (!r.ok) { const t = await r.text(); throw new Error("HTTP " + r.status + " — " + String(t).slice(0, 160)); }
    return await r.json();
  };

  // Sondage discret à l'ouverture des Réglages : si le facteur répond, la vignette s'affiche.
  useEffect(() => {
    let vivant = true;
    callBoard("/scores/list")
      .then((d) => { if (vivant) { setIsAdmin(true); setBoard(d.all || []); } })
      .catch(() => {});
    return () => { vivant = false; };
  }, []);

  const removeScore = async (pseudo) => {
    if (!window.confirm("Retirer « " + pseudo + " » du classement ?")) return;
    setBoardBusy(true);
    try { const d = await callBoard("/scores/delete", { pseudo: pseudo }); setBoard(d.all || []); flash("Ligne retirée"); }
    catch (e) { window.alert("Impossible : " + ((e && e.message) || e)); }
    finally { setBoardBusy(false); }
  };

  const wipeBoard = async () => {
    setBoardBusy(true);
    try { const d = await callBoard("/scores/reset", { confirm: "EFFACER" }); setBoard(d.all || []); setWipe(""); flash("Classement vidé"); }
    catch (e) { window.alert("Impossible : " + ((e && e.message) || e)); }
    finally { setBoardBusy(false); }
  };

  const supprimerCompte = async () => {
    if (!window.confirm("Dernière vérification.\n\nTon carnet, tes territoires, tes journées et ta page publiée vont être effacés définitivement. Cette action est irréversible.\n\nContinuer ?")) return;
    setDelBusy(true);
    try {
      const d = await callBoard("/account/delete", { confirm: "SUPPRIMER" });
      if (!d.ok) throw new Error("Suppression incomplète — écris à contact@carnetdechasse.fr");
      window.alert("Ton compte a été supprimé. Merci d'avoir utilisé Carnet de Chasse.");
      try { await SB.auth.signOut(); } catch (e) {}
      window.location.reload();
    } catch (e) {
      window.alert("Suppression impossible : " + ((e && e.message) || e));
      setDelBusy(false);
    }
  };

  const changePassword = async () => {
    if ((pass || "").length < 6) { setPwMsg("Choisis au moins 6 caractères."); return; }
    setPwBusy(true); setPwMsg("");
    try { const { error } = await SB.auth.updateUser({ password: pass }); if (error) throw error; setPass(""); setPwMsg("✓ Mot de passe modifié."); }
    catch (e) { setPwMsg("⚠ " + ((e && e.message) || e)); }
    finally { setPwBusy(false); }
  };

  // Infos pratiques : on ne recopie aucune liste officielle, elles changent chaque annee.
  // On ouvre les sources, et on garde seulement ce que l'utilisateur saisit.
  const infos = github.infos || {};
  const majInfos = (patch) => setGithub((g) => ({ ...g, infos: { ...((g && g.infos) || {}), ...patch } }));
  const cherche = (q) => "https://www.google.com/search?q=" + encodeURIComponent(q);
  const saison = (() => { const d = new Date(); const y = d.getFullYear(); return d.getMonth() >= 6 ? y + "-" + (y + 1) : (y - 1) + "-" + y; })();
  const depsVoisins = String(infos.voisins || "").split(/[^0-9AB]+/i).map((x) => x.trim()).filter(Boolean).slice(0, 8);
  const lienExt = "block w-full text-center bg-white border border-stone-300 rounded-lg py-2.5 text-[13px] font-medium text-stone-700 no-underline";

  // L'aide occupe tout l'écran : on la rend à la place des Réglages plutôt que par-dessus.
  if (showHelp) return <HelpSheet onClose={() => setShowHelp(false)} />;
  if (showLegal) return <LegalSheet onClose={() => setShowLegal(false)} />;

  return (<div className="fixed inset-0 z-50 bg-stone-100 flex flex-col">
    <div className="bg-stone-900 text-stone-50 px-4 py-3 flex items-center gap-3 shrink-0" style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top))" }}>
      <button onClick={onClose} className="p-1 -ml-1"><ArrowLeft size={22} /></button>
      <h2 className="font-serif text-lg">Réglages</h2>
    </div>

    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto p-4 space-y-5">

        <Group label="Mon compte">
          <div className="grid grid-cols-2 gap-3">
            <Tile open={open} onToggle={toggle} id="compte" emoji="👤" title="Mon compte" sub="Email, mot de passe" />
            <Tile open={open} onToggle={toggle} id="quitter" emoji="🚪" title="Déconnexion" sub="Quitter ce compte" />
            <Panel open={open} id="compte">
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-stone-100">
              <div className="w-11 h-11 rounded-full bg-emerald-700 text-stone-50 flex items-center justify-center font-semibold shrink-0">{initials}</div>
              <div className="min-w-0"><p className="text-sm font-medium text-stone-800 truncate">{email}</p><p className="text-[11px] text-stone-400">Organisateur</p></div>
            </div>
            <label className="text-[11px] uppercase tracking-wide text-stone-400">Nouveau mot de passe</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" className="w-full border border-stone-300 rounded-lg px-3 py-2 mt-1.5 text-sm bg-white" />
            <button onClick={changePassword} disabled={pwBusy || !pass} className="mt-3 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-stone-50 text-sm font-medium px-4 py-2 rounded-lg">{pwBusy ? "…" : "Modifier mon mot de passe"}</button>
            {pwMsg && <p className="text-sm mt-2 text-stone-700">{pwMsg}</p>}
            <div className="border-t border-stone-100 mt-4 pt-3">
              {!delOuvert ? (
                <button onClick={() => setDelOuvert(true)} className="text-sm font-medium text-red-700 hover:text-red-900">🗑 Supprimer mon compte</button>
              ) : (<div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-medium text-red-900">Supprimer définitivement mon compte</p>
                <p className="text-[12px] text-red-800 mt-1">Seront effacés : ton carnet, tes territoires, tes membres, tes journées et ta page publiée. <b>C'est irréversible.</b></p>
                <p className="text-[11px] text-stone-500 mt-2">Pense à exporter une sauvegarde avant, depuis la vignette Sauvegarde.</p>
                <p className="text-[11px] text-stone-500 mt-2 mb-1">Écris <b>SUPPRIMER</b> pour confirmer :</p>
                <div className="flex gap-2">
                  <input value={delMot} onChange={(e) => setDelMot(e.target.value)} placeholder="SUPPRIMER" className="flex-1 min-w-0 border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white" />
                  <button onClick={supprimerCompte} disabled={delMot !== "SUPPRIMER" || delBusy} className="shrink-0 bg-red-700 hover:bg-red-800 disabled:bg-stone-300 text-stone-50 text-sm font-medium px-4 py-2 rounded-lg">{delBusy ? "…" : "Supprimer"}</button>
                </div>
                <button onClick={() => { setDelOuvert(false); setDelMot(""); }} className="text-[11px] text-stone-500 underline mt-2">Annuler</button>
              </div>)}
            </div>
          </Panel>
            <Panel open={open} id="quitter">
            <p className="text-sm text-stone-600 mb-3">Ton carnet reste enregistré. Tu le retrouveras à la prochaine connexion.</p>
            <button onClick={onSignOut} className="w-full bg-stone-800 hover:bg-stone-900 text-stone-50 text-sm font-medium py-2.5 rounded-lg">Me déconnecter</button>
          </Panel>
          </div>
        </Group>

        <Group label="Mon carnet">
          <div className="grid grid-cols-2 gap-3">
            <Tile open={open} onToggle={toggle} id="groupe" emoji="🏹" title="Nom du groupe" sub="Titre de la page chasseurs" />
            <Tile open={open} onToggle={toggle} id="save" emoji="💾" title="Sauvegarde" sub="Exporter · Importer" />
            <Tile open={open} onToggle={toggle} id="gps" emoji="📡" title="Suivi GPS live" sub={github.gpsActif ? "Activé" : "Désactivé"} />
            <Panel open={open} id="gps">
              <p className="text-sm text-stone-600">Sur la page des chasseurs, une tuile « Suivi GPS live » permet à chacun de partager sa position jusqu'à 18 h et de voir celle des autres. Nécessite le Worker <b>battue-gps</b> (Cloudflare).</p>
              <label className="flex items-center gap-2 mt-3 text-sm text-stone-800"><input type="checkbox" checked={!!github.gpsActif} onChange={() => setGithub({ ...github, gpsActif: !github.gpsActif })} className="w-4 h-4 accent-emerald-700" />Activer le suivi GPS sur les pages publiées</label>
              <button onClick={async () => { try { const r = await fetch(GPS_URL + "/ping", { cache: "no-store" }); const d = await r.json(); flash(d && d.ok ? "Worker GPS en place ✓" : "Le Worker répond mais la base n'est pas prête"); } catch (e) { flash("Worker GPS introuvable"); } }} className="mt-3 text-sm font-medium bg-white border border-stone-300 rounded-lg px-3 py-1.5">Tester le Worker</button>
              <p className="text-[11px] text-stone-400 mt-2">Après l'avoir activé, republie la journée pour que la tuile apparaisse. Seules les cartes capturées depuis l'IGN dans l'app peuvent afficher les positions.</p>
            </Panel>
            <Tile open={open} onToggle={toggle} id="chat" emoji="💬" title="Chat des chasseurs" sub={github.chatActif ? "Activé" : "Désactivé"} />
            <Panel open={open} id="chat">
              <p className="text-sm text-stone-600">Sur la page des chasseurs, une tuile « Chat de la journée » permet aux chasseurs et aux rabatteurs de discuter ensemble. Un chat par journée, gardé jusqu'à ce que tu le vides. Utilise le même Worker que le suivi GPS (<b>battue-gps</b>).</p>
              <label className="flex items-center gap-2 mt-3 text-sm text-stone-800"><input type="checkbox" checked={!!github.chatActif} onChange={() => setGithub({ ...github, chatActif: !github.chatActif })} className="w-4 h-4 accent-emerald-700" />Activer le chat sur les pages publiées</label>
              <button onClick={async () => { try { const r = await fetch(GPS_URL + "/ping", { cache: "no-store" }); const d = await r.json(); flash(d && d.ok && d.chat ? "Chat prêt ✓" : (d && d.ok ? "Worker en place, mais la base n'a pas les tables du chat" : "Le Worker répond mais la base n'est pas prête")); } catch (e) { flash("Worker introuvable"); } }} className="mt-3 text-sm font-medium bg-white border border-stone-300 rounded-lg px-3 py-1.5">Tester le chat</button>
              <p className="text-[11px] text-stone-400 mt-2">Après l'avoir activé, republie la journée : l'écran « Envoyer les postes » te donne alors ton lien organisateur, pour supprimer des messages ou retirer quelqu'un.</p>
            </Panel>
            <Panel open={open} id="groupe">
            <label className="text-[11px] uppercase tracking-wide text-stone-400">Nom affiché aux chasseurs</label>
            <input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="ex : Société de chasse de…" className="w-full border border-stone-300 rounded-lg px-3 py-2 mt-1.5 text-sm bg-white" />
            <button onClick={saveOrg} className="mt-3 bg-emerald-800 hover:bg-emerald-900 text-stone-50 text-sm font-medium px-4 py-2 rounded-lg">Enregistrer</button>
          </Panel>
            <Panel open={open} id="save">
            <p className="text-sm text-stone-600 mb-3">Ton carnet est enregistré automatiquement. Tu peux aussi en garder une copie sur ton appareil.</p>
            {poids && poids.total > 0 && (() => {
              const pc = Math.min(100, Math.round(poids.total / (40 * 1048576) * 100));
              // Images rangees a part : seul le texte est envoye a chaque enregistrement.
              const envoye = poids.stockage === "ko" ? poids.total : poids.texte;
              const alerte = envoye > 25 * 1048576;
              const attention = envoye > 12 * 1048576;
              return (<div className={`rounded-lg border p-3 mb-3 ${alerte ? "bg-red-50 border-red-200" : attention ? "bg-amber-50 border-amber-200" : "bg-stone-50 border-stone-200"}`}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[11px] uppercase tracking-widest text-stone-400">Poids de ton carnet</span>
                  <span className="text-sm font-medium text-stone-800">{ko(poids.total)}</span>
                </div>
                <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden mb-2">
                  <div className={`h-full rounded-full ${alerte ? "bg-red-600" : attention ? "bg-amber-600" : "bg-emerald-600"}`} style={{ width: pc + "%" }} />
                </div>
                <p className="text-[11px] text-stone-500">Dont {ko(poids.photos)} de photos et cartes ({poids.total > 0 ? Math.round(poids.photos / poids.total * 100) : 0} %) sur {poids.nbPhotos} image(s).</p>
                {poids.stockage === "ok" && <p className="text-[11px] text-emerald-800 mt-1">✓ Images rangées à part, envoyées une seule fois. Chaque enregistrement n'envoie que {ko(poids.texte)}.</p>}
                {poids.stockage === "ko" && <p className="text-[11px] text-amber-800 mt-1">Stockage des images pas encore installé : tout le carnet part à chaque enregistrement.</p>}
                {attention && !alerte && <p className="text-[12px] text-amber-800 mt-1.5">Ton carnet s'alourdit. Pense à supprimer les photos de postes devenues inutiles.</p>}
                {alerte && <p className="text-[12px] text-red-800 mt-1.5"><b>Carnet volumineux.</b> L'enregistrement peut ralentir. Allège les photos, ou archive les vieilles saisons via une sauvegarde.</p>}
              </div>);
            })()}
            <button onClick={onExportExcel} className="w-full text-left text-sm text-stone-700 py-2 border-b border-stone-100">⬆ Exporter en Excel</button>
            <button onClick={onExportJson} className="w-full text-left text-sm text-stone-700 py-2 border-b border-stone-100">⬆ Exporter en fichier de secours</button>
            <button onClick={onImportPick} className="w-full text-left text-sm text-stone-700 py-2">⬇ Importer une sauvegarde</button>
          </Panel>
          </div>
        </Group>

        {isAdmin && (<Group label="Le jeu">
          <div className="grid grid-cols-2 gap-3">
            <Tile open={open} onToggle={toggle} id="classement" emoji="🏆" title="Classement" sub={board.length ? board.length + " joueur" + (board.length > 1 ? "s" : "") : "personne pour l'instant"} />
            <Panel open={open} id="classement">
            <p className="text-sm text-stone-600 mb-3">Classement mondial du jeu du sanglier. Toi seul peux y faire le ménage.</p>
            {board.length === 0 ? (
              <p className="text-sm text-stone-500 italic">Aucun score enregistré.</p>
            ) : (
              <div className="border border-stone-200 rounded-lg divide-y divide-stone-100 max-h-72 overflow-auto">
                {board.map((e, i) => (
                  <div key={e.p + i} className="flex items-center gap-2 px-3 py-2">
                    <span className="text-[11px] text-stone-400 w-5 shrink-0">{i + 1}</span>
                    <span className="text-sm text-stone-800 flex-1 truncate">{e.p}</span>
                    <span className="text-xs text-stone-500 shrink-0">{e.s} m</span>
                    <button onClick={() => removeScore(e.p)} disabled={boardBusy} className="text-red-600 hover:text-red-800 disabled:text-stone-300 p-1 shrink-0" title="Retirer">
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {board.length > 0 && (<div className="border-t border-stone-100 mt-4 pt-3">
              <p className="text-sm font-medium text-red-700">Tout effacer</p>
              <p className="text-[11px] text-stone-400 mt-0.5 mb-2">Définitif. Écris EFFACER pour confirmer.</p>
              <div className="flex gap-2">
                <input value={wipe} onChange={(ev) => setWipe(ev.target.value)} placeholder="EFFACER" className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white" />
                <button onClick={wipeBoard} disabled={wipe !== "EFFACER" || boardBusy} className="bg-red-700 hover:bg-red-800 disabled:bg-stone-300 text-stone-50 text-sm font-medium px-4 py-2 rounded-lg shrink-0">Vider</button>
              </div>
            </div>)}
          </Panel>
          </div>
        </Group>)}

        <Group label="L'application">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setShowHelp(true)} className="rounded-xl border border-stone-200 bg-white hover:border-stone-300 p-3.5 text-left transition-colors">
              <div className="text-2xl mb-1.5">❓</div>
              <div className="text-sm font-medium text-stone-800">Aide</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Le guide complet</div>
            </button>
            <Tile open={open} onToggle={toggle} id="infos" emoji="📖" title="Infos pratiques" sub="Fédération, chiens de sang, dates" />
            <Panel open={open} id="infos">
              <p className="text-[11px] text-stone-400 mb-3">Ces informations changent chaque année et diffèrent selon les départements. L'app ne les recopie pas : elle t'emmène directement à la source officielle.</p>

              <label className="text-[10px] uppercase tracking-wide text-stone-400">Mon département</label>
              <input value={infos.dep || ""} onChange={(e) => majInfos({ dep: e.target.value.slice(0, 3) })} placeholder="ex. 71" className="w-24 border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1 block" />

              <p className="text-[10px] uppercase tracking-wide text-stone-400 mt-4">🏛️ Ma fédération départementale</p>
              <input value={infos.fdc || ""} onChange={(e) => majInfos({ fdc: e.target.value.trim().slice(0, 200) })} placeholder="colle ici l'adresse de son site" className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1 mb-2" />
              {(infos.fdc || "").indexOf("http") === 0
                ? <a href={infos.fdc} target="_blank" rel="noreferrer" className={lienExt}>Ouvrir le site de ma fédération</a>
                : <a href={cherche("fédération départementale des chasseurs " + (infos.dep || ""))} target="_blank" rel="noreferrer" className={lienExt}>Trouver ma fédération</a>}

              <p className="text-[10px] uppercase tracking-wide text-stone-400 mt-4">🐕 Conducteurs de chiens de sang</p>
              <p className="text-[11px] text-stone-500 mb-2">Leur intervention est gratuite. Appelle le plus tôt possible après le coup de feu, ne suis pas la piste et laisse les indices en place.</p>
              <a href="https://www.unucr.fr/conducteurs" target="_blank" rel="noreferrer" className={lienExt}>Les conducteurs agréés UNUCR</a>
              <a href={cherche("conducteurs chien de sang UNUCR " + (infos.dep || ""))} target="_blank" rel="noreferrer" className={lienExt + " mt-2"}>La liste de mon département</a>

              <label className="text-[10px] uppercase tracking-wide text-stone-400 block mt-3">Départements limitrophes</label>
              <input value={infos.voisins || ""} onChange={(e) => majInfos({ voisins: e.target.value.slice(0, 40) })} placeholder="ex. 21, 39, 01" className="w-full border border-stone-300 rounded px-2 py-1.5 text-sm bg-white mt-1 mb-2" />
              {depsVoisins.length > 0 && (<div className="flex flex-wrap gap-2">
                {depsVoisins.map((d) => (<a key={d} href={cherche("conducteurs chien de sang UNUCR " + d)} target="_blank" rel="noreferrer"
                  className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-[13px] font-medium text-stone-700 no-underline">Chiens de sang {d}</a>))}
              </div>)}

              <p className="text-[10px] uppercase tracking-wide text-stone-400 mt-4">📅 Ouverture et fermeture</p>
              <p className="text-[11px] text-stone-500 mb-2">Les dates sont fixées chaque année par arrêté préfectoral, département par département.</p>
              <a href={cherche("arrêté ouverture fermeture chasse " + saison + " département " + (infos.dep || ""))} target="_blank" rel="noreferrer" className={lienExt}>L'arrêté de la saison {saison}</a>
            </Panel>
            <Tile open={open} onToggle={toggle} id="contact" emoji="✉️" title="Nous écrire" sub="Une idée, un souci" />
            <Panel open={open} id="contact"><p className="text-sm text-stone-600">Une idée, une remarque ? Écris à <a href="mailto:contact@carnetdechasse.fr" className="text-emerald-800 underline">contact@carnetdechasse.fr</a></p></Panel>
            <button onClick={onInstall} className="rounded-xl border border-stone-200 bg-white hover:border-stone-300 p-3.5 text-left transition-colors">
              <div className="text-2xl mb-1.5">📲</div>
              <div className="text-sm font-medium text-stone-800">Installer l'app</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Sur ton écran d'accueil</div>
            </button>
            <button onClick={() => setShowLegal(true)} className="rounded-xl border border-stone-200 bg-white hover:border-stone-300 p-3.5 text-left transition-colors">
              <div className="text-2xl mb-1.5">📜</div>
              <div className="text-sm font-medium text-stone-800">Confidentialité</div>
              <div className="text-[11px] text-stone-400 mt-0.5">Tes données, mentions légales</div>
            </button>
            <Tile open={open} onToggle={toggle} id="apropos" emoji="ℹ️" title="À propos" sub={"Version " + APP_VERSION} />
            <Panel open={open} id="apropos"><p className="text-sm text-stone-700">Carnet de Chasse</p><p className="text-sm text-stone-500 mt-0.5">Version {APP_VERSION}</p></Panel>
          </div>
        </Group>

        <p className="text-center text-[11px] text-stone-400 pt-1 pb-4">Carnet de Chasse — {APP_VERSION}</p>
      </div>
    </div>

    {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-stone-900 text-stone-50 text-sm px-4 py-2 rounded-full shadow-lg">{toast}</div>}
  </div>);
}

// ---------- Impression des postes ----------
