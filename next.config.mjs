// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // output: 'export',
    images: {
        unoptimized: false,
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Rewrites para subdomain leads.torressantiago.com
    async rewrites() {
        return [
            {
                // Root del subdomain → Login
                source: '/',
                destination: '/login',
                has: [
                    {
                        type: 'host',
                        value: 'leads.torressantiago.com',
                    },
                ],
            },
            {
                // Alias amigable para formulario de captura
                source: '/form',
                destination: '/lead-capture',
                has: [
                    {
                        type: 'host',
                        value: 'leads.torressantiago.com',
                    },
                ],
            },
            {
                // Todas las demás rutas funcionan normal
                // (dashboard, admin, etc. se mapean directamente)
                source: '/:path*',
                destination: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'leads.torressantiago.com',
                    },
                ],
            },
        ];
    },

    // Headers de seguridad - Fuerza HTTPS
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;