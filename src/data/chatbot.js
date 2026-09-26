// Same-origin: `npm run dev` answers /api/chat itself (see vite.config.js) and
// on Vercel api/chat.js does. Override with VITE_CHAT_API_URL only when the
// chat API lives on a different host.
export const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || '/api/chat';

export const GREETING =
  'Hi there! \u{1F44B}\u{1F3FB} Thanks for visiting my website. Feel free to ask me anything. Let me know how I can help!';

export const FALLBACK_REPLY = 'I’m currently unavailable right now.';
export const OFFLINE_REPLY =
  'I cannot reach my chat service right now — you can email me at abalosronmar1@gmail.com.';

// Hard-coded replies that never hit the API.
const cannedResponses = [
  {
    match: ['girlfriend', 'may jowa', 'may girlfriend'],
    reply: 'wala pa e, pag may nanligaw na siguro sakin, di jk lng. Focus muna sa aral hehe',
  },
];

export const getCannedResponse = (message) => {
  const lower = message.toLowerCase();
  const hit = cannedResponses.find((c) => c.match.some((k) => lower.includes(k)));
  return hit ? hit.reply : null;
};
