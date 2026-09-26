// Vercel serverless function: answers POST /api/chat on the deployed site.
// Needs GEMINI_API_KEY in Vercel -> Project Settings -> Environment Variables
// (server-side only: no VITE_ prefix, so it never reaches the browser).
import { DEFAULT_MODEL, RATE_LIMITED, answerChat, isRateLimited } from '../server/chat.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { message: 'Use POST.' } });
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (isRateLimited(ip)) return res.status(RATE_LIMITED.status).json(RATE_LIMITED.body);

  const { status, body } = await answerChat(req.body?.messages, {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
  });
  return res.status(status).json(body);
}
