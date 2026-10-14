'use strict';
/* =====================================================================
   Latence — noyau : utilitaires, réglages, stockage, Gemini, normes,
   rapport, Google Drive
   ===================================================================== */
const APP_VERSION = '1.1';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-6);
const esc = v => String(v === null || v === undefined ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const nrm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const pad2 = n => String(n).padStart(2, '0');
const num = v => { if (v === null || v === undefined || v === '') return null; const x = +String(v).replace(',', '.').replace(/[^\d.\-]/g, ''); return isFinite(x) && String(v).trim() !== '' ? x : null; };
const CAP = () => (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) ? window.Capacitor.Plugins : null;
function iso(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
const todayISO = () => iso(new Date());
function parseISO(s) { const p = String(s).split('-').map(Number); return new Date(p[0], (p[1] || 1) - 1, p[2] || 1); }
function fmtDate(ds) { return parseISO(ds).toLocaleDateString('fr-CA', {weekday:'short', day:'numeric', month:'short'}); }
function fmtDateLong(ds) { return parseISO(ds).toLocaleDateString('fr-CA', {weekday:'long', day:'numeric', month:'long', year:'numeric'}); }
function fmtTime(ts) { const d = new Date(ts); return pad2(d.getHours()) + ' h ' + pad2(d.getMinutes()); }
function fmtN(v, dec) { if (v === null || v === undefined || v === '') return '—'; const x = +v; if (!isFinite(x)) return '—'; return x.toLocaleString('fr-CA', {maximumFractionDigits: dec === undefined ? 1 : dec}); }
function ageAt(ddn, date) {
  if (!ddn) return null; const b = parseISO(ddn), d = parseISO(date || todayISO());
  let a = d.getFullYear() - b.getFullYear(); if (d.getMonth() < b.getMonth() || (d.getMonth() === b.getMonth() && d.getDate() < b.getDate())) a--;
  return a >= 0 && a < 130 ? a : null;
}
function getPath(o, p) { return p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o); }
function setPath(o, p, v) { const ks = p.split('.'); let a = o; ks.slice(0, -1).forEach(k => { if (a[k] == null || typeof a[k] !== 'object') a[k] = {}; a = a[k]; }); a[ks[ks.length - 1]] = v; }
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
function randomSecret() { const a = new Uint8Array(18); crypto.getRandomValues(a); return Array.from(a, b => 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 56]).join(''); }

/* ---------- Réglages ---------- */
const ST_KEY = 'latence.settings';
const DEFAULT_MODEL = 'gemini-3.8-flash';
const SET_DEFAULT = {
  geminiKey:'', modelRead:DEFAULT_MODEL, modelThink:DEFAULT_MODEL,
  driveUrl:'', driveSecret:'', driveImages:true, autoSync:true, rootName:'Latence – Rapports EMG',
  doctor:{nom:'', titre:'', etab:'', coord:''},
  theme:'auto', norms:null, comps:null, rules:null, onboarded:false, lastPull:0
};
let SET = (() => { try { return Object.assign(clone(SET_DEFAULT), JSON.parse(localStorage.getItem(ST_KEY) || '{}')); } catch (e) { return clone(SET_DEFAULT); } })();
SET.doctor = Object.assign(clone(SET_DEFAULT.doctor), SET.doctor || {});
function saveSet() { try { localStorage.setItem(ST_KEY, JSON.stringify(SET)); } catch (e) {} }
const NORMS = () => SET.norms || NORMS_DEFAULT;
const COMPS = () => SET.comps || COMPARISONS_DEFAULT;
const RULES = () => Object.assign({}, OTHER_RULES, SET.rules || {});
const normOf = k => NORMS().find(n => n.key === k) || null;

/* ---------- Stockage local (IndexedDB) ---------- */
const DB = {
  db: null,
  open() {
    return new Promise((res, rej) => {
      const r = indexedDB.open('latence', 1);
      r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains('cases')) d.createObjectStore('cases', {keyPath:'id'}); if (!d.objectStoreNames.contains('photos')) d.createObjectStore('photos', {keyPath:'id'}); };
      r.onsuccess = () => { this.db = r.result; res(); };
      r.onerror = () => rej(r.error);
    });
  },
  _req(store, mode, fn) {
    return new Promise((res, rej) => { const tx = this.db.transaction(store, mode); const q = fn(tx.objectStore(store)); tx.oncomplete = () => res(q && q.result); tx.onerror = () => rej(tx.error); tx.onabort = () => rej(tx.error); });
  },
  all(store) { return this._req(store || 'cases', 'readonly', s => s.getAll()); },
  get(store, id) { return this._req(store, 'readonly', s => s.get(id)); },
  put(store, v) { return this._req(store, 'readwrite', s => s.put(v)); },
  del(store, id) { return this._req(store, 'readwrite', s => s.delete(id)); },
  clear(store) { return this._req(store, 'readwrite', s => s.clear()); }
};
const PHOTO_CACHE = new Map();
async function photoData(id) {
  if (PHOTO_CACHE.has(id)) return PHOTO_CACHE.get(id);
  const p = await DB.get('photos', id); const d = p ? p.data : null; if (d) PHOTO_CACHE.set(id, d); return d;
}

