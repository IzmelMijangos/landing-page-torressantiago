'use client';

/**
 * Conditional Widgets
 * Only shows ChatbotWidget and StickyBar on public pages
 * Hides them on /admin and /dashboard routes
 */

import { usePathname } from 'next/navigation';
import ChatbotWidget from '@/app/components/ChatbotWidget';
import StickyBar from '@/app/components/lead-capture/StickyBar';

export default function ConditionalWidgets() {
  const pathname = usePathname();

  // Don't show widgets on admin, dashboard or lead-capture routes
  const hideWidgets =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/lead-capture');

  if (hideWidgets) {
    return null;
  }

  return (
    <>
      <ChatbotWidget />
      <StickyBar
        message="📬 Recibe tips de tecnología cada semana"
        ctaText="Suscríbete gratis"
        showAfterScroll={400}
        variant="top"
        closable={true}
      />
    </>
  );
}
