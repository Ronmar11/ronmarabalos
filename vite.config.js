import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Every VITE_* variable is compiled into the JavaScript sent to visitors.
// A Supabase secret / service_role key there would give anyone full control of
// the database, and an AI API key would let anyone spend your quota -- so
// refuse to start or build if one is found.
function looksLikeSecret(value) {
  if (/\bsb_secret_/.test(value)) return true;
  if (/^AIza[0-9A-Za-z_-]{30,}$/.test(value)) return true; // Google / Gemini API key
  if (/^sk-[A-Za-z0-9_-]{20,}$/.test(value)) return true; // OpenAI-style secret key
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
    .filter(([, value]) => looksLikeSecret(value))
    .map(([name]) => name);
  if (leaking.length) {
    throw new Error(
      `\n\n  ${leaking.join(', ')} contains a secret key (Supabase secret, Gemini or OpenAI).\n` +
        '  VITE_ variables are shipped to every visitor, so this would publish it.\n' +
        '  Supabase: use the Project URL and publishable key instead -- see supabase/README.md.\n' +
        '  Gemini: name it GEMINI_API_KEY (no VITE_ prefix) so only the chat server sees it.\n' +
        '  If a secret was ever built or deployed, revoke it and create a new one.\n'
    );
  }
}

/**
 * Answers POST /api/chat inside `npm run dev` / `npm run preview`, using the
 * same Gemini code as the deployed Vercel function (api/chat.js) -- so the
 * chatbot works locally with no second server to start. GEMINI_API_KEY is read
 * from .env here in Node; without a VITE_ prefix it never reaches the browser.
 */
function chatApi(env) {
  const handle = async (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      return res.end();
    }
    let raw = '';
    for await (const chunk of req) raw += chunk;
    let payload = {};
    try {
      payload = JSON.parse(raw);
    } catch {
      // Leave it empty; answerChat rejects it with a 400.
    }
    const { answerChat, DEFAULT_MODEL } = await import('./server/chat.js');
    const { status, body } = await answerChat(payload.messages, {
      apiKey: env.GEMINI_API_KEY,
      model: env.GEMINI_MODEL || DEFAULT_MODEL,
    });
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
  };
  // Block bodies on purpose: Vite treats a value returned from these hooks as
  // a function to run later.
  return {
    name: 'chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/chat', handle);
    },
  };
}

export default defineConfig(({ mode }) => {
  assertNoSecretsInClientEnv(mode);
  // '' prefix: every variable in .env, for the server-side chat handler only.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), chatApi(env)],
  };
});
