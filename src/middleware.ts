import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Si es el subdomain de leads
  if (hostname.includes('leads.torressantiago.com')) {
    const { pathname, search } = request.nextUrl;

    // Si está en la raíz, redirigir a login
    if (pathname === '/') {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Alias: /form → /lead-capture
    if (pathname === '/form') {
      const formUrl = new URL('/lead-capture', request.url);
      formUrl.search = search; // Mantener query params
      return NextResponse.rewrite(formUrl);
    }
  }

  // Para todo lo demás, continuar normal
  return NextResponse.next();
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
