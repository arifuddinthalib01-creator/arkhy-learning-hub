// Service worker Arkhy Learning Hub (v2.5)
// Strategi: jaringan dulu (selalu ambil versi terbaru), cadangan dari cache jika offline.
// Hanya file dari situs ini yang disimpan; permintaan ke Supabase dan CDN tidak disentuh.
const CACHE='arkhy-v2.5';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return;
  e.respondWith(
    fetch(r.url,{cache:'no-cache'}).then(res=>{
      if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r.url,cp))}
      return res;
    }).catch(()=>caches.match(r.url).then(m=>m||caches.match('./')||caches.match('index.html')))
  );
});
