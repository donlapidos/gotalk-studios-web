# Services Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Services page for GoTalk Studios backed by Sanity CMS, matching the Stitch design screenshot.

**Architecture:** Add a `service` Sanity document type with ordering, featured flag, and pricing rows. A single GROQ query fetches all active services; the page renders featured services as wide two-column cards and non-featured as three-column compact cards, matching the dark/red aesthetic of the rest of the site.

**Tech Stack:** Next.js App Router, Sanity CMS (next-sanity sanityFetch + SanityLive), TypeScript, Tailwind CSS, Framer Motion (FadeIn/FadeUp/DrawLine from `@/components/motion`)

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `sanity/schemaTypes/service.ts` | Service document schema |
| Modify | `sanity/schemaTypes/index.ts` | Register service schema |
| Modify | `sanity/structure.ts` | Add Services to Studio sidebar |
| Modify | `sanity/lib/queries.ts` | Add ALL_SERVICES_QUERY |
| Create | `app/services/page.tsx` | Services page |
| Modify | `components/Navbar.tsx` | Add SERVICES nav link |

---

### Task 1: Sanity Schema — `service` document type

**Files:**
- Create: `sanity/schemaTypes/service.ts`

- [ ] **Step 1: Create the service schema file**

```typescript
// sanity/schemaTypes/service.ts
import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      description: 'Manual sort order (lower = first)',
    }),
    defineField({
      name: 'serviceNumber',
      title: 'Service Number',
      type: 'string',
      description: "Display number, e.g. '01', '02'",
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: "Short hook line, e.g. 'Launch Your Podcast the Right Way!'",
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points of what is included',
    }),
    defineField({
      name: 'perfectFor',
      title: 'Perfect For',
      type: 'text',
      rows: 2,
      description: "Who this service is ideal for, e.g. 'Solo creators, interview shows, and corporate panels.'",
    }),
    defineField({
      name: 'featured',
      title: 'Featured (Large Card)',
      type: 'boolean',
      description: 'Toggle on to render this service as a large two-column hero card.',
      initialValue: false,
    }),
    defineField({
      name: 'pricingRows',
      title: 'Pricing Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'duration', title: 'Duration / Package', type: 'string' }),
            defineField({ name: 'price', title: 'Price', type: 'string', description: "e.g. 'RM180 – RM250'" }),
          ],
          preview: {
            select: { title: 'duration', subtitle: 'price' },
          },
        },
      ],
    }),
    defineField({
      name: 'pricingNote',
      title: 'Pricing Note',
      type: 'string',
      description: "Optional note below pricing table, e.g. 'Raw footage delivery included'",
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Uncheck to hide this service without deleting it.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'serviceNumber',
    },
    prepare({ title, subtitle }) {
      return { title: `${subtitle} — ${title}` }
    },
  },
  orderings: [
    {
      title: 'Order Rank',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
})
```

- [ ] **Step 2: Register schema in index.ts**

In `sanity/schemaTypes/index.ts`, change:

```typescript
import { type SchemaTypeDefinition } from 'sanity'
import { episode } from './episode'
import { blogPost } from './blogPost'
import { siteSettings } from './siteSettings'
import { guest } from './guest'
import { service } from './service'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [episode, blogPost, siteSettings, guest, service],
}
```

- [ ] **Step 3: Add Services section to Sanity structure**

In `sanity/structure.ts`, change:

```typescript
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('GoTalk Studios')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),
      S.documentTypeListItem('episode').title('Episodes'),
      S.divider(),
      S.listItem()
        .title('Guests')
        .child(
          S.documentTypeList('guest')
            .title('Guests')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),
      S.divider(),
      S.listItem()
        .title('Services')
        .child(
          S.documentTypeList('service')
            .title('Services')
            .defaultOrdering([{ field: 'orderRank', direction: 'asc' }])
        ),
      S.divider(),
      S.documentTypeListItem('blogPost').title('Blog Posts'),
    ])
```

- [ ] **Step 4: Commit schema changes**

