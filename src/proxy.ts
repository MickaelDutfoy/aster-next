import { auth } from '@/auth';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

type AuthMiddleware = (
  handler: (req: NextRequest) => Promise<Response | NextResponse | void>,
  options?: {
    callbacks?: {
      authorized?: (params: { auth: any; request: NextRequest }) => boolean;
    };
  },
) => (req: NextRequest) => Promise<Response | NextResponse | void>;

const authMw = auth as unknown as AuthMiddleware;

const PUBLIC_PATH_PREFIXES = [
  '/intro',
  '/login',
  '/register',
  '/reset-password',
  '/new-password',
  '/privacy',
];

const AUTH_PAGES_PREFIXES = [
  // routes which cannot be reached while logged in
  '/login',
  '/register',
  '/reset-password',
  '/new-password',
];

const INTRO_BYPASS_PREFIXES = ['/privacy'];

function startsWithOneOf(pathname: string, prefixes: readonly string[]) {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

function extractLocale(pathname: string) {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  if (hasLocale(routing.locales, maybeLocale)) {
    const bare = '/' + segments.slice(2).join('/') || '/';
    return {
      locale: maybeLocale as (typeof routing.locales)[number],
      barePath: bare === '//' ? '/' : bare,
    };
  }

  return {
    locale: null as (typeof routing.locales)[number] | null,
    barePath: pathname || '/',
  };
}

function withLocalePath(locale: string | null, barePath: string) {
  const loc = locale ?? routing.defaultLocale;
  if (barePath === '/') return `/${loc}`;
  return `/${loc}${barePath}`;
}

async function handler(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/icons') ||
    pathname === '/favicon.ico' ||
    pathname === '/sw.js' ||
    pathname === '/manifest.webmanifest'
  ) {
    return NextResponse.next();
  }

  const { locale, barePath } = extractLocale(pathname);
  let effectiveLocale = locale;

  if (!locale) {
    const cookieLocale = req.cookies.get('aster_locale')?.value;

    if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
      effectiveLocale = cookieLocale as (typeof routing.locales)[number];
    } else {
      const header = req.headers.get('accept-language') ?? '';
      let browserLang = header.slice(0, 2);

      if (!routing.locales.includes(browserLang as any)) {
        browserLang = routing.defaultLocale;
      }

      effectiveLocale = browserLang as (typeof routing.locales)[number];
    }

    const url = req.nextUrl.clone();
    url.pathname = withLocalePath(effectiveLocale, barePath);
    return NextResponse.redirect(url);
  }

  const hasIntro = req.cookies.get('intro_seen')?.value === '1';

  if (
    !hasIntro &&
    !barePath.startsWith('/intro') &&
    !startsWithOneOf(barePath, INTRO_BYPASS_PREFIXES)
  ) {
    const url = req.nextUrl.clone();
    url.pathname = withLocalePath(effectiveLocale, '/intro');
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (hasIntro && barePath.startsWith('/intro')) {
    const url = req.nextUrl.clone();
    url.pathname = withLocalePath(effectiveLocale, '/');
    url.search = '';
    return NextResponse.redirect(url);
  }

  const isPublic = startsWithOneOf(barePath, PUBLIC_PATH_PREFIXES);
  // @ts-expect-error
  const isAuthed = Boolean(req.auth);

  if (!isPublic && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = withLocalePath(effectiveLocale, '/login');
    url.searchParams.set('from', barePath);
    return NextResponse.redirect(url);
  }

  if (isAuthed && startsWithOneOf(barePath, AUTH_PAGES_PREFIXES)) {
    const url = req.nextUrl.clone();
    url.pathname = withLocalePath(effectiveLocale, '/');
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const proxy = authMw(handler, {
  callbacks: { authorized: () => true },
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
