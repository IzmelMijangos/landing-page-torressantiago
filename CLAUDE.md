# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 landing page for Torres Santiago, a technology solutions company based in Oaxaca, Mexico. The site showcases services including web development, chatbots, mobile apps, IT consulting, data processing, and cybersecurity. The project includes both a main landing page and a chat-app feature with dashboards for business and enterprise users.

**Tech Stack:**
- Next.js 14.2.3 (App Router)
- TypeScript
- React 18
- Tailwind CSS
- Framer Motion (animations)
- Swiper (carousels)
- Axios (API calls)

## Development Commands

**Start development server:**
```bash
npm run dev
```
Server runs at http://localhost:3000

**Build for production:**
```bash
npm run build
```
This also runs `next-sitemap` via the postbuild script to generate sitemap.xml and robots.txt

**Start production server:**
```bash
npm start
```

**Linting:**
```bash
npm run lint
```

## Project Structure

### Directory Layout

```
src/
├── app/
│   ├── page.tsx              # Main landing page (client component)
│   ├── layout.tsx            # Root layout with metadata, GA, JSON-LD
│   ├── globals.css           # Global styles
│   ├── api/
│   │   └── send_email/
│   │       └── route.ts      # POST endpoint for contact form (uses Brevo API)
│   ├── lib/
│   │   ├── services.ts       # Service data definitions
│   │   └── utils.ts          # Utility functions
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Header_v2.tsx
│   │   ├── Footer.tsx
│   │   ├── Modal.tsx         # Generic modal component
│   │   ├── ServiceDetail.tsx
│   │   ├── TeamModal.tsx
│   │   ├── TechInfoModal.tsx
│   │   ├── CustomSolutionsModal.tsx
│   │   ├── AppSelector.tsx
│   │   ├── LoadingOverlay.tsx
│   │   ├── ui/
│   │   │   └── Avatar.tsx
│   │   └── chat-app/
│   │       ├── auth/         # Authentication components
│   │       ├── dashboard/    # Dashboard components
│   │       └── landing/      # Chat-app landing components
│   ├── chat-app/
│   │   ├── business-dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── credits/
│   │   │   └── subscription/
│   │   └── enterprise-dashboard/
│   │       ├── page.tsx
│   │       ├── credits/
│   │       ├── allocate/
│   │       └── clients/
│   └── privacy/
│       └── page.tsx          # Privacy policy page
```

### Path Aliases

The project uses `@/*` alias mapping to `src/*` (configured in tsconfig.json):
```typescript
import Header from "@/app/components/Header"
```

## Architecture Notes

### SEO and Metadata

- SEO metadata is configured in `src/app/layout.tsx` using Next.js 14 Metadata API
- Includes Open Graph, Twitter Card, and JSON-LD structured data
- Google Analytics (G-NWG401PNM2) is integrated in the layout
- Sitemap generation via `next-sitemap` configured in `next-sitemap.config.js`
- Site URL: https://www.torressantiago.com

### Styling

- Tailwind CSS with custom theme extensions in `tailwind.config.ts`
- Custom colors: `accent` (orange #c17207), `dark` variants
- Custom animations: `fade-in`, `slide-up`
- Framer Motion used for page transitions and component animations

### Client vs Server Components

- Main page (`src/app/page.tsx`) uses `"use client"` directive for interactivity
- Components with useState, useEffect, or event handlers need `"use client"`
- API routes are server-side by default

### API Routes

- Email sending endpoint: `/api/send_email` (POST)
- Uses Brevo API for transactional emails
- Requires `BREVO_API_KEY` environment variable
- Accepts: `{ name, email, serviceType, description }`

### Services Data

Service information is centralized in `src/app/lib/services.ts`:
- Exported as `serviciosData` array
- Type: `Service[]` with `titulo` and `descripcion`
- Used for JSON-LD generation and UI components

### Multi-App Structure

The project contains two apps:
1. **Main Landing Page**: Marketing site for Torres Santiago services
2. **Chat App**: Multi-tenant chat application with role-based dashboards
   - Business dashboard: `/chat-app/business-dashboard`
   - Enterprise dashboard: `/chat-app/enterprise-dashboard`
   - Auth context for authentication state management
   - Role-based context for access control

## Deployment

### Firebase Hosting
Configuration in `firebase.json`:
- Deploys the `out` directory (static export)
- Note: `next.config.mjs` has `output: 'export'` commented out, suggesting dynamic rendering is currently enabled

### Google App Engine
Configuration in `app.yaml`:
- Service: `landing-page-amsi-design`
- Runtime: Node.js 18
- Basic scaling with max 1 instance

## Environment Variables

Required environment variables:
- `BREVO_API_KEY`: API key for Brevo email service (used in `/api/send_email`)

## Image Handling

Next.js Image component uses `unoptimized: true` in `next.config.mjs`, which is necessary for static exports but currently may not be needed if dynamic rendering is active.
