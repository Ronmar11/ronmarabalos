-- =============================================================================
-- Adds the "Show on landing page" switch for projects, and turns it on for the
-- first three (in their current order) so the carousel looks the same as now.
-- Run once in the SQL Editor. Safe to re-run: if any project is already
-- featured, it changes nothing.
-- =============================================================================

alter table public.projects add column if not exists featured boolean not null default false;

update public.projects
set featured = true
where id in (select id from public.projects order by sort_order, created_at limit 3)
  and not exists (select 1 from public.projects where featured);

-- Should list your projects; the first three marked true.
select title, featured from public.projects order by sort_order, created_at;