/* ---------- Images ---------- */
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Image illisible')); i.src = src; }); }
function fileToDataURL(f) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error); r.readAsDataURL(f); }); }
async function compressImage(src, max, q) {
  const img = await loadImg(src); max = max || 2000;
  const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * s), h = Math.round(img.naturalHeight * s);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const x = cv.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0, w, h);
  return cv.toDataURL('image/jpeg', q || 0.86);
}
async function rotateImage(src, deg) {
  const img = await loadImg(src); const r = ((deg % 360) + 360) % 360; const sw = r === 90 || r === 270;
  const cv = document.createElement('canvas'); cv.width = sw ? img.naturalHeight : img.naturalWidth; cv.height = sw ? img.naturalWidth : img.naturalHeight;
  const x = cv.getContext('2d'); x.translate(cv.width / 2, cv.height / 2); x.rotate(r * Math.PI / 180); x.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  return cv.toDataURL('image/jpeg', 0.88);
}
async function cropImage(src, c) {
  const img = await loadImg(src); const W = img.naturalWidth, H = img.naturalHeight;
  const sx = Math.round(c.x * W), sy = Math.round(c.y * H), sw = Math.max(20, Math.round(c.w * W)), sh = Math.max(20, Math.round(c.h * H));
  const cv = document.createElement('canvas'); cv.width = sw; cv.height = sh; cv.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  return cv.toDataURL('image/jpeg', 0.88);
}
const dataUrlParts = d => { const m = /^data:([^;]+);base64,(.*)$/.exec(d || ''); return m ? {mime:m[1], data:m[2]} : null; };

