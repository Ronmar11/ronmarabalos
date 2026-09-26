import { useEffect, useState } from 'react';

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/**
 * Types each phrase out, pauses, deletes it, then moves to the next.
 * With reduced motion enabled it simply shows the first phrase; with no
 * phrases it returns an empty string.
 */
export function useTypewriter(phrases, { typeMs = 70, deleteMs = 35, holdMs = 1600 } = {}) {
  const [text, setText] = useState(() => (prefersReducedMotion() ? (phrases[0] ?? '') : ''));

  useEffect(() => {
    if (!phrases.length) {
      setText('');
      return undefined;
    }
    if (prefersReducedMotion()) {
      setText(phrases[0]);
      return undefined;
    }

    let index = 0;
    let length = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const phrase = phrases[index];

      if (!deleting) {
        length += 1;
        setText(phrase.slice(0, length));
        if (length === phrase.length) {
          deleting = true;
          timer = setTimeout(tick, holdMs);
          return;
        }
        timer = setTimeout(tick, typeMs);
        return;
      }

      length -= 1;
      setText(phrase.slice(0, length));
      if (length === 0) {
        deleting = false;
        index = (index + 1) % phrases.length;
      }
      timer = setTimeout(tick, deleteMs);
    };

    timer = setTimeout(tick, typeMs);
    return () => clearTimeout(timer);
  }, [phrases, typeMs, deleteMs, holdMs]);

  return text;
}
