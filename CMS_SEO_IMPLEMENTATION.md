# CMS + SEO/AEO/GEO Implementation — What Was Done & How to Verify

This documents everything implemented against `Website_CMS_SEO_Improvement_Requirements.md`,
and gives you a step-by-step checklist to verify each feature in the UI.

## 0. Prerequisite — apply the database schema

Nothing below will work until the new tables/columns exist. This was **not** run against your
live Supabase project — you need to do it yourself:

1. Open your Supabase project → **SQL Editor**.
2. Open `supabase/schema.sql` from this repo, copy the whole file, paste it into the SQL Editor, and run it.
   - It's idempotent (`create table if not exists`, `add column if not exists`), so it's safe to run even if some of it already exists.
3. Confirm in **Table Editor** that these new tables exist: `cms_pages`, `menu_items`, `redirects`, `faq_categories`.
4. Confirm these existing tables gained new columns: `page_seo`, `properties`, `blog_posts` (canonical/robots/OG/JSON-LD columns), `gallery` (`alt_text`, `title`, `description`), `faqs` (`category_id`, `page_route`, `is_active`), `settings` (analytics/script/schema/robots columns).

If you skip this step, admin pages that read/write these tables (SEO editor, FAQ manager, Media, CMS Pages, Menus, Redirects, Settings) will show errors or fail to save.

---

## 1. SEO meta parity (canonical, robots, Open Graph, Twitter)

**What changed:** Every static page (Home, About, Founder, Contact, Gallery, Estates, Blog listing) plus every property and blog post detail page now supports canonical URL, index/follow toggles, Open Graph title/description/image, and Twitter card — editable in admin, rendered in `<head>`.

**Verify:**
1. Go to `/admin/seo`. Each page card now has: Canonical URL, Index/Follow checkboxes, OG Title/Description/Image, Twitter Card type, Custom JSON-LD box, and a live Google-style SERP preview.
2. Edit the **About** page's Meta Title, save, then open `/about` in a new tab → View Source (Ctrl+U) → confirm `<title>` and `<meta name="description">` match.
3. In the same view-source, confirm `<link rel="canonical" href="...">`, `<meta property="og:title">`, `<meta name="twitter:card">` are present.
4. Uncheck "Index" for a page, save, reload, view-source → confirm `<meta name="robots" content="noindex,...">`.
5. Open `/admin/properties` → edit any property → SEO section (in the Basic Details tab) → confirm the same Canonical/Robots/OG/Custom JSON-LD fields are there, plus a SERP preview.
6. Same check in `/admin/blog` → edit a post → scroll to the SEO section at the bottom of the form.

---

## 2. Structured data / Schema markup (JSON-LD)

**What changed:** Organization/LocalBusiness + Website schema on every page (site-wide, from Settings). WebPage + Breadcrumb on every page. BlogPosting on blog posts. FAQPage wherever FAQs are shown. A custom JSON-LD field everywhere as an escape hatch.

