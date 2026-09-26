import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Inertia-style smooth scrolling for mouse wheels and trackpads (Lenis).
 * Touch scrolling stays native -- phones already scroll smoothly, and faking
 * it there feels laggy. Skipped entirely for visitors who ask for reduced
 * motion. Lenis moves the real window scroll position, so Framer Motion's
 * scroll-triggered reveals and progress bar keep working unchanged.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      autoRaf: true, // Lenis drives its own animation frame loop
      lerp: 0.1, // how quickly it catches up to the target: lower = floatier
      anchors: true, // nav links like #projects glide instead of jumping
      allowNestedScroll: true, // the chat window and wide graph scroll on their own
    });

    return () => lenis.destroy();
  }, []);
}
