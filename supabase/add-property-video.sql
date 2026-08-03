-- Single featured "Project Video" per property (separate from gallery_urls,
-- which can already hold multiple mixed photos/videos)

alter table public.properties add column if not exists video_url text;
