/**
 * Extend NextAuth types with custom fields
 */

import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'superadmin' | 'admin' | 'palenque';
      palenqueId: number | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'superadmin' | 'admin' | 'palenque';
    palenqueId: number | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'superadmin' | 'admin' | 'palenque';
    palenqueId: number | null;
  }
}
