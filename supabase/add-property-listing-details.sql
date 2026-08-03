-- Extra listing details for the property detail page:
-- registry/possession info (buyers' first questions) and an urgency counter.

alter table public.properties add column if not exists registry_type text;
alter table public.properties add column if not exists possession_status text;
alter table public.properties add column if not exists plots_left integer;
