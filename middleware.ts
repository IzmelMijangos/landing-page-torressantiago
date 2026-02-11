/**
 * Middleware for Route Protection
 * Protects admin and dashboard routes based on user roles
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin route - only for admin and superadmin roles
    if (path.startsWith('/admin')) {
      if (token?.role !== 'admin' && token?.role !== 'superadmin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Dashboard route - accessible by palenque, admin, and superadmin
    if (path.startsWith('/dashboard')) {
      if (!token?.role) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Specify which routes should be protected
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
