import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/intro', '/login', '/api/auth']; // + autres si besoin
const SECRET = process.env.AUTH_SECRET;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Laisse passer assets & static
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 1) Intro guard
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

  // 2) Auth guard
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const token = await getToken({ req, secret: SECRET }); // nécessite AUTH_SECRET en env
  if (!isPublic && !token && !pathname.startsWith('/register')) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Optionnel: éviter /login si déjà connecté
  if (token && pathname === '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Scope du middleware (exclut tout /api, donc /api/auth est déjà hors scope)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
