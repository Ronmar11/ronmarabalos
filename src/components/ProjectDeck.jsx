import { useRef, useState } from 'react';
import { m } from 'framer-motion';
import ProjectCard from './ProjectCard.jsx';
import { useMediaQuery } from '../hooks/useMediaQuery.js';

const SPRING = { type: 'spring', stiffness: 260, damping: 24 };

// Fan geometry. Phones get a tighter, flatter fan so the back cards peek in
// without pushing the page wider than the screen.
const WIDE = { side: 120, rotate: 10, sideScale: 0.9 };
const NARROW = { side: 48, rotate: 6, sideScale: 0.86 };

/** Where card `index` sits relative to the front one (up to 3 cards). */
function slotFor(index, active, count) {
  const offset = (index - active + count) % count;
  if (offset === 0) return 'center';
  return count >= 3 && offset === count - 1 ? 'left' : 'right';
}

function targetFor(slot, g) {
  if (slot === 'center') return { x: 0, y: -8, rotate: 0, scale: 1.04, opacity: 1, filter: 'brightness(1)' };
  const dir = slot === 'left' ? -1 : 1;
  return { x: dir * g.side, y: 8, rotate: dir * g.rotate, scale: g.sideScale, opacity: 0.7, filter: 'brightness(0.75)' };
}

/**
 * Fanned carousel of the landing-page projects (the admin allows 3).
 * Clicking a card at the back brings it to the front; arrow keys and swipes
 * work too. `children` renders above the deck (the section heading).
 */
export default function ProjectDeck({ projects, isDark, children }) {
  const count = projects.length;
  const [activeRaw, setActive] = useState(0);
  const wide = useMediaQuery('(min-width: 701px)');
  const touch = useRef(null);
  const regionRef = useRef(null);
  const geometry = wide ? WIDE : NARROW;
  // Content can reload with fewer projects; keep the index in range.
  const active = count ? activeRaw % count : 0;

  if (!count) return null;

  const go = (delta) => setActive((current) => (((current % count) + delta) % count + count) % count);

  // The clicked back card's button disappears once it's in front, which would
  // drop keyboard focus to the page; keep it on the carousel so arrows still work.
  const bringForward = (index) => {
    setActive(index);
    regionRef.current?.focus({ preventScroll: true });
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      go(event.key === 'ArrowLeft' ? -1 : 1);
    }
  };

  // Horizontal swipe on touch screens; vertical drags are left to page scrolling.
  const onTouchStart = (event) => {
    const t = event.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (event) => {
    if (!touch.current) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  return (
    // No panel of its own: the deck sits on the page background and follows
    // the site's light/dark theme like every other section.
    <div className="relative">
      {children}

      <div
        ref={regionRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative rounded-2xl py-6 [perspective:1200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prime/60"
      >
        {/* All cards share one grid cell and stretch to the tallest, so the
            fan is even and the section's height never jumps. */}
        <div className="grid items-stretch justify-items-center">
          {projects.map((project, index) => {
            const slot = slotFor(index, active, count);
            const isFront = slot === 'center';
            return (
              <m.div
                key={project.id}
                initial={false}
                animate={targetFor(slot, geometry)}
                transition={SPRING}
                style={{ zIndex: isFront ? 30 : 10 }}
                className="relative w-[min(320px,76vw)] [grid-area:1/1] md:w-[360px]"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}: ${project.title}`}
              >
                <div aria-hidden={isFront ? undefined : true} className="h-full">
                  <ProjectCard project={project} isDark={isDark} solid interactive={isFront} />
                </div>
                {!isFront && (
                  // Covers the whole back card, so clicking anywhere on it brings it forward.
                  <button
                    type="button"
                    onClick={() => bringForward(index)}
                    aria-label={`Bring ${project.title} to the front`}
                    className="absolute inset-0 cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prime"
                  />
                )}
              </m.div>
            );
          })}
        </div>

        {/* Announces the new front card to screen readers */}
        <p aria-live="polite" className="sr-only">
          Showing {projects[active].title}
        </p>
      </div>
    </div>
  );
}
