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

async function handler(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // static
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname === '/favicon.ico'
  )
    return NextResponse.next();

  // intro guard
  const hasIntro = req.cookies.get('intro_seen')?.value === '1';
  if (!hasIntro && !pathname.startsWith('/intro')) {
    const url = req.nextUrl.clone();
    url.pathname = '/intro';
    return NextResponse.redirect(url);
  }
  if (hasIntro && pathname === '/intro') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // auth guard
  const isPublic = pathname.startsWith('/intro') || pathname.startsWith('/login');
  // @ts-expect-error: injecté par le wrapper
  const isAuthed = Boolean(req.auth);

  if (!isPublic && !pathname.startsWith('/register') && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthed && pathname === '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 👇 on wrappe avec l’overload middleware typé
export const proxy = authMw(handler, {
  callbacks: { authorized: () => true },
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
