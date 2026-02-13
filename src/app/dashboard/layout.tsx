'use client';

/**
 * Dashboard Layout (for Palenques)
 * Clean layout without marketing components
 */

import DashboardNav from '@/components/dashboard/DashboardNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      {children}
    </div>
  );
}
