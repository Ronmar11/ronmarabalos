import { SYSTEM_PROMPT } from './persona.js';

/**
 * The chatbot's core, shared by the Vercel function (api/chat.js) and the
 * local dev server (the chat-api plugin in vite.config.js): validate what the
 * browser sent, ask Google Gemini, and turn the result into { status, body }.
 */

// Browsers only ever send the conversation; the server decides the model and limits.
const MAX_TURNS = 12; // history entries kept, newest last
const MAX_CHARS = 2000; // per message
const REQUEST_TIMEOUT_MS = 30_000;

// A "-latest" alias follows Google's newest Flash model, so the bot keeps
// working when older model versions are retired. Pin one with GEMINI_MODEL.
export const DEFAULT_MODEL = 'gemini-flash-latest';

const API_BASE = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta';

const OFFLINE = 'My chat service is offline at the moment — you can email me at abalosronmar1@gmail.com.';
const BUSY = 'I am getting a lot of messages right now — try again in a moment.';
const UNREACHABLE = 'I could not reach my brain just now. Try again in a bit.';

const fail = (status, message) => ({ status, body: { error: { message } } });

/** Drops anything malformed rather than forwarding it upstream. */
export function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const cleaned = raw
    .filter(
      (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim()
    )
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS);

  if (!cleaned.length || cleaned[cleaned.length - 1].role !== 'user') return null;
  return cleaned;
}

/** Gemini calls the assistant "model" and wants text wrapped in parts. */
const toGeminiContents = (messages) =>
  messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

/**
 * Asks Gemini for the next reply. Never throws: every outcome, including
 * network failure and timeouts, comes back as { status, body }.
 */
export async function answerChat(rawMessages, { apiKey, model = DEFAULT_MODEL } = {}) {
  const messages = sanitizeMessages(rawMessages);
  if (!messages) return fail(400, 'Send a non-empty message.');
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set -- the chatbot is offline.');
    return fail(503, OFFLINE);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstream = await fetch(`${API_BASE}/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        // A header, not ?key= in the URL, so the key never lands in request logs.
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: toGeminiContents(messages),
        generationConfig: {
          temperature: 0.7,
          // Roomy on purpose: newer Gemini models spend part of this budget on
          // internal "thinking" before answering. The persona keeps replies short.
          maxOutputTokens: 2048,
        },
      }),
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      // Log the detail, return something safe to the visitor.
      const status = data?.error?.status || '';
      const detail = data?.error?.message || '';
      console.error('Gemini error', upstream.status, status, detail);

      if (upstream.status === 404) {
        console.error(`  -> model "${model}" was not found. Set GEMINI_MODEL to a current model name.`);
        return fail(502, OFFLINE);
      }
      // Bad or restricted key: nothing the visitor can do by retrying.
      if (upstream.status === 401 || upstream.status === 403 || /api key/i.test(detail)) {
        console.error('  -> check GEMINI_API_KEY.');
        return fail(502, OFFLINE);
      }
      if (upstream.status === 429) {
        console.error('  -> rate limit or free-tier quota reached.');
        return fail(502, BUSY);
      }
      return fail(502, UNREACHABLE);
    }

    const candidate = data?.candidates?.[0];
    const reply = (candidate?.content?.parts ?? [])
      .map((part) => (typeof part.text === 'string' && !part.thought ? part.text : ''))
      .join('')
      .trim();

    if (!reply) {
      // Empty answers happen when Gemini's safety filters block the prompt or reply.
      const blocked = data?.promptFeedback?.blockReason || candidate?.finishReason;
      console.error('Gemini returned no text', blocked || '');
      return fail(502, "I can't answer that one — try asking about my projects or skills.");
    }

    return { status: 200, body: { reply } };
  } catch (error) {
    const timedOut = error.name === 'AbortError';
    console.error('chat request failed:', timedOut ? 'timed out' : error.message);
    return fail(timedOut ? 504 : 502, UNREACHABLE);
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Light per-IP throttle so an open endpoint can't burn through the API quota.
// On Vercel each running instance keeps its own count, so this is a speed bump
// rather than a hard cap -- Google's own quota is the real ceiling.
const RATE_LIMIT = { windowMs: 5 * 60_000, max: 25 };
const hits = new Map();

/** true when this caller has sent too many messages recently. */
export function isRateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

export const RATE_LIMITED = fail(429, 'Too many messages right now — try again in a few minutes.');
