import { useEffect, useRef, useState } from 'react';
import { ChatIcon, CloseIcon, SendIcon } from './Icons.jsx';
import ChatMessage from './ChatMessage.jsx';
import {
  CHAT_API_URL,
  GREETING,
  FALLBACK_REPLY,
  OFFLINE_REPLY,
  getCannedResponse,
} from '../data/chatbot.js';
import { useContent } from '../content/ContentContext.jsx';
import { safeUrl } from '../lib/safeUrl.js';

let messageId = 0;
const nextId = () => `m${(messageId += 1)}`;

export default function Chatbot({ isDark }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: nextId(), role: 'bot', text: GREETING },
  ]);

  // Conversation sent to the API; kept in a ref so it never triggers a render.
  const historyRef = useRef([]);
  const bodyRef = useRef(null);
  const timersRef = useRef([]);
  const abortRef = useRef(null); // controller for the in-flight request, if any

  // The avatar follows the hero portrait's hover shot for the current theme.
  const { settings } = useContent();
  const avatar = safeUrl(isDark ? settings.portrait_night_hover : settings.portrait_day_hover);
  const canSend = input.trim().length > 0;

  // Keep the transcript pinned to the newest message.
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Escape closes the panel while it is open.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Drop pending timers and any in-flight request if the widget unmounts.
  // The ref is read inside the cleanup, not captured, so it sees the live value.
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      abortRef.current?.abort();
    };
  }, []);

  const replacePlaceholder = (placeholderId, text) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === placeholderId ? { ...m, text, thinking: false } : m))
    );
  };

  const requestBotReply = async (question, placeholderId) => {
    const canned = getCannedResponse(question);
    if (canned) {
      historyRef.current.push({ role: 'user', content: question });
      historyRef.current.push({ role: 'assistant', content: canned });
      replacePlaceholder(placeholderId, canned);
      return;
    }

    // A controller per request: a single long-lived one would already be
    // aborted by the time the second request runs.
    const controller = new AbortController();
    abortRef.current = controller;

    // The server owns the model, the system persona and the token limits --
    // all the browser sends is the conversation so far.
    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [...historyRef.current, { role: 'user', content: question }],
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Our server always explains its errors; an empty body means a proxy
        // or gateway answered because the chat server itself is unreachable.
        throw new Error(data?.error?.message || OFFLINE_REPLY);
      }
      if (!data?.reply) {
        throw new Error(FALLBACK_REPLY);
      }

      historyRef.current.push({ role: 'user', content: question });
      historyRef.current.push({ role: 'assistant', content: data.reply });
      replacePlaceholder(placeholderId, data.reply);
    } catch (error) {
      if (error.name === 'AbortError') return;
      // A thrown TypeError means the request never landed (server down, offline).
      const offline = error instanceof TypeError;
      replacePlaceholder(placeholderId, offline ? OFFLINE_REPLY : error.message || FALLBACK_REPLY);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSend) return;

    const question = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: question }]);

    // Short delay before the typing indicator, matching the original timing.
    const timer = setTimeout(() => {
      const placeholderId = nextId();
      setMessages((prev) => [...prev, { id: placeholderId, role: 'bot', thinking: true }]);
      requestBotReply(question, placeholderId);
    }, 600);
    timersRef.current.push(timer);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="chatbot-panel"
        className="fixed bottom-[30px] right-[30px] z-[90] flex h-[50px] cursor-pointer items-center gap-2.5 rounded-[10px] border-none bg-black text-white dark:bg-white dark:text-black"
      >
        <ChatIcon className="h-8 w-8 animate-wiggle pl-2.5" />
        <p className="pr-2.5 text-[15px]">Chat with Ron</p>
      </button>

      <div
        id="chatbot-panel"
        role="dialog"
        aria-label="Chat with Ron"
        aria-hidden={!isOpen}
        className={`fixed bottom-[90px] right-2 z-[95] w-[min(320px,calc(100vw-16px))] origin-bottom-right overflow-hidden rounded-[15px] bg-white pb-[70px] shadow-chat transition-all duration-100 xs:right-2.5 xs:w-[min(350px,calc(100vw-20px))] sm:right-3 sm:w-[min(380px,calc(100vw-24px))] ${isOpen ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-[0.2] opacity-0'
          }`}
      >
        <div className="flex items-center justify-between border-b border-chat-border px-5 py-2 dark:border-[#333] dark:bg-[#0f0f0f]">
          <div className="flex items-center gap-2.5">
            <span
              style={avatar ? { backgroundImage: `url("${avatar}")` } : undefined}
              className="m-0 h-[33px] w-[33px] shrink-0 rounded-full bg-cover bg-center p-1.5"
              aria-hidden="true"
            />
            <div className="inline">
              <h2 className="m-0 text-base font-semibold dark:text-[#f5f5f5]">Chat with Ron</h2>
              <div className="flex items-center gap-[5px]">
                <span className="h-[5px] w-[5px] rounded-full bg-[#00ff00]" aria-hidden="true" />
                <p className="m-0 text-[12px]">Online</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="-mr-2.5 h-[30px] w-[30px] cursor-pointer border-none bg-transparent"
          >
            <CloseIcon className="dark:text-white" />
          </button>
        </div>

        <div
          ref={bodyRef}
          className="flex h-[380px] flex-col gap-5 overflow-y-auto px-[22px] pb-[90px] pt-[25px] dark:bg-[#0f0f0f] dark:text-[#e5e5e5]"
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} avatar={avatar} />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 flex w-full items-center justify-center gap-[5px] border-t border-chat-border px-[18px] py-3 xs:justify-start dark:border-[#333] dark:bg-[#151515]">
          <form onSubmit={handleSubmit} className="flex h-[45px] flex-1 items-center rounded-[10px] bg-white outline outline-1 outline-chat-border focus-within:outline-chat-border-focus dark:bg-[#1a1a1a] dark:outline-[#333] dark:focus-within:outline-[#888]">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              aria-label="Message"
              required
              className="flex-1 resize-none border-none bg-transparent pl-[18px] pt-[5px] text-[0.9rem] outline-none dark:text-[#e5e5e5]"
            />
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send message"
              className="h-[45px] w-[46px] cursor-pointer rounded-[10px] border-none bg-chat-border-focus text-white opacity-100 outline outline-1 outline-chat-border transition-all duration-200 hover:bg-[#505050] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#3d3d3d] dark:outline-[#333] dark:hover:bg-[#5a5a5a]"
            >
              <SendIcon className="mx-auto h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
