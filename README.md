# Swea Fastighetsservice

Astro + Vue rewrite of the original landing page in `swea-fastighetsservice.html`.

## What changed

- Content is now centralized in `content/site.json` and loaded from `src/data/site.ts`.
- The mobile nav and contact form are Vue components.
- Theme colors are exposed as CSS variables from one place.
- The style guide section only appears in development to keep the public page clean.
- A custom editor is available at `/adm-in-brand` with live preview and Supabase-backed online updates.

## Run

```bash
npm install
npm run dev
```

## Adm-in-brand (Supabase)

1. Create a Supabase project and set env vars from `.env.example`.

2. Create table and policies (SQL):

```sql
create table if not exists public.site_content (
	key text primary key,
	content jsonb not null,
	updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "public_read_site_content"
on public.site_content
for select
to anon, authenticated
using (true);

create policy "authenticated_update_site_content"
on public.site_content
for insert
to authenticated
with check (true);

create policy "authenticated_modify_site_content"
on public.site_content
for update
to authenticated
using (true)
with check (true);
```

3. Seed initial content row:

```bash
npm run dev
```

Then insert one row in Supabase SQL editor:

```sql
insert into public.site_content (key, content)
values ('main', '{}'::jsonb)
on conflict (key) do nothing;
```

4. Create an admin user in Supabase Authentication (email/password).

5. Open `/adm-in-brand`, login, click on the preview and save changes.

## Deployment

Set these variables in your host:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_SITE_CONTENT_KEY` (optional, defaults to `main`)

Build command:

```bash
npm run build
```