'use strict';
/* =====================================================================
   Latence — langues (français / English)
   L'interface est écrite en français ; en anglais, les textes affichés
   sont traduits à la volée (dictionnaire + modèles). Les rapports et les
   constats des normes sont générés directement dans la langue choisie.
   ===================================================================== */
let LANG = (() => { try { const v = localStorage.getItem('latence.lang'); if (v === 'fr' || v === 'en') return v; } catch (e) {} return /^en/i.test(navigator.language || '') ? 'en' : 'fr'; })();
let LANG_RT = LANG;                       // langue en cours (change pendant la génération d'un rapport)
const EN = () => LANG_RT === 'en';
function withLang(l, fn) { const p = LANG_RT; LANG_RT = l; try { return fn(); } finally { LANG_RT = p; } }
function reportLang() { return (typeof SET !== 'undefined' && SET && SET.reportLang) || LANG; }
function setLang(l) { try { localStorage.setItem('latence.lang', l); } catch (e) {} }
const outLangInstr = l => l === 'en'
  ? '\n\nOUTPUT LANGUAGE: write EVERY text field of your answer in English (North American medical English), even though the instructions above are in French.'
  : '\n\nLANGUE DE SORTIE : rédige tous les champs en français médical québécois.';

function repT() {
  return EN() ? {title:'Electrodiagnostic report (EMG / nerve conduction studies)', patient:'Patient', date:'Date of study', dob:'DOB', yrs:'y', age:'Age', mrn:'MRN', ref:'Referring physician', exam:'Examiner',
    s1:'Clinical information', s2:'Technique', s3:'Nerve conduction studies', s4:'Needle EMG', s5:'Interpretation', s6:'Conclusion', s7:'Recommendations',
    disc:'Report prepared with the assistance of Latence (Gemini AI), reviewed and validated by the signing physician. Reference values: laboratory / Preston & Shapiro (adult).'}
  : {title:'Rapport d\'électrodiagnostic (EMG / conductions nerveuses)', patient:'Patient', date:'Date de l\'examen', dob:'DDN', yrs:'ans', age:'Âge', mrn:'No dossier', ref:'Référent', exam:'Examinateur',
    s1:'Renseignements cliniques', s2:'Technique', s3:'Conductions nerveuses', s4:'EMG à l\'aiguille', s5:'Interprétation', s6:'Conclusion', s7:'Recommandations',
    disc:'Rapport préparé avec l\'assistance de Latence (IA Gemini), révisé et validé par le médecin signataire. Normes de référence : laboratoire / Preston & Shapiro (adulte).'};
}

const NORM_EN = {
  median_m_apb:'Median → APB', ulnar_m_adm:'Ulnar → ADM', ulnar_m_fdi:'Ulnar → FDI', radial_m_eip:'Radial → EIP', peroneal_m_edb:'Peroneal → EDB', peroneal_m_ta:'Peroneal → tibialis anterior', tibial_m_ahb:'Tibial → AHB',
  median_s_d2:'Median → D2', ulnar_s_d5:'Ulnar → D5', radial_s:'Superficial radial → snuffbox', dorsal_ulnar_cut:'Dorsal ulnar cutaneous', lat_antebrachial:'Lateral antebrachial cutaneous', med_antebrachial:'Medial antebrachial cutaneous',
  sural:'Sural', superficial_peroneal:'Superficial peroneal', saphenous:'Saphenous', median_palm:'Median palmar mixed (8 cm)', ulnar_palm:'Ulnar palmar mixed (8 cm)',
  median_ring:'Median → D4 (14 cm)', ulnar_ring:'Ulnar → D4 (14 cm)', median_thumb:'Median → thumb (10 cm)', radial_thumb:'Radial → thumb (10 cm)', median_lumbrical:'Median → 2nd lumbrical (8 cm)', ulnar_interosseous:'Ulnar → interosseous (8 cm)',
  h_soleus:'H reflex (soleus)', blink_r1:'Blink R1', blink_r2i:'Blink R2 ipsilateral', blink_r2c:'Blink R2 contralateral'
};
const SHORT_EN = {median_m_apb:'Median (APB)', ulnar_m_adm:'Ulnar (ADM)', ulnar_m_fdi:'Ulnar (FDI)', radial_m_eip:'Radial (EIP)', peroneal_m_edb:'Peroneal (EDB)', peroneal_m_ta:'Peroneal (TA)', tibial_m_ahb:'Tibial (AHB)',
  median_s_d2:'Median sens. D2', ulnar_s_d5:'Ulnar sens. D5', radial_s:'Radial sens.', dorsal_ulnar_cut:'Dorsal ulnar cut.', lat_antebrachial:'LABC', med_antebrachial:'MABC', sural:'Sural', superficial_peroneal:'Superf. peroneal', saphenous:'Saphenous',
  median_palm:'Median palmar', ulnar_palm:'Ulnar palmar', median_ring:'Median D4', ulnar_ring:'Ulnar D4', median_thumb:'Median thumb', radial_thumb:'Radial thumb', median_lumbrical:'Median lumbrical', ulnar_interosseous:'Ulnar interosseous',
  h_soleus:'H reflex', blink_r1:'Blink R1', blink_r2i:'Blink R2 ipsi', blink_r2c:'Blink R2 contra'};
