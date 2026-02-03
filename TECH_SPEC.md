# SchoolSure Website — Technical Specification

Version: 2026‑02‑03  
Owner: SchoolSure  
Status: Active build (homepage, directory, profiles, quote flow in progress)

This document defines the current technical architecture, data relationships, brand system, UI rules, business logic, and flow behavior. Use it for internal progress updates, handovers, and roadmap planning.

---

## 1. Stack & Architecture

### Runtime
- **Framework:** Next.js 16 (App Router)
- **Rendering:** SSR for dynamic data; App Router for routes and layouts
- **Language:** TypeScript + React 19
- **Styling:** Tailwind CSS v4
- **Icons:** lucide‑react
- **Forms:** react‑hook‑form + zod
- **State:** Zustand (`useQuoteStore`)

### Data
- **Database:** Supabase (Postgres)
- **Storage:** Supabase Storage (public bucket for logos)
- **Client:** `@supabase/supabase-js` in server and client contexts

### Key Constraints
- **Dynamic pages**: `export const dynamic = "force-dynamic"` on directory/profile pages
- **No static params** for school profiles (dynamic only)

---

## 2. Global Structure & Layout

- **Root layout:** `app/layout.tsx`
  - Global `Header` and `Footer` always visible
  - Footer full‑width background, inner content constrained to `max-w-7xl`
- **Global UI:** `components/ui/*`, `components/shared/*`
- **Primary layouts:**
  - Site pages: standard layout with header/footer
  - Quote flow: `app/quote/layout.tsx` with stepper + trust strip

---

## 3. Brand Guidelines (Design System)

### Core Colors
- **Navy:** `#2D3E50` (primary text + backgrounds)
- **Magenta:** `#D6336C` (CTAs, accents)
- **Off‑white:** `#F8F9FA` (section backgrounds)
- **Neutral grays:** Tailwind `gray` scale

### Typography
- **Headlines:** bold/black, high contrast
- **Body:** readable sizes; avoid tiny text in core flows
- **CTA labels:** bold, sentence‑case
- **Tracking:** subtle `tracking-tight` for H1/H2

### Buttons
- **Primary CTA:** solid magenta (default)
- **Secondary CTA:** outline or low‑contrast navy/white
- **Consistency rule:** CTAs in a section must not mix arbitrary styles

### Depth & Layout
- Use soft shadow + ring to add depth to cards
- Align **icon + header + image** on the same top baseline in hero/coverage sections
- Use consistent vertical rhythm: avoid large gaps between sequential sections

### Assets
- **Hero images:** `/public/images/hero/*`
- **School images:** `/public/images/schools/*`
- **School logos:** Supabase public bucket `school-logos`
- **Logo usage:** `components/shared/SchoolLogo.tsx` (hides broken images)

---

## 4. Data Model (Supabase)

### Table: `public.schools`
**Core fields in use:**
- `school_id` (PK)
- `school_name`, `slug`, `sector`, `gender`
- `year_levels_text`, `boarding_school`
- `street_address`, `suburb`, `postcode`, `lga`
- `latitude`, `longitude`
- `phone`, `email`, `website_url`
- `fee_page_url`, `enrolment_url`, `tours_url`, `latest_reports_url`
- `facebook_url`, `instagram_url`
- `extra_campuses`
- `icsea_value`, `total_enrolment`

### Storage: `school-logos` (public)
- File naming: `{school_id}.png`
- URL helper: `lib/school-utils.ts`
- Usage: Directory cards + school hero

### Relationships & Usage
- **Directory** pulls paginated records with filters and count
- **School profile** pulls a single record by `slug`
- **Nearby schools** uses lat/long + Haversine in JS
- **Similar schools** matches gender + sector + year levels

---

## 5. Supabase Query Rules

### Directory
- Search:
  - `school_name.ilike.%query%`
  - `suburb.ilike.%query%`
- Area filtering:
  - LGA uses `.ilike("lga", `%${area}%`)` (format inconsistent in DB)
- Pagination:
  - `.range(from, to)`
- Sort:
  - `school_name` or `suburb`

### School Profile
- `.eq("slug", slug)` to fetch school
- Nearby schools filtered by postcode range before Haversine
- Similar schools filtered by gender + sector + year levels

---

## 6. Page Structure & Flow

### Homepage (`/`)
Flow:
1. Hero (label + headline + trust strip + CTA)
2. Stats bar (overlaps hero)
3. Hook section (rhetorical)
4. Coverage cards (3 products)
5. Why SchoolSure (trust cards)
6. How it works (3 steps)
7. Testimonials
8. FAQ
9. Bottom CTA
10. Footer

Rules:
- **Coffee** appears exactly once (hero subtitle)
- **2 minutes** appears only in:
  - Hero trust strip
  - “Why SchoolSure” card title
- **No paperwork / No medical** appears only in:
  - “Why SchoolSure” card
  - Bottom CTA

### School Directory (`/school-directory`)
Component: `components/school-directory/SchoolDirectoryListing.tsx`

