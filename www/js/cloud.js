'use strict';
/* =====================================================================
   Latence — comptes (Firebase), synchronisation et Google Drive personnel
   ===================================================================== */
const FB_CONFIG = {
  apiKey: 'AIzaSyBTs75atDy7pNGxNMxm0RYUubjdJFsxvU8',
  authDomain: 'gen-lang-client-0692623180.firebaseapp.com',
  projectId: 'gen-lang-client-0692623180',
  storageBucket: 'gen-lang-client-0692623180.firebasestorage.app',
  messagingSenderId: '911113359259',
  appId: '1:911113359259:web:ea61f4c3593491b0669b3e'
};
const ADMINS = ['kasaskuengric@gmail.com', 'cahyan@hotmail.fr'];
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const ME_KEY = 'latence.me';
const SYNC_KEYS = ['lang', 'reportLang', 'reportLangSet', 'accent', 'textSize', 'geminiKey', 'modelRead', 'modelThink', 'aiProfile', 'doctor', 'theme', 'norms', 'comps', 'rules',
  'driveMode', 'driveFormat', 'driveImages', 'autoSync', 'rootName', 'driveUrl', 'driveSecret'];

const AUTH = {state:'loading', user:null, msg:'', admin:false};
let FB = null;
let GTOKEN = (() => { try { return JSON.parse(localStorage.getItem('latence.gtoken') || 'null'); } catch (e) { return null; } })();
const saveGToken = () => { try { if (GTOKEN) localStorage.setItem('latence.gtoken', JSON.stringify(GTOKEN)); else localStorage.removeItem('latence.gtoken'); } catch (e) {} };
let PENDING_DEL = (() => { try { return JSON.parse(localStorage.getItem('latence.pendingDel') || '[]'); } catch (e) { return []; } })();
const savePendingDel = () => { try { localStorage.setItem('latence.pendingDel', JSON.stringify(PENDING_DEL)); } catch (e) {} };
const isNativeApp = () => !!CAP();
const isAdmin = () => !!(AUTH.user && ADMINS.includes(String(AUTH.user.email || '').toLowerCase()));

function fbInit() {
  if (FB) return FB;
  if (!(window.firebase && firebase.initializeApp && firebase.auth && firebase.firestore)) return null;
  firebase.initializeApp(FB_CONFIG);
  const auth = firebase.auth(); auth.languageCode = 'fr';
  FB = {auth, db: firebase.firestore()};
  return FB;
}
const authErr = e => {
  const c = (e && e.code) || '';
  return ({
    'auth/invalid-credential': 'Courriel ou mot de passe incorrect.', 'auth/wrong-password': 'Mot de passe incorrect.', 'auth/user-not-found': 'Aucun compte avec ce courriel.',
    'auth/invalid-email': 'Adresse courriel invalide.', 'auth/email-already-in-use': 'Ce courriel a déjà un compte. Connecte-toi (ou « Mot de passe oublié »).',
    'auth/weak-password': 'Mot de passe trop court (8 caractères ou plus).', 'auth/too-many-requests': 'Trop d\'essais. Réessaie dans quelques minutes.',
    'auth/popup-closed-by-user': 'Fenêtre Google fermée.', 'auth/popup-blocked': 'Fenêtre bloquée par le navigateur : autorise les fenêtres pour ce site.',
    'auth/network-request-failed': 'Pas de connexion Internet.', 'auth/operation-not-supported-in-this-environment': 'Connexion Google indisponible dans l\'application Android : utilise courriel et mot de passe.',
    'auth/credential-already-in-use': 'Ce compte Google est déjà lié à un autre utilisateur.', 'auth/requires-recent-login': 'Reconnecte-toi puis recommence.',
    'auth/provider-already-linked': 'Déjà lié.'
  })[c] || (e && e.message) || String(e);
};
function rememberMe(u) { try { localStorage.setItem(ME_KEY, JSON.stringify({uid:u.uid, email:u.email, name:u.displayName || ''})); } catch (e) {} }
function cachedMe() { try { return JSON.parse(localStorage.getItem(ME_KEY) || 'null'); } catch (e) { return null; } }

