import { createContext, useContext, useEffect, useState } from 'react';
import { SUPABASE_KEY, SUPABASE_URL, isSupabaseConfigured, supabaseConfigProblem } from '../lib/supabaseConfig.js';
import { CONTENT_TABLES, defaultRowsWithIds } from './defaults.js';
import { buildContent } from './buildContent.js';

const ContentContext = createContext(null);

// Bump the version whenever buildContent's output shape changes, so an old
// cached copy is ignored instead of crashing the page.
const CACHE_KEY = 'portfolio-content:v1';
const FETCH_TIMEOUT_MS = 6000;

export const DEFAULT_CONTENT = buildContent(defaultRowsWithIds());

// Half-filled .env: say why the site is showing built-in content.
if (!isSupabaseConfigured && (import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)) {
  console.warn(`Supabase not connected: ${supabaseConfigProblem} Showing built-in content.`);
}

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    return cached && typeof cached.settings === 'object' ? cached : null;
  } catch {
    return null;
  }
}

function writeCache(content) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch {
    // Storage full or blocked (private mode) -- caching is only an optimisation.
  }
}

/** Called by the admin after a save, so this browser shows the change immediately. */
export function clearContentCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // Storage blocked -- nothing cached, nothing to clear.
  }
}

// Reading public tables is one GET per table against Supabase's REST API, so
// the public page does it with plain fetch rather than the ~60 KB client.
// New "sb_publishable_" keys go in the apikey header only; legacy anon keys
// are JWTs and are also sent as the bearer token.
function restHeaders() {
  const headers = { apikey: SUPABASE_KEY, Accept: 'application/json' };
  if (!SUPABASE_KEY.startsWith('sb_')) headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  return headers;
}

async function fetchTable(table) {
  const order = table === 'site_settings' ? '' : '&order=sort_order.asc,created_at.asc';
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*${order}`, { headers: restHeaders() });
  if (!response.ok) throw new Error(`Loading ${table} failed: ${response.status} ${response.statusText}`);
  return response.json();
}

/** Fetches every content table in parallel; rejects if any request fails. */
export async function fetchContent() {
  const results = await Promise.all(CONTENT_TABLES.map(fetchTable));
  return buildContent(Object.fromEntries(CONTENT_TABLES.map((table, i) => [table, results[i]])));
}

/**
 * Supplies page content. Stale-while-revalidate: a returning visitor sees the
 * last cached content instantly while fresh content loads. A first-time
 * visitor sees a brief loader. If Supabase is unconfigured, slow or down, the
 * built-in defaults are shown so the page is never blank.
 */
export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => (isSupabaseConfigured ? readCache() : DEFAULT_CONTENT));

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let cancelled = false;
    const fallback = () => !cancelled && setContent((current) => current ?? DEFAULT_CONTENT);
    const timer = setTimeout(fallback, FETCH_TIMEOUT_MS);

    fetchContent()
      .then((fresh) => {
        if (cancelled) return;
        setContent(fresh);
        writeCache(fresh);
      })
      .catch((error) => {
        console.warn('Could not load content from Supabase; showing built-in content.', error);
        fallback();
      })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (!content) return <PageLoader />;
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const content = useContext(ContentContext);
  if (!content) throw new Error('useContent must be used inside <ContentProvider>');
  return content;
}

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center font-mono text-sm text-muted dark:text-muted-dark">
      <span className="text-prime">~/ronmar $</span>
      <span className="ml-2">loading</span>
      <span className="ml-1 inline-block h-4 w-2 animate-blink bg-prime" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
