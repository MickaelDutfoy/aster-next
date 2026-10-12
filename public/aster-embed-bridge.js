(function () {
  const CONTAINER_RESIZE_MESSAGE = 'ASTER_EMBED_CONTAINER_RESIZE';

  const setHeight = (element, height) => {
    if (!element) return;

    element.style.setProperty('height', `${height}px`, 'important');
  };

  const resizeHostingerEmbed = (iframe, height) => {
    if (iframe.getAttribute('data-qa') !== 'builder-gridembed-iframe') {
      return false;
    }

    const gridEmbed = iframe.closest('.grid-embed');
    const layoutElement = gridEmbed?.closest('.layout-element');
    const blockLayout = layoutElement?.closest('.block-layout');
    const section = blockLayout?.closest('section[data-qa="block"]');

    // Prevent the few pixels of baseline spacing produced by an inline iframe.
    iframe.style.setProperty('display', 'block', 'important');

    setHeight(iframe, height);
    setHeight(gridEmbed, height);
    setHeight(layoutElement, height);

    if (blockLayout) {
      setHeight(blockLayout, height);

      blockLayout.style.setProperty('min-height', '0', 'important');

      blockLayout.style.setProperty(
        'grid-template-rows',
        `minmax(${height}px, auto) 1fr`,
        'important',
      );
    }

    if (section) {
      section.style.setProperty('height', 'auto', 'important');
      section.style.setProperty('min-height', '0', 'important');
    }

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

    if (!resizeHostingerEmbed(sourceIframe, height)) {
      setHeight(sourceIframe, height);
    }

    sourceIframe.style.setProperty('overflow', 'hidden', 'important');
    sourceIframe.setAttribute('height', String(height));
    sourceIframe.setAttribute('scrolling', 'no');
  });
})();