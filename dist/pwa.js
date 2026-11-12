(() => {
  const status = document.getElementById('offline-status');
  const installButton = document.getElementById('installbtn');
  const dialog = document.getElementById('install-dialog');
  const installNow = document.getElementById('install-now');
  const feedback = document.getElementById('install-feedback');
  const updateBanner = document.getElementById('pwa-update');
  let promptEvent = null;
  let registration = null;
  let offlineReady = false;
  let applyingUpdate = false;
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  function setStatus() {
    status.dataset.ready = String(offlineReady);
    status.textContent = !navigator.onLine
      ? (offlineReady ? '● Sin conexión · podés estudiar' : 'Sin conexión · falta descargar la app')
      : (offlineReady ? '✓ Lista para usar sin conexión' : 'Preparando acceso sin conexión…');
    if (standalone()) installButton.textContent = '✓ App instalada';
  }
  function checkOffline() {
    const worker = navigator.serviceWorker?.controller || registration?.active;
    if (!worker) return;
    const channel = new MessageChannel();
    const timer = setTimeout(() => channel.port1.close(), 6000);
    channel.port1.onmessage = event => {
      clearTimeout(timer);
      offlineReady = event.data?.ready === true;
      channel.port1.close();
      setStatus();
    };
    worker.postMessage({type: 'CHECK_OFFLINE'}, [channel.port2]);
  }
  installButton.addEventListener('click', () => {
    installNow.hidden = !promptEvent;
    feedback.textContent = standalone()
      ? 'La app ya está abierta en su propia ventana.'
      : promptEvent ? 'Tu navegador ya permite instalar la app.'
      : 'Si no ves la opción todavía, recargá después de que termine la preparación sin conexión. El navegador también puede ofrecerla desde su menú.';
    dialog.showModal();
  });
  document.getElementById('install-close').addEventListener('click', () => dialog.close());
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    promptEvent = event;
    installNow.hidden = false;
    feedback.textContent = 'Tu navegador ya permite instalar la app.';
  });
  installNow.addEventListener('click', async () => {
    if (!promptEvent) return;
    const event = promptEvent;
    promptEvent = null;
    installNow.hidden = true;
    try {
      await event.prompt();
      const choice = await event.userChoice;
      feedback.textContent = choice.outcome === 'accepted'
        ? 'Instalación aceptada. Podés buscar AWS en práctica entre tus aplicaciones.'
        : 'Podés volver a instalarla desde el menú de Chrome cuando quieras.';
    } catch {
      feedback.textContent = 'Usá la opción de instalación en la barra de direcciones o en el menú de Chrome.';
    }
  });
  window.addEventListener('appinstalled', () => {
    promptEvent = null;
    installNow.hidden = true;
    installButton.textContent = '✓ App instalada';
    feedback.textContent = '¡App instalada! Abrila desde su ícono cuando quieras estudiar.';
  });
  ['online', 'offline'].forEach(name => window.addEventListener(name, () => {setStatus();checkOffline()}));
  setStatus();
  if (!('serviceWorker' in navigator) || !window.isSecureContext || location.protocol === 'file:') {
    status.textContent = 'Para instalar, abrí el enlace online en Chrome';
    return;
  }
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (applyingUpdate) location.reload();
    else checkOffline();
  });
  document.getElementById('pwa-refresh').addEventListener('click', () => {
    if (registration?.waiting) {
      applyingUpdate = true;
      registration.waiting.postMessage({type: 'ACTIVATE_UPDATE'});
    }
  });
  window.addEventListener('load', async () => {
    try {
      registration = await navigator.serviceWorker.register('/sw.js', {scope: '/', updateViaCache: 'none'});
      function showUpdate() {
        if (registration.waiting && navigator.serviceWorker.controller) updateBanner.hidden = false;
      }
      showUpdate();
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed') {showUpdate();checkOffline()}
          if (worker.state === 'redundant' && !offlineReady) status.textContent = 'No se pudo preparar el modo sin conexión. Recargá con internet.';
        });
      });
      await navigator.serviceWorker.ready;
      checkOffline();
    } catch {
      status.textContent = 'Modo sin conexión no disponible. Probá recargar en Chrome.';
      status.dataset.ready = 'false';
    }
  });
})();