```bash
git add sanity/schemaTypes/service.ts sanity/schemaTypes/index.ts sanity/structure.ts
git commit -m "feat(sanity): add service document type and Studio sidebar section"
```

---

### Task 2: GROQ query

**Files:**
- Modify: `sanity/lib/queries.ts`

- [ ] **Step 1: Add ALL_SERVICES_QUERY**

Append to the bottom of `sanity/lib/queries.ts`:

```typescript
export const ALL_SERVICES_QUERY = defineQuery(`
  *[_type == "service" && active == true] | order(orderRank asc) {
    _id,
    serviceNumber,
    name,
    tagline,
    description,
    features,
    perfectFor,
    featured,
    pricingRows,
    pricingNote
  }
`)
```

- [ ] **Step 2: Commit**

```bash
git add sanity/lib/queries.ts
git commit -m "feat(sanity): add ALL_SERVICES_QUERY"
```

---

### Task 3: Services page

**Files:**
- Create: `app/services/page.tsx`

- [ ] **Step 1: Create `app/services/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { sanityFetch } from '@/sanity/lib/live'
import { ALL_SERVICES_QUERY } from '@/sanity/lib/queries'
import { FadeIn, FadeUp, DrawLine } from '@/components/motion'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Services | GoTalk Studios',
  description:
    'Professional production services for businesses, creators, and brands in Sarawak — podcast studio rental, videography, drone, and video editing.',
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PricingRow = {
  duration: string
  price: string
}

type Service = {
  _id: string
  serviceNumber: string | null
  name: string
  tagline: string | null
  description: string | null
  features: string[] | null
  perfectFor: string | null
  featured: boolean
  pricingRows: PricingRow[] | null
  pricingNote: string | null
}

// ─── Pricing Table ────────────────────────────────────────────────────────────

function PricingTable({ rows, note, compact }: { rows: PricingRow[]; note?: string | null; compact?: boolean }) {
  return (
    <div className="mt-4">
      <div className={`flex justify-between ${compact ? 'mb-1' : 'mb-2'}`}>
        <span className={`text-white/40 font-bold tracking-[0.2em] uppercase ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
          {compact ? 'Package' : 'Duration'}
        </span>
        <span className={`text-white/40 font-bold tracking-[0.2em] uppercase ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
          Rate (RM)
        </span>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex justify-between items-center px-3 ${compact ? 'py-1.5' : 'py-2.5'}`}
          style={{ backgroundColor: i % 2 === 0 ? '#1A1A1A' : '#222222' }}
        >
          <span className={`text-white/70 ${compact ? 'text-[11px]' : 'text-xs'}`}>{row.duration}</span>
          <span className={`text-[#CC0000] font-bold ${compact ? 'text-[11px]' : 'text-xs'}`}>{row.price}</span>
        </div>
      ))}
      {note && (
        <p className="mt-2 text-white/35 text-[10px] italic">{note}</p>
      )}
    </div>
  )
}

// ─── Featured Card (large, two-column) ───────────────────────────────────────

