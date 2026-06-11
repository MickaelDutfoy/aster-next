(function () {
  const ASTER_ORIGIN = 'https://aster-app.eu';
  const EXPAND_TRANSITION = 'height 120ms ease-out';

  const currentScript = document.currentScript;

  if (!currentScript) return;

  const slug = currentScript.dataset.slug;
  const locale = currentScript.dataset.locale || 'en';
  const theme = currentScript.dataset.theme || 'system';

  if (!slug) return;

  const iframe = document.createElement('iframe');

  iframe.src = `${ASTER_ORIGIN}/${locale}/embed/${slug}?theme=${theme}`;
  iframe.width = '100%';

  iframe.style.width = '100%';
  iframe.style.border = '1px solid black';
  iframe.style.borderRadius = '20px';
  iframe.style.display = 'block';
  iframe.style.overflow = 'hidden';
  iframe.style.transition = EXPAND_TRANSITION;

  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('loading', 'lazy');

  currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);

  const setIframeHeight = (nextHeight) => {
    const currentHeight = iframe.getBoundingClientRect().height;
    const isShrinking = nextHeight < currentHeight;

    iframe.style.transition = isShrinking ? 'none' : EXPAND_TRANSITION;
    iframe.style.height = `${nextHeight}px`;

    if (isShrinking) {
      requestAnimationFrame(() => {
        iframe.style.transition = EXPAND_TRANSITION;
      });
    }
  };

  window.addEventListener('message', (event) => {
    if (event.origin !== ASTER_ORIGIN) return;
    if (!event.data || event.data.type !== 'ASTER_EMBED_HEIGHT') return;
    if (event.data.slug !== slug) return;
    if (typeof event.data.height !== 'number') return;

    setIframeHeight(event.data.height);
  });
})();