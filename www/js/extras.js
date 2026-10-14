'use strict';
/* =====================================================================
   Latence — protocoles d'examen, études antérieures, verrou NIP,
   affichage (accent, taille), langue
   ===================================================================== */
const PROTOCOLS = [
  {k:'scc', fr:'Canal carpien', en:'Carpal tunnel',
   ncs:['median_m_apb', 'ulnar_m_adm', 'median_s_d2', 'ulnar_s_d5', 'radial_s', 'median_palm', 'ulnar_palm', 'median_ring', 'ulnar_ring'],
   emg:['Court abducteur du pouce', 'Premier interosseux dorsal', 'Rond pronateur', 'Paraspinaux cervicaux'],
   nfr:'Si les études de routine sont normales : études comparatives (palmaire, D4, pouce → CSI). Côté opposé si symptômes bilatéraux.',
   nen:'If routine studies are normal: comparison studies (palmar, ring, thumb → CSI). Test the other side if symptoms are bilateral.'},
  {k:'ulnar', fr:'Neuropathie ulnaire au coude', en:'Ulnar neuropathy at the elbow',
   ncs:['ulnar_m_adm', 'ulnar_m_fdi', 'median_m_apb', 'ulnar_s_d5', 'dorsal_ulnar_cut', 'median_s_d2', 'med_antebrachial'],
   emg:['Premier interosseux dorsal', 'Abducteur du 5e doigt', 'FDP IV–V', 'Fléchisseur ulnaire du carpe', 'Court abducteur du pouce', 'Extenseur propre de l\'index', 'Paraspinaux cervicaux'],
   nfr:'Ulnaire moteur : poignet, sous le coude et au-dessus du coude (coude fléchi ~90°, segment ≥ 10 cm). Inching si localisation incertaine.',
   nen:'Ulnar motor: wrist, below and above elbow (elbow flexed ~90°, segment ≥ 10 cm). Inching if localization is uncertain.'},
  {k:'cervical', fr:'Radiculopathie cervicale', en:'Cervical radiculopathy',
   ncs:['median_m_apb', 'ulnar_m_adm', 'median_s_d2', 'ulnar_s_d5', 'radial_s', 'lat_antebrachial'],
   emg:['Deltoïde', 'Biceps brachial', 'Rond pronateur', 'Triceps', 'Extenseur commun des doigts', 'Premier interosseux dorsal', 'Court abducteur du pouce', 'Paraspinaux cervicaux'],
   nfr:'PANS normaux attendus. Ondes F des nerfs moteurs. Dépistage : ≈ 6 muscles couvrant C5–T1 + paraspinaux.',
   nen:'Normal SNAPs expected. F waves on motor nerves. Screen: ~6 muscles covering C5–T1 + paraspinals.'},
  {k:'lumbar', fr:'Radiculopathie lombosacrée', en:'Lumbosacral radiculopathy',
   ncs:['peroneal_m_edb', 'tibial_m_ahb', 'sural', 'superficial_peroneal', 'h_soleus'],
   emg:['Vaste médial', 'Tibial antérieur', 'Long fibulaire', 'Tibial postérieur', 'Gastrocnémien médial', 'Moyen fessier', 'Paraspinaux lombaires'],
   nfr:'Ondes F tibial et fibulaire, réflexe H bilatéral (S1). PANS normaux attendus.',
   nen:'Tibial and peroneal F waves, bilateral H reflex (S1). Normal SNAPs expected.'},
  {k:'peroneal', fr:'Neuropathie fibulaire', en:'Peroneal neuropathy',
   ncs:['peroneal_m_edb', 'peroneal_m_ta', 'tibial_m_ahb', 'sural', 'superficial_peroneal'],
   emg:['Tibial antérieur', 'Long extenseur de l\'hallux', 'Long fibulaire', 'Biceps fémoral (chef court)', 'Tibial postérieur', 'Gastrocnémien médial', 'Paraspinaux lombaires'],
   nfr:'Fibulaire moteur : cheville, sous et au-dessus de la tête fibulaire, enregistrement EDB et tibial antérieur.',
   nen:'Peroneal motor: ankle, below and above fibular head, recording EDB and tibialis anterior.'},
  {k:'pnp', fr:'Polyneuropathie', en:'Polyneuropathy',
   ncs:['sural', 'superficial_peroneal', 'peroneal_m_edb', 'tibial_m_ahb', 'median_m_apb', 'ulnar_m_adm', 'median_s_d2', 'ulnar_s_d5', 'radial_s'],
   emg:['Tibial antérieur', 'Gastrocnémien médial', 'Premier interosseux dorsal', 'Vaste médial'],
   nfr:'Sural bilatéral, membre inférieur puis supérieur. Chercher un patron longueur-dépendant ; ondes F et blocs si suspicion de démyélinisation (PIDC).',
   nen:'Bilateral sural, lower then upper limb. Look for a length-dependent pattern; F waves and blocks if demyelination is suspected (CIDP).'},
  {k:'plexus', fr:'Plexopathie brachiale', en:'Brachial plexopathy',
   ncs:['median_m_apb', 'ulnar_m_adm', 'median_s_d2', 'ulnar_s_d5', 'radial_s', 'lat_antebrachial', 'med_antebrachial'],
   emg:['Sus-épineux', 'Deltoïde', 'Biceps brachial', 'Triceps', 'Rond pronateur', 'Extenseur propre de l\'index', 'Premier interosseux dorsal', 'Court abducteur du pouce', 'Paraspinaux cervicaux'],
   nfr:'Comparer au côté sain (PANS). Paraspinaux normaux attendus (post-ganglionnaire).',
   nen:'Compare with the unaffected side (SNAPs). Normal paraspinals expected (postganglionic).'},
  {k:'mnd', fr:'Maladie du motoneurone (SLA)', en:'Motor neuron disease (ALS)',
   ncs:['median_m_apb', 'ulnar_m_adm', 'peroneal_m_edb', 'tibial_m_ahb', 'median_s_d2', 'ulnar_s_d5', 'sural'],
   emg:['Langue', 'Paraspinaux thoraciques', 'Premier interosseux dorsal', 'Biceps brachial', 'Tibial antérieur', 'Vaste médial', 'Gastrocnémien médial'],
   nfr:'≥ 3 régions (bulbaire, cervicale, thoracique, lombosacrée). Critères de Gold Coast. Stimulation répétitive si fatigabilité.',
   nen:'≥ 3 regions (bulbar, cervical, thoracic, lumbosacral). Gold Coast criteria. Repetitive stimulation if fatigability.'},
  {k:'myo', fr:'Myopathie', en:'Myopathy',
   ncs:['median_m_apb', 'peroneal_m_edb', 'median_s_d2', 'sural'],
   emg:['Deltoïde', 'Biceps brachial', 'Iliopsoas', 'Vaste latéral', 'Tibial antérieur', 'Paraspinaux thoraciques'],
   nfr:'Muscles proximaux et paraspinaux ; PUM petits, brefs, polyphasiques, recrutement précoce.',
   nen:'Proximal muscles and paraspinals; small, short, polyphasic MUAPs with early recruitment.'}
];
const protoOf = k => PROTOCOLS.find(p => p.k === k) || null;
const pLabel = p => (LANG === 'en' ? p.en : p.fr);

