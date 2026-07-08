# Gallery / Portfolio with Purchase Option — Design

**Date:** 2026-07-07
**Status:** Approved by Lionel (conversation, 2026-07-07)
**Design reference:** `C:\Users\Lionel\Downloads\Portfolio with purchase option\Gallery.dc.html`
**Note:** Per user instruction, this feature is built but NOT committed until they say so.

## Summary

A `/gallery` page showing GoTalk Studios' field work — photos, videos, and short
films — grouped into collections (events/shoots). Photos display as watermarked
web-resolution previews and can be selected for purchase with set pricing
(RM 10 single; 3/RM 25; 5/RM 40; 10/RM 70 — editable in Sanity). Checkout is an
**order request**: it emails the studio the selected frames and the buyer's
email; payment (DuitNow/bank transfer) and full-resolution delivery (Google
Drive) are handled manually by the studio. Videos and short films are YouTube
embeds and are not for sale.

## Decisions made

| Decision | Choice | Why |
|---|---|---|
| Checkout | Order request via Resend email | No MY payment gateway set up yet; mock stubs payment anyway; upgradeable later |
| Photo storage | Resized display copies (~2000px) in Sanity; full-res originals stay in Google Drive | CSS watermark can't protect a hosted original; keeps Sanity storage small; originals can never leak |
| Video hosting | YouTube embeds (public/unlisted) | Matches episode pattern; zero storage cost |
| Content model | `galleryCollection` + `galleryItem` documents | Mirrors mock's collection filter; per-item publishing; no typo-fragmented filters |
| Pricing | `gallerySettings` singleton in Sanity | Editors change prices without code, like services pricing |
| Order tracking | Email only (v1) | Manual fulfilment workflow is email anyway; Sanity order docs can be added later |

## Sanity schemas (new files in `sanity/schemaTypes/`)

### `galleryCollection`
- `name` string, required — e.g. "Sarawak Business Summit"
- `badge` string, required, short — e.g. "SUMMIT '26" (chip on cards)
- `orderRank` number, required — sort order of the collection filter row

### `galleryItem`
- `title` string, required
- `mediaType` string radio, required: `photo` | `video` | `film`
- `image` image with hotspot + alt field — required when `mediaType == photo`;
  description tells editors: *"Upload a resized display copy (~2000px longest
  side). Keep the full-resolution original in Google Drive — it is what buyers
  receive."*
- `youtubeUrl` url — required when `mediaType` is `video`/`film`
- `duration` string — e.g. "2:14", shown on video cards (optional)
- `collection` reference → `galleryCollection`, required
- `description` text — shown in lightbox (optional)
- `orderRank` number — sort within the grid (optional; falls back to creation date)
- Preview: image (or YouTube auto-thumb is not needed — title + badge subtitle)

### `gallerySettings` (singleton, pinned in Studio structure)
- `singlePrice` number, required — RM per frame (default 10)
- `packs` array of `{ qty: number, price: number }`, required — default
  [{3,25},{5,40},{10,70}]
- `watermarkText` string — default "© GOTALK STUDIOS"
- `watermarkStyle` string enum: `corner` | `diagonal` | `centered` — default `corner`
- `orderEmail` is NOT a field — orders go to the hardcoded studio address in the
  server action, same as the contact forms

`sanity/structure.ts` gains a Gallery group: settings singleton pinned,
collections list, items list. `sanity/schemaTypes/index.ts` registers all three.

## Queries (`sanity/lib/queries.ts`)

- `GALLERY_PAGE_QUERY` — one query returning `{ settings, collections, items }`:
  - settings: singlePrice, packs, watermarkText, watermarkStyle
  - collections ordered by orderRank: _id, name, badge
  - items ordered by collection->orderRank then orderRank/_createdAt:
    _id, title, mediaType, image{..., lqip via asset->metadata.lqip, alt},
    youtubeUrl, duration, description,
    collection->{_id, name, badge}

## Page & components

### `app/(site)/gallery/page.tsx` (server)
- Metadata: title "Gallery | GoTalk Studios", description + OG/twitter matching
  other pages, url https://gotalkstudios.com/gallery
- Hero: "IN THE FIELD" kicker (DrawLine + red label), H1 "Beyond the Studio."
  with red "Studio.", intro paragraph, sub-line "Watermarked previews —
  full-resolution files unlock on purchase.", giant background "GALLERY"
  watermark text, red left edge bar, grid-line texture (matches mock + site hero
  idiom)
- Fetches `GALLERY_PAGE_QUERY`, passes data to `GalleryClient`
- Pricing section ("LICENSING" kicker, "Take the Frames Home.") rendered from
  settings: single + pack tiers with savings notes (computed: qty×single −
  pack price)
- No `force-dynamic` — cached + revalidated by Sanity live like other pages

### `components/gallery/GalleryClient.tsx` (client)
State: `filter` (all|photo|video|film), `collectionId` (all|_id),
`selected` (item ids, photos only), `lightboxId`, `checkoutOpen`,
`orderState` (idle|sending|sent|error), `email`.

