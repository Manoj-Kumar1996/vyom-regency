-- Rename admin_profiles roles: super_admin -> admin, staff -> editor

alter table public.admin_profiles drop constraint if exists admin_profiles_role_check;

update public.admin_profiles set role = 'admin' where role = 'super_admin';
update public.admin_profiles set role = 'editor' where role = 'staff';

alter table public.admin_profiles add constraint admin_profiles_role_check
  check (role in ('admin', 'editor'));

alter table public.admin_profiles alter column role set default 'editor';

create or replace function public.handle_new_admin_user()
returns trigger as $$
begin
  insert into public.admin_profiles (id, email, role)
  values (new.id, new.email, 'editor')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;
