import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;
const CONTENT_KEY = process.env.PUBLIC_SITE_CONTENT_KEY || 'main';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.log('[prebuild] No Supabase env vars found, using existing site.json');
  process.exit(0);
}

try {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/site_content?key=eq.${encodeURIComponent(CONTENT_KEY)}&select=content&limit=1`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  if (!res.ok) {
    console.warn('[prebuild] Supabase error:', res.status, '— using existing site.json');
    process.exit(0);
  }

  const rows = await res.json();
  const content = rows?.[0]?.content;

  if (!content || typeof content !== 'object') {
    console.log('[prebuild] No content in Supabase yet — using existing site.json');
    process.exit(0);
  }

  const outPath = resolve(__dirname, '../content/site.json');
  writeFileSync(outPath, JSON.stringify(content, null, 2), 'utf-8');
  console.log('[prebuild] ✓ content/site.json updated from Supabase');
} catch (err) {
  console.warn('[prebuild] Failed to fetch from Supabase:', err.message, '— using existing site.json');
  process.exit(0);
}