/* ---------- Démarrage de l'authentification ---------- */
function authStart(onChange) {
  const fb = fbInit();
  if (!fb) {
    const me = cachedMe();
    Object.assign(AUTH, me ? {state:'offline', user:me, admin:ADMINS.includes(String(me.email).toLowerCase())} : {state:'out', msg:'Connexion Internet requise pour la première connexion.'});
    onChange(); return;
  }
  fb.auth.onAuthStateChanged(async u => {
    if (!u) { Object.assign(AUTH, {state:'out', user:null, admin:false}); onChange(); return; }
    if (!u.emailVerified) { Object.assign(AUTH, {state:'verify', user:u}); onChange(); return; }
    try {
      const em = String(u.email).toLowerCase(); let ok = ADMINS.includes(em);
      if (!ok) { const d = await fb.db.collection('allowed').doc(em).get(); ok = d.exists; }
      if (!ok) { Object.assign(AUTH, {state:'denied', user:u}); onChange(); return; }
      rememberMe(u);
      Object.assign(AUTH, {state:'in', user:u, admin:ADMINS.includes(em), msg:''});
      onChange();
    } catch (e) {
      // Hors ligne : laisser entrer l'utilisateur déjà connu sur cet appareil
      const me = cachedMe();
      if (me && me.uid === u.uid) { Object.assign(AUTH, {state:'offline', user:me, admin:ADMINS.includes(String(me.email).toLowerCase())}); onChange(); }
      else { Object.assign(AUTH, {state:'out', msg:'Vérification de l\'accès impossible : ' + (e.message || e)}); onChange(); }
    }
  });
}

/* ---------- Connexion ---------- */
function googleProvider() { const p = new firebase.auth.GoogleAuthProvider(); p.addScope(DRIVE_SCOPE); p.setCustomParameters({prompt:'select_account'}); return p; }
function keepToken(res) {
  const t = res && res.credential && res.credential.accessToken;
  if (t) { GTOKEN = {t, exp: Date.now() + 55 * 60 * 1000, email: res.user && res.user.email}; saveGToken(); }
}
async function signInGoogle() { const fb = fbInit(); if (!fb) throw new Error('Pas de connexion Internet.'); if (isNativeApp()) return openBridge(); const r = await fb.auth.signInWithPopup(googleProvider()); keepToken(r); return r; }
async function signInEmail(email, pw) { const fb = fbInit(); if (!fb) throw new Error('Pas de connexion Internet.'); return fb.auth.signInWithEmailAndPassword(email.trim(), pw); }
async function signUpEmail(email, pw) {
  const fb = fbInit(); if (!fb) throw new Error('Pas de connexion Internet.');
  const r = await fb.auth.createUserWithEmailAndPassword(email.trim(), pw);
  await r.user.sendEmailVerification({url: location.origin + location.pathname});
  return r;
}
async function resetPw(email) { const fb = fbInit(); if (!fb) throw new Error('Pas de connexion Internet.'); await fb.auth.sendPasswordResetEmail(email.trim()); }
async function signOutAll() {
  GTOKEN = null; saveGToken(); try { localStorage.removeItem(ME_KEY); } catch (e) {}
  if (FB) await FB.auth.signOut();
  else Object.assign(AUTH, {state:'out', user:null, admin:false});
}
async function addPassword(pw) {
  const u = FB && FB.auth.currentUser; if (!u) throw new Error('Non connecté.');
  await u.linkWithCredential(firebase.auth.EmailAuthProvider.credential(u.email, pw));
}
const hasProvider = id => !!(FB && FB.auth.currentUser && FB.auth.currentUser.providerData.some(p => p.providerId === id));

