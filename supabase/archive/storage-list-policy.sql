-- Public buckets allow direct file downloads by URL automatically, but the
-- .list() API (used by the Gallery page, HomeGallery, and admin Media Manager)
-- goes through RLS on storage.objects separately. Without this policy, .list()
-- silently returns an empty array even though the files exist and are downloadable.

create policy "Public can list objects in public buckets"
on storage.objects for select
using ( bucket_id in ('hero-banners', 'gallery', 'properties', 'testimonials', 'blog') );

-- Admin (logged in) needs to upload/replace/delete files via the Media Manager,
-- Property/Testimonial/Blog editors, and Hero Banner manager.
create policy "Authenticated can upload to public buckets"
on storage.objects for insert
with check ( bucket_id in ('hero-banners', 'gallery', 'properties', 'testimonials', 'blog') and auth.role() = 'authenticated' );

create policy "Authenticated can update objects in public buckets"
on storage.objects for update
using ( bucket_id in ('hero-banners', 'gallery', 'properties', 'testimonials', 'blog') and auth.role() = 'authenticated' );

create policy "Authenticated can delete objects in public buckets"
on storage.objects for delete
using ( bucket_id in ('hero-banners', 'gallery', 'properties', 'testimonials', 'blog') and auth.role() = 'authenticated' );
