-- Run this in the Supabase SQL Editor.
-- Adds: brochure PDF support on properties, video support on gallery.

alter table public.properties add column if not exists brochure_url text;
alter table public.gallery add column if not exists media_type text not null default 'photo';

-- The "brochures" storage bucket has already been created (public). These policies
-- let the public download brochures and let logged-in admins upload/replace/delete them.
create policy "Public can view brochures"
on storage.objects for select
using ( bucket_id = 'brochures' );

create policy "Authenticated can manage brochures"
on storage.objects for all
using ( bucket_id = 'brochures' and auth.role() = 'authenticated' )
with check ( bucket_id = 'brochures' and auth.role() = 'authenticated' );
