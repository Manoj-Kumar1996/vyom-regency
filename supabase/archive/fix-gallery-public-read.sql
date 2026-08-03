-- Run this in the Supabase SQL Editor.
-- The gallery table was originally admin-only (photos are served via Storage.list()
-- instead, which is public). Now that videos live in this table and the public
-- Gallery/HomeGallery pages read video rows with the anon key, we need a public
-- SELECT policy too — otherwise videos silently don't show for visitors.

create policy "Public can view gallery rows"
on public.gallery for select
using (true);
