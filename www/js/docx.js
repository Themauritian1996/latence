'use strict';
/* =====================================================================
   Latence — génération du rapport Word (.docx), sans dépendance
   ===================================================================== */
const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(u8) { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function zipStore(files) {
  const enc = new TextEncoder(); const parts = []; const central = []; let offset = 0;
  const d = new Date(); const dosTime = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1); const dosDate = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  files.forEach(f => {
    const name = enc.encode(f.name); const data = typeof f.data === 'string' ? enc.encode(f.data) : f.data; const crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
    h.setUint16(10, dosTime, true); h.setUint16(12, dosDate, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true);
    h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
    parts.push(new Uint8Array(h.buffer), name, data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
    c.setUint16(12, dosTime, true); c.setUint16(14, dosDate, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true);
    c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
    central.push(new Uint8Array(c.buffer), name);
    offset += 30 + name.length + data.length;
  });
  const cSize = central.reduce((a, b) => a + b.length, 0);
  const e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, cSize, true); e.setUint32(16, offset, true);
  const all = [...parts, ...central, new Uint8Array(e.buffer)]; const out = new Uint8Array(all.reduce((a, b) => a + b.length, 0)); let p = 0;
  all.forEach(a => { out.set(a, p); p += a.length; }); return out;
}

const X = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
function wRun(t, o) { o = o || {};
  const pr = (o.b ? '<w:b/>' : '') + (o.i ? '<w:i/>' : '') + (o.u ? '<w:u w:val="single"/>' : '') + (o.color ? `<w:color w:val="${o.color}"/>` : '') + (o.sz ? `<w:sz w:val="${o.sz}"/><w:szCs w:val="${o.sz}"/>` : '') + (o.caps ? '<w:caps/>' : '');
  return String(t == null ? '' : t).split('\n').map((line, i) => (i ? '<w:r><w:br/></w:r>' : '') + `<w:r>${pr ? `<w:rPr>${pr}</w:rPr>` : ''}<w:t xml:space="preserve">${X(line)}</w:t></w:r>`).join('');
}
function wP(runs, o) { o = o || {};
  const pr = (o.style ? `<w:pStyle w:val="${o.style}"/>` : '') + (o.align ? `<w:jc w:val="${o.align}"/>` : '') + (o.after != null || o.before != null ? `<w:spacing w:before="${o.before || 0}" w:after="${o.after == null ? 120 : o.after}"/>` : '') + (o.border ? '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="BBBBBB"/></w:pBdr>' : '');
  return `<w:p>${pr ? `<w:pPr>${pr}</w:pPr>` : ''}${runs}</w:p>`;
}
const wText = (t, o) => String(t || '').split(/\n{2,}/).map(x => x.trim()).filter(Boolean).map(x => wP(wRun(x, o))).join('');
function wTable(head, rows, widths, opt) { opt = opt || {};
  const total = widths.reduce((a, b) => a + b, 0);
  const cell = (c, w, isHead, shade) => {
    const o = typeof c === 'object' && c !== null ? c : {t:c};
    const align = o.align || (isHead || o.left ? 'left' : 'right');
    return `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${shade ? `<w:shd w:val="clear" w:color="auto" w:fill="${shade}"/>` : ''}${o.span ? `<w:gridSpan w:val="${o.span}"/>` : ''}</w:tcPr>` +
      wP(wRun(o.t, {b:isHead || o.b, color:o.color || (isHead ? '444444' : null), sz:opt.sz || 17, u:o.u}) + (o.sub ? wRun('\n' + o.sub, {sz:13, color:'777777'}) : ''), {align, after:0}) + '</w:tc>';
  };
  const tr = (cells, isHead, shade) => {
    let wi = 0;
    return `<w:tr>${isHead ? '<w:trPr><w:tblHeader/></w:trPr>' : ''}${cells.map(c => { const span = (c && c.span) || 1; const w = widths.slice(wi, wi + span).reduce((a, b) => a + b, 0); wi += span; return cell(c, w, isHead, shade || (c && c.shade)); }).join('')}</w:tr>`;
  };
  return `<w:tbl><w:tblPr><w:tblW w:w="${total}" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="CCCCCC"/><w:bottom w:val="single" w:sz="4" w:color="CCCCCC"/><w:insideH w:val="single" w:sz="4" w:color="E2E2E2"/></w:tblBorders><w:tblCellMar><w:top w:w="30" w:type="dxa"/><w:left w:w="70" w:type="dxa"/><w:bottom w:w="30" w:type="dxa"/><w:right w:w="70" w:type="dxa"/></w:tblCellMar><w:tblLook w:val="04A0"/></w:tblPr>` +
    `<w:tblGrid>${widths.map(w => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>` +
    (head ? tr(head, true, 'F2F2F2') : '') + rows.map(r => r.__group ? tr([{t:r.__group, span:widths.length, left:true, b:true, shade:'F5F5F5'}]) : tr(r)).join('') + '</w:tbl>' + wP('', {after:60});
}