Features:
- Full‑text search on `school_name` + `suburb` (debounced 300ms)
- Filters: sector, area/LGA, gender, year level, boarding
- Filters persisted via **URL search params** for shareability
- Pagination: 50 per page via Supabase `.range()`
- Sort: name A–Z, name Z–A, suburb A–Z
- Empty state: “No schools found” + clear filters

Card Rules:
- Link to `/school/[slug]`
- Show tags: sector, gender, year levels, boarding
- Logo: Supabase storage (`getSchoolLogoUrl`)

### School Profile (`/school/[slug]`)
Server component using Supabase query by slug.

Sections (order fixed):
1. Hero identity card (breadcrumb, logo, name, location, tags)
2. Snapshot grid (only fields with data)
3. SchoolSure cross‑sell (hidden for Government)
4. Contact cards (conditional)
5. Action links (conditional)
6. Extra campuses (conditional)
7. Map (if lat/long)
8. Nearby schools (Haversine)
9. Similar schools
10. Bottom CTA (hidden for Government)

Rules:
- Never render “N/A”
- Hide banners for Government schools
- SEO metadata generated dynamically

### Quote Flow (`/quote/*`)
Routes:
- `/quote/school`
- `/quote/coverage`
- `/quote/details`
- `/quote/review`
- `/quote/purchase`

Layout:
- Shared stepper + trust bar (`app/quote/layout.tsx`)
- Trust strip (Lloyd’s, AFSL, Secure)

UX Enhancements:
- Step headers (“Step X of 4”)
- Personalization (name, school, child, quote reference)
- Save/share actions (download, email, copy link)
- Payment trust cues and badges
- “What happens next” guidance on purchase

---

## 7. Brand & UI Rules (Detailed)

### CTAs
- Primary: solid magenta, consistent size (`min-h-[56px]`)
- Secondary: white/transparent with subtle border
- Avoid mixing CTA styles within a section

### Icons
- Use lucide icons consistently in trust cues, steps, and cards
- Use brand colors (magenta/navy) for icon accents

### Typography Scale (General)
- H1: `text-h1` (or `text-4xl/5xl` on homepage)
- H2: `text-2xl/3xl`
- Body: `text-lg` for lead copy, `text-sm` for metadata
- Avoid `text-xs` in primary content areas

### Shadows & Cards
- Cards: rounded‑2xl + soft shadow
- Image frames: subtle ring + depth
- Elevate primary selections with stronger shadow + ring

---

## 8. Quote Business Rules

### Inputs
- **Annual fees:** numeric, required
- **Year level:** required
- **Parent details:** first/last/email/phone/DOB
- **Children:** at least one child

### Coverage Logic
- Tier pricing computed via `calculatePremium`
- Add‑ons:
  - Student Continuity Cover (+$4/week)
  - Deposits & Booking Protection (+$2/week)
- Premiums shown weekly/monthly/annual

### Review & Purchase
- Quote reference generated on review
- Quote valid for 14 days (displayed)
- Save/share: download, email, copy link
- Purchase step is “secure checkout coming soon”

---

## 9. Quote UX/Trust Rules

Must‑have on all steps:
- Stepper visible at top
- Trust cues (Lloyd’s, AFSL, Secure)
- Clear next action button
- Real‑time selections reflected in UI

Purchase:
- Payment badges (Visa, Mastercard, AMEX, Apple Pay)
- “What happens next” guidance
- Back to review link

---

## 10. Fonts, Logos, and Media

### Fonts
- Uses project defaults from global styles
- Headings are bold/black
- Body uses clean readable sans‑serif

### Logos
- SchoolSure logo in `components/ui/Logo`
- School logos from Supabase storage via `getSchoolLogoUrl`

### Images
- Hero and school images in `/public/images`
- Images are `object-cover` with consistent rounded corners

---

## 11. Compliance & Copy Rules

- No “guaranteed” language
- Use “helps your child stay in school”
- Payment/coverage statements must be non‑absolute
- Show AFSL + Lloyd’s trust cues in quote flow

---

## 12. File Map (Key)

- `app/layout.tsx` — global layout
- `app/page.tsx` — homepage
- `components/homepage/*` — homepage sections
- `components/layout/*` — navigation/footer
- `app/school-directory/page.tsx`
- `components/school-directory/SchoolDirectoryListing.tsx`
- `app/school/[slug]/page.tsx`
- `app/quote/*` — quote steps + layout
- `components/quote/*` — quote UI blocks
- `lib/school-utils.ts` — logo URL helper

---

## 13. Operational Notes

- Directory/profile pages are dynamic (`force-dynamic`)
- Quote state is stored in Zustand
- Payment flow is a placeholder until gateway integration

---

## 14. Next Iterations (Suggested)

- Replace text badges with SVG payment logos
- Add inline “Saving…” feedback between quote steps
- Add persistent “Save quote” in quote header
- Add analytics/tracking for CTA conversions
- Add server‑side validation for quote flow

---

**Document location:** `schoolsure/TECH_SPEC.md`  
Copy/upload directly from this file. If you want a PDF export or a different folder, tell me where to place it.