/* ---------- Réglages par utilisateur ---------- */
function settingsKey(uid) { return 'latence.settings.' + uid; }
function loadUserSettings(uid) {
  let raw = null; try { raw = localStorage.getItem(settingsKey(uid)); } catch (e) {}
  if (!raw) { try { raw = localStorage.getItem(ST_KEY); localStorage.removeItem(ST_KEY); } catch (e) {} } // reprise (une seule fois) des réglages d'avant les comptes
  try { SET = Object.assign(clone(SET_DEFAULT), JSON.parse(raw || '{}')); } catch (e) { SET = clone(SET_DEFAULT); }
  SET.doctor = Object.assign(clone(SET_DEFAULT.doctor), SET.doctor || {});
  SET_UID = uid; saveSet(true);
}
const pushSettings = debounce(async () => {
  if (AUTH.state !== 'in' || !FB) return;
  const s = {}; SYNC_KEYS.forEach(k => { if (SET[k] !== undefined) s[k] = SET[k]; });
  try { await FB.db.collection('users').doc(AUTH.user.uid).set({email: AUTH.user.email, settings: JSON.stringify(s), settingsAt: SET.settingsAt || Date.now()}, {merge:true}); } catch (e) {}
}, 1500);

/* ---------- Synchronisation des cas ---------- */
const cloudPayload = c => { const x = storableCase(c); x.photos = []; x.emgPhotos = []; return {json: JSON.stringify(x), updatedAt: c.updatedAt || 0, date: c.date || '', name: pName(c)}; };
const PUSH_T = {};
function cloudPushCase(c) {
  if (!c || AUTH.state !== 'in' || !FB) return;
  clearTimeout(PUSH_T[c.id]);
  PUSH_T[c.id] = setTimeout(() => {
    FB.db.collection('users').doc(AUTH.user.uid).collection('cases').doc(c.id).set(cloudPayload(c)).catch(() => {});
  }, 1200);
}
async function cloudDeleteCase(id) {
  if (AUTH.state === 'in' && FB) { try { await FB.db.collection('users').doc(AUTH.user.uid).collection('cases').doc(id).delete(); return; } catch (e) {} }
  PENDING_DEL.push(id); savePendingDel();
}
async function cloudSyncAll() {
  if (AUTH.state !== 'in' || !FB) return {pulled:0, pushed:0};
  const uid = AUTH.user.uid; const udoc = FB.db.collection('users').doc(uid);
  // Réglages : le plus récent gagne
  try {
    const p = await udoc.get();
    const d = p.exists ? p.data() : null;
    if (d && d.settings && (d.settingsAt || 0) > (SET.settingsAt || 0)) {
      const s = JSON.parse(d.settings); SYNC_KEYS.forEach(k => { if (s[k] !== undefined) SET[k] = s[k]; });
      SET.doctor = Object.assign(clone(SET_DEFAULT.doctor), SET.doctor || {}); SET.settingsAt = d.settingsAt; saveSet(true);
    } else if (!d || (SET.settingsAt || 0) > (d.settingsAt || 0)) pushSettings();
  } catch (e) {}
  // Suppressions en attente
  for (const id of [...PENDING_DEL]) { try { await udoc.collection('cases').doc(id).delete(); PENDING_DEL = PENDING_DEL.filter(x => x !== id); } catch (e) {} }
  savePendingDel();
  // Cas
  let pulled = 0, pushed = 0;
  const snap = await udoc.collection('cases').get();
  const remote = new Map(); snap.forEach(doc => { const v = doc.data(); remote.set(doc.id, v); });
  for (const [id, v] of remote) {
    const loc = CASES.find(x => x.id === id);
    if (!loc || (v.updatedAt || 0) > (loc.updatedAt || 0)) {
      let c; try { c = JSON.parse(v.json); } catch (e) { continue; }
      c.owner = uid; c.photos = loc ? loc.photos : []; c.emgPhotos = loc ? loc.emgPhotos : [];
      CASES = CASES.filter(x => x.id !== id); CASES.push(c); await DB.put('cases', storableCase(c)); pulled++;
    }
  }
  const batch = FB.db.batch(); let n = 0;
  for (const c of CASES) {
    const v = remote.get(c.id);
    if (!v || (c.updatedAt || 0) > (v.updatedAt || 0)) { batch.set(udoc.collection('cases').doc(c.id), cloudPayload(c)); n++; pushed++; if (n >= 400) break; }
  }
  if (n) await batch.commit();
  return {pulled, pushed};
}

