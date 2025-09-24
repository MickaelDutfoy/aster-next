// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/intro", "/login", "/api/auth"]; // ajoute d'autres routes publiques si besoin
const SECRET = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Laisse passer assets & static
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 1) Garde "intro": si pas vu, force /intro (mais laisse /intro passer)
  const hasIntro = req.cookies.get("intro_seen")?.value === "1";
  if (!hasIntro && !pathname.startsWith("/intro")) {
    const url = req.nextUrl.clone();
    url.pathname = "/intro";
    return NextResponse.redirect(url);
  }
  if (hasIntro && pathname === "/intro") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 2) Garde d'auth: protège tout sauf les PUBLIC_PATHS
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));
  const token = await getToken({ req, secret: SECRET }); // nécessite NEXTAUTH_SECRET
  if (!isPublic && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname); // pratique pour post-login redirect
    return NextResponse.redirect(url);
  }
  // Optionnel: si connecté, évite /login
  if (token && pathname === "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
