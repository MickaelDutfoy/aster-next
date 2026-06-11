(function () {
  const currentScript = document.currentScript;

  if (!currentScript) return;

  const slug = currentScript.dataset.slug;
  const locale = currentScript.dataset.locale || 'fr';
  const theme = currentScript.dataset.theme || 'system';

  if (!slug) return;

  const iframe = document.createElement('iframe');

  iframe.src = `https://aster-app.eu/${locale}/embed/${slug}?theme=${theme}`;
  iframe.width = '100%';
  iframe.style.width = '100%';
  iframe.style.border = '0';
  iframe.style.display = 'block';
  iframe.style.overflow = 'hidden';
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('title', 'Aster adoption listings');

  currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);

  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://aster-app.eu') return;
    if (!event.data || event.data.type !== 'ASTER_EMBED_HEIGHT') return;
    if (event.data.slug !== slug) return;

    iframe.style.height = `${event.data.height}px`;
  });
})();
