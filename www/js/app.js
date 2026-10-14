'use strict';
/* =====================================================================
   Latence — interface
   ===================================================================== */
const ICON = {
  home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".6"/><circle cx="4.5" cy="12" r=".6"/><circle cx="4.5" cy="18" r=".6"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  cam:'<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.8"/>',
  img:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  wave:'<path d="M2 13h5l2-6 3 12 2.5-9 1.5 3h6"/>',
  brain:'<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4z"/>',
  needle:'<path d="M20 4l-9 9M14 4h6v6M11 13l-6 6M7 13l4 4"/>',
  doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  left:'<path d="M15 6l-6 6 6 6"/>',
  right:'<path d="M9 6l6 6-6 6"/>',
  down:'<path d="M6 9l6 6 6-6"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  share:'<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.4 13.3l7.2 4.4M15.6 6.3l-7.2 4.4"/>',
  cloud:'<path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5z"/><path d="M12 11v6M9.5 13.5L12 11l2.5 2.5"/>',
  print:'<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3"/><rect x="7" y="14" width="10" height="7"/>',
  rotate:'<path d="M4 4v6h6"/><path d="M5.5 15a8 8 0 1 0 1.9-8.3L4 10"/>',
  crop:'<path d="M6 2v14a2 2 0 0 0 2 2h14M18 22V8a2 2 0 0 0-2-2H2"/>',
  refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  dots:'<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
  download:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  upload:'<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>'
};
function ic(n, s) { s = s || 22; return `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n] || ''}</svg>`; }

/* ---------- État ---------- */
let CASES = [];
let cur = null;
const S = {view:'home', step:0, editRows:false, editReport:false, q:'', filter:'all', models:null, libSide:'D', libQ:''};
const STEPS = [
  {k:'patient', l:'Patient'}, {k:'photos', l:'Photos'}, {k:'values', l:'Valeurs'},
  {k:'analysis', l:'Analyse'}, {k:'emg', l:'EMG'}, {k:'report', l:'Rapport'}
];
const ATCD = ['Diabète', 'Hypothyroïdie', 'Insuffisance rénale', 'Alcool', 'Chimiothérapie', 'Chirurgie antérieure', 'Anticoagulant', 'Stimulateur / DCI', 'Grossesse'];
const MEMBRES = ['MS droit', 'MS gauche', 'MI droit', 'MI gauche', 'Face / bulbaire', 'Paraspinaux'];

function newCase() {
  return {id:uid(), owner:(AUTH.user && AUTH.user.uid) || null, createdAt:Date.now(), updatedAt:Date.now(), date:todayISO(), final:false,
    patient:{nom:'', prenom:'', dossier:'', ddn:'', sexe:'', taille:''},
    clin:{referent:'', motif:'', debut:'', symptomes:'', examen:'', atcd:[], atcdTxt:'', membres:[], tMain:'', tPied:''},
    photos:[], emgPhotos:[], ncs:{rows:[], tMain:null, tPied:null, autres:'', at:null, lisibilite:''},
    analysis:null, emg:[], emgNote:'', report:null, drive:{state:'none'}};
}
function caseStatus(c) {
  if (c.final) return {t:'Finalisé', cls:'pos'};
  if (c.report) return {t:'Rapport prêt', cls:'ink'};
  if ((c.emg || []).some(emgFilled)) return {t:'EMG en cours', cls:''};
  if (c.analysis) return {t:'Analysé', cls:''};
  if (c.ncs.rows.length) return {t:'Valeurs lues', cls:''};
  return {t:'Brouillon', cls:''};
}
function stepDone(c, i) {
  return [!!(c.clin.motif || c.patient.nom), c.photos.length > 0 || c.ncs.rows.length > 0, c.ncs.rows.length > 0, !!c.analysis, (c.emg || []).some(emgFilled), !!c.report][i];
}
const pName = c => [c.patient.nom ? c.patient.nom.toUpperCase() : '', c.patient.prenom].filter(Boolean).join(' ') || 'Nouveau patient';

/* ---------- Sauvegarde ---------- */
const flushSave = debounce(() => { if (cur) { DB.put('cases', storableCase(cur)).catch(e => toast('Enregistrement impossible : ' + e.message)); cloudPushCase(cur); } }, 350);
function touch(noRender) { if (!cur) return; cur.updatedAt = Date.now(); if (cur.drive && cur.drive.state === 'ok') cur.drive.state = 'stale'; flushSave(); updateSync(); if (!noRender) render(); }
async function saveNow(c) { c = c || cur; if (c) { await DB.put('cases', storableCase(c)); cloudPushCase(c); } }

/* ---------- UI : utilitaires ---------- */
let toastT;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800); }
function busy(title, sub) {
  $('#busy').innerHTML = title ? `<div class="busy" role="alert" aria-busy="true"><div class="busy-in"><svg class="wave" width="120" height="40" viewBox="0 0 120 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h26l8-16 10 30 9-24 6 10h57"/></svg><p>${esc(title)}</p>${sub ? `<small>${esc(sub)}</small>` : ''}</div></div>` : '';
}
function openSheet(html, tall) {
  $('#sheets').innerHTML = `<div class="sheet-wrap" data-a="sheet-close-bg"><div class="sheet${tall ? ' tall' : ''}" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div></div>`;
  document.body.classList.add('locked');
}
function closeSheet() { $('#sheets').innerHTML = ''; document.body.classList.remove('locked'); }
function confirmSheet(title, text, okLbl, danger) {
  return new Promise(res => {
    openSheet(`<div class="sh-head"><h2 class="sh-title">${esc(title)}</h2></div><p class="muted">${esc(text)}</p><div class="btns"><button class="btn ghost" id="cf-no">Annuler</button><button class="btn ${danger ? 'danger-ghost' : 'primary'}" id="cf-ok">${esc(okLbl || 'OK')}</button></div>`);
    $('#cf-no').onclick = () => { closeSheet(); res(false); };
    $('#cf-ok').onclick = () => { closeSheet(); res(true); };
  });
}
function applyTheme() { const r = document.documentElement; if (SET.theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', SET.theme); }
function updateSync() {
  const el = $('#sync'); if (!el) return;
  if (AUTH.state !== 'in' && AUTH.state !== 'offline') { el.className = 'sync'; el.textContent = ''; return; }
  if (driveModeEff() === 'off') { el.className = 'sync ' + (AUTH.state === 'in' ? 'ok' : 'wait'); el.textContent = AUTH.state === 'in' ? 'Synchronisé' : 'Hors ligne'; return; }
  const pend = CASES.filter(c => c.report && c.final && c.drive && c.drive.state !== 'ok').length;
  const err = CASES.some(c => c.drive && c.drive.state === 'err');
  el.className = 'sync ' + (err ? 'err' : pend ? 'wait' : 'ok');
  el.textContent = err ? 'Drive : erreur' : pend ? pend + ' à envoyer' : 'Drive à jour';
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); toast('Copié dans le presse-papiers'); }
  catch (e) { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('Copié'); } catch (x) { toast('Copie impossible'); } ta.remove(); }
}
async function saveFile(name, mime, content) {
  const P = CAP();
  if (P && P.Filesystem && P.Share) {
    const b64 = content instanceof Uint8Array ? u8ToB64(content) : btoa(unescape(encodeURIComponent(content)));
    const w = await P.Filesystem.writeFile({path:name, data:b64, directory:'CACHE'});
    await P.Share.share({title:name, files:[w.uri]}).catch(() => {});
    return;
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], {type:mime})); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}

/* =====================================================================
   Rendu
   ===================================================================== */
function render() {
  applyTheme();
  if (AUTH.state !== 'in' && AUTH.state !== 'offline') {
    $('#gear').innerHTML = ''; $('#navbar').style.display = 'none'; $('#bar').innerHTML = '';
    $('#view').innerHTML = viewLogin(); updateSync(); return;
  }
  const inCase = S.view === 'case' && cur;
  $('#gear').innerHTML = ic('gear');
  $('#navbar').style.display = inCase ? 'none' : '';
  $('#nav').innerHTML = [['home', 'Accueil', 'home'], ['new', 'Nouveau', 'plus'], ['history', 'Historique', 'list'], ['settings', 'Réglages', 'gear']]
    .map(([v, l, i]) => v === 'new'
      ? `<button class="go" data-a="new-case" aria-label="Nouveau cas"><i>${ic(i, 26)}</i>${l}</button>`
      : `<button data-a="nav" data-v="${v}" class="${S.view === v ? 'on' : ''}" aria-current="${S.view === v ? 'page' : 'false'}">${ic(i)}${l}</button>`).join('');
  const v = $('#view');
  const scrollKeep = S._keepScroll ? window.scrollY : 0;
  if (inCase) v.innerHTML = viewCase();
  else if (S.view === 'history') v.innerHTML = viewHistory();
  else if (S.view === 'settings') v.innerHTML = viewSettings();
  else v.innerHTML = viewHome();
  $('#bar').innerHTML = inCase ? barCase() : '';
  if (S._keepScroll) { window.scrollTo(0, scrollKeep); S._keepScroll = false; }
  updateSync();
  hydratePhotos();
}
function rerender() { S._keepScroll = true; render(); }
async function hydratePhotos() {
  for (const el of $$('img[data-ph]')) { if (el.src && !el.src.endsWith('#')) continue; const d = await photoData(el.dataset.ph); if (d) el.src = d; }
}


/* ---------- Connexion ---------- */
function viewLogin() {
  const st = AUTH.state, u = AUTH.user || {};
  const brand = `<div style="text-align:center;margin:28px 0 22px"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--pos)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 13h5l2-6 3 12 2.5-9 1.5 3h6"/></svg><h1 class="hero-title" style="margin:10px 0 4px">Latence</h1><p class="muted" style="margin:0">Lecture des conductions, plan d'EMG et rapport</p></div>`;
  if (st === 'loading') return `<div class="wrap">${brand}<p class="empty">Chargement…</p></div>`;
  if (st === 'verify') return `<div class="wrap">${brand}<div class="card"><h3 class="h3">${ic('mail', 18)} Vérifie ton courriel</h3>
    <p class="small">Un lien de confirmation a été envoyé à <b>${esc(u.email)}</b>. Ouvre-le, puis reviens ici.</p>
    <div class="btns"><button class="btn primary" data-a="verify-check">J'ai confirmé</button><button class="btn ghost" data-a="verify-resend">Renvoyer le courriel</button></div>
    <button class="btn sm danger-ghost" data-a="sign-out" style="margin-top:6px">Se déconnecter</button></div></div>`;
  if (st === 'denied') return `<div class="wrap">${brand}<div class="card"><h3 class="h3">Accès sur invitation</h3>
    <p class="small"><b>${esc(u.email)}</b> n'est pas encore autorisé. Demande à l'administrateur de Latence de t'inviter, puis touche « Réessayer ».</p>
    <div class="btns"><button class="btn primary" data-a="verify-check">Réessayer</button><button class="btn danger-ghost" data-a="sign-out">Se déconnecter</button></div></div></div>`;
  const up = S.loginMode === 'up';
  return `<div class="wrap">${brand}
  ${AUTH.msg ? `<div class="note warn">${esc(AUTH.msg)}</div>` : ''}
  ${!isNativeApp() ? `<button class="btn ghost big wide" data-a="login-google"><svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg> Continuer avec Google</button>
  <p class="muted small" style="text-align:center;margin:4px 0 14px">Recommandé : donne aussi accès à ton Google Drive pour les rapports.</p>` : ''}
  <div class="card"><h3 class="h3">${up ? 'Créer un compte' : 'Connexion par courriel'}</h3>
    <label class="lab">Courriel<input class="field" id="lg-email" type="email" autocomplete="email" inputmode="email"></label>
    <label class="lab">Mot de passe<input class="field" id="lg-pw" type="password" autocomplete="${up ? 'new-password' : 'current-password'}" placeholder="${up ? '8 caractères ou plus' : ''}"></label>
    <div class="btns"><button class="btn primary" data-a="${up ? 'signup-email' : 'login-email'}">${up ? 'Créer le compte' : 'Se connecter'}</button></div>
    <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:8px">
      <button class="btn sm ghost" data-a="login-mode">${up ? 'J\'ai déjà un compte' : 'Créer un compte'}</button>
      ${!up ? '<button class="btn sm ghost" data-a="reset-pw">Mot de passe oublié</button>' : ''}</div>
  </div>
  <p class="muted small" style="text-align:center">Accès sur invitation. Tes données restent privées : chaque compte ne voit que ses propres cas.</p>
  </div>`;
}

