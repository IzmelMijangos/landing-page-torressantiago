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
- PostgreSQL (Neon) - Database
- node-postgres (pg) - Database client

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

**Database commands:**
```bash
# Create database schema
npm run db:schema

# Migrate data from JSON to PostgreSQL (one-time migration)
npm run db:migrate
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

#### Email & Contact
- **`/api/send_email`** (POST): Contact form emails via Brevo API
  - Accepts: `{ name, email, serviceType, description }`

#### Leads Management
- **`/api/leads`** (GET, POST): Lead capture and retrieval
  - GET: Returns all leads with statistics
  - POST: Creates new lead (auto-notifies if score >= 50)
  - Data stored in PostgreSQL `leads` table

#### Newsletter
- **`/api/leads/subscribe`** (GET, POST): Newsletter subscriptions
  - GET: Returns subscriber statistics
  - POST: Creates new subscription with welcome email
  - Data stored in PostgreSQL `newsletter_subscribers` table

- **`/api/newsletter/send`** (GET, POST): Send newsletters
  - GET: Returns newsletter send history
  - POST: Sends newsletter to active subscribers
  - Data stored in PostgreSQL `sent_newsletters` table

#### Lead Magnets
- **`/api/leads/download`** (GET, POST): Lead magnet downloads
  - GET: Returns download statistics
  - POST: Triggers download email with resource
  - Data stored in PostgreSQL `lead_magnet_downloads` table

#### Data Export
- **`/api/leads/export`** (GET): Export data in multiple formats
  - Formats: JSON, CSV, Brevo contacts
  - Types: leads, newsletter, downloads, all

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

## Database Architecture

### PostgreSQL (Neon)

The application uses PostgreSQL hosted on Neon for data persistence. Previously used JSON files, now fully migrated to database.

**Tables:**
1. **`newsletter_subscribers`** - Newsletter subscriptions
   - Unique email constraint
   - Status tracking (active/unsubscribed)
   - Source attribution (sidebar, inline, footer, etc)

2. **`leads`** - Sales leads from chatbot and forms
   - Score-based classification (0-100)
   - Conversation history stored as JSONB
   - Auto-notification for hot leads (score >= 50)

3. **`lead_magnet_downloads`** - Resource download tracking
   - Links email to downloaded resource
   - Tracks email delivery status

4. **`sent_newsletters`** - Newsletter send history
   - Post slugs array
   - Success/fail counts
   - Test mode flag

**Database utilities:**
- Connection pool management in `src/app/lib/db.ts`
- Schema definition in `database/schema.sql`
- Migration script in `database/migrate-json-to-db.ts`
- Full documentation in `database/README.md`

## Environment Variables

**Required:**
- `DATABASE_URL`: PostgreSQL connection string (Neon)
  - Format: `postgresql://user:password@host.neon.tech/db?sslmode=require`
- `BREVO_API_KEY`: API key for Brevo email service
- `OPENAI_API_KEY`: API key for chatbot functionality

**Optional:**
- `NEXT_PUBLIC_BASE_URL`: Base URL for the site (default: localhost:3000)
- `TELEGRAM_BOT_TOKEN`: For Telegram notifications
- `TELEGRAM_CHAT_ID`: Telegram chat for notifications
- `GOOGLE_AI_API_KEY`: Google Gemini API key
- `HUBSPOT_API_KEY`: HubSpot CRM integration

See `.env.example` for complete list and setup instructions.

## Image Handling

Next.js Image component uses `unoptimized: true` in `next.config.mjs`, which is necessary for static exports but currently may not be needed if dynamic rendering is active.
