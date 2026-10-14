const CACHE='latence-v2';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./js/data.js','./js/core.js','./js/cloud.js','./js/drive-script.js','./js/docx.js','./js/app.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||/googleapis\.com$|script\.google/.test(u.hostname)&&!/fonts/.test(u.hostname))return;
  // Réseau d'abord pour l'app (mises à jour), cache en secours hors ligne
  e.respondWith(fetch(e.request).then(res=>{
    if(res.ok&&(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)||/^www\.gstatic\.com$/.test(u.hostname)&&/firebasejs/.test(u.pathname))){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return res;
  }).catch(()=>caches.match(e.request).then(h=>h||caches.match('./index.html'))));
});