function protocolCard(c) {
  const p = protoOf(c.clin.protocole); if (!p) return '';
  const done = k => (c.ncs.rows || []).some(r => r.normKey === k);
  const n = p.ncs.filter(done).length;
  return `<div class="card flat"><div class="sec-title" style="margin:0 0 6px"><h3 class="h3" style="margin:0">Études recommandées</h3><span class="tag ${n === p.ncs.length ? 'pos' : ''}">${n}/${p.ncs.length}</span></div>
    <p class="muted small" style="margin:0 0 8px">${esc(pLabel(p))} — ${esc(LANG === 'en' ? p.nen : p.nfr)}</p>
    ${p.ncs.map(k => { const nm = normOf(k); return `<div class="flag ${done(k) ? 'n' : ''}"><i></i><span>${esc(nm ? normLabel(nm) : k)}${done(k) ? ' ✓' : ''}</span></div>`; }).join('')}</div>`;
}
function protocolChips(c) {
  return `<label class="lab">Protocole d'examen</label><div class="chips">${PROTOCOLS.map(p => `<button class="chip ${c.clin.protocole === p.k ? 'on' : ''}" data-a="proto" data-v="${p.k}">${esc(pLabel(p))}</button>`).join('')}</div>`;
}

/* ---------- Études antérieures du même patient ---------- */
function samePatient(a, b) {
  const pa = a.patient, pb = b.patient;
  if (pa.dossier && pb.dossier) return nrm(pa.dossier) === nrm(pb.dossier);
  return !!(pa.nom && pb.nom && nrm(pa.nom) === nrm(pb.nom) && nrm(pa.prenom) === nrm(pb.prenom) && (!pa.ddn || !pb.ddn || pa.ddn === pb.ddn));
}
function priorCases(c) {
  if (!c.patient.nom && !c.patient.dossier) return [];
  return CASES.filter(x => x.id !== c.id && samePatient(x, c) && (x.date < c.date || (x.date === c.date && x.createdAt < c.createdAt)) && (x.report || x.analysis))
    .sort((a, b) => b.date.localeCompare(a.date));
}
const caseConclusion = x => (x.report && x.report.sections && x.report.sections.conclusion) || (x.analysis && x.analysis.conclusion_preliminaire) || '';
function priorCard(c) {
  const pr = priorCases(c).slice(0, 3); if (!pr.length) return '';
  return `<div class="card flat"><h3 class="h3">Études antérieures</h3>${pr.map(x => `<button class="lib-item" data-a="open" data-id="${x.id}"><span><b>${esc(fmtDate(x.date))}</b><small>${esc(caseConclusion(x).slice(0, 220))}</small></span>${ic('right', 18)}</button>`).join('')}
  <p class="muted small" style="margin:8px 0 0">Gemini comparera avec la plus récente lors de l'analyse et du rapport.</p></div>`;
}
const priorContext = c => priorCases(c).slice(0, 2).map(x => ({date: x.date, conclusion: caseConclusion(x)}));