function reportDocx(c) {
  const ev = evaluate(c), p = c.patient, S = (c.report && c.report.sections) || {}, D = SET.doctor, age = ageAt(p.ddn, c.date);
  const pname = [p.nom ? p.nom.toUpperCase() : '', p.prenom].filter(Boolean).join(', ') || 'Patient';
  const RED = 'C62828';
  const col = st => (st === 'a' || st === 'd' || st === 'x') ? RED : null;
  const H = t => wP(wRun(t, {b:true, sz:20, caps:true, color:'333333'}), {before:240, after:80, border:true});
  let body = '';
  body += wP(wRun('Rapport d\'électrodiagnostic (EMG / conductions nerveuses)', {b:true, sz:30}), {after:100});
  body += wTable(null, [
    [{t:'Patient : ', b:true, left:true}, {t:pname, left:true}, {t:'Date de l\'examen : ', b:true, left:true}, {t:fmtDateLong(c.date), left:true}],
    [{t:'DDN : ', b:true, left:true}, {t:(p.ddn || '—') + (age != null ? ` (${age} ans)` : '') + (p.sexe ? ' · ' + p.sexe : ''), left:true}, {t:'No dossier : ', b:true, left:true}, {t:p.dossier || '—', left:true}],
    [{t:'Référent : ', b:true, left:true}, {t:c.clin.referent || '—', left:true}, {t:'Examinateur : ', b:true, left:true}, {t:D.nom || '—', left:true}]
  ], [1300, 3400, 1800, 3100], {sz:19});
  const sec = (t, inner) => { if (inner) body += H(t) + inner; };
  sec('Renseignements cliniques', wText(S.renseignements || c.clin.motif));
  sec('Technique', wText(S.technique));
  // Conductions
  const order = [['motor', 'Conductions motrices'], ['sensory', 'Conductions sensitives'], ['mixed', 'Études mixtes'], ['F', 'Ondes F'], ['H', 'Réflexe H'], ['blink', 'Réflexe de clignement'], ['other', 'Autres']];
  const nrows = [];
  order.forEach(([t, l]) => {
    const rs = (c.ncs.rows || []).map((r, i) => [r, i]).filter(([r]) => r.type === t); if (!rs.length) return;
    nrows.push({__group:l});
    rs.forEach(([r, i]) => {
      const o = ev.cells[i], n = normOf(r.normKey);
      const nm = n ? [n.lat != null ? 'lat ≤' + fmtN(n.lat) : '', n.amp != null ? 'amp ≥' + fmtN(n.amp) : '', n.cv != null ? 'VC ≥' + fmtN(n.cv, 0) : '', n.f != null ? 'F ≤' + fmtN(n.f, 0) : ''].filter(Boolean).join(' · ') : '';
      const first = {t:shortName(r) + (siteName(r) ? ' — ' + siteName(r) : ''), left:true, sub: nm ? 'N : ' + nm : ''};
      if (r.absent) nrows.push([first, {t:'Absente', color:RED, b:true}, '', '', '', '', '']);
      else nrows.push([first,
        {t:fmtL(rowLatency(r)), color:col(o.lat), b:!!col(o.lat), u:o.lat === 'd'},
        {t:r.amplitude == null ? '—' : fmtN(r.amplitude, 1), color:col(o.amp), b:!!col(o.amp)},
        {t:r.amplitude == null ? '' : (r.type === 'motor' ? 'mV' : 'µV'), left:true},
        {t:r.distance == null ? '—' : fmtN(r.distance, 1)},
        {t:r.vitesse == null ? '—' : fmtN(r.vitesse, 0), color:col(o.cv), b:!!col(o.cv), u:o.cv === 'd'},
        {t:r.f_lat == null ? '—' : fmtL(r.f_lat), color:col(o.f), b:!!col(o.f)}]);
    });
  });
  let ncs = '';
  if (nrows.length) ncs += wTable(['Nerf — site', 'Lat. (ms)', 'Amp.', '', 'Dist. (cm)', 'VC (m/s)', 'F (ms)'].map((t, i) => ({t, align: i === 0 || i === 3 ? 'left' : 'right'})), nrows, [3600, 1050, 900, 450, 1050, 1050, 1000]) +
    wP(wRun('En rouge : hors normes. Souligné : zone démyélinisante. Latence motrice = début ; sensitive = pic.', {sz:15, color:'666666'}), {after:100});
  sec('Conductions nerveuses', ncs + wText(S.ncs_resume));
  // EMG
  const em = (c.emg || []).filter(emgFilled);
  let emg = '';
  if (em.length) {
    const bad = (k, v) => (k === 'fib' || k === 'psw') ? (v && v !== '0') : k === 'fasc' ? v === '+' : k === 'ins' ? v === '↑' : (v && v !== 'N');
    emg = wTable(['Muscle', 'Ins.', 'Fibs', 'PSW', 'Fasc.', 'Amp.', 'Durée', 'Poly.', 'Recrut.', 'Autre'].map((t, i) => ({t, align: i === 0 || i === 9 ? 'left' : 'center'})),
      em.map(e => [{t:e.muscle + ' ' + e.cote, left:true, sub:[e.nerf, e.rac].filter(Boolean).join(' · ')},
        ...['ins', 'fib', 'psw', 'fasc', 'amp', 'dur', 'poly', 'rec'].map(k => ({t:e[k] || '—', align:'center', color: bad(k, e[k]) ? RED : null, b: bad(k, e[k])})),
        {t:[...(e.autre || []), e.note].filter(Boolean).join(' · '), left:true}]),
      [2700, 600, 650, 650, 650, 650, 700, 650, 900, 1450]);
  }
  sec('EMG à l\'aiguille', emg + wText(S.emg_resume));
  sec('Interprétation', wText(S.interpretation));
  sec('Conclusion', String(S.conclusion || '').split(/\n+/).map(x => x.trim()).filter(Boolean).map(x => wP(wRun(x, {b:/^\d+\./.test(x) && x.length < 140}))).join(''));
  sec('Recommandations', String(S.recommandations || '').split(/\n+/).map(x => x.trim()).filter(Boolean).map(x => wP(wRun(x))).join(''));
  const sig = [D.nom, D.titre, D.etab, D.coord].filter(Boolean).join('\n');
  if (sig) body += wP('', {after:200}) + wP(wRun(sig));
  body += wP(wRun('Rapport préparé avec l\'assistance de Latence (IA Gemini), révisé et validé par le médecin signataire. Normes de référence : laboratoire / Preston & Shapiro (adulte).', {sz:14, color:'888888'}), {before:200});

  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1000" w:right="1080" w:bottom="1000" w:left="1080" w:header="500" w:footer="500" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/><w:sz w:val="21"/><w:szCs w:val="21"/><w:lang w:val="fr-CA"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="100" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>`;
  const files = [
    {name:'[Content_Types].xml', data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>'},
    {name:'_rels/.rels', data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>'},
    {name:'docProps/core.xml', data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${X('Rapport EMG — ' + pname + ' — ' + c.date)}</dc:title><dc:creator>${X(D.nom || 'Latence')}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</dcterms:created></cp:coreProperties>`},
    {name:'word/_rels/document.xml.rels', data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'},
    {name:'word/document.xml', data:doc},
    {name:'word/styles.xml', data:styles}
  ];
  return zipStore(files);
}
function u8ToB64(u8) { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); }
const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