- **Tabs:** ALL WORK / PHOTOS / VIDEOS / SHORT FILMS (red active fill, like
  mock); count label "N PHOTOS · N VIDEOS · N FILMS"
- **Collection row:** "Collection —" label + ALL + one button per collection
  (red underline on active)
- **Grid:** CSS grid 3 cols desktop (2 cols mobile), `grid-auto-flow: dense`,
  4px gap. Photos: span 1, aspect 4/5. Videos/films: span 2, wide aspect. Card =
  media area (SanityImage or YouTube thumbnail via existing `i.ytimg.com`
  pattern with hqdefault fallback) + watermark overlay (photos only) + badge
  chip + play triangle/duration (videos) + info bar (title, collection ·
  RM price for photos, WATCH → for videos) + SELECT/SELECTED ✓ toggle
  (photos only, stopPropagation)
- **Empty state:** "Nothing in this cut." card
- **Lightbox:** fixed overlay, Esc/←/→ keyboard nav within the filtered list,
  ✕ close. Photos: SanityImage (contain), watermark overlay, title/badge/
  description, "Single Frame RM X" price box, sets line, ADD TO SELECTION /
  REMOVE toggle. Videos: youtube-nocookie iframe embed playing inline,
  title/description. AnimatePresence fade.
- **Selection tray:** fixed bottom, visible when selected.length > 0 and
  checkout closed. Pulsing red dot (`gtPulse` keyframes added to globals.css),
  "N Frames Selected", sets hint, running total via `computeTotal`, CLEAR,
  CHECKOUT →
- **Checkout modal:** summary (N frames / RM total), savings line when set
  pricing saves money, email input (required, validated non-empty + contains @),
  honeypot field, SEND ORDER REQUEST → button (disabled while sending).
  On success: "PAYMENT DETAILS INCOMING" state — heading "The Frames Are
  Almost Yours.", copy: *"We've received your order. We'll email you payment
  details (DuitNow / bank transfer), and your full-resolution, watermark-free
  files follow as soon as payment clears."* + list of ordered frames + BACK TO
  GALLERY button (clears selection). On error: inline red error, selection
  kept.
- Uses `motion.tsx` primitives where applicable; respects reduced motion via
  existing patterns.

### Watermark overlay
Component-level styles for the three variants (corner text / diagonal /
centered), driven by `watermarkStyle` + `watermarkText` from settings. Photos
only; pointer-events none; also applied in lightbox at larger size.

### `lib/gallery.ts`
- `computeTotal(count, singlePrice, packs)` — min-cost dynamic programming over
  [1×single, ...packs] as in the mock; returns total
- `savings(count, singlePrice, packs)` = count×single − total

### `app/actions/order.ts` (server action)
`submitGalleryOrder(prev, formData)` mirroring `contact.ts` conventions:
- Honeypot check (`website_url`) → pretend success
- Fields: `email` (required), `items` (JSON string of {id, title, badge}
  serialized by the client), `total` (string). The client-computed total is
  informational only — a human reviews every order request before invoicing,
  and the email body labels the total as quoted at current site pricing
- Sends via Resend: from no-reply@, to hello@gotalkstudios.com, replyTo buyer,
  subject `Gallery Order — N frames — RM X`, plain-text body listing each
  frame title + collection badge + item _id, buyer email, quoted total +
  savings, and a reminder line that price is per current site settings
- Returns `{ success, error? }`

## Site chrome updates

- `components/Navbar.tsx`: GALLERY link (EPISODES · SERVICES · GUESTS ·
  GALLERY · BLOG · ABOUT)
- `components/Footer.tsx`: Gallery link in same relative position
- `app/sitemap.ts`: `/gallery` static entry (weekly, 0.8)
- `app/globals.css`: `gtPulse` keyframes for the tray dot

## Error handling

- Empty dataset → page renders hero + empty state + pricing (from defaults if
  settings missing: RM 10 / packs {3:25, 5:40, 10:70})
- Missing settings document → same hardcoded defaults used
- Video without extractable YouTube ID → card renders without watch affordance
- Order email failure → `{ success: false, error }`, inline message, selection
  preserved
- Photos without image asset → excluded from grid (defensive filter)

## Verification

1. `npm run build` + `npx tsc --noEmit` + lint clean
2. Runtime smoke test: dev/prod server, check /gallery renders empty state
3. Seed via Sanity MCP: 1 gallerySettings, 2 collections, ~5 items (photos with
   generated/placeholder images + 1 video) to verify filters, selection,
   pricing math, lightbox, tray; leave seeded content for the user to replace
4. Order action verified with a real submit in the browser (email lands at
   studio address) — or if user prefers not to send test email, verify action
   returns success shape via form submit with honeypot short-circuit
5. NOT committed — left as working-tree changes for user review

## Out of scope (explicit)

- Real payment gateway (toyyibPay/Billplz) — future upgrade replacing the order
  action; UI already shaped for it
- Automated full-res delivery / download links — manual via Google Drive
- Order documents in Sanity — add later if volume justifies
- Per-item price overrides — uniform pricing v1