**Verify:**
1. Open any page → View Source → search for `application/ld+json`. You should see at least 2 `<script type="application/ld+json">` blocks (Organization/LocalBusiness + Website site-wide, plus WebPage/Breadcrumb per page).
2. On a blog post (`/blog/<slug>`), confirm an additional block with `"@type": "BlogPosting"`.
3. Copy any block's JSON and paste it into [Google's Rich Results Test](https://search.google.com/test/rich-results) or [schema.org validator](https://validator.schema.org/) → confirm no errors.
4. Go to `/admin/settings` → **Schema / Organization** tab → set Legal Name, Logo URL, Latitude/Longitude → save → reload homepage → confirm the Organization JSON-LD block picks up the new values.
5. Try entering invalid text (e.g. `not json`) into any "Custom JSON-LD" field in admin → save → reload the live page → confirm the page still renders fine (invalid JSON is silently ignored, not a crash).

---

## 3. FAQs — categories, page-association, schema

**What changed:** FAQs can now be assigned to a category and to a specific page (or "Global" to show everywhere, matching old behavior). `/admin/faq` has search + category filter. FAQPage JSON-LD is generated wherever FAQs are shown.

**Verify:**
1. Go to `/admin/faq` → click "+ New Category", create one (e.g. "Pricing") → confirm it appears in the category dropdown on every FAQ row.
2. Add a new FAQ, set its "page" dropdown to **About** (not Global), save.
3. Visit `/about` → this FAQ should **not** appear there yet (About page doesn't render an FAQ block by default — this only affects CMS pages and Home, see below). Visit the **Home** page (`/`) → confirm it does **not** show this About-only FAQ.
4. Set a FAQ's page to **Global (all pages)** → confirm it now shows on Home.
5. Use the search box and category filter at the top of `/admin/faq` to confirm filtering works.
6. View source on `/` → search for `FAQPage` → confirm the JSON-LD includes your active global FAQs.

---

## 4. Image SEO (alt text, title, description)

**What changed:** Gallery images have real Alt Text/Title/Description fields, editable from Media admin. The public Gallery page now actually reads from the database (previously it always rendered empty `alt=""` regardless of what was set).

**Verify:**
1. Go to `/admin/media` → select the **Gallery** category tab.
2. Hover over any image → click the pencil icon (top-left) → fill in Alt Text → Save Details.
3. If an image has no alt text, you'll see a small "No alt text set" warning under it in the grid.
4. Visit `/gallery` → open browser DevTools → Inspect the image → confirm its `alt` attribute matches what you set.
5. Upload a brand-new image via the upload box on the Gallery tab → confirm it appears in the grid and can also have alt text set the same way.

---

## 5. Technical SEO — sitemap, robots.txt, redirects, analytics

**Sitemap** (`/sitemap.xml`):
1. Visit `https://<your-domain>/sitemap.xml` (or `http://localhost:3000/sitemap.xml` locally).
2. Confirm it's valid XML listing: all static pages, every property (`/estates/<slug>`), every blog post (`/blog/<slug>`), and every **published** CMS page.

**Robots.txt** (`/robots.txt`):
1. Visit `/robots.txt` → confirm you see `Disallow: /admin`, `Disallow: /api`, and a `Sitemap:` line by default.
2. Go to `/admin/settings` → **Robots.txt** tab → paste custom content → save → reload `/robots.txt` → confirm it now returns exactly what you typed.
3. Clear the override field, save, reload → confirm it reverts to the generated default.

**Redirects:**
1. Go to `/admin/redirects` → click "New Redirect" → From: `/old-test-path`, To: `/about`, Type: 301 → Save.
2. Visit `/old-test-path` directly in the browser → confirm it redirects you to `/about`.
3. Toggle "Active" off, save, revisit `/old-test-path` → confirm it no longer redirects (may take up to 60 seconds due to a short cache — reload again after a minute if it still redirects immediately).
4. Confirm `/admin` and `/api/*` routes are never affected by redirects (they're excluded).

**Analytics & scripts:**
1. Go to `/admin/settings` → **Analytics & Scripts** tab.
2. Paste a dummy GA4 ID like `G-TEST12345` → save → reload any public page → View Source → confirm a `gtag(...)` script referencing `G-TEST12345` appears.
3. Clear the field, save, reload → confirm the script is completely gone (not just empty).
4. Repeat for GTM Container ID (look for the GTM script + a `<noscript><iframe>` right after `<body>`) and Meta Pixel ID (`fbq('init', ...)`).
5. Set a GSC Verification Code → reload → View Source → confirm `<meta name="google-site-verification" content="...">` is in `<head>`.

---

## 6. CMS Pages (the "page builder")

**What changed:** You can now create/edit/delete simple pages (title, rich-text body, full SEO/schema fields) without touching code. They render at `/<slug>`.

**Verify:**
1. Go to `/admin/cms-pages` → "New Page".
2. Title: "Careers", leave slug auto-generated (`careers`), write some body content with the rich-text editor, set Status to **Published**, fill in a Meta Title/Description → Create Page.
3. Visit `/careers` → confirm the title and body render, and View Source shows the correct `<title>`, meta description, canonical, and WebPage/Breadcrumb JSON-LD.
4. Go back to `/admin/cms-pages` → edit the page → change Status to **Draft** → Save.
5. Revisit `/careers` → confirm it now 404s (drafts aren't publicly visible).
6. Try creating a page with slug `about` → confirm the form blocks it with a "reserved route" warning (this protects against creating an unreachable page — the real `/about` always wins routing regardless).
7. Delete the test page from the list.

---

## 7. Dynamic Menus

**What changed:** Header and footer navigation can be managed from admin. If no menu items are configured, the site falls back to the original hardcoded nav (so nothing breaks by default).

**Verify:**
1. Go to `/admin/menus` → you'll see Header/Footer tabs, both empty by default (meaning the site is currently using the original hardcoded nav — confirm this by checking the live header now).
2. Click "Header" tab → "Add Menu Item" → Label: "Careers", Link Type: "CMS Page" → select a published CMS page (create one first per section 6 if needed) → Save header menu.
3. Reload the homepage → confirm "Careers" now appears in the header nav, linking to `/careers`.
4. Add another item with Link Type "External URL", check "New tab" → save → confirm it opens in a new tab and has `rel="noopener noreferrer"` (inspect the link element).
5. Delete all header menu items and save → confirm the header reverts to the original hardcoded links (no empty nav).
6. Repeat for the Footer tab, checking the "Quick Links" column in the site footer.

---

## 8. Follow-up UI fixes (post-initial-pass)

A few polish/bug fixes made after the initial implementation, in case you're auditing the diff:

- **Admin sidebar scrollbar**: replaced the default OS scrollbar on the `/admin` nav with a slim, theme-matched one (`.scrollbar-thin` in `globals.css`, applied in `admin/layout.tsx`).
- **`/admin/login` redesign**: added the real logo, mail/lock icons on inputs, a show/hide password toggle, and switched the background from `min-h-screen` (document-flow height, which could fall short and show white below it) to `fixed inset-0` (always pinned to the exact viewport — no gap possible regardless of page content height).
- **Menus admin — "add one more" bug**: previously, if you saved even one new menu item, it would **replace** the entire live nav (which falls back to a hardcoded list when the table is empty) instead of adding to it. `/admin/menus` now seeds the editor with the current live nav when nothing's saved yet, so adding a new row and saving preserves the existing links. Shared default lists now live in `src/lib/menu.ts` (`DEFAULT_HEADER_LINKS`, `DEFAULT_FOOTER_LINKS`) so the header/footer components and the admin editor can't drift apart.
- **Menus admin — bad default selection**: new rows previously defaulted their "Existing Page" dropdown to Home (confusing, since Home is usually already in the list). New rows now start on a "Select a page" placeholder, and Save is blocked with a clear error if any row's page/CMS-page/URL field was left unset.

**Verify:** reload `/admin` and check the sidebar scrollbar looks slim; reload `/admin/login` and confirm no white gap below the green background at any window size; reload `/admin/menus`, confirm existing links are pre-populated, add one more item, and confirm the placeholder shows "Select a page" until you choose.

## Known limitation (not a bug in the code)

Running `pnpm build` on this Windows machine fails at the very last step (copying traced files
into `.next/standalone`) with `EPERM: operation not permitted, symlink`. This is a Windows/pnpm
permission limitation — Windows requires Developer Mode or admin rights to create symlinks — and
happens *after* TypeScript compiled and all 36 routes statically generated successfully, so it
does not indicate a problem with the code. Enable Developer Mode (Settings → Update & Security →
For Developers) or run the build as Administrator, or simply build on your Linux/Vercel deploy
target, and this step will succeed.