/* ---------- Gemini ---------- */
const GEM_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const gemErr = (status, body) => {
  let msg = ''; try { msg = JSON.parse(body).error.message || ''; } catch (e) { msg = String(body || '').slice(0, 200); }
  if (status === 400 && /api key/i.test(msg)) return 'Clé API Gemini invalide. Vérifie-la dans Réglages.';
  if (status === 403) return 'Accès refusé par Gemini (clé invalide ou API non activée). ' + msg;
  if (status === 404) return 'Modèle Gemini introuvable. Choisis un autre modèle dans Réglages. (' + msg + ')';
  if (status === 429) return 'Limite d\'utilisation Gemini atteinte (quota). Réessaie dans une minute ou active la facturation sur ta clé.';
  if (status >= 500) return 'Gemini est momentanément indisponible (' + status + '). Réessaie.';
  return 'Erreur Gemini ' + status + ' : ' + msg;
};
function parseLooseJSON(t) {
  t = String(t || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(t); } catch (e) {}
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
  throw new Error('Réponse de Gemini illisible. Réessaie.');
}
function upSchema(o) {
  if (Array.isArray(o)) return o.map(upSchema);
  if (!o || typeof o !== 'object') return o;
  const r = {}; Object.keys(o).forEach(k => { r[k] = k === 'type' && typeof o[k] === 'string' ? o[k].toUpperCase() : (k === 'enum' || k === 'required' ? o[k] : upSchema(o[k])); });
  return r;
}
const FALLBACK_MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-flash-latest'];
let GEM_LAST_MODEL = '';
async function gemini(parts, opt) {
  opt = opt || {};
  if (!SET.geminiKey) throw new Error('Ajoute ta clé API Gemini dans Réglages.');
  const first = (opt.model || SET.modelThink || DEFAULT_MODEL).replace(/^models\//, '');
  const chain = [first, ...FALLBACK_MODELS.filter(m => m !== first)];
  let lastErr = null;
  // Jusqu'à 3 tours de la chaîne de modèles (pause croissante) si Google est surchargé
  for (let pass = 0; pass < 3; pass++) {
    if (pass) { if (opt.onWait) opt.onWait(pass); await new Promise(s => setTimeout(s, pass * 6000)); }
    for (let i = 0; i < chain.length; i++) {
      try { const res = await geminiOnce(chain[i], parts, opt); GEM_LAST_MODEL = chain[i]; return res; }
      catch (e) {
        lastErr = e;
        // Basculer vers un autre modèle seulement si celui-ci est surchargé, hors quota ou introuvable
        if (!e.retryable) throw e;
      }
    }
  }
  if (lastErr && /indisponible/.test(lastErr.message)) throw new Error('Les serveurs Gemini sont surchargés en ce moment. Tes données sont gardées : réessaie dans quelques minutes.');
  throw lastErr;
}
async function geminiOnce(model, parts, opt) {
  const url = `${GEM_BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(SET.geminiKey)}`;
  const gc = {responseMimeType:'application/json'};
  if (opt.schema) gc.responseSchema = upSchema(opt.schema);
  if (!/gemini-([3-9]|\d\d)|latest/.test(model)) gc.temperature = 0.2; // Gemini 3+ : garder la température par défaut
  const body = {contents:[{role:'user', parts}], generationConfig:gc};
  if (opt.system) body.systemInstruction = {parts:[{text:opt.system}]};
  const call = async () => {
    const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), opt.timeout || 180000);
    try { return await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body), signal:ctl.signal}); }
    catch (e) { throw new Error(e.name === 'AbortError' ? 'Gemini a mis trop de temps à répondre. Réessaie.' : 'Pas de connexion à Gemini. Vérifie Internet.'); }
    finally { clearTimeout(to); }
  };
  const fail = (status, t) => { const e = new Error(gemErr(status, t)); e.retryable = status === 429 || status === 404 || status >= 500; return e; };
  let r = await call();
  if (!r.ok) {
    const t = await r.text();
    if (r.status === 400 && gc.responseSchema && /schema|response_?schema|Invalid JSON payload|Unknown name/i.test(t)) { delete gc.responseSchema; r = await call(); if (!r.ok) throw fail(r.status, await r.text()); }
    else if (r.status === 503 || r.status === 500) { throw fail(r.status, t); }
    else throw fail(r.status, t);
  }
  const j = await r.json();
  const cand = j.candidates && j.candidates[0];
  if (!cand) throw new Error('Gemini a bloqué la requête' + (j.promptFeedback && j.promptFeedback.blockReason ? ' (' + j.promptFeedback.blockReason + ')' : '') + '.');
  const text = ((cand.content && cand.content.parts) || []).filter(p => p.text && !p.thought).map(p => p.text).join('');
  if (!text) throw new Error('Réponse vide de Gemini' + (cand.finishReason ? ' (' + cand.finishReason + ')' : '') + '. Réessaie.');
  return parseLooseJSON(text);
}
async function geminiModels() {
  if (!SET.geminiKey) throw new Error('Ajoute d\'abord ta clé API.');
  const r = await fetch(`${GEM_BASE}/models?pageSize=200&key=${encodeURIComponent(SET.geminiKey)}`);
  if (!r.ok) throw new Error(gemErr(r.status, await r.text()));
  const j = await r.json();
  return (j.models || []).filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
    .map(m => m.name.replace(/^models\//, ''))
    .filter(n => /^gemini-/.test(n) && !/(tts|image|live|embedding|transcribe|robotics|computer-use|banana|audio|aqa|translate)/.test(n))
    .sort((a, b) => b.localeCompare(a, 'en', {numeric:true}));
}

/* ---------- Bibliothèque de muscles ---------- */
function findMuscle(name) {
  const q = nrm(name).replace(/\b(droit|gauche|g|d|bilat|bilateral|left|right|muscle|le|la|du|de|l)\b/g, ' ').replace(/\s+/g, ' ').trim();
  if (!q) return null;
  let m = MUSCLES.find(x => nrm(x.n) === q || nrm(x.en) === q);
  if (m) return m;
  m = MUSCLES.find(x => q.includes(nrm(x.n)) || q.includes(nrm(x.en)) || nrm(x.n).includes(q) || nrm(x.en).includes(q));
  if (m) return m;
  const qt = q.split(' ').filter(w => w.length > 2); let best = null, bs = 0;
  MUSCLES.forEach(x => { const t = (nrm(x.n) + ' ' + nrm(x.en)).split(' '); const s = qt.filter(w => t.includes(w)).length / Math.max(1, qt.length); if (s > bs) { bs = s; best = x; } });
  return bs >= 0.6 ? best : null;
}
function emgEntry(name, side) {
  const m = findMuscle(name);
  return {id:uid(), muscle: m ? m.n : name, en: m ? m.en : '', nerf: m ? m.nerf : '', rac: m ? m.rac : '', cote: side || 'D',
    ins:'', fib:'', psw:'', fasc:'', amp:'', dur:'', poly:'', rec:'', act:'', autre:[], note:''};
}
function emgAbnormal(e) {
  return e.ins === '↑' || (e.fib && e.fib !== '0') || (e.psw && e.psw !== '0') || e.fasc === '+' || (e.amp && e.amp !== 'N') || (e.dur && e.dur !== 'N') || e.poly === '↑' || (e.rec && e.rec !== 'N') || e.act === '↓' || (e.autre || []).length > 0;
}
const emgFilled = e => ['ins','fib','psw','amp','dur','rec'].some(k => e[k]);

/* =====================================================================
   Moteur de normes — calcul déterministe des anomalies
   ===================================================================== */
const SIDE = {G:'gauche', D:'droit', '?':''};
const sideLbl = s => s === 'G' ? 'G' : s === 'D' ? 'D' : '';
function rowLatency(r) { return (r.type === 'sensory' || r.type === 'mixed') ? (r.latence_pic != null ? r.latence_pic : r.latence) : (r.latence != null ? r.latence : r.latence_pic); }
const SHORT = {median_m_apb:'Médian (APB)', ulnar_m_adm:'Ulnaire (ADM)', ulnar_m_fdi:'Ulnaire (FDI)', radial_m_eip:'Radial (EIP)', peroneal_m_edb:'Fibulaire (EDB)', peroneal_m_ta:'Fibulaire (TA)', tibial_m_ahb:'Tibial (AHB)',
  median_s_d2:'Médian sens. D2', ulnar_s_d5:'Ulnaire sens. D5', radial_s:'Radial sens.', dorsal_ulnar_cut:'Cutané dors. ulnaire', lat_antebrachial:'CAB latéral', med_antebrachial:'CAB médial', sural:'Sural', superficial_peroneal:'Fibulaire superf.', saphenous:'Saphène',
  median_palm:'Médian palmaire', ulnar_palm:'Ulnaire palmaire', median_ring:'Médian D4', ulnar_ring:'Ulnaire D4', median_thumb:'Médian pouce', radial_thumb:'Radial pouce', median_lumbrical:'Médian lombrical', ulnar_interosseous:'Ulnaire interosseux',
  h_soleus:'Réflexe H', blink_r1:'Clignement R1', blink_r2i:'Clignement R2 ipsi', blink_r2c:'Clignement R2 contro'};
function shortName(r) { return (SHORT[r.normKey] || r.nerf || 'Nerf') + (r.cote && r.cote !== '?' ? ' ' + sideLbl(r.cote) : ''); }
function fmtL(v) { if (v === null || v === undefined || v === '' || !isFinite(+v)) return '—'; return (+v).toLocaleString('fr-CA', {minimumFractionDigits:1, maximumFractionDigits:2}); }
function rowName(r) { const n = normOf(r.normKey); return (n ? n.label : (r.nerf || 'Nerf')) + (r.cote && r.cote !== '?' ? ' ' + sideLbl(r.cote) : ''); }
function siteName(r) { return r.stimulation || ({distal:'distal','avant-bras':'avant-bras','trans-coude':'au-dessus du coude',bras:'bras',aisselle:'aisselle',erb:'Erb',jambe:'tête fibulaire (sous)','trans-tete-fibulaire':'tête fibulaire (dessus)','creux-poplite':'creux poplité'}[r.segment] || ''); }

function evaluate(c) {
  const R = RULES(), rows = (c.ncs && c.ncs.rows) || [], out = rows.map(() => ({lat:'z', amp:'z', cv:'z', f:'z'})), F = [];
  const age = ageAt(c.patient.ddn, c.date);
  const groups = new Map();
  rows.forEach((r, i) => {
    const k = (r.normKey && r.normKey !== 'autre' ? r.normKey : nrm(r.nerf) + '|' + r.type) + '|' + (r.cote || '?');
    if (!groups.has(k)) groups.set(k, []); groups.get(k).push(i);
  });
  const add = (lvl, txt) => F.push({lvl, txt});

  groups.forEach(idx => {
    const r0 = rows[idx[0]]; const n = normOf(r0.normKey); const name = rowName(r0);
    const isMotor = r0.type === 'motor';
    // Ligne distale de référence
    const di = idx.find(i => rows[i].segment === 'distal') ?? idx[0];
    idx.forEach(i => {
      const r = rows[i], o = out[i];
      if (r.absent) { o.lat = o.amp = o.cv = 'x'; if (i === di || !isMotor) add('a', `${name} : réponse absente${isMotor && r.stimulation ? ' (stimulation ' + r.stimulation + ')' : ''}.`); return; }
      if (!n) return;
      const lat = rowLatency(r);
      // Latence : seulement distale pour le moteur
      if (n.lat != null && lat != null && (!isMotor || i === di)) {
        if (lat > n.lat) {
          const demy = (r.type === 'motor') && lat > n.lat * R.demyLat / 100;
          o.lat = demy ? 'd' : 'a';
          add('a', `${name} : latence ${isMotor ? 'distale' : 'au pic'} allongée à ${fmtN(lat, 2)} ms (N ≤ ${fmtN(n.lat, 1)})${demy ? ' — zone démyélinisante (> ' + R.demyLat + ' % LSN)' : ''}.`);
        } else o.lat = 'n';
      }
      // Amplitude : distale (moteur) ou unique (sensitif)
      if (n.amp != null && r.amplitude != null && (!isMotor || i === di)) {
        if (r.amplitude < n.amp) { o.amp = 'a'; add('a', `${name} : amplitude ${isMotor ? 'PAMC (CMAP)' : 'PANS (SNAP)'} diminuée à ${fmtN(r.amplitude, 1)} ${isMotor ? 'mV' : 'µV'} (N ≥ ${fmtN(n.amp, 1)}).`); }
        else o.amp = 'n';
      }
      // Vitesse
      if (r.vitesse != null) {
        let lln = n.cv;
        if (r.normKey && r.normKey.startsWith('ulnar_m') && r.segment === 'trans-coude') lln = R.elbowCv;
        if (lln != null) {
          if (r.vitesse < lln) {
            const demy = r.vitesse < lln * R.demyCv / 100; o.cv = demy ? 'd' : 'a';
            add('a', `${name} : vitesse de conduction ralentie à ${fmtN(r.vitesse, 0)} m/s${isMotor && siteName(r) ? ' (segment ' + siteName(r) + ')' : ''} (N ≥ ${fmtN(lln, 0)})${demy ? ' — zone démyélinisante (< ' + R.demyCv + ' % LIN)' : ''}.`);
          } else o.cv = 'n';
        }
      }
      // Onde F
      if (r.f_lat != null && n.f != null) {
        if (r.f_lat > n.f) { const demy = r.f_lat > n.f * R.demyLat / 100; o.f = demy ? 'd' : 'a'; add('a', `${name} : latence de l'onde F allongée à ${fmtN(r.f_lat, 1)} ms (N ≤ ${fmtN(n.f, 0)}${c.patient.taille ? ', taille ' + c.patient.taille + ' cm' : ''}).`); }
        else o.f = 'n';
      }
    });
    // Chute d'amplitude proximale (bloc de conduction)
    if (isMotor) {
      const d = rows[di];
      if (d && !d.absent && d.amplitude) {
        let prev = d;
        idx.filter(i => i !== di).forEach(i => {
          const r = rows[i]; if (r.absent || r.amplitude == null) return;
          const drop = (prev.amplitude - r.amplitude) / prev.amplitude * 100;
          const tib = (r0.normKey || '').startsWith('tibial');
          if (drop > R.blockDrop) {
            add(tib ? 'w' : 'a', `${name} : chute d'amplitude de ${fmtN(drop, 0)} % entre ${siteName(prev) || 'distal'} et ${siteName(r) || 'proximal'}${tib ? ' — fréquente au creux poplité (technique) ; interpréter avec prudence' : ' — bloc de conduction probable (vérifier la dispersion temporelle)'}.`);
            out[i].amp = tib ? 'z' : 'a';
          } else if (drop > R.blockPossible && !tib) {
            add('w', `${name} : chute d'amplitude de ${fmtN(drop, 0)} % entre ${siteName(prev) || 'distal'} et ${siteName(r) || 'proximal'} (bloc partiel possible).`);
          }
          prev = r;
        });
        // Ralentissement focal ulnaire au coude / fibulaire à la tête
        const fore = idx.map(i => rows[i]).find(r => r.segment === 'avant-bras' && r.vitesse != null);
        const elb = idx.map(i => rows[i]).find(r => r.segment === 'trans-coude' && r.vitesse != null);
        if ((r0.normKey || '').startsWith('ulnar_m') && fore && elb && fore.vitesse - elb.vitesse > R.focalDrop)
          add('a', `${name} : ralentissement focal au coude (${fmtN(elb.vitesse, 0)} vs ${fmtN(fore.vitesse, 0)} m/s à l'avant-bras, Δ > ${R.focalDrop} m/s).`);
        const leg = idx.map(i => rows[i]).find(r => r.segment === 'jambe' && r.vitesse != null);
        const fh = idx.map(i => rows[i]).find(r => r.segment === 'trans-tete-fibulaire' && r.vitesse != null);
        if ((r0.normKey || '').startsWith('peroneal_m') && leg && fh && leg.vitesse - fh.vitesse > R.focalDrop)
          add('a', `${name} : ralentissement focal à la tête fibulaire (${fmtN(fh.vitesse, 0)} vs ${fmtN(leg.vitesse, 0)} m/s à la jambe, Δ > ${R.focalDrop} m/s).`);
      }
    }
  });

  // Asymétrie côté à côté (amplitudes distales)
  const byKey = {};
  rows.forEach((r, i) => { if (!r.normKey || r.normKey === 'autre' || r.absent || r.amplitude == null) return; if (r.type === 'motor' && r.segment && r.segment !== 'distal') return; (byKey[r.normKey] = byKey[r.normKey] || {})[r.cote] = r; });
  Object.entries(byKey).forEach(([k, s]) => {
    if (s.G && s.D) { const lo = Math.min(s.G.amplitude, s.D.amplitude), hi = Math.max(s.G.amplitude, s.D.amplitude);
      if (hi > 0 && (hi - lo) / hi * 100 > R.sideAmp) add('w', `${normOf(k) ? normOf(k).label : k} : asymétrie d'amplitude de ${fmtN((hi - lo) / hi * 100, 0)} % (${lo === s.G.amplitude ? 'G' : 'D'} plus bas).`); }
  });

  // Études comparatives
  const latOf = (key, side) => { const r = rows.find(x => x.normKey === key && (x.cote || '?') === side && !x.absent); return r ? rowLatency(r) : null; };
  ['G', 'D', '?'].forEach(side => {
    let csi = 0, csiN = 0;
    COMPS().forEach(cp => {
      const a = latOf(cp.a, side), b = latOf(cp.b, side); if (a == null || b == null) return;
      const d = +(a - b).toFixed(2);
      if (['palm', 'ring', 'thumb'].includes(cp.id)) { csi += d; csiN++; }
      add(d >= cp.thr ? 'a' : 'n', `${cp.label}${side !== '?' ? ' ' + side : ''} : différence ${fmtN(d, 2)} ms (anormal si ≥ ${fmtN(cp.thr, 1)}).`);
    });
    if (csiN === 3) add(csi >= CSI_THR ? 'a' : 'n', `Index sensitif combiné (CSI)${side !== '?' ? ' ' + side : ''} : ${fmtN(csi, 2)} ms (anormal si ≥ ${fmtN(CSI_THR, 1)}).`);
  });

  // Réflexe H — asymétrie
  const hG = latOf('h_soleus', 'G'), hD = latOf('h_soleus', 'D');
  if (hG != null && hD != null && Math.abs(hG - hD) > R.hSide) add('a', `Réflexe H : asymétrie de ${fmtN(Math.abs(hG - hD), 1)} ms (anormal si > ${R.hSide}).`);

  // Contexte technique
  const tM = num(c.ncs.tMain != null ? c.ncs.tMain : c.clin.tMain), tP = num(c.ncs.tPied != null ? c.ncs.tPied : c.clin.tPied);
  if (tM != null && tM < R.tempHand) add('w', `Température de la main ${fmtN(tM, 1)} °C (< ${R.tempHand} °C) : latences possiblement allongées et vitesses ralenties.`);
  if (tP != null && tP < R.tempFoot) add('w', `Température du pied ${fmtN(tP, 1)} °C (< ${R.tempFoot} °C) : latences possiblement allongées et vitesses ralenties.`);
  if (age != null && age < 18) add('w', `Patient de ${age} ans : les normes intégrées sont adultes — utiliser des normes pédiatriques.`);
  if (age != null && age >= 70 && rows.some(r => ['sural', 'superficial_peroneal'].includes(r.normKey) && (r.absent || (r.amplitude != null && normOf(r.normKey) && r.amplitude < normOf(r.normKey).amp))))
    add('w', `Patient de ${age} ans : PANS sural/fibulaire superficiel bas ou absents peuvent être non spécifiques à cet âge.`);
  const unknown = rows.filter(r => !normOf(r.normKey) && r.type !== 'other');
  if (unknown.length) add('w', `${unknown.length} étude(s) sans norme intégrée (${[...new Set(unknown.map(r => r.nerf))].slice(0, 4).join(', ')}) : interprétée(s) par Gemini seulement.`);
  return {cells: out, findings: F, age};
}

/* =====================================================================
   Contexte transmis à Gemini (sans identifiants)
   ===================================================================== */
function clinicalContext(c) {
  const k = c.clin, age = ageAt(c.patient.ddn, c.date);
  return {
    age: age, sexe: c.patient.sexe || null, taille_cm: num(c.patient.taille),
    date_examen: c.date, debut_symptomes: k.debut || null,
    motif_reference: k.motif || null, referent: k.referent ? 'oui' : null,
    symptomes: k.symptomes || null, examen_physique: k.examen || null,
    antecedents: [...(k.atcd || []), k.atcdTxt].filter(Boolean).join(', ') || null,
    membres_etudies: (k.membres || []).join(', ') || null,
    temperature_main: num(c.ncs.tMain != null ? c.ncs.tMain : k.tMain), temperature_pied: num(c.ncs.tPied != null ? c.ncs.tPied : k.tPied)
  };
}
function ncsContext(c, ev) {
  ev = ev || evaluate(c);
  const lab = {a:'ANORMAL', d:'ANORMAL (zone démyélinisante)', x:'ABSENT', n:'normal', z:'non jugé'};
  return (c.ncs.rows || []).map((r, i) => {
    const n = normOf(r.normKey), o = ev.cells[i];
    return {etude: rowName(r), type: r.type, stimulation: siteName(r), enregistrement: r.enregistrement || null, absent: !!r.absent,
      latence_ms: rowLatency(r), amplitude: r.amplitude, unite_amp: r.type === 'motor' ? 'mV' : 'µV', vitesse_ms: r.vitesse, distance_cm: r.distance, onde_f_ms: r.f_lat,
      normes: n ? {lat_max: n.lat, amp_min: n.amp, vc_min: n.cv, f_max: n.f} : 'aucune norme intégrée',
      evaluation: {latence: lab[o.lat], amplitude: lab[o.amp], vitesse: lab[o.cv], onde_f: lab[o.f]}, remarque: r.remarque || null};
  });
}
function emgContext(c) {
  return (c.emg || []).filter(emgFilled).map(e => ({muscle: e.muscle + ' ' + e.cote, nerf: e.nerf, racines: e.rac,
    insertion: e.ins, fibrillations: e.fib, ondes_positives: e.psw, fasciculations: e.fasc, amplitude_PUM: e.amp, duree_PUM: e.dur, polyphasie: e.poly,
    recrutement: e.rec, activation: e.act, autres: (e.autre || []).join(', '), note: e.note}));
}

/* =====================================================================
   Rapport (HTML autonome + texte pour DME)
   ===================================================================== */
const REP_CSS = `body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:28px 34px;font-size:12.5px;line-height:1.45}
h1{font-size:18px;margin:0 0 2px}h2{font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;margin:16px 0 6px;color:#333;border-bottom:1px solid #ccc;padding-bottom:3px}
.meta{width:100%;font-size:12px;color:#333;margin:6px 0 0}.meta td{padding:1px 12px 1px 0;border:0}
table.t{border-collapse:collapse;width:100%;font-size:11px;margin:4px 0}table.t th,table.t td{border-bottom:1px solid #ddd;padding:3px 4px;text-align:right}
table.t th:first-child,table.t td:first-child{text-align:left}table.t th{color:#444}.a,.d,.x{color:#c62828;font-weight:bold}.d{text-decoration:underline}
.nm{display:block;font-size:9.5px;color:#777}p{margin:0 0 7px}.sig{margin-top:22px}.disc{margin-top:14px;font-size:9.5px;color:#777}.leg{font-size:9.5px;color:#666}`;

function reportParts(c) {
  const ev = evaluate(c), p = c.patient, S = (c.report && c.report.sections) || {}, D = SET.doctor;
  const age = ageAt(p.ddn, c.date);
  const pname = [p.nom ? p.nom.toUpperCase() : '', p.prenom].filter(Boolean).join(', ') || 'Patient';
  const cellCls = v => v === 'a' ? 'a' : v === 'd' ? 'd' : v === 'x' ? 'x' : '';
  const cellv = (v, dec, cls) => `<td class="${cellCls(cls)}">${v == null ? '—' : fmtN(v, dec)}</td>`;
  // Tableau NCS
  const groupsOrder = [['motor', 'Conductions motrices'], ['sensory', 'Conductions sensitives'], ['mixed', 'Études mixtes'], ['F', 'Ondes F'], ['H', 'Réflexe H'], ['blink', 'Réflexe de clignement'], ['other', 'Autres']];
  let ncs = '';
  groupsOrder.forEach(([t, lbl]) => {
    const rs = (c.ncs.rows || []).map((r, i) => [r, i]).filter(([r]) => r.type === t); if (!rs.length) return;
    ncs += `<tr><td colspan="7" style="font-weight:bold;background:#f3f3f3">${lbl}</td></tr>`;
    rs.forEach(([r, i]) => {
      const o = ev.cells[i], n = normOf(r.normKey);
      const nm = n ? [n.lat != null ? 'lat ≤' + fmtN(n.lat) : '', n.amp != null ? 'amp ≥' + fmtN(n.amp) : '', n.cv != null ? 'VC ≥' + fmtN(n.cv, 0) : '', n.f != null ? 'F ≤' + fmtN(n.f, 0) : ''].filter(Boolean).join(' · ') : '';
      ncs += `<tr><td>${esc(shortName(r))}${siteName(r) ? ' — ' + esc(siteName(r)) : ''}${nm ? '<span class="nm">N : ' + nm + '</span>' : ''}</td>` +
        (r.absent ? `<td class="x" colspan="5">Absente</td>` :
        `<td class="${cellCls(o.lat)}">${fmtL(rowLatency(r))}</td>` + cellv(r.amplitude, 1, o.amp) + `<td>${r.amplitude == null ? '' : (r.type === 'motor' ? 'mV' : 'µV')}</td>` + cellv(r.distance, 1) + cellv(r.vitesse, 0, o.cv)) + `<td class="${cellCls(o.f)}">${r.f_lat == null ? '—' : fmtL(r.f_lat)}</td></tr>`;
    });
  });
  const ncsTable = ncs ? `<div class="rep-tbl"><table class="t"><thead><tr><th>Nerf — site</th><th>Lat. (ms)</th><th>Amp.</th><th></th><th>Dist. (cm)</th><th>VC (m/s)</th><th>F (ms)</th></tr></thead><tbody>${ncs}</tbody></table></div><div class="leg">En rouge : hors normes. Latence motrice = début ; sensitive = pic.${ev.findings.some(f => f.txt.includes('démyélinisante')) ? ' Souligné : zone démyélinisante.' : ''}</div>` : '';
  // Tableau EMG
  const em = (c.emg || []).filter(emgFilled);
  const emgTable = em.length ? `<div class="rep-tbl"><table class="t"><thead><tr><th>Muscle</th><th>Ins.</th><th>Fibs</th><th>PSW</th><th>Fasc.</th><th>Amp.</th><th>Durée</th><th>Poly.</th><th>Recrut.</th><th>Autre</th></tr></thead><tbody>${em.map(e => {
    const bad = (k, v) => (k === 'fib' || k === 'psw') ? (v && v !== '0') : k === 'fasc' ? v === '+' : k === 'ins' ? v === '↑' : (v && v !== 'N');
    return `<tr><td>${esc(e.muscle)} ${esc(e.cote)}<span class="nm">${esc([e.nerf, e.rac].filter(Boolean).join(' · '))}</span></td>${['ins', 'fib', 'psw', 'fasc', 'amp', 'dur', 'poly', 'rec'].map(k => `<td class="${bad(k, e[k]) ? 'a' : ''}">${esc(e[k] || '—')}</td>`).join('')}<td>${esc((e.autre || []).join(', ') + (e.note ? (e.autre && e.autre.length ? ' · ' : '') + e.note : ''))}</td></tr>`;
  }).join('')}</tbody></table></div>` : '';
  const para = t => String(t || '').split(/\n{2,}|\n(?=\d+\.)/).map(x => x.trim()).filter(Boolean).map(x => `<p>${esc(x).replace(/\n/g, '<br>')}</p>`).join('');
  const sec = (title, body) => body ? `<h2>${title}</h2>${body}` : '';
  const body = `
<h1>Rapport d'électrodiagnostic (EMG / conductions nerveuses)</h1>
<table class="meta"><tr><td><b>Patient :</b> ${esc(pname)}</td><td><b>Date de l'examen :</b> ${esc(fmtDateLong(c.date))}</td></tr>
<tr><td><b>DDN :</b> ${esc(p.ddn || '—')}${age != null ? ' (' + age + ' ans)' : ''}${p.sexe ? ' · ' + esc(p.sexe) : ''}</td><td><b>No dossier :</b> ${esc(p.dossier || '—')}</td></tr>
<tr><td><b>Référent :</b> ${esc(c.clin.referent || '—')}</td><td><b>Examinateur :</b> ${esc(D.nom || '—')}</td></tr></table>
${sec('Renseignements cliniques', para(S.renseignements || c.clin.motif))}
${sec('Technique', para(S.technique))}
${sec('Conductions nerveuses', ncsTable + para(S.ncs_resume))}
${sec('EMG à l\'aiguille', emgTable + para(S.emg_resume))}
${sec('Interprétation', para(S.interpretation))}
${sec('Conclusion', para(S.conclusion))}
${sec('Recommandations', para(S.recommandations))}
<div class="sig">${esc(D.nom || '')}${D.titre ? '<br>' + esc(D.titre) : ''}${D.etab ? '<br>' + esc(D.etab) : ''}${D.coord ? '<br>' + esc(D.coord) : ''}</div>
<div class="disc">Rapport préparé avec l'assistance de Latence (IA Gemini), révisé et validé par le médecin signataire. Normes de référence : laboratoire / Preston & Shapiro (adulte).</div>`;
  return {body, pname};
}
function reportHTMLDoc(c) {
  const {body, pname} = reportParts(c);
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>EMG — ${esc(pname)} — ${esc(c.date)}</title><style>${REP_CSS}</style></head><body>${body}</body></html>`;
}
function reportText(c) {
  const ev = evaluate(c), p = c.patient, S = (c.report && c.report.sections) || {}, age = ageAt(p.ddn, c.date);
  const L = [];
  L.push('RAPPORT D\'ÉLECTRODIAGNOSTIC (EMG / CONDUCTIONS NERVEUSES)');
  L.push(`Date : ${c.date}${age != null ? ' — Âge : ' + age + ' ans' : ''}`);
  const s = (t, v) => { if (v && String(v).trim()) { L.push(''); L.push(t.toUpperCase()); L.push(String(v).trim()); } };
  s('Renseignements cliniques', S.renseignements || c.clin.motif);
  s('Technique', S.technique);
  const nl = (c.ncs.rows || []).map((r, i) => {
    const o = ev.cells[i], fl = v => (v === 'a' || v === 'd') ? ' *' : '';
    if (r.absent) return `- ${shortName(r)}${siteName(r) ? ' (' + siteName(r) + ')' : ''} : réponse absente *`;
    const parts = [];
    const lat = rowLatency(r); if (lat != null) parts.push(`lat ${fmtL(lat)} ms${fl(o.lat)}`);
    if (r.amplitude != null) parts.push(`amp ${fmtN(r.amplitude, 1)} ${r.type === 'motor' ? 'mV' : 'µV'}${fl(o.amp)}`);
    if (r.vitesse != null) parts.push(`VC ${fmtN(r.vitesse, 0)} m/s${fl(o.cv)}`);
    if (r.f_lat != null) parts.push(`F ${fmtL(r.f_lat)} ms${fl(o.f)}`);
    return `- ${shortName(r)}${siteName(r) ? ' (' + siteName(r) + ')' : ''} : ${parts.join(', ')}`;
  });
  s('Conductions nerveuses (* = hors normes)', nl.join('\n') + (S.ncs_resume ? '\n\n' + S.ncs_resume : ''));
  const em = (c.emg || []).filter(emgFilled).map(e => `- ${e.muscle} ${e.cote} : ins ${e.ins || '—'}, fibs ${e.fib || '—'}, PSW ${e.psw || '—'}, fasc ${e.fasc || '—'}, PUM amp ${e.amp || '—'}/durée ${e.dur || '—'}/poly ${e.poly || '—'}, recrutement ${e.rec || '—'}${(e.autre || []).length ? ', ' + e.autre.join(', ') : ''}${e.note ? ' (' + e.note + ')' : ''}`);
  if (em.length || S.emg_resume) s('EMG à l\'aiguille', em.join('\n') + (S.emg_resume ? '\n\n' + S.emg_resume : ''));
  s('Interprétation', S.interpretation);
  s('Conclusion', S.conclusion);
  s('Recommandations', S.recommandations);
  if (SET.doctor.nom) { L.push(''); L.push(SET.doctor.nom + (SET.doctor.titre ? ', ' + SET.doctor.titre : '')); }
  return L.join('\n');
}

/* =====================================================================
   Google Drive (via Google Apps Script personnel)
   ===================================================================== */
const safeName = s => String(s || '').replace(/[\\/:*?"<>|#%]+/g, '-').replace(/\s+/g, ' ').trim().slice(0, 80);
function patientFolder(c) {
  const p = c.patient; const nm = [p.nom ? p.nom.toUpperCase() : '', p.prenom].filter(Boolean).join(' ');
  return safeName((nm || 'Patient sans nom') + (p.dossier ? ' – ' + p.dossier : (nm ? '' : ' – ' + c.id.slice(-5))));
}
function baseName(c) { const d = new Date(c.createdAt); return safeName(`EMG ${c.date} ${pad2(d.getHours())}h${pad2(d.getMinutes())} – ${patientFolder(c)}`); }
function storableCase(c) { const x = clone(c); delete x._ui; return x; }
async function driveCall(payload, timeout) {
  if (!SET.driveUrl || !SET.driveSecret) throw new Error('Configure Google Drive dans Réglages.');
  if (!/^https:\/\/script\.google(usercontent)?\.com\//.test(SET.driveUrl)) throw new Error('L\'adresse Drive doit commencer par https://script.google.com/');
  const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), timeout || 120000);
  let r;
  try { r = await fetch(SET.driveUrl, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(Object.assign({secret:SET.driveSecret, rootName:SET.rootName}, payload)), redirect:'follow', signal:ctl.signal}); }
  catch (e) { throw new Error(e.name === 'AbortError' ? 'Google Drive ne répond pas.' : 'Connexion à Google Drive impossible (Internet, ou script non déployé pour « Tout le monde »).'); }
  finally { clearTimeout(to); }
  const t = await r.text(); let j;
  try { j = JSON.parse(t); } catch (e) { throw new Error(/<html/i.test(t) ? 'Le script Drive a renvoyé une page web : vérifie le déploiement (Application Web, accès « Tout le monde »).' : 'Réponse Drive illisible.'); }
  if (!j.ok) throw new Error(j.error || 'Erreur Google Drive');
  return j;
}
async function driveSaveCase(c) {
  if (!c.report) throw new Error('Génère le rapport avant de l\'envoyer au Drive.');
  const images = [];
  if (SET.driveImages) for (const ph of [...(c.photos || []), ...(c.emgPhotos || [])]) { const d = await photoData(ph.id); const pp = dataUrlParts(d); if (pp) images.push(pp); }
  return driveCall({action:'save', date:c.date, patientFolder:patientFolder(c), baseName:baseName(c), html:reportHTMLDoc(c), text:reportText(c), caseId:c.id, caseJson:JSON.stringify(storableCase(c)), images}, 180000);
}
