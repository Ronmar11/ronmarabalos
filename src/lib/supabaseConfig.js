// Connection settings only -- deliberately no supabase-js import, so the public
// site can read content without shipping the full client library.

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();

// Supabase's newer "publishable" key and the legacy "anon" key both work.
// Either is safe in the browser: access is enforced by row-level security in
// the database, not by keeping this key secret.
export const SUPABASE_KEY = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

function checkUrl(value) {
  if (!value) return 'VITE_SUPABASE_URL is missing.';
  if (/^sb_(secret|publishable)_/.test(value)) {
    return 'VITE_SUPABASE_URL contains an API key instead of the project URL. It should look like https://your-project.supabase.co';
  }
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error();
    return '';
  } catch {
    return `VITE_SUPABASE_URL isn't a valid URL. It should look like https://your-project.supabase.co`;
  }
}

/** Human-readable reason Supabase can't be used, or '' when it's set up. */
export const supabaseConfigProblem =
  checkUrl(rawUrl) || (SUPABASE_KEY ? '' : 'VITE_SUPABASE_PUBLISHABLE_KEY is missing.');

export const SUPABASE_URL = supabaseConfigProblem ? '' : rawUrl.replace(/\/+$/, '');

export const isSupabaseConfigured = !supabaseConfigProblem;

export const STORAGE_BUCKET = 'portfolio';
