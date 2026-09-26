-- =============================================================================
-- Portfolio CMS schema for Supabase.
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run: every statement is idempotent.
--
-- Security model
--   * Every content table is world-readable (the public site needs it).
--   * Writes are allowed only for users listed in public.admin_users.
--     Being signed in is NOT enough -- so even if sign-ups were ever left on,
--     a stranger's account still couldn't change anything.
--   * admin_users itself is not reachable through the API at all.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Admin registry + helpers
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id  uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[A-Za-z0-9_.-]{3,32}$'),
  created_at timestamptz not null default now()
);

-- RLS on with no policies = no API access. Only the definer functions below read it.
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- Lets the login form accept a username: returns the matching admin's login
-- email, or null. Only admin usernames resolve, and the password is still
-- required to sign in (Supabase Auth rate-limits attempts).
create or replace function public.admin_login_email(p_username text)
returns text
language sql
stable
security definer
set search_path = public, auth
as $$
  select u.email
  from public.admin_users a
  join auth.users u on u.id = a.user_id
  where lower(a.username) = lower(trim(p_username))
  limit 1;
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.admin_login_email(text) from public;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.admin_login_email(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

-- Free-form page text keyed by name (hero name, tagline, section titles...).
create table if not exists public.site_settings (
  key        text primary key check (key ~ '^[a-z0-9_]{1,64}$'),
  value      text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_roles (
  id         uuid primary key default gen_random_uuid(),
  text       text not null check (char_length(text) between 1 and 80),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.about_paragraphs (
  id         uuid primary key default gen_random_uuid(),
  body       text not null check (char_length(body) between 1 and 2000),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quick_facts (
  id         uuid primary key default gen_random_uuid(),
  key        text not null check (char_length(key) between 1 and 40),
  value      text not null check (char_length(value) between 1 and 200),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 60),
  experience text not null default '',
  icon_class text not null default '',   -- icon-font classes, e.g. "devicon-java-plain colored"
  icon_url   text not null default '',   -- or an image URL; used when icon_class is empty
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 120),
  description text not null default '',
  file_name   text not null default '',  -- shown in the preview's window bar
  media       text not null default 'wide' check (media in ('wide', 'dual', 'portrait')),
  tags        text[] not null default '{}',
  images      jsonb not null default '[]' check (jsonb_typeof(images) = 'array'),  -- [{src, dark_src, alt}]
  links       jsonb not null default '[]' check (jsonb_typeof(links) = 'array'),   -- [{type, label, url}]
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.video_projects (
  id            uuid primary key default gen_random_uuid(),
  thumbnail_url text not null check (char_length(thumbnail_url) > 0),
  url           text not null default '',
  alt           text not null default '',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.social_links (
  id         uuid primary key default gen_random_uuid(),
  placement  text not null check (placement in ('hero', 'contact')),
  label      text not null check (char_length(label) between 1 and 60),
  icon_class text not null default '',
  url        text not null check (char_length(url) > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Grants + row-level security: public read, admin-only write
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'hero_roles', 'about_paragraphs', 'quick_facts',
    'skills', 'projects', 'video_projects', 'social_links'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);

    -- Table privileges are the first gate; RLS below is the second.
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('revoke insert, update, delete on public.%I from anon', t);

    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);

    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format(
      'create policy "admin insert" on public.%I for insert to authenticated with check (public.is_admin())', t);

    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format(
      'create policy "admin update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);

    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format(
      'create policy "admin delete" on public.%I for delete to authenticated using (public.is_admin())', t);
  end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- Image storage: public bucket, admin-only uploads
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio', 'portfolio', true, 5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public buckets serve files by URL without RLS, so reads need no policy for
-- visitors; the select policy only lets the admin list/replace/remove files.
drop policy if exists "portfolio admin select" on storage.objects;
create policy "portfolio admin select" on storage.objects
  for select to authenticated using (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "portfolio admin insert" on storage.objects;
create policy "portfolio admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "portfolio admin update" on storage.objects;
create policy "portfolio admin update" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio' and public.is_admin())
  with check (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "portfolio admin delete" on storage.objects;
create policy "portfolio admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio' and public.is_admin());
