import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Every VITE_* variable is compiled into the JavaScript sent to visitors.
// A Supabase secret / service_role key there would give anyone full control of
// the database, so refuse to start or build if one is found.
function looksLikeSupabaseSecret(value) {
  if (/\bsb_secret_/.test(value)) return true;
  const parts = value.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return payload?.role === 'service_role';
  } catch {
    return false;
  }
}

function assertNoSecretsInClientEnv(mode) {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const leaking = Object.entries(env)
    .filter(([, value]) => looksLikeSupabaseSecret(value))
    .map(([name]) => name);
  if (leaking.length) {
    throw new Error(
      `\n\n  ${leaking.join(', ')} contains a Supabase SECRET / service_role key.\n` +
        '  VITE_ variables are shipped to every visitor, so this would expose full database access.\n' +
        '  Use the Project URL and the publishable (or anon) key instead -- see supabase/README.md.\n' +
        '  If this secret was ever built or deployed, revoke it in Supabase: Project Settings -> API Keys.\n'
    );
  }
}

export default defineConfig(({ mode }) => {
  assertNoSecretsInClientEnv(mode);

  return {
    plugins: [react()],
    server: {
      // Lets the browser call /api/chat same-origin in dev; no CORS, no hardcoded port.
      proxy: {
        '/api': { target: 'http://localhost:3000', changeOrigin: true },
      },
    },
  };
});
