/**
 * Latence — synchronisation Google Drive
 *
 * Classe chaque rapport dans :  <Dossier racine> / AAAA-MM-JJ / NOM Prénom – dossier /
 *   - Rapport en Word (.docx) et/ou PDF (+ version texte pour le DME)
 *   - Photos des tableaux (si activé dans l'application)
 * et garde une copie des cas dans <Dossier racine> / _donnees-app (pour récupérer l'historique).
 *
 * Installation : Déployer › Nouveau déploiement › type « Application Web »
 *   Exécuter en tant que : Moi    ·    Qui a accès : Tout le monde
 * Puis copier l'URL (…/exec) dans Latence › Réglages › Google Drive.
 */
const SECRET = '__SECRET__';

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const req = JSON.parse(e.postData.contents);
    if (!SECRET || SECRET === 'CHANGE-MOI' || req.secret !== SECRET) return out({ok: false, error: 'Mot de passe de synchronisation invalide.'});
    const root = folder(DriveApp.getRootFolder(), req.rootName || 'Latence – Rapports EMG');
    if (req.action === 'ping') return out({ok: true, rootName: root.getName(), url: root.getUrl()});
    if (req.action === 'save') return out(save(root, req));
    if (req.action === 'pull') return out(pull(root));
    return out({ok: false, error: 'Action inconnue.'});
  } catch (err) {
    return out({ok: false, error: String((err && err.message) || err)});
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() {
  return out({ok: true, app: 'latence', info: 'Script actif. Utilise l\'application Latence pour envoyer les rapports.'});
}

function save(root, r) {
  if (!r.date || !r.patientFolder || !r.baseName || !(r.docx || r.html)) return {ok: false, error: 'Données incomplètes.'};
  const day = folder(root, r.date);
  const pt = folder(day, r.patientFolder);
  const base = r.baseName;
  trashPrefix(pt, base);                       // remplace la version précédente du même examen
  let file = null;
  if (r.docx) file = pt.createFile(Utilities.newBlob(Utilities.base64Decode(r.docx), MimeType.MICROSOFT_WORD, base + '.docx'));
  if (r.html) { const pdf = pt.createFile(Utilities.newBlob(r.html, MimeType.HTML, base + '.html').getAs(MimeType.PDF).setName(base + '.pdf')); file = file || pdf; }
  if (r.text) pt.createFile(base + '.txt', r.text, MimeType.PLAIN_TEXT);
  (r.images || []).forEach(function (im, i) {
    pt.createFile(Utilities.newBlob(Utilities.base64Decode(im.data), im.mime || 'image/jpeg', base + ' – photo ' + (i + 1) + '.jpg'));
  });
  if (r.caseJson && r.caseId) {
    const data = folder(root, '_donnees-app');
    trashPrefix(data, r.caseId + '.json');
    data.createFile(r.caseId + '.json', r.caseJson, MimeType.PLAIN_TEXT);
  }
  return {ok: true, url: pt.getUrl(), fileUrl: file.getUrl(), version: 2};
}

function pull(root) {
  const it = root.getFoldersByName('_donnees-app');
  if (!it.hasNext()) return {ok: true, cases: []};
  const files = it.next().getFiles();
  const cases = [];
  while (files.hasNext() && cases.length < 1000) {
    const f = files.next();
    if (/\.json$/.test(f.getName())) cases.push(f.getBlob().getDataAsString());
  }
  return {ok: true, cases: cases};
}

function folder(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function trashPrefix(f, prefix) {
  const it = f.getFiles();
  while (it.hasNext()) {
    const x = it.next();
    if (x.getName().indexOf(prefix) === 0) x.setTrashed(true);
  }
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
