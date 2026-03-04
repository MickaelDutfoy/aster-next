function detectEnv() {
  if (typeof navigator === 'undefined') {
    return { isAndroid: false, isFirefox: false, isFirefoxIOS: false, isIOS: false };
  }

  const ua = navigator.userAgent || '';
  const isAndroid = /Android/.test(ua);
  const isFirefox = /Firefox\//.test(ua) || /FxiOS\//.test(ua);
  const isFirefoxIOS = /FxiOS\//.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua);

  return { isAndroid, isFirefox, isFirefoxIOS, isIOS };
}

function buildChromeIntentUrl(targetHttpsUrl: string) {
  const withoutScheme = targetHttpsUrl.replace(/^https?:\/\//, '');
  return `intent://${withoutScheme}#Intent;scheme=https;package=com.android.chrome;end`;
}

export function openInstallPage(opts: {
  locale: string;
  origin: string;
  push: (href: string) => void;
}) {
  const { locale, origin, push } = opts;
  const { isAndroid, isFirefox } = detectEnv();

  const installPath = `/${locale}/install`;

  if (isAndroid && isFirefox) {
    const target = new URL(installPath, origin).toString();
    window.location.href = buildChromeIntentUrl(target);
    return;
  }

  push(`/install`);
}
