// proxy.ts
import { auth } from '@/auth';
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

async function handler(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // static / assets
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

  // intro guard
  const hasIntro = req.cookies.get('intro_seen')?.value === '1';

  if (!hasIntro && !pathname.startsWith('/intro')) {
    const url = req.nextUrl.clone();
    url.pathname = '/intro';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (hasIntro && pathname.startsWith('/intro')) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // auth guard
  const isPublic = startsWithOneOf(pathname, PUBLIC_PATH_PREFIXES);
  // @ts-expect-error: injecté par le wrapper
  const isAuthed = Boolean(req.auth);

  if (!isPublic && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthed && startsWithOneOf(pathname, AUTH_PAGES_PREFIXES)) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
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
