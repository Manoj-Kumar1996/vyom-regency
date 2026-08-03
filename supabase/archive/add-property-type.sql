-- Run this in the Supabase SQL Editor.
-- Adds an explicit property_type field so admin can mark a listing as
-- "Individual Land" from a dropdown instead of the site guessing based on
-- whether the property NAME happens to contain the word "individual".

alter table public.properties add column if not exists property_type text not null default 'project';

-- Backfill existing rows using the same name-matching heuristic the site used before,
-- so nothing currently classified as "individual" changes behavior after this migration.
update public.properties
set property_type = 'individual'
where name ilike '%individual%' or name ilike '%premium farm land%';