/* ---------- Administration : invitations ---------- */
async function inviteList() { const s = await FB.db.collection('allowed').get(); const out = []; s.forEach(d => out.push(Object.assign({email:d.id}, d.data()))); return out.sort((a, b) => a.email.localeCompare(b.email)); }
async function inviteAdd(email) {
  const e = String(email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) throw new Error('Adresse courriel invalide.');
  await FB.db.collection('allowed').doc(e).set({by: AUTH.user.email, at: Date.now()});
}
async function inviteRemove(email) { await FB.db.collection('allowed').doc(email).delete(); }

/* =====================================================================
   Google Drive personnel (API Drive, accès limité aux fichiers de l'app)
   ===================================================================== */
const tokenValid = () => !!(GTOKEN && GTOKEN.t && GTOKEN.exp > Date.now() + 60000);
/* ---------- App Android : connexion Google via le navigateur du téléphone ---------- */
const BRIDGE_URL = 'https://themauritian1996.github.io/latence/connect.html';
let BRIDGE_WAIT = null;
async function openBridge() {
  const P = CAP(); const url = BRIDGE_URL + '?lang=' + (typeof LANG === 'string' ? LANG : 'fr');
  if (P && P.Browser) await P.Browser.open({url});
  else window.open(url, '_system');
  return new Promise((res, rej) => { BRIDGE_WAIT = {res, rej}; setTimeout(() => { if (BRIDGE_WAIT) { BRIDGE_WAIT = null; rej(new Error('Connexion Google non terminée.')); } }, 5 * 60 * 1000); });
}
async function handleBridgeReturn(url) {
  const P = CAP(); try { if (P && P.Browser) P.Browser.close(); } catch (e) {}
  const q = new URLSearchParams(String(url).split('?')[1] || '');
  const at = q.get('at'), it = q.get('it');
  if (!at) { if (BRIDGE_WAIT) { BRIDGE_WAIT.rej(new Error('Connexion Google annulée.')); BRIDGE_WAIT = null; } return; }
  GTOKEN = {t: at, exp: +q.get('exp') || Date.now() + 50 * 60 * 1000, email: q.get('em') || ''}; saveGToken();
  const fb = fbInit();
  try {
    if (fb) {
      const cred = firebase.auth.GoogleAuthProvider.credential(it || null, at);
      if (!fb.auth.currentUser) await fb.auth.signInWithCredential(cred);
      else if (!hasProvider('google.com')) { try { await fb.auth.currentUser.linkWithCredential(cred); } catch (e) {} }
    }
    if (BRIDGE_WAIT) { BRIDGE_WAIT.res(GTOKEN); BRIDGE_WAIT = null; }
  } catch (e) { if (BRIDGE_WAIT) { BRIDGE_WAIT.rej(e); BRIDGE_WAIT = null; } else throw e; }
}
async function driveConnect() {
  // Doit être appelé directement depuis un clic (fenêtre Google)
  const fb = fbInit(); if (!fb || !fb.auth.currentUser) throw new Error('Connecte-toi d\'abord.');
  if (isNativeApp()) { await openBridge(); if (!tokenValid()) throw new Error('Accès Drive non accordé.'); return GTOKEN; }
  const u = fb.auth.currentUser; let r;
  try { r = hasProvider('google.com') ? await u.reauthenticateWithPopup(googleProvider()) : await u.linkWithPopup(googleProvider()); }
  catch (e) { if (e.code === 'auth/credential-already-in-use' || e.code === 'auth/provider-already-linked') r = await u.reauthenticateWithPopup(googleProvider()); else throw e; }
  keepToken(r);
  if (!tokenValid()) throw new Error('Accès Drive non accordé.');
  return GTOKEN;
}
class DriveAuthError extends Error {}
async function gfetch(url, opt) {
  if (!tokenValid()) throw new DriveAuthError('Reconnecte Google Drive (la connexion expire après une heure).');
  opt = opt || {}; opt.headers = Object.assign({Authorization: 'Bearer ' + GTOKEN.t}, opt.headers || {});
  const r = await fetch(url, opt);
  if (r.status === 401) { GTOKEN = null; saveGToken(); throw new DriveAuthError('Reconnecte Google Drive.'); }
  if (!r.ok) { let m = ''; try { m = (await r.json()).error.message; } catch (e) {} throw new Error('Google Drive : ' + (m || r.status)); }
  return r;
}
const qEsc = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const FOLDER_CACHE = {};
async function gFolder(name, parent) {
  const k = parent + '/' + name; if (FOLDER_CACHE[k]) return FOLDER_CACHE[k];
  const q = `name='${qEsc(name)}' and mimeType='application/vnd.google-apps.folder' and trashed=false and '${parent}' in parents`;
  const r = await (await gfetch('https://www.googleapis.com/drive/v3/files?fields=files(id,webViewLink)&q=' + encodeURIComponent(q))).json();
  let f = r.files && r.files[0];
  if (!f) f = await (await gfetch('https://www.googleapis.com/drive/v3/files?fields=id,webViewLink', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name, mimeType:'application/vnd.google-apps.folder', parents:[parent]})})).json();
  FOLDER_CACHE[k] = f; return f;
}
async function gUpload(name, mime, data, parent) {
  const q = `name='${qEsc(name)}' and trashed=false and '${parent}' in parents`;
  const ex = (await (await gfetch('https://www.googleapis.com/drive/v3/files?fields=files(id)&q=' + encodeURIComponent(q))).json()).files || [];
  const blob = data instanceof Blob ? data : new Blob([data], {type: mime});
  if (ex[0]) return (await gfetch(`https://www.googleapis.com/upload/drive/v3/files/${ex[0].id}?uploadType=media&fields=id,webViewLink`, {method:'PATCH', headers:{'Content-Type': mime}, body: blob})).json();
  const fd = new FormData();
  fd.append('metadata', new Blob([JSON.stringify({name, parents:[parent]})], {type:'application/json'}));
  fd.append('file', blob);
  return (await gfetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', {method:'POST', body: fd})).json();
}
function dataUrlToBlob(d) { const p = dataUrlParts(d); if (!p) return null; const bin = atob(p.data); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); return new Blob([u8], {type: p.mime}); }
async function driveSaveGoogle(c) {
  if (!c.report) throw new Error('Génère le rapport avant de l\'envoyer au Drive.');
  const root = await gFolder(SET.rootName || 'Latence – Rapports EMG', 'root');
  const day = await gFolder(c.date, root.id);
  const pt = await gFolder(patientFolder(c), day.id);
  const base = baseName(c);
  await gUpload(base + '.docx', DOCX_MIME, reportDocx(c), pt.id);
  await gUpload(base + '.txt', 'text/plain;charset=utf-8', reportText(c), pt.id);
  if (SET.driveImages) {
    let i = 0;
    for (const ph of [...(c.photos || []), ...(c.emgPhotos || [])]) { const d = await photoData(ph.id); const b = d && dataUrlToBlob(d); if (b) await gUpload(`${base} – photo ${++i}.jpg`, 'image/jpeg', b, pt.id); }
  }
  return {url: pt.webViewLink || ''};
}
const driveModeEff = () => SET.driveMode || (SET.driveUrl && SET.driveSecret ? 'script' : 'google');