function FeaturedServiceCard({ service, reversed }: { service: Service; reversed?: boolean }) {
  return (
    <div
      className="group relative flex border border-white/8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#CC0000]/50"
      style={{ minHeight: '480px' }}
    >
      {/* Content column */}
      <div className={`w-full md:w-1/2 bg-[#111111] p-8 lg:p-10 flex flex-col ${reversed ? 'order-2' : 'order-1'}`}>
        {/* Service number */}
        {service.serviceNumber && (
          <FadeIn>
            <span
              className="font-[family-name:var(--font-bebas-neue)] text-[#CC0000] leading-none block mb-2"
              style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
            >
              {service.serviceNumber}
            </span>
          </FadeIn>
        )}

        {/* Name */}
        <FadeUp delay={0.1}>
          <h2
            className="font-[family-name:var(--font-bebas-neue)] text-white uppercase leading-none mb-3"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '0.02em' }}
          >
            {service.name}
          </h2>
        </FadeUp>

        {/* Tagline */}
        {service.tagline && (
          <FadeIn delay={0.15}>
            <p className="text-[#CC0000]/60 text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
              {service.tagline}
            </p>
          </FadeIn>
        )}

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <ul className="space-y-2 mb-6">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 shrink-0 w-3 h-3 bg-[#CC0000] inline-block" />
                <span className="text-white/70 text-xs font-semibold tracking-[0.12em] uppercase leading-relaxed">
                  {f}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Perfect For */}
        {service.perfectFor && (
          <div className="bg-[#2A0000] border-l-2 border-[#CC0000] px-4 py-3 mb-6">
            <p className="text-[#CC0000]/70 text-[9px] font-bold tracking-[0.25em] uppercase mb-1">
              Perfect For
            </p>
            <p className="text-white/70 text-xs leading-relaxed">{service.perfectFor}</p>
          </div>
        )}

        {/* Pricing */}
        {service.pricingRows && service.pricingRows.length > 0 && (
          <PricingTable rows={service.pricingRows} note={service.pricingNote} />
        )}
      </div>

      {/* Image / dark panel */}
      <div
        className={`hidden md:block md:w-1/2 bg-[#0A0A0A] ${reversed ? 'order-1' : 'order-2'}`}
        style={{
          background: 'linear-gradient(135deg, #0D0D0D 0%, #181818 50%, #0A0A0A 100%)',
        }}
      >
        <div className="w-full h-full flex items-center justify-center opacity-10">
          <span
            className="font-[family-name:var(--font-bebas-neue)] text-white select-none"
            style={{ fontSize: 'clamp(6rem, 15vw, 14rem)', letterSpacing: '0.05em' }}
          >
            {service.serviceNumber}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Compact Card (smaller, three-column grid) ────────────────────────────────

