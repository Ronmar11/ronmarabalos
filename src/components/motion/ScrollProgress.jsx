import { m, useScroll, useSpring } from 'framer-motion';

/** Thin accent bar across the top of the viewport that fills as you scroll. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // Spring-smooth the raw scroll value so the bar glides rather than jumps.
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[110] h-[3px] origin-left bg-gradient-to-r from-prime to-accent-dark"
    />
  );
}
