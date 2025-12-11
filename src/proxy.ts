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

// 👇 on caste l’overload vers la variante middleware
const authMw = auth as unknown as AuthMiddleware;

const PUBLIC_PATH_PREFIXES = [
  '/intro',
  '/login',
  '/register',
  '/reset-password',
  '/new-password',
] as const;

const AUTH_PAGES_PREFIXES = ['/login', '/register', '/reset-password', '/new-password'] as const;

function startsWithOneOf(pathname: string, prefixes: readonly string[]) {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

// --- helpers i18n / routing ---

function extractLocale(pathname: string) {
  // /en/login -> ['','en','login']
  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  if (hasLocale(routing.locales, maybeLocale)) {
    const bare = '/' + segments.slice(2).join('/') || '/'; // '/login' ou '/'
    return {
      locale: maybeLocale as (typeof routing.locales)[number],
      barePath: bare === '//' ? '/' : bare,
    };
  }

  // Pas de locale dans l'URL
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

  // static / assets -> on sort direct
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

  // On sépare locale + chemin nu
  const { locale, barePath } = extractLocale(pathname);
  const effectiveLocale = locale ?? routing.defaultLocale;

  // Si pas de locale dans l’URL, on normalise :
  // /login -> /en/login, /intro -> /en/intro, / -> /en
  if (!locale) {
    const url = req.nextUrl.clone();
    url.pathname = withLocalePath(effectiveLocale, barePath);
    return NextResponse.redirect(url);
  }

  // intro guard (sur le chemin nu)
  const hasIntro = req.cookies.get('intro_seen')?.value === '1';

  if (!hasIntro && !barePath.startsWith('/intro')) {
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

  // auth guard (toujours sur le chemin nu)
  const isPublic = startsWithOneOf(barePath, PUBLIC_PATH_PREFIXES);
  // @ts-expect-error: injecté par le wrapper
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