const COMP_EN = {palm:'Palmar median − ulnar', ring:'Ring (D4) median − ulnar', thumb:'Thumb median − radial', lumb:'Lumbrical − interosseous'};
const SEG_EN = {distal:'distal', 'avant-bras':'forearm', 'trans-coude':'above elbow', bras:'arm', aisselle:'axilla', erb:'Erb', jambe:'below fibular head', 'trans-tete-fibulaire':'above fibular head', 'creux-poplite':'popliteal fossa'};
const GRP_EN = {Moteur:'Motor', Sensitif:'Sensory', Mixte:'Mixed', Comparatif:'Comparison', 'Réflexe':'Reflex'};
function normLabel(n) { return EN() ? (NORM_EN[n.key] || n.label) : n.label; }
function muscleName(name) { if (!EN()) return name; const m = typeof findMuscle === 'function' ? findMuscle(name) : null; return m ? m.en : name; }

/* ---------- Traduction de l'interface ---------- */
const UI_EN = {};          // rempli par i18n-dict.js
const UI_PATTERNS = [];    // [regex, fonction]
function trStr(s) {
  const k = String(s).replace(/\s+/g, ' ').trim(); if (!k) return null;
  let t = UI_EN[k];
  if (t == null) for (const [re, fn] of UI_PATTERNS) { const m = k.match(re); if (m) { t = fn(m); break; } }
  if (t == null) return null;
  return String(s).replace(/\S[\s\S]*\S|\S/, t);
}
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE']);
function skipNode(el, attrs) { for (let e = el; e && e !== document.body; e = e.parentElement) { if ((!attrs && SKIP.has(e.tagName)) || (e.hasAttribute && e.hasAttribute('data-noi18n')) || (e.classList && e.classList.contains('rep'))) return true; } return false; }
function trTextNode(n) { if (!n.parentElement || skipNode(n.parentElement)) return; const t = trStr(n.nodeValue); if (t != null && t !== n.nodeValue) n.nodeValue = t; }
function trAttrs(el) {
  for (const a of ['placeholder', 'aria-label', 'title']) { const v = el.getAttribute && el.getAttribute(a); if (v) { const t = trStr(v); if (t != null && t !== v) el.setAttribute(a, t); } }
}
function i18nApply(root) {
  if (LANG !== 'en' || !root) return;
  if (root.nodeType === 3) { trTextNode(root); return; }
  if (root.nodeType !== 1) return;
  if (!skipNode(root, true)) trAttrs(root);
  root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => { if (!skipNode(el, true)) trAttrs(el); });
  if (skipNode(root)) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; const list = [];
  while ((n = w.nextNode())) list.push(n);
  list.forEach(trTextNode);
}
let I18N_MO = null;
function i18nStart() {
  if (LANG !== 'en' || I18N_MO) return;
  document.title = 'Latence, EMG reading';
  i18nApply(document.body);
  I18N_MO = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'characterData') trTextNode(m.target);
      else m.addedNodes.forEach(n => i18nApply(n));
    }
  });
  I18N_MO.observe(document.body, {childList:true, subtree:true, characterData:true});
}
