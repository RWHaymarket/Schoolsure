# SchoolSure Admin System — Tech Summary

This document describes the internal admin command centre built under `/admin`. It is a dark-mode operational tool with mock data and no authentication (MVP).

## Scope and Purpose

- Internal operations console for founders.
- Data-dense dashboard with financials, quotes, policies, customers, reports, and settings.
- Fully mocked data, deterministic generation (no `Math.random()`).
- No auth, no route protection, no login page.

## Tech Stack

- Next.js App Router (Next 16)
- TypeScript
- Tailwind CSS v4
- Lucide Icons
- Deterministic mock data (seeded pseudo-random)

## Routing

- `/admin` — Dashboard
- `/admin/quotes` — Quotes list and detail
- `/admin/policies` — Policies list and detail
- `/admin/customers` — Customer directory and detail
- `/admin/financials` — GWP, commission, IPT
- `/admin/reports` — Report builder with exports
- `/admin/settings` — Rate configuration and business info

## Layout and UI Architecture

### Layout shell

- `app/admin/layout.tsx` wraps admin pages with `AdminLayout`.
- `components/admin/AdminLayout.tsx` handles sidebar, mobile hamburger, and main content.
- Admin layout is isolated from public header/footer via `AppShell` route check.

### Sidebar

- `components/admin/AdminSidebar.tsx`
- Desktop: icon-only at `lg` (64px), full labels at `xl` (240px).
- Mobile: slide-out overlay with the same nav.
- Active link state and hover styles.

### Theme / Tokens (admin only)

Defined under `.admin-root` in `styles/globals.css`:

- `--admin-bg`: `#0F1419`
- `--admin-surface`: `#1A2332`
- `--admin-surface-hover`: `#1E2A3A`
- `--admin-border`: `#2A3A4A`
- `--admin-text`: `#E8ECF0`
- `--admin-text-muted`: `#8899AA`
- `--admin-accent`: `#D6336C`
- `--admin-accent-hover`: `#E8477E`
- `--admin-success`: `#38A169`
- `--admin-warning`: `#ECC94B`
- `--admin-error`: `#E53E3E`
- `--admin-info`: `#4299E1`

### Global admin utilities

- `.admin-card`: dark card surface
- `.admin-input`: dark input styles
- `.admin-scrollbar`: styled scrollbars
- Animations: sparkline draw, bar grow, pulse, slide-in
- `@media print`: light theme, hide nav + buttons

## Data Model and Generation

Primary source: `lib/mock-admin-data.ts`.

### Deterministic generator

- Seeded PRNG for consistency between renders.
- 18 months of data: March 2026 → August 2027.
- No `Math.random()`.

### Data volumes

- Quotes: 150
- Policies: derived from converted quotes
- Placements: 22
- Amendments: 12
- Renewals: 8
- Claims: 3 (distributed across policies)

### Entities

- `Quote`
  - Status: converted | pending | abandoned | expired
  - Parent details
  - 1–2 children
  - Products: parent cover (always), full-term upgrade, student cover, expenses cover
  - `premiumCalculation`: gross, gst, stamp duty, stamp duty rate, total payable
  - Source channel mix
- `Policy`
  - Linked to quote (quoteId + policyId)
  - Premium breakdown + commission
  - Payment history (monthly/annual)
  - Claims array (3 total across all policies)
- `Placement`
  - Product D purchases (level 1/2/3)
  - Status: active | expired | claimed
- `Amendment`
  - Types: add/remove child, add product, upgrade full-term, change school, update fee, change payment frequency
- `Renewal`
  - Status: renewed | pending | declined
- `ActivityItem`
  - Combined feed from quotes, policies, placements, amendments, renewals, claims
- `dashboardStats`
  - Aggregates: GWP, commission, stamp duty, GST, conversion rate, averages
  - Monthly rollups
  - By state, by source, by product

### Taxes & Commission

`lib/insurance-tax.ts`:

- GST: 10%
- Commission: 35%
- State stamp duty rates (GST-inclusive)
- `calculateInsuranceTaxes` and `calculateCommission`

## Shared Components

- `components/admin/KpiCard.tsx` — count-up + sparkline
- `components/admin/Sparkline.tsx` — SVG sparkline
- `components/admin/BarChart.tsx` — bar chart + optional line overlays
- `components/admin/DataTable.tsx` — sortable grid table (min width, hover)
- `components/admin/StatusBadge.tsx` — status pill colors
- `components/admin/DateRangeSelector.tsx` — presets + custom range
- `components/admin/SlidePanel.tsx` — right-side detail drawer

## Page Behavior Highlights

### Dashboard (`/admin`)

- KPI cards (GWP, policies, conversion rate, quotes, commission, avg premium).
- Revenue overview bar chart + cumulative line.
- Recent activity feed (20 items).
- Period snapshot stats.
- Policies by state (horizontal bars).
- Product uptake (bars).
- “Last updated” updates every 60 seconds.

### Quotes (`/admin/quotes`)

- Filters: status, date, source, state, search.
- Summary line (converted/pending/abandoned/expired + GWP).
- Sortable table.
- Slide-out detail panel.
- CSV export.

### Policies (`/admin/policies`)

- Filters: status, date, state, search.
- Summary line: active count, GWP, renewals due, claims.
- Table with product pills.
- Slide-out detail with premium breakdown, payments, claims, amendments.

### Customers (`/admin/customers`)

- Directory from quotes + policies.
- Detail panel: profile, lifetime value, quote history, policy history, amendments, payments, notes.

### Financials (`/admin/financials`)

- Date range (full selector).
- KPI cards: GWP, commission, net to underwriter, stamp duty.
- Stamp duty table by state.
- Revenue split bar.
- Monthly GWP trend with cumulative overlays.
- Product mix revenue table.
- Payment frequency split.

### Reports (`/admin/reports`)

- Date range presets and custom range.
- Generate Report action.
- KPI summary, MoM table, channel performance, geo analysis, amendments & renewals.
- CSV export + print.

### Settings (`/admin/settings`)

- Rate configuration (commission, GST, product rates, discounts, loadings).
- Stamp duty table.
- Admin users list.
- Business details.

## Interaction / Animation Rules

- KPI count-up (500ms) on load.
- Sparkline draw-on (800ms).
- Bar grow (400ms, staggered).
- Activity slide-in (200ms, staggered).
- Pulsing green status dots.
- Table row hover with left magenta border.
- `prefers-reduced-motion` respected.

## Print Handling

- `@media print` in `styles/globals.css`
- Light background, dark text.
- `.admin-print-hide` hides nav/buttons.
- `.admin-print-only` shows print header.

## Files Map

- `lib/mock-admin-data.ts`
- `lib/insurance-tax.ts`
- `components/admin/*`
- `app/admin/*`
- `styles/globals.css` (admin theme + animations + print rules)

## Known Constraints

- No real auth.
- No backend persistence.
- No charting library (SVG only).
- Mock data only.

## Suggested Next Steps

- Add proper auth + role gating.
- Connect to real data source (Supabase/Postgres).
- Replace mock CSV export with server-generated exports.
- Add detail pages for quote/policy/cust IDs (`/admin/quotes/[id]`, etc.).
