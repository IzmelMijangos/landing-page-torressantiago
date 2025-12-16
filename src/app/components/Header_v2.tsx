'use client';

import Link from "next/link";
import React from "react";

export default function Header_v2() {
  const handleScroll = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-gray-950 dark:bg-gray-900 px-4 lg:px-6 h-14 flex items-center shadow-lg">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <img src="/images/logo-.png" alt="Torres Santiago Soluciones Inteligentes Logo" className="h-6 w-6" />
        <span className="sr-only">Torres Santiago Soluciones Inteligentes</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          href="/#servicios"
          className="text-sm font-medium hover:underline underline-offset-4 text-gray-400 hover:text-gray-50"
        >
          Servicios
        </Link>
        
        <Link
          href="/#proyectos"
          className="text-sm font-medium hover:underline underline-offset-4 text-gray-400 hover:text-gray-50"
        >
          Proyectos
        </Link>
        <Link
          href="/#quienes-somos"
          className="text-sm font-medium hover:underline underline-offset-4 text-gray-400 hover:text-gray-50"
        >
          Quienes somos
        </Link>
        <Link
          href="/#faq"
          className="text-sm font-medium hover:underline underline-offset-4 text-gray-400 hover:text-gray-50"
        >
          FAQ
        </Link>
      </nav>
    </header>
  );
}
