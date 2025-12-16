'use client';

import Link from "next/link";
import React from "react";

export default function HeaderRedesign() {
  const handleScroll = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "529516482395";
    const message = "Hola, me interesa conocer más sobre sus servicios";
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 lg:px-6 h-16 flex items-center shadow-lg">
      <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
        <img src="/images/logo-.png" alt="Torres Santiago Logo" className="h-8 w-8" />
        <span className="text-white font-bold text-lg">Torres Santiago</span>
      </Link>

      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Link
          href="#servicios"
          className="text-sm font-medium hover:text-amber-400 transition-colors text-slate-300"
          onClick={(e) => handleScroll(e, "servicios")}
        >
          Servicios
        </Link>

        <Link
          href="#proyectos"
          className="text-sm font-medium hover:text-amber-400 transition-colors text-slate-300 hidden sm:block"
          onClick={(e) => handleScroll(e, "proyectos")}
        >
          Proyectos
        </Link>

        <button
          onClick={handleWhatsAppClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Contacto
        </button>
      </nav>
    </header>
  );
}
