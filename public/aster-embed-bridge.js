(function () {
  const CONTAINER_RESIZE_MESSAGE = 'ASTER_EMBED_CONTAINER_RESIZE';

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

    sourceIframe.style.setProperty('height', `${height}px`, 'important');

    sourceIframe.style.setProperty('overflow', 'hidden', 'important');

    sourceIframe.setAttribute('height', String(height));
    sourceIframe.setAttribute('scrolling', 'no');
  });
})();
