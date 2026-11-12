/* Only the educational app shell is stored. Sign-in routes and third-party
   requests always pass through to the network. Progress remains in localStorage. */
const CACHE = 'aws-flopy-shell-v10';
const FILES = ['/', '/index.html', '/style.css', '/appearance.css', '/appearance.js', '/data.js', '/app.js', '/pwa.js',
  '/manifest.webmanifest', '/workshops.js', '/depth.js', '/icons/icon-180.png', '/icons/icon-192.png', '/icons/icon-512.png'];
const SHELL_MARKER = '<meta name="aws-app-shell" content="v10">';
async function validShell(response) {
  return response && response.ok && !response.redirected &&
    (response.headers.get('content-type') || '').includes('text/html') &&
    (await response.clone().text()).includes(SHELL_MARKER);
}
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Fetch and validate everything before writing. Never cache a sign-in page.
    const entries = await Promise.all(FILES.map(async path => {
      const response = await fetch(new Request(new URL(path, self.location.origin), {
        credentials: 'same-origin', cache: 'reload', redirect: 'error'
      }));
      if (!response.ok || response.redirected) throw new Error('App asset unavailable: ' + path);
      if ((path === '/' || path === '/index.html') && !await validShell(response)) {
        throw new Error('Expected the authenticated app, not a sign-in page');
      }
      return [path, response];
    }));
    await Promise.all(entries.map(([path, response]) => cache.put(path, response)));
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('aws-flopy-shell-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_UPDATE') self.skipWaiting();
  if (event.data?.type === 'CHECK_OFFLINE' && event.ports?.[0]) {
    event.waitUntil((async () => {
      const cache = await caches.open(CACHE);
      const present = await Promise.all(FILES.map(path => cache.match(path)));
      event.ports[0].postMessage({ready: present.every(Boolean)});
    })());
  }
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  const isHome = url.pathname === '/' || url.pathname === '/index.html';
  // Authentication, callback, and all other routes must not be intercepted.
  if (request.mode === 'navigate' && isHome) {
    event.respondWith((async () => {
      try {
        // Online navigation respects the hosting service's authentication.
        // Only a network failure falls back to the locally stored study app.
        return await fetch(request);
      } catch (error) {
        const cache = await caches.open(CACHE);
        const response = await cache.match('/');
        if (response) return response;
        return new Response('Abrí AWS en práctica con conexión para preparar la descarga.', {
          status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}
        });
      }
    })());
    return;
  }
  if (!isHome && FILES.includes(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      return await cache.match(url.pathname) || fetch(request);
    })());
  }
});