/* ---------- Accueil ---------- */
function greet() { const h = new Date().getHours(); return h < 5 ? 'Bonne nuit' : h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir'; }
function caseRow(c) {
  const st = caseStatus(c); const concl = c.analysis && c.analysis.conclusion_preliminaire;
  const dr = c.drive && c.drive.state === 'ok' ? `<span class="tag pos">${ic('cloud', 13)} Drive</span>` : c.drive && c.drive.state === 'err' ? `<span class="tag neg">Drive</span>` : '';
  return `<button class="row case-row" data-a="open" data-id="${c.id}"><span class="who"><b>${esc(pName(c))}</b><small>${esc((concl || c.clin.motif || 'Sans motif').slice(0, 90))}</small></span><span class="tags"><span class="tag ${st.cls}">${st.t}</span>${dr}</span></button>`;
}
function viewHome() {
  const t = todayISO(); const today = CASES.filter(c => c.date === t);
  const wk = CASES.filter(c => (Date.now() - parseISO(c.date).getTime()) < 7 * 864e5).length;
  const pend = CASES.filter(c => !c.final).length;
  const recent = [...CASES].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
  const setup = !SET.geminiKey ? `<div class="card"><h3 class="h3">Configurer Gemini</h3><p class="muted small" style="margin:0 0 12px">Ajoute ta clé API Google AI Studio pour lire les photos et générer les rapports.</p><button class="btn primary sm" data-a="nav" data-v="settings">${ic('key', 18)} Ajouter la clé</button></div>`
    : driveModeEff() === 'off' && !S.hideDriveTip ? `<div class="card flat"><h3 class="h3">Rapports dans Google Drive</h3><p class="muted small" style="margin:0 0 12px">Connecte ton Drive pour classer automatiquement chaque rapport par jour et par patient.</p><button class="btn ghost sm" data-a="nav" data-v="settings">${ic('cloud', 18)} Connecter Drive</button></div>` : '';
  return `<div class="wrap">
  <p class="status live-dot">${esc(fmtDateLong(t))}</p>
  <h1 class="hero-title">${greet()}${SET.doctor.nom ? ',<br>' + esc(SET.doctor.nom.replace(/^(dr|dre|docteure?)\.?\s+/i, '').split(' ')[0]) : ''}</h1>
  <p class="hero-sub">Photo des conductions, analyse selon les normes, plan d'EMG et rapport — au même endroit.</p>
  <div class="stats3"><div><b>${today.length}</b><span>Aujourd'hui</span></div><div><b>${wk}</b><span>7 derniers jours</span></div><div><b>${pend}</b><span>En cours</span></div></div>
  <button class="btn primary big wide" data-a="new-case">${ic('cam')} Nouveau cas</button>
  ${setup}
  <div class="flow"><div>${ic('cam')}Photo NCS</div><div>${ic('brain')}Conclusion</div><div>${ic('needle')}Plan EMG</div><div>${ic('doc')}Rapport</div></div>
  <div class="sec-title"><h2 class="h2">Récents</h2>${CASES.length ? '<button class="btn sm ghost" data-a="nav" data-v="history">Tout voir</button>' : ''}</div>
  ${recent.length ? recent.map(caseRow).join('') : '<p class="empty">Aucun cas pour l\'instant.</p>'}
  </div>`;
}

/* ---------- Historique ---------- */
function viewHistory() {
  const q = nrm(S.q);
  let list = [...CASES].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  if (q) list = list.filter(c => nrm([c.patient.nom, c.patient.prenom, c.patient.dossier, c.clin.motif, c.analysis && c.analysis.conclusion_preliminaire].join(' ')).includes(q));
  if (S.filter === 'draft') list = list.filter(c => !c.final);
  if (S.filter === 'final') list = list.filter(c => c.final);
  if (S.filter === 'unsync') list = list.filter(c => c.report && (!c.drive || c.drive.state !== 'ok'));
  let html = '', last = '';
  list.forEach(c => { if (c.date !== last) { html += `<div class="day-h">${esc(fmtDateLong(c.date))}</div>`; last = c.date; } html += caseRow(c); });
  const f = [['all', 'Tous'], ['draft', 'En cours'], ['final', 'Finalisés'], ['unsync', 'Non envoyés']];
  return `<div class="wrap"><h1 class="hero-title" style="font-size:38px">Historique</h1>
  <input class="search" type="search" placeholder="Nom, dossier, diagnostic…" value="${esc(S.q)}" data-a-input="hist-q" aria-label="Rechercher">
  <div class="chips scroll">${f.map(([k, l]) => `<button class="chip ${S.filter === k ? 'on' : ''}" data-a="hist-f" data-v="${k}">${l}</button>`).join('')}</div>
  ${AUTH.state === 'in' ? `<button class="btn sm ghost" data-a="cloud-sync" style="margin:0 0 6px">${ic('refresh', 18)} Synchroniser</button>` : ''}
  <div id="hist-list">${html || '<p class="empty">Aucun cas.</p>'}</div></div>`;
}

/* ---------- Cas ---------- */
function viewCase() {
  const c = cur;
  const steps = STEPS.map((s, i) => `<button class="step ${S.step === i ? 'on' : ''} ${stepDone(c, i) ? 'done' : ''}" data-a="step" data-v="${i}"><i>${stepDone(c, i) && S.step !== i ? '✓' : i + 1}</i>${s.l}</button>`).join('');
  const body = [stepPatient, stepPhotos, stepValues, stepAnalysis, stepEmg, stepReport][S.step](c);
  return `<div class="wrap">
  <div class="case-head"><div><p class="status">${esc(fmtDate(c.date))} · ${caseStatus(c).t}</p><h1>${esc(pName(c))}</h1></div>
  <div style="display:flex;gap:2px"><button class="icon-btn" data-a="close-case" aria-label="Fermer">${ic('x')}</button><button class="icon-btn" data-a="case-menu" aria-label="Options">${ic('dots')}</button></div></div>
  <div class="steps" role="tablist">${steps}</div>${body}</div>`;
}
function fld(path, label, opt) {
  opt = opt || {}; const v = getPath(cur, path);
  const attrs = `data-f="${path}" ${opt.num ? 'inputmode="decimal"' : ''} placeholder="${esc(opt.ph || '')}" aria-label="${esc(label)}"`;
  const inp = opt.area ? `<textarea class="field" rows="${opt.rows || 3}" ${attrs}>${esc(v || '')}</textarea>` : `<input class="field" type="${opt.type || 'text'}" value="${esc(v == null ? '' : v)}" ${attrs}>`;
  return `<label class="lab">${esc(label)}${inp}</label>`;
}
function stepPatient(c) {
  const age = ageAt(c.patient.ddn, c.date);
  return `
  <div class="card"><h3 class="h3">Patient</h3>
    <div class="grid2">${fld('patient.nom', 'Nom')}${fld('patient.prenom', 'Prénom')}</div>
    <div class="grid2">${fld('patient.ddn', 'Date de naissance', {type:'date'})}${fld('patient.dossier', 'No dossier')}</div>
    <div class="grid2"><label class="lab">Sexe<div class="seg">${['F', 'M', 'X'].map(s => `<button data-a="set" data-f="patient.sexe" data-v="${s}" class="${c.patient.sexe === s ? 'on' : ''}">${s}</button>`).join('')}</div></label>${fld('patient.taille', 'Taille (cm)', {num:true, ph:'ex. 172'})}</div>
    ${age != null ? `<p class="muted small" style="margin:-4px 0 4px">${age} ans le jour de l'examen</p>` : ''}
    ${fld('date', 'Date de l\'examen', {type:'date'})}
    <p class="muted small" style="margin:0">Le nom, le dossier et la date de naissance restent sur l'appareil et dans ton Drive : ils ne sont jamais envoyés à Gemini.</p>
  </div>
  <div class="card"><h3 class="h3">Demande</h3>
    ${fld('clin.referent', 'Médecin référent')}
    ${fld('clin.motif', 'Question clinique / motif', {area:true, rows:2, ph:'ex. Paresthésies D1-D3 main droite, r/o SCC vs radiculopathie C6'})}
    ${fld('clin.debut', 'Début des symptômes', {ph:'ex. 6 mois, ou 2026-08-01'})}
    <label class="lab">Membres étudiés</label>
    <div class="chips">${MEMBRES.map(m => `<button class="chip ${c.clin.membres.includes(m) ? 'on' : ''}" data-a="tog-arr" data-f="clin.membres" data-v="${esc(m)}">${m}</button>`).join('')}</div>
  </div>
  <div class="card"><h3 class="h3">Clinique</h3>
    ${fld('clin.symptomes', 'Symptômes', {area:true, ph:'Distribution, nocturne, faiblesse, douleur…'})}
    ${fld('clin.examen', 'Examen physique', {area:true, ph:'Force, ROT, sensibilité, Tinel/Phalen, Spurling, atrophie…'})}
    <label class="lab">Antécédents pertinents</label>
    <div class="chips">${ATCD.map(m => `<button class="chip ${c.clin.atcd.includes(m) ? 'on' : ''}" data-a="tog-arr" data-f="clin.atcd" data-v="${esc(m)}">${m}</button>`).join('')}</div>
    ${fld('clin.atcdTxt', 'Autres antécédents / médication', {ph:'ex. statine, chirurgie de décompression 2021…'})}
    <div class="grid2">${fld('clin.tMain', 'Température main (°C)', {num:true, ph:'≥ 32'})}${fld('clin.tPied', 'Température pied (°C)', {num:true, ph:'≥ 30'})}</div>
    ${c.clin.atcd.includes('Anticoagulant') ? '<div class="note warn">Anticoagulant : évaluer le risque avant l\'EMG à l\'aiguille des muscles profonds (ex. iliopsoas, tibial postérieur, paraspinaux).</div>' : ''}
    ${c.clin.atcd.includes('Stimulateur / DCI') ? '<div class="note warn">Stimulateur / DCI : éviter la stimulation proximale près du dispositif (Erb, aisselle du côté de l\'appareil).</div>' : ''}
  </div>`;
}
function stepPhotos(c) {
  const tiles = c.photos.map((p, i) => `<div class="ph"><img data-ph="${p.id}" alt="Page ${i + 1}" src="#"><b>${i + 1}</b><div class="ph-acts"><button data-a="ph-edit" data-i="${i}" aria-label="Recadrer">${ic('crop', 18)}</button><button data-a="ph-del" data-i="${i}" aria-label="Supprimer">${ic('trash', 18)}</button></div></div>`).join('');
  return `
  <div class="card"><h3 class="h3">Photos des conductions</h3>
    <p class="muted small" style="margin:0 0 6px">Photographie le tableau des valeurs (une ou plusieurs pages), bien à plat et éclairé. Recadre pour masquer le nom du patient.</p>
    <div class="photos">${tiles}
      <label class="add-ph file-btn">${ic('cam', 26)}Caméra<input type="file" accept="image/*" capture="environment" data-a-file="ncs" aria-label="Prendre une photo"></label>
      <label class="add-ph file-btn">${ic('img', 26)}Galerie<input type="file" accept="image/*" multiple data-a-file="ncs" aria-label="Choisir des photos"></label>
    </div>
    ${c.ncs.at ? `<div class="note good">${c.ncs.rows.length} mesures lues le ${new Date(c.ncs.at).toLocaleString('fr-CA', {dateStyle:'medium', timeStyle:'short'})}. Relire remplacera les valeurs.</div>` : ''}
  </div>
  <button class="btn ghost wide" data-a="manual">${ic('edit', 18)} Saisir les valeurs à la main</button>`;
}
function cellTd(v, dec, st, lat) { return `<td class="${st && st !== 'z' ? st : ''}">${v == null ? '<span class="muted">—</span>' : lat ? fmtL(v) : fmtN(v, dec)}</td>`; }
function ncsTableHTML(c, ev) {
  const order = [['motor', 'Moteurs'], ['sensory', 'Sensitifs'], ['mixed', 'Mixtes'], ['F', 'Ondes F'], ['H', 'Réflexe H'], ['blink', 'Clignement'], ['other', 'Autres']];
  let h = '';
  order.forEach(([t, l]) => {
    const rs = c.ncs.rows.map((r, i) => [r, i]).filter(([r]) => r.type === t); if (!rs.length) return;
    h += `<tr class="grp"><td colspan="5">${l}</td></tr>`;
    rs.forEach(([r, i]) => {
      const o = ev.cells[i], n = normOf(r.normKey);
      const nm = n ? [n.lat != null ? '≤' + fmtN(n.lat) + ' ms' : '', n.amp != null ? '≥' + fmtN(n.amp) + (r.type === 'motor' ? ' mV' : ' µV') : '', n.cv != null ? '≥' + fmtN(n.cv, 0) + ' m/s' : ''].filter(Boolean).join(' · ') : 'sans norme';
      h += `<tr><td><b class="tn">${esc(shortName(r))}</b>${siteName(r) ? `<span class="nm">${esc(siteName(r))}</span>` : ''}<span class="nm">${esc(nm)}</span></td>` +
        (r.absent ? `<td class="x" colspan="3">Absente</td>` : cellTd(rowLatency(r), 2, o.lat, 1) + cellTd(r.amplitude, 1, o.amp) + cellTd(r.vitesse, 0, o.cv)) + cellTd(r.f_lat, 1, o.f, 1) + '</tr>';
    });
  });
  return `<div class="tbl-wrap"><table class="ncs"><thead><tr><th>Étude</th><th>Lat.<br>ms</th><th>Amp.</th><th>VC<br>m/s</th><th>F<br>ms</th></tr></thead><tbody>${h}</tbody></table></div>
  <div class="legend"><span><i style="background:var(--pos)"></i>Normal</span><span><i style="background:var(--neg)"></i>Hors normes</span><span><u>souligné</u> zone démyélinisante</span></div>`;
}
function findingsHTML(F) {
  if (!F.length) return '<p class="muted small" style="margin:0">Aucune anomalie selon les normes intégrées.</p>';
  const ord = {a:0, w:1, n:2};
  return [...F].sort((a, b) => ord[a.lvl] - ord[b.lvl]).map(f => `<div class="flag ${f.lvl}"><i></i><span>${esc(f.txt)}</span></div>`).join('');
}
const SEGS = [['distal', 'Distal'], ['avant-bras', 'Avant-bras'], ['trans-coude', 'Trans-coude'], ['bras', 'Bras'], ['aisselle', 'Aisselle'], ['erb', 'Erb'], ['jambe', 'Sous tête fib.'], ['trans-tete-fibulaire', 'Trans-tête fib.'], ['creux-poplite', 'Creux poplité'], ['autre', 'Autre']];
function rowEditor(r, i) {
  const opt = (arr, v) => arr.map(([k, l]) => `<option value="${esc(k)}" ${v === k ? 'selected' : ''}>${esc(l)}</option>`).join('');
  const nk = [['autre', '— Autre / sans norme —'], ...NORMS().map(n => [n.key, n.grp + ' · ' + n.label])];
  const inp = (f, l, cls) => `<label class="mini ${cls || ''}">${l}<input inputmode="decimal" data-rf="${i}.${f}" value="${r[f] == null ? '' : esc(r[f])}"></label>`;
  return `<div class="ed-row"><div class="ed-top"><b>${esc(rowName(r))}</b><button class="icon-btn" data-a="row-del" data-i="${i}" aria-label="Supprimer la ligne">${ic('trash', 18)}</button></div>
  <div class="ed-f">
    <label class="mini wide">Type<select data-rf="${i}.type">${opt([['motor', 'Moteur'], ['sensory', 'Sensitif'], ['mixed', 'Mixte'], ['F', 'Onde F'], ['H', 'Réflexe H'], ['blink', 'Clignement'], ['other', 'Autre']], r.type)}</select></label>
    <label class="mini">Côté<select data-rf="${i}.cote">${opt([['D', 'Droit'], ['G', 'Gauche'], ['?', '?']], r.cote)}</select></label>
    <label class="mini">Absente<select data-rf="${i}.absent">${opt([['false', 'Non'], ['true', 'Oui']], String(!!r.absent))}</select></label>
    <label class="mini full">Norme<select data-rf="${i}.normKey">${opt(nk, r.normKey || 'autre')}</select></label>
    <label class="mini wide">Nerf (texte)<input data-rf="${i}.nerf" value="${esc(r.nerf || '')}"></label>
    <label class="mini wide">Segment<select data-rf="${i}.segment">${opt(SEGS, r.segment || 'distal')}</select></label>
    <label class="mini full">Site de stimulation<input data-rf="${i}.stimulation" value="${esc(r.stimulation || '')}"></label>
    ${inp('latence', 'Lat. début')}${inp('latence_pic', 'Lat. pic')}${inp('amplitude', 'Amplitude')}${inp('vitesse', 'VC m/s')}
    ${inp('distance', 'Dist. cm')}${inp('f_lat', 'Onde F')}${inp('duree', 'Durée')}
  </div></div>`;
}
function stepValues(c) {
  if (!c.ncs.rows.length && !S.editRows) return `<div class="card"><p class="empty">Aucune valeur pour l'instant. Ajoute des photos et lance la lecture, ou saisis-les à la main.</p><div class="btns"><button class="btn ghost" data-a="step" data-v="1">${ic('cam', 18)} Photos</button><button class="btn ghost" data-a="manual">${ic('edit', 18)} Saisie manuelle</button></div></div>`;
  const ev = evaluate(c);
  const nA = ev.findings.filter(f => f.lvl === 'a').length;
  return `
  ${c.ncs.lisibilite && c.ncs.lisibilite !== 'bonne' ? `<div class="note warn">Lisibilité des photos : ${esc(c.ncs.lisibilite)}. Vérifie les valeurs avant d'analyser.</div>` : ''}
  <div class="card"><div class="sec-title" style="margin:0 0 8px"><h3 class="h3" style="margin:0">Conductions</h3><button class="btn sm ${S.editRows ? 'primary' : 'ghost'}" data-a="edit-rows">${ic(S.editRows ? 'check' : 'edit', 16)} ${S.editRows ? 'Terminé' : 'Corriger'}</button></div>
  ${S.editRows ? '' : ncsTableHTML(c, ev)}
  ${S.editRows ? `<div class="grid2" style="margin-top:6px"><label class="mini">Temp. main (°C)<input inputmode="decimal" data-f="ncs.tMain" value="${esc(c.ncs.tMain == null ? '' : c.ncs.tMain)}"></label><label class="mini">Temp. pied (°C)<input inputmode="decimal" data-f="ncs.tPied" value="${esc(c.ncs.tPied == null ? '' : c.ncs.tPied)}"></label></div>` : ''}
  </div>
  ${S.editRows ? c.ncs.rows.map(rowEditor).join('') + `<button class="btn ghost wide" data-a="row-add">${ic('plus', 18)} Ajouter une ligne</button>` : ''}
  <div class="card"><h3 class="h3">Selon les normes ${nA ? `<span class="tag neg">${nA} anomalie${nA > 1 ? 's' : ''}</span>` : '<span class="tag pos">normal</span>'}</h3>${findingsHTML(ev.findings)}</div>
  ${c.ncs.autres ? `<div class="card flat"><h3 class="h3">Autres informations lues</h3><p class="small pre" style="margin:0">${esc(c.ncs.autres)}</p></div>` : ''}`;
}
function stepAnalysis(c) {
  const a = c.analysis;
  if (!a) return `<div class="card"><h3 class="h3">Analyse clinique</h3><p class="muted">Gemini va interpréter les conductions avec les anomalies calculées selon tes normes et le contexte clinique, puis proposer les muscles à tester.</p>${!c.ncs.rows.length ? '<div class="note warn">Aucune valeur de conduction : l\'analyse se basera seulement sur la clinique.</div>' : ''}</div>`;
  const prio = {'essentiel':'neg', 'recommandé':'', 'optionnel':''};
  const plan = (a.emg_plan || []).map((m, i) => {
    const lib = findMuscle(m.muscle);
    return `<div class="musc ${m.sel ? 'on' : ''}" data-a="plan-tog" data-i="${i}" role="checkbox" aria-checked="${!!m.sel}" tabindex="0"><span class="tick">${ic('check', 16)}</span><div><b>${esc(m.muscle)} ${esc(m.cote)}</b> <span class="tag ${prio[m.priorite] || ''}">${esc(m.priorite || '')}</span>
    ${lib ? `<div class="inn">${esc(lib.nerf)} · ${esc(lib.rac)}${lib.plex ? ' · ' + esc(lib.plex) : ''}</div>` : '<div class="inn">Hors bibliothèque</div>'}<p>${esc(m.raison)}</p></div></div>`;
  }).join('');
  const nSel = (a.emg_plan || []).filter(m => m.sel).length;
  return `
  <div class="card"><p class="status">Conclusion préliminaire</p><p class="concl">${esc(a.conclusion_preliminaire)}</p>
    <div class="chips">${a.pattern ? `<span class="tag ink">${esc(a.pattern)}</span>` : ''}${a.severite ? `<span class="tag warn">${esc(a.severite)}</span>` : ''}${a.localisation ? `<span class="tag">${esc(a.localisation)}</span>` : ''}</div>
    <p class="small" style="margin:0">${esc(a.synthese)}</p></div>
  ${(a.alertes || []).length ? `<div class="note warn"><b>À vérifier</b><br>${a.alertes.map(esc).join('<br>')}</div>` : ''}
  <details class="acc"><summary>Constats ${ic('down', 18)}</summary><div class="acc-in">${(a.constats || []).map(f => `<div class="flag ${f.niveau === 'anormal' ? 'a' : f.niveau === 'limite' || f.niveau === 'technique' ? 'w' : 'n'}"><i></i><span>${esc(f.texte)}</span></div>`).join('')}</div></details>
  <details class="acc"><summary>Différentiel et corrélation clinique ${ic('down', 18)}</summary><div class="acc-in">
    ${(a.diagnostics_differentiels || []).length ? `<ul style="margin:0 0 10px;padding-left:20px">${a.diagnostics_differentiels.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
    ${a.correlation_clinique ? `<p class="small" style="margin:0">${esc(a.correlation_clinique)}</p>` : ''}</div></details>
  ${(a.ncs_supplementaires || []).length ? `<details class="acc"><summary>Conductions à ajouter (${a.ncs_supplementaires.length}) ${ic('down', 18)}</summary><div class="acc-in">${a.ncs_supplementaires.map(n => `<div class="flag w"><i></i><span><b>${esc(n.etude)}</b> — ${esc(n.raison)}</span></div>`).join('')}</div></details>` : ''}
  <div class="card"><div class="sec-title" style="margin:0 0 4px"><h3 class="h3" style="margin:0">Plan d'EMG à l'aiguille</h3><span class="tag">${nSel} choisi${nSel > 1 ? 's' : ''}</span></div>
    ${a.strategie_emg ? `<p class="muted small" style="margin:0 0 6px">${esc(a.strategie_emg)}</p>` : ''}
    ${plan || '<p class="empty">Aucun muscle proposé.</p>'}
  </div>
  <button class="btn ghost wide" data-a="analyze">${ic('refresh', 18)} Relancer l'analyse</button>`;
}
function emgCard(e, i) {
  const rows = EMG_FIELDS.map(f => `<div class="opt-row"><span>${f.l}</span><div class="opts">${f.opts.map(o => {
    const on = e[f.k] === o; const bad = on && ((f.k === 'fib' || f.k === 'psw') ? o !== '0' : f.k === 'fasc' ? o === '+' : f.k === 'ins' ? o === '↑' : o !== 'N');
    return `<button class="${on ? 'on' : ''} ${bad ? 'bad' : ''}" data-a="emg-set" data-i="${i}" data-k="${f.k}" data-v="${esc(o)}">${esc(o)}</button>`; }).join('')}</div></div>`).join('');
  const other = `<div class="opt-row"><span>Autres</span><div class="opts">${EMG_OTHER.map(o => `<button class="${(e.autre || []).includes(o) ? 'on bad' : ''}" data-a="emg-other" data-i="${i}" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`;
  return `<div class="emg-card ${emgAbnormal(e) ? 'abn' : ''}"><div class="emg-top"><div><b>${esc(e.muscle)} ${esc(e.cote)}</b><small>${esc([e.nerf, e.rac].filter(Boolean).join(' · ') || 'Innervation non précisée')}</small></div>
  <div style="display:flex;gap:4px;flex:none"><button class="btn sm ghost" data-a="emg-normal" data-i="${i}">Normal</button><button class="icon-btn" data-a="emg-side" data-i="${i}" aria-label="Changer de côté" style="width:38px;height:38px;font-size:13px;font-weight:600">${e.cote === 'G' ? 'D' : 'G'}</button><button class="icon-btn" data-a="emg-del" data-i="${i}" aria-label="Retirer" style="width:38px;height:38px">${ic('trash', 18)}</button></div></div>
  ${rows}${other}<label class="mini full" style="margin-top:6px">Note<input data-ef="${i}.note" value="${esc(e.note || '')}" placeholder="ex. PUM > 4 mV, recrutement réduit en distal"></label></div>`;
}
function stepEmg(c) {
  const done = c.emg.filter(emgFilled).length;
  return `
  <div class="card flat"><div class="sec-title" style="margin:0"><span class="small">${done}/${c.emg.length} muscle${c.emg.length > 1 ? 's' : ''} saisi${done > 1 ? 's' : ''}</span>
    <label class="btn sm ghost file-btn">${ic('cam', 16)} Lire une photo<input type="file" accept="image/*" multiple data-a-file="emg" aria-label="Photo du tableau EMG"></label></div>
    ${c.emgPhotos.length ? `<p class="muted small" style="margin:8px 0 0">${c.emgPhotos.length} photo(s) EMG jointe(s).</p>` : ''}</div>
  ${c.emg.map(emgCard).join('') || '<p class="empty">Aucun muscle. Choisis-en dans l\'analyse ou ajoute-les ici.</p>'}
  <button class="btn ghost wide" data-a="lib">${ic('plus', 18)} Ajouter un muscle</button>
  <label class="lab">Commentaires de l'examen (ex. limité par la douleur, mauvaise collaboration)<textarea class="field" rows="2" data-f="emgNote">${esc(c.emgNote || '')}</textarea></label>`;
}
function stepReport(c) {
  if (!c.report) return `<div class="card"><h3 class="h3">Rapport</h3><p class="muted">Le rapport complet sera rédigé à partir des conductions, de l'EMG et de la clinique. Tu pourras modifier chaque section avant de finaliser.</p>${!c.emg.some(emgFilled) ? '<div class="note">Aucun EMG saisi : le rapport portera sur les conductions seulement.</div>' : ''}</div>`;
  const keys = [['renseignements', 'Renseignements cliniques'], ['technique', 'Technique'], ['ncs_resume', 'Conductions (résumé)'], ['emg_resume', 'EMG (résumé)'], ['interpretation', 'Interprétation'], ['conclusion', 'Conclusion'], ['recommandations', 'Recommandations']];
  const dr = c.drive || {};
  return `
  <div class="btns no-print" style="margin-top:0">
    <button class="btn sm ${S.editReport ? 'primary' : 'ghost'}" data-a="edit-report">${ic(S.editReport ? 'check' : 'edit', 16)} ${S.editReport ? 'Aperçu' : 'Modifier'}</button>
    <button class="btn sm ghost" data-a="rep-copy">${ic('copy', 16)} Copier (DME)</button>
    <button class="btn sm ghost" data-a="rep-word">${ic('doc', 16)} Word</button>
    <button class="btn sm ghost" data-a="rep-export">${ic(CAP() ? 'share' : 'print', 16)} ${CAP() ? 'Partager' : 'PDF / imprimer'}</button>
  </div>
  ${dr.state === 'ok' ? `<div class="note good no-print">${ic('cloud', 16)} Dans Drive (${esc(c.date)} › ${esc(patientFolder(c))})${dr.url ? ` — <a href="${esc(dr.url)}" target="_blank" rel="noopener">ouvrir le dossier</a>` : ''}</div>` : dr.state === 'auth' ? `<div class="note warn no-print">La connexion Google Drive a expiré. <button class="btn sm ghost" data-a="drive-send" style="margin-left:6px">${ic('cloud', 16)} Reconnecter et envoyer</button></div>` : dr.state === 'err' ? `<div class="note bad no-print">Envoi Drive échoué : ${esc(dr.error || '')}</div>` : dr.state === 'stale' ? '<div class="note warn no-print">Modifié depuis le dernier envoi au Drive.</div>' : ''}
  ${S.editReport ? keys.map(([k, l]) => `<div class="sec-ed"><label class="lab">${l}<textarea class="field" rows="${k === 'interpretation' || k === 'ncs_resume' ? 6 : 3}" data-f="report.sections.${k}">${esc(c.report.sections[k] || '')}</textarea></label></div>`).join('')
    : `<div class="rep">${reportParts(c).body}</div>`}
  <button class="btn ghost wide no-print" data-a="report-gen">${ic('refresh', 18)} Régénérer le rapport</button>`;
}
function barCase() {
  const c = cur, s = S.step;
  const back = s > 0 ? `<button class="btn ghost" data-a="step" data-v="${s - 1}" aria-label="Étape précédente">${ic('left')}</button>` : `<button class="btn ghost" data-a="close-case" aria-label="Fermer">${ic('left')}</button>`;
  let main = '';
  if (s === 0) main = `<button class="btn primary" data-a="step" data-v="1">Photos ${ic('right', 18)}</button>`;
  if (s === 1) main = `<button class="btn ${c.photos.length ? 'go' : 'primary'}" data-a="extract" ${c.photos.length ? '' : 'disabled'}>${ic('wave', 18)} Lire les valeurs</button>`;
  if (s === 2) main = `<button class="btn go" data-a="analyze" ${c.ncs.rows.length || c.clin.motif ? '' : 'disabled'}>${ic('brain', 18)} ${c.analysis ? 'Réanalyser' : 'Analyser'}</button>` + (c.analysis ? `<button class="btn ghost" data-a="step" data-v="3">${ic('right')}</button>` : '');
  if (s === 3) main = c.analysis ? `<button class="btn primary" data-a="to-emg">${ic('needle', 18)} Passer à l'EMG</button><button class="btn ghost" data-a="skip-emg" title="Rapport sans EMG">${ic('doc')}</button>` : `<button class="btn go" data-a="analyze">${ic('brain', 18)} Analyser</button>`;
  if (s === 4) main = `<button class="btn go" data-a="report-gen">${ic('doc', 18)} ${c.report ? 'Régénérer le rapport' : 'Générer le rapport'}</button>`;
  if (s === 5) main = !c.report ? `<button class="btn go" data-a="report-gen">${ic('doc', 18)} Générer le rapport</button>`
    : !c.final ? `<button class="btn go" data-a="finalize">${ic('check', 18)} Finaliser${driveModeEff() !== 'off' && SET.autoSync ? ' et envoyer' : ''}</button>`
    : `<button class="btn primary" data-a="drive-send" ${driveModeEff() !== 'off' ? '' : 'disabled'}>${ic('cloud', 18)} ${c.drive && c.drive.state === 'ok' ? 'Renvoyer au Drive' : 'Envoyer au Drive'}</button>`;
  return `<div class="bar"><div class="bar-in">${back}${main}</div></div>`;
}

/* ---------- Réglages ---------- */
function viewSettings() {
  const mdl = (k) => { const list = S.models || [SET[k]]; const all = list.includes(SET[k]) ? list : [SET[k], ...list];
    return `<select class="field" data-sf="${k}">${all.map(m => `<option ${m === SET[k] ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select>`; };
  const nr = NORMS().map((n, i) => `<div class="norm-row"><span>${esc(n.label)}</span>${['lat', 'amp', 'cv', 'f'].map(k => n[k] === undefined || (n[k] === null && n.grp === 'Comparatif') ? '<span></span>' : `<input inputmode="decimal" data-nf="${i}.${k}" value="${n[k] == null ? '' : n[k]}" aria-label="${k}">`).join('')}</div>`).join('');
  const R = RULES();
  const u = AUTH.user || {};
  const acct = `<div class="card"><div class="sec-title" style="margin:0 0 6px"><h3 class="h3" style="margin:0">${ic('user', 18)} Compte</h3>${AUTH.admin ? '<span class="tag ink">Administrateur</span>' : ''}</div>
    <p class="small" style="margin:0 0 4px"><b>${esc(u.displayName || u.name || '')}</b> ${esc(u.email || '')}</p>
    <p class="muted small" style="margin:0 0 10px">${AUTH.state === 'offline' ? 'Hors ligne : les changements seront synchronisés au retour d\'Internet.' : 'Tes cas et réglages sont synchronisés sur tous tes appareils (Firestore, Montréal). Les photos restent sur l\'appareil et dans Drive.'}</p>
    <div class="btns" style="margin-top:0">${AUTH.state === 'in' ? `<button class="btn sm ghost" data-a="cloud-sync">${ic('refresh', 16)} Synchroniser</button>` : ''}
    ${AUTH.state === 'in' && !isNativeApp() && hasProvider('google.com') && !hasProvider('password') ? `<button class="btn sm ghost" data-a="add-pw">${ic('key', 16)} Mot de passe pour l'app Android</button>` : ''}
    <button class="btn sm danger-ghost" data-a="sign-out">Se déconnecter</button></div></div>`;
  const admin = AUTH.admin && AUTH.state === 'in' ? `<details class="acc" id="acc-admin"><summary>Utilisateurs invités ${ic('down', 18)}</summary><div class="acc-in">
    <p class="muted small" style="margin:0 0 8px">Seules les adresses de cette liste peuvent utiliser Latence. Chaque personne a ses propres cas, sa clé Gemini et son Drive.</p>
    <div style="display:flex;gap:8px;margin:0 0 10px"><input class="field" id="inv-email" type="email" placeholder="courriel@exemple.com" autocomplete="off"><button class="btn sm primary" data-a="inv-add">Inviter</button></div>
    <div id="inv-list">${S.invites ? (S.invites.length ? S.invites.map(i => `<div class="lib-item"><span>${esc(i.email)}<small>Invité ${i.at ? 'le ' + new Date(i.at).toLocaleDateString('fr-CA') : ''}</small></span><button class="icon-btn" data-a="inv-del" data-v="${esc(i.email)}" aria-label="Retirer">${ic('trash', 18)}</button></div>`).join('') : '<p class="empty">Aucune invitation.</p>') : `<button class="btn sm ghost" data-a="inv-load">Afficher la liste</button>`}</div>
    <div class="note small">Message à envoyer : « Ouvre ${esc(location.origin + location.pathname)} (ou installe l'app Android depuis Réglages › Installer), crée ton compte avec cette adresse, puis ajoute ta clé Gemini dans Réglages. »</div>
  </div></details>` : '';
  const install = !isNativeApp() ? `<details class="acc"><summary>${ic('phone', 18)} Installer sur le téléphone ${ic('down', 18)}</summary><div class="acc-in">
    <p class="small" style="margin:0 0 8px"><b>Android :</b> télécharge l'application, puis ouvre le fichier pour l'installer (autorise l'installation depuis ton navigateur si demandé).</p>
    <a class="btn sm primary" href="Latence.apk" download="Latence.apk">${ic('download', 16)} Télécharger Latence.apk</a>
    <p class="small" style="margin:12px 0 0"><b>Ou</b> (Android et iPhone) : menu du navigateur › <b>Ajouter à l'écran d'accueil</b>. C'est la version la plus complète (connexion Google et Drive personnel).</p>
  </div></details>` : '';
  return `<div class="wrap"><h1 class="hero-title" style="font-size:38px">Réglages</h1>
  ${acct}${admin}
  ${!SET.geminiKey ? `<div class="card"><h3 class="h3">Configuration rapide</h3><p class="muted small" style="margin:0 0 8px">Colle le code ou le lien de configuration reçu pour tout régler d'un coup.</p><div style="display:flex;gap:8px"><input class="field" id="cfg-code" placeholder="https://…#config=… ou code" autocomplete="off"><button class="btn sm primary" data-a="cfg-apply">Appliquer</button></div></div>` : ''}
  <details class="acc" ${!SET.geminiKey ? 'open' : ''}><summary>Gemini (IA) ${SET.geminiKey ? '<span class="tag pos">configuré</span>' : '<span class="tag neg">à faire</span>'} ${ic('down', 18)}</summary><div class="acc-in">
    <ol class="howto"><li>Va sur <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a> et crée une clé API.</li><li>Colle-la ci-dessous, puis touche « Tester ».</li><li>Pour des données de patients, active la facturation sur le projet de la clé : au niveau payant, Google n'utilise pas les requêtes pour entraîner ses modèles.</li></ol>
    <label class="lab">Clé API<input class="field" type="password" autocomplete="off" data-sf="geminiKey" value="${esc(SET.geminiKey)}" placeholder="AIza…"></label>
    <label class="lab">Vitesse / profondeur de l'analyse</label>
    <div class="chips">${Object.entries(AI_PROFILES).map(([k, p]) => `<button class="chip ${(SET.aiProfile || 'rapide') === k ? 'on' : ''}" data-a="set-val" data-k="aiProfile" data-v="${k}">${p.l}</button>`).join('')}</div>
    <p class="muted small" style="margin:0 0 10px">${esc((AI_PROFILES[SET.aiProfile] || AI_PROFILES.rapide).d)} Les valeurs anormales sont toujours calculées par l'app selon tes normes, quel que soit le modèle. Si un modèle est surchargé, l'app en essaie un autre automatiquement.</p>
    ${SET.aiProfile === 'perso' ? `<label class="lab">Modèle pour lire les photos${mdl('modelRead')}</label><label class="lab">Modèle pour l'analyse et le rapport${mdl('modelThink')}</label>` : ''}
    <div class="btns"><button class="btn sm ghost" data-a="gem-test">${ic('check', 16)} Tester</button><button class="btn sm ghost" data-a="gem-models">${ic('refresh', 16)} Charger les modèles</button></div>
  </div></details>

  <details class="acc" ${SET.geminiKey && driveModeEff() === 'off' ? 'open' : ''}><summary>Google Drive ${driveModeEff() !== 'off' ? '<span class="tag pos">' + (driveModeEff() === 'google' ? 'mon Drive' : 'script') + '</span>' : '<span class="tag">désactivé</span>'} ${ic('down', 18)}</summary><div class="acc-in">
    <p class="small" style="margin:0 0 8px">Chaque rapport finalisé est enregistré dans <b>${esc(SET.rootName)} › date › patient</b> (Word + texte, et photos si tu veux).</p>
    <div class="seg" role="group" aria-label="Mode Drive">${[['google', 'Mon Drive'], ['script', 'Script'], ['off', 'Désactivé']].map(([k, l]) => `<button data-a="set-val" data-k="driveMode" data-v="${k}" class="${driveModeEff() === k ? 'on' : ''}" ${k === 'google' && isNativeApp() ? 'disabled' : ''}>${l}</button>`).join('')}</div>
    ${driveModeEff() === 'google' ? `<p class="small" style="margin:0 0 8px">Connexion directe à ton Google Drive : l'app n'a accès qu'aux fichiers qu'elle crée. La connexion dure une heure ; l'app te la redemande au besoin.</p>
      <div class="btns" style="margin-top:0"><button class="btn sm ${tokenValid() ? 'ghost' : 'primary'}" data-a="drive-connect">${ic('cloud', 16)} ${tokenValid() ? 'Connecté — reconnecter' : 'Connecter Google Drive'}</button></div>` : ''}
    ${driveModeEff() === 'google' && isNativeApp() ? '<div class="note warn">Le mode « Mon Drive » fonctionne sur le site web. Dans l\'app Android, utilise le mode « Script ».</div>' : ''}
    ${driveModeEff() === 'script' ? `<p class="muted small" style="margin:0 0 6px">Mode avancé (fonctionne aussi dans l'app Android) : un petit script Google dans ton compte reçoit les rapports.</p>
    <ol class="howto">
      <li>Touche « Générer » pour créer ton mot de passe de synchronisation, puis « Copier le script ».</li>
      <li>Sur un ordinateur, ouvre <a href="https://script.google.com/home/projects/create" target="_blank" rel="noopener">script.google.com</a> (compte Google du Drive voulu), efface le contenu et colle le script.</li>
      <li>Déployer › Nouveau déploiement › type <b>Application Web</b> · Exécuter en tant que : <b>Moi</b> · Accès : <b>Tout le monde</b>. Autorise l'accès au Drive.</li>
      <li>Copie l'URL de l'application Web (…/exec) ici, puis « Tester ».</li>
    </ol>
    <label class="lab">Mot de passe de synchronisation<div style="display:flex;gap:8px;margin-top:6px"><input class="field" style="margin:0" data-sf="driveSecret" value="${esc(SET.driveSecret)}" placeholder="Générer →"><button class="btn sm ghost" data-a="secret-gen">Générer</button></div></label>
    <button class="btn sm ghost" data-a="script-copy" style="margin:0 0 12px">${ic('copy', 16)} Copier le script (secret inclus)</button>
    <label class="lab">URL de l'application Web<input class="field" data-sf="driveUrl" value="${esc(SET.driveUrl)}" placeholder="https://script.google.com/macros/s/…/exec"></label>
    <label class="lab">Format du rapport</label>
    <div class="seg" role="group" aria-label="Format">${[['docx', 'Word'], ['pdf', 'PDF'], ['both', 'Les deux']].map(([k, l]) => `<button data-a="set-val" data-k="driveFormat" data-v="${k}" class="${(SET.driveFormat || 'docx') === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <div class="btns"><button class="btn sm ghost" data-a="drive-test">${ic('check', 16)} Tester</button></div>` : ''}
    ${driveModeEff() !== 'off' ? `<label class="lab">Dossier racine<input class="field" data-sf="rootName" value="${esc(SET.rootName)}"></label>
    <div class="seg" role="group" aria-label="Photos"><button data-a="set-bool" data-k="driveImages" data-v="1" class="${SET.driveImages ? 'on' : ''}">Avec photos</button><button data-a="set-bool" data-k="driveImages" data-v="0" class="${!SET.driveImages ? 'on' : ''}">Sans photos</button></div>
    <div class="seg" role="group" aria-label="Envoi"><button data-a="set-bool" data-k="autoSync" data-v="1" class="${SET.autoSync ? 'on' : ''}">Envoi à la finalisation</button><button data-a="set-bool" data-k="autoSync" data-v="0" class="${!SET.autoSync ? 'on' : ''}">Manuel</button></div>
    <div class="btns"><button class="btn sm ghost" data-a="drive-all">${ic('upload', 16)} Envoyer tous les rapports</button></div>` : ''}
  </div></details>

  <details class="acc"><summary>Signature du rapport ${ic('down', 18)}</summary><div class="acc-in">
    <label class="lab">Nom<input class="field" data-sf="doctor.nom" value="${esc(SET.doctor.nom)}" placeholder="Dr Prénom Nom"></label>
    <label class="lab">Titre<input class="field" data-sf="doctor.titre" value="${esc(SET.doctor.titre)}" placeholder="ex. Physiatre / Résident en physiatrie"></label>
    <label class="lab">Établissement<input class="field" data-sf="doctor.etab" value="${esc(SET.doctor.etab)}"></label>
    <label class="lab">Coordonnées / no de permis<input class="field" data-sf="doctor.coord" value="${esc(SET.doctor.coord)}"></label>
  </div></details>

  <details class="acc"><summary>Normes du laboratoire ${SET.norms ? '<span class="tag warn">modifiées</span>' : ''} ${ic('down', 18)}</summary><div class="acc-in">
    <p class="muted small" style="margin:0 0 8px">Adultes, par défaut Preston &amp; Shapiro. Latence : maximum (ms). Amplitude : minimum (mV moteur, µV sensitif). VC : minimum (m/s). F : maximum (ms). Ajuste aux normes de ton laboratoire.</p>
    <div class="norm-row h"><span>Étude</span><span>Lat ≤</span><span>Amp ≥</span><span>VC ≥</span><span>F ≤</span></div>${nr}
    <h3 class="h3" style="margin:16px 0 6px">Règles</h3>
    ${[['blockDrop', 'Chute d\'amplitude = bloc probable (%)'], ['elbowCv', 'VC ulnaire trans-coude minimale (m/s)'], ['focalDrop', 'Ralentissement focal significatif (m/s)'], ['sideAmp', 'Asymétrie d\'amplitude côté à côté (%)'], ['demyLat', 'Zone démyélinisante — latence (% LSN)'], ['demyCv', 'Zone démyélinisante — VC (% LIN)'], ['tempHand', 'Température main minimale (°C)'], ['tempFoot', 'Température pied minimale (°C)']]
      .map(([k, l]) => `<div class="norm-row" style="grid-template-columns:1fr 70px"><span>${l}</span><input inputmode="decimal" data-rl="${k}" value="${R[k]}"></div>`).join('')}
    <div class="btns"><button class="btn sm danger-ghost" data-a="norms-reset">Rétablir les normes par défaut</button></div>
  </div></details>

  ${install}
  <details class="acc"><summary>Affichage et données ${ic('down', 18)}</summary><div class="acc-in">
    <div class="seg">${[['auto', 'Auto'], ['light', 'Clair'], ['dark', 'Sombre']].map(([k, l]) => `<button data-a="theme" data-v="${k}" class="${SET.theme === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <div class="btns"><button class="btn sm ghost" data-a="backup">${ic('download', 16)} Sauvegarde (JSON)</button><label class="btn sm ghost file-btn">${ic('upload', 16)} Restaurer<input type="file" accept="application/json,.json" data-a-file="restore"></label></div>
    <div class="btns"><button class="btn sm danger-ghost" data-a="wipe">${ic('trash', 16)} Effacer toutes les données de l'appareil</button></div>
  </div></details>
  <div class="note small">Latence ${APP_VERSION} — outil d'aide à la lecture. Les anomalies sont calculées selon les normes ci-dessus ; l'interprétation de Gemini doit être révisée par le médecin, qui reste responsable du rapport. Données des patients : sur cet appareil, dans ton compte (Firestore, Montréal) et dans ton Google Drive ; Gemini ne reçoit que l'âge, le sexe, la taille, la clinique et les valeurs (et les photos, à recadrer).</div>
  </div>`;
}

/* =====================================================================
   Actions
   ===================================================================== */
async function openCase(id, step) {
  cur = CASES.find(c => c.id === id); if (!cur) return;
  S.view = 'case'; S.editRows = false; S.editReport = false;
  S.step = step != null ? step : cur.report ? 5 : (cur.emg || []).length ? 4 : cur.analysis ? 3 : cur.ncs.rows.length ? 2 : cur.photos.length ? 1 : 0;
  render(); window.scrollTo(0, 0);
}
function go(view) { if (S.view === 'case') flushSave(); S.view = view; cur = view === 'case' ? cur : null; render(); window.scrollTo(0, 0); }

async function addPhotos(files, kind) {
  if (!files || !files.length) return;
  busy('Préparation des photos…');
  try {
    for (const f of Array.from(files)) {
      const raw = await fileToDataURL(f); const data = await compressImage(raw, 2200, 0.86);
      const id = uid(); await DB.put('photos', {id, caseId:cur.id, data}); PHOTO_CACHE.set(id, data);
      (kind === 'emg' ? cur.emgPhotos : cur.photos).push({id, at:Date.now()});
    }
    await saveNow(); touch(true);
  } catch (e) { toast(e.message); }
  busy(); rerender();
  if (kind === 'emg') extractEmg();
}

async function imageParts(list) {
  const parts = [];
  for (const p of list) { const d = await photoData(p.id); const pp = dataUrlParts(d); if (pp) parts.push({inlineData:{mimeType:pp.mime, data:pp.data}}); }
  return parts;
}
async function extractNcs() {
  const c = cur; if (!c.photos.length) return;
  busy('Lecture des valeurs…', 'Gemini transcrit le tableau des conductions');
  try {
    const keys = NORMS().map(n => `${n.key} = ${n.label}`).join('\n');
    const parts = [...await imageParts(c.photos), {text:'Transcris toutes les mesures de ces photos.'}];
    const j = await gemini(parts, {system:PROMPT_EXTRACT(keys), schema:SCHEMA_EXTRACT, model:aiModel('read')});
    const rows = (j.rows || []).map(r => ({
      type: ['motor', 'sensory', 'mixed', 'F', 'H', 'blink', 'other'].includes(r.type) ? r.type : 'other',
      nerf: r.nerf || '', cote: ['G', 'D'].includes(r.cote) ? r.cote : '?', stimulation: r.stimulation || '', enregistrement: r.enregistrement || '',
      segment: r.segment || 'autre', normKey: NORMS().some(n => n.key === r.normKey) ? r.normKey : 'autre',
      latence: num(r.latence), latence_pic: num(r.latence_pic), amplitude: num(r.amplitude), duree: num(r.duree), distance: num(r.distance), vitesse: num(r.vitesse), f_lat: num(r.f_lat),
      absent: !!r.absent, remarque: r.remarque || ''}));
    if (!rows.length) throw new Error('Aucune valeur trouvée sur les photos. Reprends la photo plus près, bien éclairée.');
    c.ncs = Object.assign(c.ncs, {rows, at:Date.now(), tMain:num(j.temperature_main), tPied:num(j.temperature_pied), autres:j.autres || '', lisibilite:j.lisibilite || ''});
    c.analysis = null; touch(true); await saveNow();
    S.step = 2; S.editRows = false; busy(); render(); window.scrollTo(0, 0);
    toast(rows.length + ' mesures lues — vérifie-les avant d\'analyser');
  } catch (e) { busy(); toast(e.message); }
}
async function analyze() {
  const c = cur;
  busy('Analyse en cours…', 'Interprétation et plan d\'EMG — environ 1 à 2 minutes');
  try {
    const ev = evaluate(c);
    const payload = {
      contexte_clinique: clinicalContext(c),
      conductions: ncsContext(c, ev),
      anomalies_calculees_selon_normes: ev.findings.map(f => (f.lvl === 'a' ? 'ANORMAL : ' : f.lvl === 'w' ? 'ATTENTION : ' : 'NORMAL : ') + f.txt),
      autres_infos: c.ncs.autres || null,
      bibliotheque_muscles: MUSCLES.map(m => `${m.n} (${m.en}) — ${m.nerf}, ${m.rac}`)
    };
    const a = await gemini([{text:PROMPT_ANALYSIS + '\n\nDONNÉES :\n' + JSON.stringify(payload)}], {system:SYS_BASE + '\n' + KNOWLEDGE, schema:SCHEMA_ANALYSIS, model:aiModel('think'), onWait: () => busy('Gemini est très sollicité…', 'Nouvel essai automatique en cours')});
    a.emg_plan = (a.emg_plan || []).map(m => Object.assign(m, {sel: m.priorite !== 'optionnel'}));
    a.at = Date.now(); c.analysis = a; touch(true); await saveNow();
    S.step = 3; busy(); render(); window.scrollTo(0, 0);
  } catch (e) { busy(); toast(e.message); }
}
function toEmg() {
  const c = cur, plan = (c.analysis && c.analysis.emg_plan) || [];
  let added = 0;
  plan.filter(m => m.sel).forEach(m => {
    const sides = m.cote === 'Bilat' ? ['G', 'D'] : [m.cote === 'G' ? 'G' : 'D'];
    sides.forEach(sd => { const e = emgEntry(m.muscle, sd); if (!c.emg.some(x => nrm(x.muscle) === nrm(e.muscle) && x.cote === sd)) { c.emg.push(e); added++; } });
  });
  touch(true); S.step = 4; render(); window.scrollTo(0, 0);
  if (added) toast(added + ' muscle' + (added > 1 ? 's' : '') + ' ajouté' + (added > 1 ? 's' : ''));
}
async function extractEmg() {
  const c = cur; if (!c.emgPhotos.length) return;
  busy('Lecture du tableau EMG…');
  try {
    const last = c.emgPhotos.slice(-3);
    const j = await gemini([...await imageParts(last), {text:'Transcris ce tableau d\'EMG à l\'aiguille.'}], {system:PROMPT_EMG_EXTRACT, schema:SCHEMA_EMG_EXTRACT, model:aiModel('read')});
    let n = 0;
    (j.muscles || []).forEach(m => {
      const side = m.cote === 'G' ? 'G' : 'D'; const tmpl = emgEntry(m.muscle, side);
      let e = c.emg.find(x => nrm(x.muscle) === nrm(tmpl.muscle) && x.cote === side);
      if (!e) { e = tmpl; c.emg.push(e); }
      EMG_FIELDS.forEach(f => { const v = String(m[f.k] || '').trim(); if (f.opts.includes(v)) e[f.k] = v; });
      if (m.autre) { EMG_OTHER.forEach(o => { if (nrm(m.autre).includes(nrm(o).split(' ')[0]) && !e.autre.includes(o)) e.autre.push(o); }); if (!e.note) e.note = m.autre; }
      n++;
    });
    touch(true); await saveNow(); busy(); rerender(); toast(n + ' muscle(s) lus — vérifie les valeurs');
  } catch (e) { busy(); toast(e.message); }
}
async function genReport() {
  const c = cur;
  busy('Rédaction du rapport…', 'Gemini rédige à partir de tes résultats — environ 1 à 2 minutes');
  try {
    const ev = evaluate(c);
    const payload = {
      contexte_clinique: clinicalContext(c), conductions: ncsContext(c, ev),
      anomalies_calculees_selon_normes: ev.findings.map(f => (f.lvl === 'a' ? 'ANORMAL : ' : f.lvl === 'w' ? 'ATTENTION : ' : 'NORMAL : ') + f.txt),
      analyse_preliminaire: c.analysis ? {conclusion: c.analysis.conclusion_preliminaire, pattern: c.analysis.pattern, severite: c.analysis.severite} : null,
      emg_aiguille: emgContext(c), commentaires_examen: c.emgNote || null,
      membres_etudies: c.clin.membres
    };
    const r = await gemini([{text:PROMPT_REPORT + '\n\nDONNÉES :\n' + JSON.stringify(payload)}], {system:SYS_BASE + '\n' + KNOWLEDGE, schema:SCHEMA_REPORT, model:aiModel('think'), onWait: () => busy('Gemini est très sollicité…', 'Nouvel essai automatique en cours')});
    c.report = {sections:{renseignements:r.renseignements || '', technique:r.technique || '', ncs_resume:r.ncs_resume || '', emg_resume:r.emg_resume || '', interpretation:r.interpretation || '', conclusion:r.conclusion || '', recommandations:r.recommandations || ''}, at:Date.now()};
    c.final = false; touch(true); await saveNow();
    S.step = 5; S.editReport = false; busy(); render(); window.scrollTo(0, 0);
    toast('Rapport prêt — relis-le avant de finaliser');
  } catch (e) { busy(); toast(e.message); }
}
async function sendDrive(c, quiet) {
  c = c || cur;
  if (!quiet) busy('Envoi vers Google Drive…');
  try {
    const j = driveModeEff() === 'google' ? await driveSaveGoogle(c) : await driveSaveCase(c);
    c.drive = {state:'ok', at:Date.now(), url:j.url || '', error:''};
    await saveNow(c); if (!quiet) { busy(); toast('Rapport enregistré dans Drive'); }
  } catch (e) {
    c.drive = {state: e instanceof DriveAuthError ? 'auth' : 'err', at:Date.now(), error:e.message}; await saveNow(c);
    if (!quiet) { busy(); toast(e.message); }
  }
  updateSync(); if (!quiet) rerender();
}
async function retryPending() {
  const mode = driveModeEff();
  if (mode === 'off' || !navigator.onLine || (mode === 'google' && !tokenValid())) return;
  for (const c of CASES.filter(x => x.final && x.report && (!x.drive || x.drive.state !== 'ok'))) await sendDrive(c, true);
  updateSync();
}

function libSheet() {
  const q = nrm(S.libQ);
  const list = MUSCLES.filter(m => !q || nrm(m.n + ' ' + m.en + ' ' + m.nerf + ' ' + m.rac).includes(q));
  return `<div class="sh-head"><h2 class="sh-title">Ajouter un muscle</h2><button class="icon-btn" data-a="sheet-close" aria-label="Fermer">${ic('x')}</button></div>
  <div class="seg">${['G', 'D'].map(s => `<button data-a="lib-side" data-v="${s}" class="${S.libSide === s ? 'on' : ''}">${s === 'G' ? 'Gauche' : 'Droit'}</button>`).join('')}</div>
  <input class="search" type="search" placeholder="Muscle, nerf ou racine (ex. C7, ulnaire)" value="${esc(S.libQ)}" data-a-input="lib-q" aria-label="Rechercher un muscle">
  <div id="lib-list">${list.map(m => `<button class="lib-item" data-a="lib-add" data-v="${esc(m.n)}"><span><b>${esc(m.n)}</b> <span class="muted small">${esc(m.en)}</span><small>${esc(m.nerf)} · ${esc(m.rac)}</small></span>${ic('plus', 20)}</button>`).join('')}
  ${S.libQ && !list.length ? `<button class="lib-item" data-a="lib-add" data-v="${esc(S.libQ)}"><span><b>Ajouter « ${esc(S.libQ)} »</b><small>Muscle hors bibliothèque</small></span>${ic('plus', 20)}</button>` : ''}</div>`;
}

function cropSheet(i) {
  const p = cur.photos[i];
  openSheet(`<div class="sh-head"><h2 class="sh-title">Recadrer la page ${i + 1}</h2><button class="icon-btn" data-a="sheet-close" aria-label="Fermer">${ic('x')}</button></div>
    <p class="muted small" style="margin:0 0 10px">Glisse les coins pour garder seulement le tableau et masquer l'identité du patient.</p>
    <div class="crop-stage" id="crop"><img id="crop-img" alt="Photo" src="#"><div class="crop-shade" id="sh1"></div><div class="crop-shade" id="sh2"></div><div class="crop-shade" id="sh3"></div><div class="crop-shade" id="sh4"></div><div class="crop-box" id="cbox"></div>
    <div class="crop-h" data-h="tl"></div><div class="crop-h" data-h="tr"></div><div class="crop-h" data-h="bl"></div><div class="crop-h" data-h="br"></div></div>
    <div class="btns"><button class="btn ghost" id="crop-rot">${ic('rotate', 18)} Pivoter</button><button class="btn primary" id="crop-ok">${ic('check', 18)} Appliquer</button></div>`, true);
  const img = $('#crop-img'); let box = {x:0, y:0, w:1, h:1};
  const draw = () => {
    const W = img.clientWidth, H = img.clientHeight; const L = box.x * W, T = box.y * H, Rr = (box.x + box.w) * W, B = (box.y + box.h) * H;
    Object.assign($('#cbox').style, {left:L + 'px', top:T + 'px', width:(Rr - L) + 'px', height:(B - T) + 'px'});
    Object.assign($('#sh1').style, {left:0, top:0, width:W + 'px', height:T + 'px'});
    Object.assign($('#sh2').style, {left:0, top:B + 'px', width:W + 'px', height:(H - B) + 'px'});
    Object.assign($('#sh3').style, {left:0, top:T + 'px', width:L + 'px', height:(B - T) + 'px'});
    Object.assign($('#sh4').style, {left:Rr + 'px', top:T + 'px', width:(W - Rr) + 'px', height:(B - T) + 'px'});
    const pos = {tl:[L, T], tr:[Rr, T], bl:[L, B], br:[Rr, B]};
    $$('.crop-h').forEach(h => { const [x, y] = pos[h.dataset.h]; h.style.left = x + 'px'; h.style.top = y + 'px'; });
  };
  photoData(p.id).then(d => { img.onload = draw; img.src = d; });
  let drag = null;
  $('#crop').addEventListener('pointerdown', e => { const h = e.target.closest('.crop-h'); if (!h) return; drag = h.dataset.h; h.setPointerCapture(e.pointerId); e.preventDefault(); });
  $('#crop').addEventListener('pointermove', e => {
    if (!drag) return; const rc = img.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rc.left) / rc.width)), y = Math.min(1, Math.max(0, (e.clientY - rc.top) / rc.height));
    let x1 = box.x, y1 = box.y, x2 = box.x + box.w, y2 = box.y + box.h; const m = 0.05;
    if (drag[1] === 'l') x1 = Math.min(x, x2 - m); else x2 = Math.max(x, x1 + m);
    if (drag[0] === 't') y1 = Math.min(y, y2 - m); else y2 = Math.max(y, y1 + m);
    box = {x:x1, y:y1, w:x2 - x1, h:y2 - y1}; draw();
  });
  $('#crop').addEventListener('pointerup', () => { drag = null; });
  window.addEventListener('resize', draw, {once:true});
  const store = async d => { PHOTO_CACHE.set(p.id, d); await DB.put('photos', {id:p.id, caseId:cur.id, data:d}); touch(true); };
  $('#crop-rot').onclick = async () => { const d = await rotateImage(await photoData(p.id), 90); await store(d); box = {x:0, y:0, w:1, h:1}; img.src = d; };
  $('#crop-ok').onclick = async () => {
    if (box.w < 0.999 || box.h < 0.999) { const d = await cropImage(await photoData(p.id), box); await store(d); }
    closeSheet(); rerender();
  };
}

function caseMenu() {
  openSheet(`<div class="sh-head"><h2 class="sh-title">${esc(pName(cur))}</h2><button class="icon-btn" data-a="sheet-close" aria-label="Fermer">${ic('x')}</button></div>
  ${cur.report ? `<button class="row" data-a="rep-copy">${ic('copy')}<span style="flex:1">Copier le rapport (texte DME)</span></button>` : ''}
  ${cur.report && driveModeEff() !== 'off' ? `<button class="row" data-a="drive-send">${ic('cloud')}<span style="flex:1">Envoyer au Drive</span></button>` : ''}
  ${cur.final ? `<button class="row" data-a="unfinal">${ic('edit')}<span style="flex:1">Rouvrir (retirer « finalisé »)</span></button>` : ''}
  <button class="row" data-a="dup">${ic('copy')}<span style="flex:1">Dupliquer (même patient, nouvel examen)</span></button>
  <button class="row" data-a="case-del" style="color:var(--neg)">${ic('trash')}<span style="flex:1">Supprimer ce cas</span></button>`);
}

function applyConfigCode(code) {
  const m = String(code || '').trim().match(/(?:#|^)(?:config=)?([A-Za-z0-9_\-]+={0,2})$/);
  if (!m) throw new Error('Code de configuration invalide.');
  let j; try { j = JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g, '+').replace(/_/g, '/'))))); } catch (e) { throw new Error('Code de configuration illisible.'); }
  if (j.k) SET.geminiKey = String(j.k).trim();
  if (j.u) SET.driveUrl = String(j.u).trim();
  if (j.s) SET.driveSecret = String(j.s).trim();
  if (j.m) { SET.modelRead = j.m; SET.modelThink = j.m; }
  if (j.n) SET.doctor.nom = j.n;
  saveSet(); return j;
}
const DRIVE_SCRIPT = (secret) => DRIVE_SCRIPT_SRC.replace('__SECRET__', secret || 'CHANGE-MOI');

async function handle(a, el) {
  const d = el.dataset;
  switch (a) {
    case 'nav': if (d.v === 'settings' && S.view === 'settings') return; go(d.v); break;
    case 'new-case': { const c = newCase(); CASES.push(c); await saveNow(c); cur = c; S.view = 'case'; S.step = 0; render(); window.scrollTo(0, 0); break; }
    case 'open': openCase(d.id); break;
    case 'close-case': flushSave(); cur = null; S.view = 'home'; render(); window.scrollTo(0, 0); break;
    case 'step': S.step = +d.v; S.editRows = false; render(); window.scrollTo(0, 0); break;
    case 'set': setPath(cur, d.f, getPath(cur, d.f) === d.v ? '' : d.v); touch(true); rerender(); break;
    case 'tog-arr': { const arr = getPath(cur, d.f) || []; const i = arr.indexOf(d.v); if (i >= 0) arr.splice(i, 1); else arr.push(d.v); setPath(cur, d.f, arr); touch(true); rerender(); break; }
    case 'ph-del': { const p = cur.photos.splice(+d.i, 1)[0]; if (p) { DB.del('photos', p.id); PHOTO_CACHE.delete(p.id); } touch(true); rerender(); break; }
    case 'ph-edit': cropSheet(+d.i); break;
    case 'manual': S.step = 2; S.editRows = true; if (!cur.ncs.rows.length) cur.ncs.rows.push({type:'motor', nerf:'Médian', cote:'D', stimulation:'Poignet', segment:'distal', normKey:'median_m_apb', latence:null, latence_pic:null, amplitude:null, vitesse:null, distance:null, f_lat:null, absent:false}); touch(true); render(); break;
    case 'extract': extractNcs(); break;
    case 'edit-rows': S.editRows = !S.editRows; if (!S.editRows && cur.analysis) toast('Valeurs modifiées : relance l\'analyse au besoin'); rerender(); break;
    case 'row-del': cur.ncs.rows.splice(+d.i, 1); touch(true); rerender(); break;
    case 'row-add': { const last = cur.ncs.rows[cur.ncs.rows.length - 1]; cur.ncs.rows.push({type:last ? last.type : 'motor', nerf:last ? last.nerf : '', cote:last ? last.cote : 'D', stimulation:'', segment:'autre', normKey:last ? last.normKey : 'autre', latence:null, latence_pic:null, amplitude:null, vitesse:null, distance:null, f_lat:null, absent:false}); touch(true); rerender(); break; }
    case 'analyze': analyze(); break;
    case 'plan-tog': { const m = cur.analysis.emg_plan[+d.i]; m.sel = !m.sel; touch(true); rerender(); break; }
    case 'to-emg': toEmg(); break;
    case 'skip-emg': S.step = 5; render(); window.scrollTo(0, 0); break;
    case 'emg-set': { const e = cur.emg[+d.i]; e[d.k] = e[d.k] === d.v ? '' : d.v; touch(true); rerender(); break; }
    case 'emg-other': { const e = cur.emg[+d.i]; e.autre = e.autre || []; const j = e.autre.indexOf(d.v); if (j >= 0) e.autre.splice(j, 1); else e.autre.push(d.v); touch(true); rerender(); break; }
    case 'emg-normal': { const e = cur.emg[+d.i]; Object.assign(e, {ins:'N', fib:'0', psw:'0', fasc:'0', amp:'N', dur:'N', poly:'N', rec:'N', act:'N', autre:[]}); touch(true); rerender(); break; }
    case 'emg-side': { const e = cur.emg[+d.i]; e.cote = e.cote === 'G' ? 'D' : 'G'; touch(true); rerender(); break; }
    case 'emg-del': cur.emg.splice(+d.i, 1); touch(true); rerender(); break;
    case 'lib': { const m = cur.clin.membres.join(' '); S.libSide = /gauche/i.test(m) && !/droit/i.test(m) ? 'G' : 'D'; S.libQ = ''; openSheet(libSheet(), true); break; }
    case 'lib-side': S.libSide = d.v; $('.sheet').innerHTML = '<div class="grab"></div>' + libSheet(); break;
    case 'lib-add': { const e = emgEntry(d.v, S.libSide); cur.emg.push(e); touch(true); closeSheet(); rerender(); toast(e.muscle + ' ' + e.cote + ' ajouté'); break; }
    case 'report-gen': genReport(); break;
    case 'edit-report': S.editReport = !S.editReport; rerender(); break;
    case 'rep-copy': closeSheet(); copyText(reportText(cur)); break;
    case 'rep-word': await saveFile(baseName(cur) + '.docx', DOCX_MIME, reportDocx(cur)); break;
    case 'rep-export': {
      if (CAP()) { await saveFile(baseName(cur) + '.html', 'text/html', reportHTMLDoc(cur)); }
      else { const w = window.open('', '_blank'); if (w) { w.document.write(reportHTMLDoc(cur)); w.document.close(); setTimeout(() => w.print(), 400); } else window.print(); }
      break;
    }
    case 'finalize': {
      const mode = driveModeEff();
      if (mode === 'google' && SET.autoSync && !tokenValid()) { try { await driveConnect(); } catch (e) { toast(authErr(e)); } }
      cur.final = true; touch(true); await saveNow(); rerender(); toast('Rapport finalisé');
      if (mode !== 'off' && SET.autoSync) sendDrive(cur); break;
    }
    case 'drive-connect': try { await driveConnect(); toast('Google Drive connecté ✓'); rerender(); } catch (e) { toast(authErr(e)); } break;
    case 'unfinal': cur.final = false; touch(true); closeSheet(); rerender(); break;
    case 'drive-send': closeSheet(); if (driveModeEff() === 'google' && !tokenValid()) { try { await driveConnect(); } catch (e) { toast(authErr(e)); break; } } sendDrive(cur); break;
    case 'case-menu': caseMenu(); break;
    case 'dup': { const c = newCase(); c.patient = clone(cur.patient); c.clin.referent = cur.clin.referent; CASES.push(c); await saveNow(c); closeSheet(); openCase(c.id, 0); break; }
    case 'case-del': {
      closeSheet(); if (!(await confirmSheet('Supprimer ce cas ?', 'Le cas et ses photos seront effacés de cet appareil. Les fichiers déjà dans Drive restent.', 'Supprimer', true))) return;
      for (const p of [...cur.photos, ...cur.emgPhotos]) await DB.del('photos', p.id);
      await DB.del('cases', cur.id); cloudDeleteCase(cur.id); CASES = CASES.filter(c => c.id !== cur.id); cur = null; S.view = 'history'; render(); toast('Cas supprimé'); break;
    }
    case 'hist-f': S.filter = d.v; rerender(); break;
    case 'sheet-close': closeSheet(); break;
    case 'sheet-close-bg': closeSheet(); break;
    // Compte
    case 'login-mode': S.loginMode = S.loginMode === 'up' ? 'in' : 'up'; AUTH.msg = ''; render(); break;
    case 'login-google': try { await signInGoogle(); } catch (e) { AUTH.msg = authErr(e); render(); } break;
    case 'login-email': case 'signup-email': {
      const em = ($('#lg-email') || {}).value || '', pw = ($('#lg-pw') || {}).value || '';
      if (!em || !pw) { toast('Entre ton courriel et ton mot de passe.'); break; }
      if (a === 'signup-email' && pw.length < 8) { toast('Mot de passe : 8 caractères ou plus.'); break; }
      busy(a === 'signup-email' ? 'Création du compte…' : 'Connexion…');
      try { if (a === 'signup-email') await signUpEmail(em, pw); else await signInEmail(em, pw); busy(); }
      catch (e) { busy(); AUTH.msg = authErr(e); render(); const f = $('#lg-email'); if (f) f.value = em; }
      break;
    }
    case 'reset-pw': { const em = ($('#lg-email') || {}).value || ''; if (!em) { toast('Entre ton courriel d\'abord.'); break; } try { await resetPw(em); toast('Courriel de réinitialisation envoyé'); } catch (e) { toast(authErr(e)); } break; }
    case 'verify-check': { const cu = FB && FB.auth.currentUser; if (cu) { await cu.reload(); await cu.getIdToken(true); AUTH.user = FB.auth.currentUser; } if (cu && FB.auth.currentUser.emailVerified) { busy('Vérification…'); await onAuthChanged(true); busy(); } else toast('Pas encore confirmé — ouvre le lien reçu par courriel.'); break; }
    case 'verify-resend': try { await FB.auth.currentUser.sendEmailVerification({url: location.origin + location.pathname}); toast('Courriel renvoyé'); } catch (e) { toast(authErr(e)); } break;
    case 'sign-out': if (!(await confirmSheet('Se déconnecter ?', 'Tes cas restent synchronisés dans ton compte. Sur cet appareil, ils seront masqués jusqu\'à ta prochaine connexion.', 'Se déconnecter'))) return; await signOutAll(); if (!FB) onAuthChanged(); break;
    case 'add-pw': {
      openSheet(`<div class="sh-head"><h2 class="sh-title">Mot de passe pour l'app Android</h2><button class="icon-btn" data-a="sheet-close" aria-label="Fermer">${ic('x')}</button></div><p class="muted small">L'app Android ne permet pas « Continuer avec Google ». Ajoute un mot de passe pour t'y connecter avec ${esc(AUTH.user.email)}.</p><label class="lab">Nouveau mot de passe<input class="field" id="np" type="password" autocomplete="new-password" placeholder="8 caractères ou plus"></label><div class="btns"><button class="btn primary" data-a="add-pw-ok">Enregistrer</button></div>`);
      break;
    }
    case 'add-pw-ok': { const pw = $('#np').value; if (pw.length < 8) { toast('8 caractères ou plus.'); break; } try { await addPassword(pw); closeSheet(); toast('Mot de passe ajouté ✓'); rerender(); } catch (e) { toast(authErr(e)); } break; }
    case 'cloud-sync': busy('Synchronisation…'); try { const r = await cloudSyncAll(); busy(); toast(`Synchronisé ✓ (${r.pulled} reçu(s), ${r.pushed} envoyé(s))`); rerender(); } catch (e) { busy(); toast('Synchronisation impossible : ' + e.message); } break;
    case 'inv-load': try { S.invites = await inviteList(); rerender(); const d = $('#acc-admin'); if (d) d.open = true; } catch (e) { toast(e.message); } break;
    case 'inv-add': try { await inviteAdd($('#inv-email').value); S.invites = await inviteList(); toast('Invitation ajoutée ✓'); rerender(); const d = $('#acc-admin'); if (d) d.open = true; } catch (e) { toast(e.message); } break;
    case 'inv-del': if (!(await confirmSheet('Retirer l\'accès ?', d.v + ' ne pourra plus utiliser Latence. Ses données ne sont pas effacées.', 'Retirer', true))) return; try { await inviteRemove(d.v); S.invites = await inviteList(); rerender(); const x = $('#acc-admin'); if (x) x.open = true; } catch (e) { toast(e.message); } break;
    // Réglages
    case 'theme': SET.theme = d.v; saveSet(); rerender(); break;
    case 'set-val': SET[d.k] = d.v; saveSet(); rerender(); break;
    case 'set-bool': SET[d.k] = d.v === '1'; saveSet(); rerender(); break;
    case 'cfg-apply': { try { applyConfigCode($('#cfg-code').value); toast('Configuration appliquée ✓'); rerender(); } catch (e) { toast(e.message); } break; }
    case 'secret-gen': SET.driveSecret = randomSecret(); saveSet(); rerender(); toast('Mot de passe généré'); break;
    case 'script-copy': if (!SET.driveSecret) { SET.driveSecret = randomSecret(); saveSet(); rerender(); } copyText(DRIVE_SCRIPT(SET.driveSecret)); break;
    case 'gem-test': busy('Test de Gemini…'); try { const j = await gemini([{text:'Réponds {"ok":true}'}], {model:aiModel('read'), timeout:30000}); busy(); toast(j && j.ok ? 'Gemini fonctionne ✓ (' + GEM_LAST_MODEL + ')' : 'Réponse inattendue'); } catch (e) { busy(); toast(e.message); } break;
    case 'gem-models': busy('Chargement des modèles…'); try { S.models = await geminiModels(); busy(); rerender(); toast(S.models.length + ' modèles disponibles'); } catch (e) { busy(); toast(e.message); } break;
    case 'drive-test': busy('Test de Google Drive…'); try { const j = await driveCall({action:'ping'}, 30000); busy(); toast('Drive connecté ✓ ' + (j.rootName || '')); } catch (e) { busy(); toast(e.message); } break;
    case 'drive-all': { const list = CASES.filter(c => c.report); if (!list.length) return toast('Aucun rapport à envoyer'); busy('Envoi de ' + list.length + ' rapport(s)…'); for (const c of list) await sendDrive(c, true); busy(); toast('Envoi terminé'); rerender(); break; }
    case 'drive-pull': await drivePull(); break;
    case 'norms-reset': SET.norms = null; SET.rules = null; saveSet(); rerender(); toast('Normes par défaut rétablies'); break;
    case 'backup': {
      busy('Préparation de la sauvegarde…');
      const photos = await DB.all('photos');
      await saveFile(`latence-sauvegarde-${todayISO()}.json`, 'application/json', JSON.stringify({app:'latence', v:1, at:Date.now(), settings:Object.assign({}, SET, {geminiKey:'', driveSecret:''}), cases:CASES.map(storableCase), photos}));
      busy(); break;
    }
    case 'wipe': {
      if (!(await confirmSheet('Tout effacer ?', 'Tous les cas et photos de cet appareil seront supprimés. Ton compte en ligne et ton Drive ne sont pas touchés.', 'Tout effacer', true))) return;
      await DB.clear('cases'); await DB.clear('photos'); PHOTO_CACHE.clear(); CASES = []; ALL_CASES = []; go('home'); toast('Données de l\'appareil effacées (ton compte en ligne est conservé)'); break;
    }
  }
}
async function drivePull() {
  busy('Récupération depuis Drive…');
  try {
    const j = await driveCall({action:'pull'}, 120000); let n = 0;
    for (const raw of (j.cases || [])) {
      let c; try { c = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { continue; }
      if (!c || !c.id) continue;
      const loc = CASES.find(x => x.id === c.id);
      if (!loc || (c.updatedAt || 0) > (loc.updatedAt || 0)) {
        if (loc) { c.photos = loc.photos; c.emgPhotos = loc.emgPhotos; CASES = CASES.filter(x => x.id !== c.id); } else { c.photos = []; c.emgPhotos = []; }
        c.drive = Object.assign({}, c.drive, {state:'ok'}); CASES.push(c); await DB.put('cases', storableCase(c)); n++;
      }
    }
    busy(); toast(n ? n + ' cas récupéré(s)' : 'Historique déjà à jour'); rerender();
  } catch (e) { busy(); toast(e.message); }
}
async function restore(file) {
  try {
    busy('Restauration…'); const j = JSON.parse(await file.text());
    if (j.app !== 'latence') throw new Error('Fichier non reconnu');
    for (const p of j.photos || []) await DB.put('photos', p);
    for (const c of j.cases || []) { const loc = CASES.find(x => x.id === c.id); if (!loc || c.updatedAt > loc.updatedAt) { CASES = CASES.filter(x => x.id !== c.id); CASES.push(c); await DB.put('cases', c); } }
    if (j.settings) { const keep = {geminiKey:SET.geminiKey, driveSecret:SET.driveSecret, driveUrl:SET.driveUrl || j.settings.driveUrl}; SET = Object.assign(clone(SET_DEFAULT), j.settings, keep); saveSet(); }
    busy(); toast('Restauration terminée'); render();
  } catch (e) { busy(); toast('Restauration impossible : ' + e.message); }
}

/* ---------- Événements ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el || el.disabled) return;
  if (el.tagName === 'LABEL') return;
  const a = el.dataset.a;
  if (a === 'sheet-close-bg' && e.target !== el) return;
  e.preventDefault();
  handle(a, el).catch(err => { busy(); toast(err.message || String(err)); });
});
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=checkbox][data-a]')) { e.preventDefault(); e.target.click(); } });
document.addEventListener('input', e => {
  const t = e.target, d = t.dataset;
  if (d.f && cur) {
    const numeric = /ncs\.t(Main|Pied)$/.test(d.f);
    setPath(cur, d.f, numeric ? num(t.value) : t.value); touch(true);
    if (d.f.startsWith('patient.nom') || d.f.startsWith('patient.prenom')) { const h = $('.case-head h1'); if (h) h.textContent = pName(cur); }
    return;
  }
  if (d.rf && cur) {
    const [i, f] = d.rf.split('.'); const r = cur.ncs.rows[+i]; if (!r) return;
    if (['latence', 'latence_pic', 'amplitude', 'vitesse', 'distance', 'f_lat', 'duree'].includes(f)) r[f] = num(t.value);
    else if (f === 'absent') r[f] = t.value === 'true';
    else r[f] = t.value;
    touch(true);
    if (t.tagName === 'SELECT') rerender();
    return;
  }
  if (d.ef && cur) { const [i, f] = d.ef.split('.'); const e2 = cur.emg[+i]; if (e2) { e2[f] = t.value; touch(true); } return; }
  if (d.sf) {
    setPath(SET, d.sf, ['geminiKey', 'driveUrl', 'driveSecret'].includes(d.sf) ? t.value.trim() : t.value); saveSet();
    if (d.sf === 'driveUrl') updateSync(); return;
  }
  if (d.nf) { const [i, k] = d.nf.split('.'); if (!SET.norms) SET.norms = clone(NORMS_DEFAULT); SET.norms[+i][k] = num(t.value); saveSet(); return; }
  if (d.rl) { SET.rules = Object.assign({}, SET.rules || {}, {[d.rl]: num(t.value) != null ? num(t.value) : OTHER_RULES[d.rl]}); saveSet(); return; }
  if (d.aInput === 'hist-q') { S.q = t.value; const box = $('#hist-list'); const tmp = document.createElement('div'); tmp.innerHTML = viewHistory(); box.innerHTML = tmp.querySelector('#hist-list').innerHTML; return; }
  if (d.aInput === 'lib-q') { S.libQ = t.value; const tmp = document.createElement('div'); tmp.innerHTML = libSheet(); $('#lib-list').innerHTML = tmp.querySelector('#lib-list').innerHTML; return; }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.aFile) { const k = t.dataset.aFile; const files = t.files; if (k === 'restore') { if (files[0]) restore(files[0]); } else addPhotos(files, k); t.value = ''; return; }
  if (t.dataset.f && cur && t.type === 'date') rerender();
  if (t.dataset.sf && /^model/.test(t.dataset.sf)) { SET[t.dataset.sf] = t.value; saveSet(); }
});
window.addEventListener('online', retryPending);

/* Bouton retour Android */
function onBack() {
  if ($('#sheets').innerHTML) { closeSheet(); return true; }
  if (S.view === 'case') { if (S.step > 0) { S.step--; render(); } else { cur = null; S.view = 'home'; render(); } return true; }
  if (S.view !== 'home') { go('home'); return true; }
  return false;
}

/* ---------- Démarrage ---------- */
let ALL_CASES = [];
async function onAuthChanged(forceCheck) {
  if (forceCheck && FB && FB.auth.currentUser) {
    // relancer la vérification d'accès après confirmation du courriel ou invitation
    const u = FB.auth.currentUser, em = String(u.email).toLowerCase();
    let ok = ADMINS.includes(em); if (!ok) { try { ok = (await FB.db.collection('allowed').doc(em).get()).exists; } catch (e) {} }
    Object.assign(AUTH, ok ? {state:'in', user:u, admin:ADMINS.includes(em)} : {state:'denied', user:u});
    if (ok) rememberMe(u);
  }
  if (AUTH.state === 'in' || AUTH.state === 'offline') {
    const uid = AUTH.user.uid;
    loadUserSettings(uid);
    try { ALL_CASES = (await DB.all('cases')) || []; } catch (e) {}
    for (const c of ALL_CASES) if (!c.owner) { c.owner = uid; DB.put('cases', c).catch(() => {}); }
    CASES = ALL_CASES.filter(c => c.owner === uid);
    const pend = sessionStorage.getItem('latence.cfg');
    if (pend) { try { applyConfigCode(pend); toast('Configuration appliquée ✓'); } catch (e) {} sessionStorage.removeItem('latence.cfg'); }
    render();
    if (AUTH.state === 'in') { try { const r = await cloudSyncAll(); if (r.pulled) { render(); toast(r.pulled + ' cas synchronisé(s)'); } else rerender(); } catch (e) { console.warn('sync', e); } }
    setTimeout(retryPending, 2000);
  } else { CASES = []; cur = null; S.view = 'home'; SET_UID = null; SET = clone(SET_DEFAULT); render(); }
}
(async function init() {
  applyTheme();
  try { await DB.open(); } catch (e) { toast('Stockage local indisponible : ' + e.message); }
  if (/^#config=/.test(location.hash)) {
    try { sessionStorage.setItem('latence.cfg', location.hash); } catch (e) {}
    history.replaceState(null, '', location.pathname + location.search);
  }
  render();
  authStart(() => onAuthChanged(false));
  const P = CAP();
  if (P && P.App) P.App.addListener('backButton', () => { if (!onBack()) P.App.exitApp(); });
  if ('serviceWorker' in navigator && location.protocol === 'https:' && !P) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
