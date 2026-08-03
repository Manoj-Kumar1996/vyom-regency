-- SEO fields: per-property, per-blog-post meta overrides + a page_seo table
-- for static pages (Home, About, Contact, Gallery, Estates listing, etc.)

alter table public.properties add column if not exists meta_title text;
alter table public.properties add column if not exists meta_description text;
alter table public.properties add column if not exists focus_keyword text;

alter table public.blog_posts add column if not exists meta_title text;
alter table public.blog_posts add column if not exists meta_description text;
alter table public.blog_posts add column if not exists focus_keyword text;

create table if not exists public.page_seo (
  route text primary key,
  meta_title text,
  meta_description text,
  focus_keyword text,
  updated_at timestamptz not null default now()
);

alter table public.page_seo enable row level security;

create policy "Public can view page seo" on public.page_seo
  for select using (true);

create policy "Authenticated can manage page seo" on public.page_seo
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
