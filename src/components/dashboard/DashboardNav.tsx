/**
 * Dashboard Navigation
 * Quick navigation for palenque dashboard
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  CubeIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';

export default function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Conversaciones',
      href: '/dashboard/conversaciones',
      icon: ChatBubbleLeftRightIcon,
      badge: '🆕',
    },
    {
      name: 'Productos',
      href: '/dashboard/productos',
      icon: CubeIcon,
      badge: '🆕',
    },
    {
      name: 'Chatbot',
      href: '/dashboard/chatbot-config',
      icon: CogIcon,
      badge: '🆕',
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 mb-6">
      <div className="flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TS</span>
          </div>
          <span className="font-semibold text-gray-900 hidden sm:inline">Torres Santiago</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition relative ${
                  isActive
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden md:inline">{item.name}</span>
                {item.badge && (
                  <span className="text-xs">{item.badge}</span>
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm font-medium transition"
            title="Cerrar Sesión"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="hidden lg:inline">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
