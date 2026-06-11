(function () {
  let baseHeight = null;
  let expandedHeight = null;

  const currentScript = document.currentScript;

  if (!currentScript) return;

  const slug = currentScript.dataset.slug;
  const locale = currentScript.dataset.locale || 'en';
  const theme = currentScript.dataset.theme || 'system';

  if (!slug) return;

  const iframe = document.createElement('iframe');

  iframe.src = `https://aster-app.eu/${locale}/embed/${slug}?theme=${theme}`;
  iframe.width = '100%';
  iframe.style.width = '100%';
  iframe.style.border = '1px solid black';
  iframe.style.borderRadius = '20px';
  iframe.style.display = 'block';
  iframe.style.overflow = 'hidden';
  iframe.style.transition = 'height 120ms ease-out';
  iframe.style.overflowAnchor = 'none';
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('loading', 'lazy');

  currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);

  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://aster-app.eu') return;
    if (!event.data || event.data.slug !== slug) return;

    if (event.data.type === 'ASTER_EMBED_HEIGHT') {
      baseHeight = event.data.height;
      iframe.style.height = `${baseHeight}px`;
    }

    if (event.data.type === 'ASTER_EMBED_MODAL_HEIGHT') {
      expandedHeight = event.data.height;
      iframe.style.height = `${expandedHeight}px`;
    }

    if (event.data.type === 'ASTER_EMBED_RESET_HEIGHT' && baseHeight !== null) {
      iframe.style.height = `${baseHeight}px`;
    }
  });
})();
