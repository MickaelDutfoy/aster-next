(function () {
  const CONTAINER_RESIZE_MESSAGE = 'ASTER_EMBED_CONTAINER_RESIZE';

  const resizeHostingerLayout = (iframe, height) => {
    if (!iframe.classList.contains('grid-embed__iframe')) {
      return false;
    }

    const gridEmbed = iframe.closest('.grid-embed');
    const layoutElement = gridEmbed?.closest('.layout-element');
    const blockLayout = layoutElement?.closest('.block-layout');

    if (!gridEmbed || !layoutElement || !blockLayout) {
      return false;
    }

    layoutElement.style.setProperty('height', `${height}px`, 'important');

    const rowStart = Number.parseInt(window.getComputedStyle(layoutElement).gridRowStart, 10);

    const gridTemplateRows =
      rowStart === 2 ? `auto minmax(${height}px, auto)` : `minmax(${height}px, auto) 1fr`;

    blockLayout.style.setProperty('grid-template-rows', gridTemplateRows, 'important');

    return true;
  };

  window.addEventListener('message', (event) => {
    const data = event.data;

    if (!data) return;
    if (data.source !== 'aster-embed') return;
    if (data.type !== CONTAINER_RESIZE_MESSAGE) return;
    if (!Number.isFinite(data.height) || data.height <= 0) return;

    const sourceIframe = Array.from(document.querySelectorAll('iframe')).find(
      (iframe) => iframe.contentWindow === event.source,
    );

    if (!sourceIframe) return;

    const height = Math.ceil(data.height);

    resizeHostingerLayout(sourceIframe, height);
  });
})();
