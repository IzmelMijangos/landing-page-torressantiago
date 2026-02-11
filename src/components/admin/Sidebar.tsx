'use client';

/**
 * Admin Sidebar Component
 * Responsive navigation sidebar for admin panel
 * - Desktop: Always visible
 * - Mobile/Tablet: Hamburger menu with slide-in overlay
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  HomeIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  XMarkIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Palenques', href: '/admin/palenques', icon: BuildingStorefrontIcon },
  { name: 'Códigos QR', href: '/admin/qr-codes', icon: QrCodeIcon },
  { name: 'Reportes', href: '/admin/reportes', icon: ChartBarIcon },
  { name: 'Configuración', href: '/admin/configuracion', icon: Cog6ToothIcon },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex h-full w-64 flex-col bg-gray-900
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button (mobile only) */}
        <div className="flex lg:hidden justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-800 px-6 lg:mt-0 -mt-16">
          <h1 className="text-xl font-bold text-white">Torres Santiago</h1>
        </div>

        {/* User Info */}
        <div className="border-b border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {session?.user?.email}
              </p>
              <p className="text-xs text-amber-500 font-medium uppercase">
                {(session?.user as any)?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-6 w-6 flex-shrink-0
                    ${isActive ? 'text-amber-500' : 'text-gray-400 group-hover:text-gray-300'}
                  `}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-800 p-4">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-300" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
}
