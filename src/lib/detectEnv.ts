export function detectEnv() {
  const ua = navigator.userAgent || '';

  const isAndroid = /Android/.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isDesktop = !isAndroid && !isIOS;

  const isFirefoxIOS = /FxiOS\//.test(ua);
  const isChromeIOS = /CriOS\//.test(ua);
  const isEdgeIOS = /EdgiOS\//.test(ua);
  const isOperaIOS = /OPiOS\//.test(ua);

  const isFirefox = /Firefox\//.test(ua) || isFirefoxIOS;

  const isSafariIOS =
    isIOS && /Safari\//.test(ua) && !isFirefoxIOS && !isChromeIOS && !isEdgeIOS && !isOperaIOS;

  return { isAndroid, isIOS, isDesktop, isFirefox, isSafariIOS };
}
