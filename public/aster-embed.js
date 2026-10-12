(function () {
  const ASTER_ORIGIN = 'https://aster-app.eu';
  const EXPAND_TRANSITION = 'height 120ms ease-out';
  const CONTAINER_RESIZE_MESSAGE = 'ASTER_EMBED_CONTAINER_RESIZE';

  const currentScript = document.currentScript;

  if (!currentScript) return;

  const slug = currentScript.dataset.slug;
  const locale = currentScript.dataset.locale || 'en';
  const theme = currentScript.dataset.theme || 'system';
  const isSeamless = currentScript.dataset.appearance === 'seamless';

  if (!slug) return;

  const iframe = document.createElement('iframe');

  iframe.src = `${ASTER_ORIGIN}/${locale}/embed/${slug}?theme=${theme}${
    isSeamless ? '&appearance=seamless' : ''
  }`;
  iframe.width = '100%';

  iframe.style.width = '100%';
  iframe.style.border = isSeamless ? '0' : '1px solid black';
  iframe.style.borderRadius = isSeamless ? '0' : '20px';

  if (isSeamless) {
    iframe.style.background = 'transparent';
  }

  iframe.style.display = 'block';
  iframe.style.overflow = 'hidden';
  iframe.style.transition = EXPAND_TRANSITION;

  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('loading', 'lazy');

  currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);

  const getPixelValue = (value) => {
    const parsedValue = Number.parseFloat(value);

    return Number.isFinite(parsedValue) ? parsedValue : 0;
  };

  const reportContainerHeight = (iframeHeight) => {
    // Standard integration:
    // aster-embed.js already lives in the actual website.
    // Nothing else needs to be resized.
    if (window.parent === window) return;

    const iframeTop = iframe.getBoundingClientRect().top + window.scrollY;

    const bodyStyle = document.body ? window.getComputedStyle(document.body) : null;

    const htmlStyle = window.getComputedStyle(document.documentElement);

    // Accounts for the small amount of spacing that the platform
    // containing Aster may add around our iframe.
    const bottomSpacing =
      (bodyStyle
        ? getPixelValue(bodyStyle.marginBottom) +
          getPixelValue(bodyStyle.paddingBottom) +
          getPixelValue(bodyStyle.borderBottomWidth)
        : 0) +
      getPixelValue(htmlStyle.paddingBottom) +
      getPixelValue(htmlStyle.borderBottomWidth);

    const containerHeight = Math.ceil(iframeTop + iframeHeight + bottomSpacing);

    window.parent.postMessage(
      {
        source: 'aster-embed',
        type: CONTAINER_RESIZE_MESSAGE,
        slug,
        height: containerHeight,
      },
      '*',
    );
  };

  const setIframeHeight = (nextHeight) => {
    const currentHeight = iframe.getBoundingClientRect().height;
    const isShrinking = nextHeight < currentHeight;

    iframe.style.transition = isShrinking ? 'none' : EXPAND_TRANSITION;
    iframe.style.height = `${nextHeight}px`;

    reportContainerHeight(nextHeight);

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