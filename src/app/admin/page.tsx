/**
 * Admin Root Page
 * Redirects based on user role
 */

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const user = session.user as any;

  // Palenques should go to /dashboard, not /admin
  if (user.role === 'palenque') {
    redirect('/dashboard');
  }

  // Admins go to admin dashboard
  redirect('/admin/dashboard');
}
