# Swea Fastighetsservice

Astro + Vue rewrite of the original landing page in `swea-fastighetsservice.html`.

## What changed

- Content is now centralized in `content/site.json` and loaded from `src/data/site.ts`.
- The mobile nav and contact form are Vue components.
- Theme colors are exposed as CSS variables from one place.
- The style guide section only appears in development to keep the public page clean.
- Tina CMS schema is configured in `tina/config.ts` so titles, texts and images are editable from CMS.

## Run

```bash
npm install
npm run dev
```

## Tina CMS

1. Install dependencies:

```bash
npm install
```

2. Start Astro + Tina editor:

```bash
npm run dev:tina
```

3. Open the Tina admin UI at `/admin/index.html`.

4. Editable source document:

- `content/site.json`

## Tina Cloud (for deployment)

Set environment variables in your host (for example on Netlify/Vercel):

- `TINA_CLIENT_ID`
- `TINA_TOKEN`
- `GITHUB_REF_NAME` (optional, branch fallback)

Build command for production with Tina admin:

```bash
npm run build:tina
```