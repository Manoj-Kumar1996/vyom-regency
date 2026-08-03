-- Admin roles: restrict which admin users can see the Content & Media tabs
-- on the property editor. Every logged-in admin defaults to 'staff'; only
-- 'super_admin' rows unlock the full editor.

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'staff' check (role in ('super_admin', 'staff')),
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

-- Each admin can read only their own role.
create policy "Admins can read own profile" on public.admin_profiles
  for select using (auth.uid() = id);

-- Auto-create a 'staff' profile row whenever a new admin user signs up.
create or replace function public.handle_new_admin_user()
returns trigger as $$
begin
  insert into public.admin_profiles (id, email, role)
  values (new.id, new.email, 'staff')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_admin_user_created on auth.users;
create trigger on_admin_user_created
  after insert on auth.users
  for each row execute function public.handle_new_admin_user();

-- Backfill profile rows for any admin users that already exist.
insert into public.admin_profiles (id, email, role)
select id, email, 'staff' from auth.users
on conflict (id) do nothing;

-- Promote yourself to super_admin (edit the email below to match your login).
update public.admin_profiles set role = 'super_admin'
where email = 'admin@gmail.com';
