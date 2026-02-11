'use client';

/**
 * Session Provider Wrapper
 * Wraps the app with NextAuth SessionProvider
 */

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