function CompactServiceCard({ service }: { service: Service }) {
  return (
    <div className="group relative bg-[#111111] border border-white/8 p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-[#CC0000]/50">
      {/* Service number */}
      {service.serviceNumber && (
        <span
          className="font-[family-name:var(--font-bebas-neue)] text-[#CC0000]/60 leading-none block mb-1"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          {service.serviceNumber}
        </span>
      )}

      {/* Name */}
      <h2
        className="font-[family-name:var(--font-bebas-neue)] text-white uppercase leading-none mb-2"
        style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', letterSpacing: '0.02em' }}
      >
        {service.name}
      </h2>

      {/* Tagline */}
      {service.tagline && (
        <p className="text-[#CC0000]/50 text-[9px] font-bold tracking-[0.2em] uppercase mb-4">
          {service.tagline}
        </p>
      )}

      {/* Perfect For */}
      {service.perfectFor && (
        <div className="bg-[#CC0000] px-3 py-2 mb-4">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/80 mb-0.5">
            Perfect For
          </p>
          <p className="text-white text-[11px] leading-snug">{service.perfectFor}</p>
        </div>
      )}

      {/* Pricing */}
      {service.pricingRows && service.pricingRows.length > 0 && (
        <PricingTable rows={service.pricingRows} note={service.pricingNote} compact />
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ServicesPage() {
  const { data } = await sanityFetch({ query: ALL_SERVICES_QUERY })
  const services = (data ?? []) as Service[]

  const featured = services.filter((s) => s.featured)
  const compact = services.filter((s) => !s.featured)

  return (
    <>
      <Navbar />
      <main className="pt-16 bg-[#111111] min-h-screen">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <div className="relative bg-[#0D0D0D] border-b border-white/5 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 50% 80% at 0% 100%, rgba(204,0,0,0.12) 0%, transparent 65%)',
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
            <FadeIn delay={0.05}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-[2px] bg-[#CC0000] inline-block" />
                <span className="text-[#CC0000] text-[11px] font-bold tracking-[0.35em] uppercase">
                  What We Offer
                </span>
              </div>
            </FadeIn>

            <FadeUp delay={0.1}>
              <div className="leading-none mb-6">
                <h1
                  className="font-[family-name:var(--font-bebas-neue)] text-white uppercase block"
                  style={{ fontSize: 'clamp(4.5rem, 12vw, 11rem)', letterSpacing: '0.02em', lineHeight: 0.9 }}
                >
                  STUDIO
                </h1>
                <h1
                  className="font-[family-name:var(--font-bebas-neue)] uppercase block"
                  style={{
                    fontSize: 'clamp(4.5rem, 12vw, 11rem)',
                    letterSpacing: '0.02em',
                    lineHeight: 0.9,
                    color: 'transparent',
                    WebkitTextStroke: '2px #CC0000',
                  }}
                >
                  SERVICES
                </h1>
              </div>
            </FadeUp>

            <FadeIn delay={0.3}>
              <DrawLine delay={0.35} className="w-16 h-[2px] bg-[#CC0000] mb-5" />
              <p className="text-white/50 text-sm max-w-md leading-relaxed">
                Professional production services for businesses, creators, and brands in Sarawak.
                High-fidelity gear, expert operators, and creative space.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* ── Featured Services ──────────────────────────────────── */}
        {featured.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="space-y-px">
              {featured.map((s, i) => (
                <FeaturedServiceCard key={s._id} service={s} reversed={i % 2 !== 0} />
              ))}
            </div>
          </div>
        )}

        {/* ── Compact Services ───────────────────────────────────── */}
        {compact.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
              {compact.map((s) => (
                <CompactServiceCard key={s._id} service={s} />
              ))}
            </div>
          </div>
        )}

        {/* ── Booking CTA ────────────────────────────────────────── */}
        <section className="bg-[#CC0000] py-20 px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="font-[family-name:var(--font-bebas-neue)] text-white uppercase leading-none mb-5"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.03em' }}
            >
              Ready to Book?
            </h2>
            <p className="text-white/80 text-sm leading-relaxed mb-10">
              Contact us to check availability and confirm your session.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-[#CC0000] text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#F0F0EE] active:scale-95 transition-all"
              >
                BOOK NOW
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 hover:bg-white/10 active:scale-95 transition-all"
              >
                GET IN TOUCH
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/services/page.tsx
git commit -m "feat: add Services page with featured + compact card layout"
```

---

### Task 4: Navigation — add SERVICES link

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Insert SERVICES between EPISODES and GUESTS in `NAV_LINKS`**

In `components/Navbar.tsx`, change the `NAV_LINKS` array (lines 7–11) from:

```typescript
const NAV_LINKS = [
  { label: "EPISODES", href: "/episodes" },
  { label: "GUESTS", href: "/guests" },
  { label: "BLOG", href: "/blog" },
  { label: "ABOUT", href: "/about" },
];
```

to:

```typescript
const NAV_LINKS = [
  { label: "EPISODES", href: "/episodes" },
  { label: "SERVICES", href: "/services" },
  { label: "GUESTS", href: "/guests" },
  { label: "BLOG", href: "/blog" },
  { label: "ABOUT", href: "/about" },
];
```

- [ ] **Step 2: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: add SERVICES link to main nav between EPISODES and GUESTS"
```

---

### Task 5: Seed content — Studio entry guide

**This task is documentation only — no code changes.**

After deploying, Gordon should enter the following five services in Sanity Studio (`/studio` → Services → New Service):

---

#### Service 01 — Podcast Studio Rental

| Field | Value |
|-------|-------|
| Order Rank | `1` |
| Service Number | `01` |
| Name | `Podcast Studio Rental` |
| Tagline | `Launch Your Podcast the Right Way!` |
| Description | `Our fully equipped podcast studio gives you everything you need for a professional-grade recording — from multi-cam 4K video to treated acoustics.` |
| Features | `Multi-cam 4K video recording` / `Professional Shure SM7B microphones` / `Acoustically treated environment` |
| Perfect For | `Solo creators, interview shows, and corporate panels.` |
| Featured | ✅ On |
| Pricing Rows | 1 Hour → `RM180 – RM250` / 2 Hours → `RM300 – RM450` / 4 Hours → `RM550 – RM800` / Operator Fee → `RM150 – RM300` |
| Pricing Note | `Raw footage delivery included` |
| Active | ✅ On |

---

#### Service 02 — Studio Space Rental

| Field | Value |
|-------|-------|
| Order Rank | `2` |
| Service Number | `02` |
| Name | `Studio Space Rental` |
| Tagline | `Flexible Studio for Any Shoot` |
| Description | `A versatile studio space with modular backgrounds, high-end lighting, and a makeup area — ready for photo shoots, commercial filming, and livestreams.` |
| Features | `Modular background sets` / `High-end lighting rig included` / `Makeup & changing area` |
| Perfect For | `Product photography, commercial filming, and livestreams.` |
| Featured | ✅ On |
| Pricing Rows | 1 Hour → `RM100 – RM160` / Half-Day (4H) → `RM350 – RM800` / Full-Day (8H) → `RM700 – RM1,200` |
| Pricing Note | *(leave blank)* |
| Active | ✅ On |

---

#### Service 03 — Videography Services

| Field | Value |
|-------|-------|
| Order Rank | `3` |
| Service Number | `03` |
| Name | `Videography Services` |
| Tagline | `Cinematic Storytelling` |
| Description | `Professional on-location videography for events, corporate reels, and branded content.` |
| Features | *(leave blank)* |
| Perfect For | `Events, corporate reels, and cinematic storytelling.` |
| Featured | ☐ Off |
| Pricing Rows | Hourly → `RM150 – RM300` / Half-Day → `RM700 – RM1,500` / Full-Day → `RM1,400 – RM3,000` |
| Pricing Note | *(leave blank)* |
| Active | ✅ On |

---

#### Service 04 — Drone Videography

| Field | Value |
|-------|-------|
| Order Rank | `4` |
| Service Number | `04` |
| Name | `Drone Videography` |
| Tagline | `Aerial Perspective, Ground-Level Detail` |
| Description | `Licensed drone operators capturing real estate, landscape, and high-production quality aerial footage.` |
| Features | *(leave blank)* |
| Perfect For | `Real estate, landscape shots, and high-production square.` |
| Featured | ☐ Off |
| Pricing Rows | Per Session → `RM500 – RM800` / Half-Day → `RM700 – RM1,200` |
| Pricing Note | *(leave blank)* |
| Active | ✅ On |

---

#### Service 05 — Video Editing Services

| Field | Value |
|-------|-------|
| Order Rank | `5` |
| Service Number | `05` |
| Name | `Video Editing Services` |
| Tagline | `Polish Your Content to Perfection` |
| Description | `Expert post-production for social media content, YouTube series, and trailers.` |
| Features | *(leave blank)* |
| Perfect For | `Social media content, YouTube series, and trailers.` |
| Featured | ☐ Off |
| Pricing Rows | Short Form → `RM80 – RM150` / Standard → `RM300 – RM700` / Advanced → `RM800 – RM2,000` |
| Pricing Note | *(leave blank)* |
| Active | ✅ On |

---

## Self-Review Checklist

- [x] Sanity schema covers all required fields (orderRank, serviceNumber, name, tagline, description, features, perfectFor, featured, pricingRows, pricingNote, active)
- [x] Schema registered in index.ts
- [x] Studio structure shows Services sorted by orderRank
- [x] ALL_SERVICES_QUERY filters `active == true`, orders by `orderRank asc`, selects all needed fields
- [x] Page uses `sanityFetch` with `SanityLive` (inherited from layout.tsx)
- [x] `export const dynamic = 'force-dynamic'` present
- [x] Hero: red eyebrow, "STUDIO" white, "SERVICES" outlined red
- [x] Featured cards: large service number, name, tagline, features with red square icons, Perfect For box, pricing table, alternating row backgrounds
- [x] Compact cards: three-column grid, same elements more compact
- [x] Hover state: translateY(-4px) + red border
- [x] Booking CTA: red background, BOOK NOW (white filled) + GET IN TOUCH (outlined), both link to /contact
- [x] SERVICES nav link added between EPISODES and GUESTS
- [x] Metadata: title = 'Services | GoTalk Studios', correct description
- [x] Five services seed content documented for Gordon
- [x] No placeholder text — all code is complete and runnable
