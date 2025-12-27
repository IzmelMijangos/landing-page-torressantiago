import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { serviciosData, Service } from "@/app/lib/services";
import ChatbotWidget from "@/app/components/ChatbotWidget";
import StickyBar from "@/app/components/lead-capture/StickyBar";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// metadata sin themeColor (Next.js ya no lo acepta aquí)
export const metadata: Metadata = {
  title: {
    default:
      "Desarrollo Web Empresarial, Chatbots y Ciberseguridad | Torres Santiago, Desarrollo Oaxaca, Desarrollo Tlacolula",
    template: "%s | Torres Santiago",
  },
  description:
    "Expertos en desarrollo web, chatbots, ciberseguridad y más. Llévate una cotización sin compromiso.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  openGraph: {
    title: "Torres Santiago Soluciones Inteligentes",
    description: "Soluciones tecnológicas adaptadas a tu negocio",
    url: "https://www.torressantiago.com/",
    siteName: "Torres Santiago",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "https://www.torressantiago.com/images/og-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "Torres Santiago Soluciones Inteligentes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Torres Santiago Soluciones Inteligentes",
    description:
      "Expertos en desarrollo web, chatbots, ciberseguridad y más. Llévate una cotización sin compromiso.",
    images: ["https://www.torressantiago.com/images/og-homepage.jpg"],
  },
  alternates: {
    canonical: "https://www.torressantiago.com/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PH6VM4QW');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Theme color para modo claro y oscuro */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NWG401PNM2" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}  
              gtag('js', new Date());
              gtag('config', 'G-NWG401PNM2');
            `,
          }}
        />

        {/* JSON‑LD Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Torres Santiago Soluciones Inteligentes",
              url: "https://www.torressantiago.com",
              logo: "https://www.torressantiago.com/logo.png",
              sameAs: [
                "https://www.linkedin.com/company/torres-santiago",
                "https://www.facebook.com/torres.santiago",
                "https://twitter.com/torressantiago",
              ],
            }),
          }}
        />

        {/* JSON‑LD Services */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              serviciosData.map((s: Service) => ({
                "@context": "https://schema.org",
                "@type": "Service",
                serviceType: s.titulo,
                provider: {
                  "@type": "Organization",
                  name: "Torres Santiago Soluciones Inteligentes",
                },
                description: s.descripcion,
              }))
            ),
          }}
        />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PH6VM4QW"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {children}
        <ChatbotWidget />
        <StickyBar
          message="📬 Recibe tips de tecnología cada semana"
          ctaText="Suscríbete gratis"
          showAfterScroll={400}
          variant="top"
          closable={true}
        />
      </body>
    </html>
  );
}
