# Changelog

Notable changes to the Vyom Regency website and admin panel.

## 2026-07-08

### Added
- Local dev environment set up (pnpm, dependencies, `.claude/launch.json` dev server config).
- New Supabase project migration: full schema, RLS policies, and storage buckets recreated from the original project (`supabase/new-project-setup.sql`, `supabase/fix-identity-columns.sql`, `supabase/storage-list-policy.sql`).
- All table data (properties, testimonials, leads, blog posts, gallery, site settings) and storage files (hero banner, gallery photos, property images) migrated from the old Supabase project to the new one.
- Sample/dummy data seeded for Properties, Testimonials, and Blog Posts.
- Deployed to Vercel on the `vyom-regency-proj` branch (GitHub: `iamabhishekgarg/vyom-regency-proj`).
- `src/lib/blog.ts` — new Supabase-backed data layer for all blog reads (posts, categories, tags).

### Fixed
- **Admin panel had no login enforcement** — any `/admin/*` page was publicly viewable without authentication; the layout checked the session only to display the user's email, never redirected. Now redirects to `/admin/login` when unauthenticated.
- **Blog pages were 100% disconnected from the database** — `/blog`, `/blog/[slug]`, category, and tag pages all read from a hardcoded static fixture file instead of Supabase, so admin-created posts never appeared on the live site.
- **Blog admin update bug** — editing an existing post sent `id` inside the update payload instead of as a filter, silently failing to save changes.
- **Blog admin category bug** — the category dropdown only saved `categorySlug`, leaving the human-readable category name blank on every new post.
- **Blog pages served stale cached data on Vercel** — pages were statically generated once at build time with whatever data existed then; new/edited posts never showed up until the next deploy. Forced dynamic rendering (`export const dynamic = "force-dynamic"`) on all four blog routes.
- **Blog single-post page missing header/footer** — `/blog/[slug]` rendered only the article content with no site navigation or footer.
- **Every testimonial submission via the admin panel was silently failing** — the form sent a `date` field that doesn't exist in the `testimonials` table schema (only `created_at` does), causing every insert/update to fail with a swallowed error.
- **Hero Banner upload could create duplicate rows** — used an unscoped `upsert()` instead of targeting the known row by `id`, risking a second `site_settings` row and the public site silently falling back to the default image.
- **Gallery page missing header/footer entirely** — `Header`/`Footer` were imported but never rendered in any of the three return paths (loading, empty, populated state).
- **Contact page inconsistent styling** — used a plain white heading instead of the green gradient hero banner used on every other page.
- **12 broken internal links** — header "Contact" nav link, footer "About Us"/"Our Estates" links (broken slug generator), and 10 dead-anchor links in the search bar (`/estates#...`, `/location#...`, `/#amenities`) that pointed to sections that don't exist.
- **Sticky bottom CTA bar's "Book Site Visit" link broken on non-homepage pages** — used a relative `#lead-form` anchor instead of `/#lead-form`, so it silently did nothing anywhere except the homepage.
- **Hero button height/alignment bugs** — the "Call Now" button in the hero rendered 28px taller than its sibling "Schedule Site Visit" button due to a flexbox `align-items: stretch` default, and the two buttons' tops didn't line up.
- **Founder page "Journey" timeline had no connecting line** between the year milestones — added the missing visual connector.
- **Media Manager crashed with `Cannot read properties of undefined (reading 'writeText')`** when accessed over a non-secure (HTTP/LAN IP) connection, since the Clipboard API is unavailable outside secure contexts. Added a safe fallback using `document.execCommand`.
- Gallery/media `.list()` API returned empty results despite files existing — public storage bucket flags don't grant `storage.objects` list permission on their own; added the missing RLS policy.

### Changed
- Standardized primary CTA button shape to pill (`rounded-full`) across the Hero section, Header, and sticky bottom bar for visual consistency.
- README rewritten with setup, deployment, and design-system documentation (this file didn't exist before).
