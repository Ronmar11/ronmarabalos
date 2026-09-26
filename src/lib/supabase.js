import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL, isSupabaseConfigured } from './supabaseConfig.js';

export { isSupabaseConfigured, supabaseConfigProblem, STORAGE_BUCKET } from './supabaseConfig.js';

/**
 * Full Supabase client (auth, writes, storage) -- used only by the admin panel,
 * which is its own lazily-loaded chunk. The public page reads through the
 * lightweight REST helper in src/content instead. Null when not configured.
 */
export const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;
