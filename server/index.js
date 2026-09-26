import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { SYSTEM_PROMPT } from './persona.js';

const PORT = Number(process.env.PORT) || 3000;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const API_KEY = process.env.OPENAI_API_KEY;

// Browsers only ever send these; the server decides model, temperature and limits.
const MAX_TURNS = 12; // history entries kept, newest last
const MAX_CHARS = 2000; // per message
const REQUEST_TIMEOUT_MS = 30_000;

// Light per-IP throttle so an open endpoint can't drain the API credit.
const RATE_LIMIT = { windowMs: 5 * 60_000, max: 25 };
const hits = new Map();

if (!API_KEY) {
  console.error(
    '\n  OPENAI_API_KEY is not set.\n' +
      '  Add it to .env in the project root:  OPENAI_API_KEY=sk-...\n'
  );
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: '32kb' }));

// In dev the Vite proxy makes this same-origin; set ALLOWED_ORIGIN in production.
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || true }));

function rateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip;
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return next();
  }
  if (entry.count >= RATE_LIMIT.max) {
    return res
      .status(429)
      .json({ error: { message: 'Too many messages right now — try again in a few minutes.' } });
  }
  entry.count += 1;
  return next();
}

// Drop anything malformed rather than forwarding it upstream.
function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const cleaned = raw
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim()
    )
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS);

  if (!cleaned.length || cleaned[cleaned.length - 1].role !== 'user') return null;
  return cleaned;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, model: MODEL });
});

app.post('/api/chat', rateLimit, async (req, res) => {
  const messages = sanitizeMessages(req.body?.messages);
  if (!messages) {
    return res.status(400).json({ error: { message: 'Send a non-empty message.' } });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      // Log the detail, return something safe: upstream errors can echo the key.
      const detail = data?.error?.message;
      const code = data?.error?.code || data?.error?.type;
      console.error('OpenAI error', upstream.status, code || '', detail);

      // 429 covers both "slow down" and "out of credit" -- they are not the
      // same problem, and only the first is worth asking the visitor to retry.
      const outOfCredit = code === 'credit_balance_exhausted' || code === 'insufficient_quota';
      if (outOfCredit) {
        console.error(
          '  -> the API account has no credit left; the chat agent is offline until it is topped up.'
        );
      }

      const message =
        upstream.status === 401 || outOfCredit
          ? 'My chat service is offline at the moment — you can email me at abalosronmar1@gmail.com.'
          : upstream.status === 429
            ? 'I am getting a lot of messages right now — try again in a moment.'
            : 'I could not reach my brain just now. Try again in a bit.';
      return res.status(502).json({ error: { message } });
    }

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(502).json({ error: { message: 'I did not catch that — try rephrasing?' } });
    }

    return res.json({ reply });
  } catch (error) {
    const timedOut = error.name === 'AbortError';
    console.error('chat request failed:', timedOut ? 'timed out' : error.message);
    return res.status(timedOut ? 504 : 500).json({
      error: { message: 'I could not reach my brain just now. Try again in a bit.' },
    });
  } finally {
    clearTimeout(timer);
  }
});

app.listen(PORT, () => {
  console.log(`Chat API listening on http://localhost:${PORT} (model: ${MODEL})`);
});
