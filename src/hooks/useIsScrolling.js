import { useEffect, useRef, useState } from 'react';

/**
 * True while the page is scrolling, flipping back to false once the user has
 * been still for `idleDelay` ms.
 */
export function useIsScrolling(idleDelay = 400) {
  const [isScrolling, setIsScrolling] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsScrolling(false), idleDelay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timerRef.current);
    };
  }, [idleDelay]);

  return isScrolling;
}