/* ---------- Verrou NIP (propre à l'appareil) ---------- */
const PIN_KEY = 'latence.pin';
const getPin = () => { try { return JSON.parse(localStorage.getItem(PIN_KEY) || 'null'); } catch (e) { return null; } };
async function hashPin(pin, salt) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pin)); return Array.from(new Uint8Array(b), x => x.toString(16).padStart(2, '0')).join(''); }
let PIN_BUF = '', PIN_MODE = null, PIN_FIRST = '', PIN_TRIES = 0, HIDDEN_AT = 0;
function lockShown() { return !!$('#lock').innerHTML; }
function showLock(mode) {
  PIN_MODE = mode; PIN_BUF = '';
  const title = mode === 'set' ? (PIN_FIRST ? 'Confirme ton NIP' : 'Choisis un NIP à 4 chiffres') : 'Latence est verrouillée';
  $('#lock').innerHTML = `<div class="lock" role="dialog" aria-modal="true"><div class="lock-in">
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 13h5l2-6 3 12 2.5-9 1.5 3h6"/></svg>
    <h2 class="h2" style="margin:10px 0 0">${esc(title)}</h2>
    <div class="pin-dots">${[0, 1, 2, 3].map(i => `<i class="${i < PIN_BUF.length ? 'on' : ''}"></i>`).join('')}</div>
    <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-a="pin-key" data-v="${n}">${n}</button>`).join('')}
      <button data-a="${mode === 'set' ? 'pin-cancel' : 'pin-forgot'}" style="font-size:13px">${mode === 'set' ? 'Annuler' : 'Oublié ?'}</button><button data-a="pin-key" data-v="0">0</button><button data-a="pin-del" aria-label="Effacer">⌫</button></div>
  </div></div>`;
  if (typeof i18nApply === 'function') i18nApply($('#lock'));
}
function updateDots() { $$('.pin-dots i').forEach((el, i) => el.classList.toggle('on', i < PIN_BUF.length)); }
async function pinKey(v) {
  if (PIN_BUF.length >= 4) return; PIN_BUF += v; updateDots();
  if (PIN_BUF.length < 4) return;
  const entered = PIN_BUF;
  if (PIN_MODE === 'set') {
    if (!PIN_FIRST) { PIN_FIRST = entered; setTimeout(() => showLock('set'), 150); return; }
    if (PIN_FIRST !== entered) { PIN_FIRST = ''; toast('Les NIP ne correspondent pas. Recommence.'); setTimeout(() => showLock('set'), 150); return; }
    const salt = randomSecret(); localStorage.setItem(PIN_KEY, JSON.stringify({salt, hash: await hashPin(entered, salt), delay: 2}));
    PIN_FIRST = ''; $('#lock').innerHTML = ''; toast('NIP activé ✓'); rerender(); return;
  }
  const p = getPin();
  if (p && await hashPin(entered, p.salt) === p.hash) { PIN_TRIES = 0; $('#lock').innerHTML = ''; return; }
  PIN_TRIES++; PIN_BUF = ''; updateDots();
  if (PIN_TRIES >= 5) { localStorage.removeItem(PIN_KEY); $('#lock').innerHTML = ''; toast('5 essais : déconnexion par sécurité.'); await signOutAll(); if (!FB) onAuthChanged(); return; }
  toast('NIP incorrect (' + (5 - PIN_TRIES) + ' essai(s) restant(s))');
}
function maybeLock() { const p = getPin(); if (p && (AUTH.state === 'in' || AUTH.state === 'offline') && !lockShown()) showLock('unlock'); }
document.addEventListener('visibilitychange', () => {
  if (document.hidden) HIDDEN_AT = Date.now();
  else { const p = getPin(); if (p && HIDDEN_AT && Date.now() - HIDDEN_AT > (p.delay || 2) * 60000) maybeLock(); }
});
document.addEventListener('keydown', e => { if (!lockShown() || !PIN_MODE) return; if (/^\d$/.test(e.key)) pinKey(e.key); else if (e.key === 'Backspace') { PIN_BUF = PIN_BUF.slice(0, -1); updateDots(); } });

/* ---------- Affichage ---------- */
const ACCENTS = [['green', '#30d158'], ['blue', '#0a84ff'], ['violet', '#bf5af2'], ['orange', '#ff9f0a'], ['pink', '#ff375f']];
const THEME_ICON = {auto:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>', light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', dark:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'};
function displaySettings() {
  const pin = getPin();
  return `<details class="acc"><summary>Affichage et langue ${ic('down', 18)}</summary><div class="acc-in">
    <label class="lab">Thème</label>
    <div class="seg">${[['auto', 'Auto'], ['light', 'Clair'], ['dark', 'Sombre']].map(([k, l]) => `<button data-a="theme" data-v="${k}" class="${SET.theme === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <label class="lab">Couleur d'accent</label>
    <div class="chips" style="gap:12px;padding:6px 2px 14px">${ACCENTS.map(([k, c]) => `<button class="swatch ${(SET.accent || 'green') === k ? 'on' : ''}" style="background:${c}" data-a="set-val" data-k="accent" data-v="${k}" aria-label="${k}"></button>`).join('')}</div>
    <label class="lab">Taille du texte</label>
    <div class="seg">${[['m', 'Normale'], ['l', 'Grande'], ['xl', 'Très grande']].map(([k, l]) => `<button data-a="set-val" data-k="textSize" data-v="${k}" class="${(SET.textSize || 'm') === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <label class="lab">Langue de l'application</label>
    <div class="seg">${[['fr', 'Français'], ['en', 'English']].map(([k, l]) => `<button data-a="set-lang" data-v="${k}" class="${LANG === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <label class="lab">Langue des rapports</label>
    <div class="seg">${[['fr', 'Français'], ['en', 'English']].map(([k, l]) => `<button data-a="set-val" data-k="reportLang" data-v="${k}" class="${reportLang() === k ? 'on' : ''}">${l}</button>`).join('')}</div>
  </div></details>
  <details class="acc"><summary>Sécurité ${pin ? '<span class="tag pos">NIP</span>' : ''} ${ic('down', 18)}</summary><div class="acc-in">
    <p class="muted small" style="margin:0 0 8px">Verrouille Latence sur cet appareil avec un NIP à 4 chiffres (après 2 minutes en arrière-plan et à l'ouverture). 5 erreurs = déconnexion.</p>
    ${pin ? `<div class="seg">${[[1, '1 min'], [2, '2 min'], [5, '5 min'], [15, '15 min']].map(([k, l]) => `<button data-a="pin-delay" data-v="${k}" class="${(pin.delay || 2) === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      <div class="btns"><button class="btn sm ghost" data-a="pin-lock-now">Verrouiller maintenant</button><button class="btn sm danger-ghost" data-a="pin-off">Désactiver le NIP</button></div>`
    : `<button class="btn sm primary" data-a="pin-set">Activer un NIP</button>`}
  </div></details>`;
}
function applyDisplay() {
  const r = document.documentElement;
  if (SET.accent && SET.accent !== 'green') r.setAttribute('data-accent', SET.accent); else r.removeAttribute('data-accent');
  if (SET.textSize && SET.textSize !== 'm') r.setAttribute('data-size', SET.textSize); else r.removeAttribute('data-size');
  r.lang = LANG;
  const b = $('#themebtn'); if (b) { const t = SET.theme || 'auto'; b.innerHTML = `<svg class="ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${THEME_ICON[t] || THEME_ICON.auto}</svg>`; b.style.display = (AUTH.state === 'in' || AUTH.state === 'offline') ? '' : 'none'; b.setAttribute('aria-label', (LANG === 'en' ? 'Theme: ' : 'Thème : ') + t); }
}

/* ---------- Actions supplémentaires ---------- */
async function handleExtra(a, el) {
  const d = el.dataset;
  switch (a) {
    case 'proto': { cur.clin.protocole = cur.clin.protocole === d.v ? '' : d.v; touch(true); rerender(); return true; }
    case 'proto-emg': {
      const p = protoOf(cur.clin.protocole); if (!p) return true;
      const sd = (cur.clin.membres || []).some(m => /gauche|left/i.test(m)) && !(cur.clin.membres || []).some(m => /droit|right/i.test(m)) ? 'G' : 'D';
      let n = 0; p.emg.forEach(m => { const e = emgEntry(m, sd); if (!cur.emg.some(x => nrm(x.muscle) === nrm(e.muscle) && x.cote === sd)) { cur.emg.push(e); n++; } });
      touch(true); rerender(); toast(n + ' muscle(s) ajouté(s)'); return true;
    }
    case 'theme-cycle': { const order = ['auto', 'light', 'dark']; SET.theme = order[(order.indexOf(SET.theme || 'auto') + 1) % 3]; saveSet(); rerender(); toast({auto:'Thème automatique', light:'Thème clair', dark:'Thème sombre'}[SET.theme]); return true; }
    case 'set-lang': { setLang(d.v); SET.lang = d.v; if (!SET.reportLangSet) SET.reportLang = d.v; saveSet(); setTimeout(() => location.reload(), 300); return true; }
    case 'pin-set': PIN_FIRST = ''; showLock('set'); return true;
    case 'pin-key': pinKey(d.v); return true;
    case 'pin-del': PIN_BUF = PIN_BUF.slice(0, -1); updateDots(); return true;
    case 'pin-cancel': PIN_FIRST = ''; $('#lock').innerHTML = ''; return true;
    case 'pin-forgot': if (await confirmSheet('NIP oublié ?', 'Tu seras déconnecté. Reconnecte-toi avec ton compte pour retrouver tes cas (synchronisés).', 'Se déconnecter')) { localStorage.removeItem(PIN_KEY); $('#lock').innerHTML = ''; await signOutAll(); if (!FB) onAuthChanged(); } return true;
    case 'pin-off': localStorage.removeItem(PIN_KEY); toast('NIP désactivé'); rerender(); return true;
    case 'pin-delay': { const p = getPin(); if (p) { p.delay = +d.v; localStorage.setItem(PIN_KEY, JSON.stringify(p)); } rerender(); return true; }
    case 'pin-lock-now': showLock('unlock'); return true;
  }
  return false;
}
